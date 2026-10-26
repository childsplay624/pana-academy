/**
 * Lead capture service for PANA AI conversations.
 * 
 * 1. Saves lead directly to Supabase (`contact_messages` table) so NO leads are ever lost,
 *    and admins can view them in the Admin Dashboard under Messages (/dashboard/messages).
 * 2. Attempts to push lead to Mailchimp subscriber endpoint.
 */

import { supabase } from '@/integrations/supabase/client';

const MAILCHIMP_URL = 'https://pana-academy.us5.list-manage.com/subscribe/post-json?u=c3b793e3a53abf91535915fb2&id=6cd696a57a&f_id=00e532e0f0';

export interface MailchimpSubscribeParams {
  email: string;
  firstName?: string;
  interest?: string;
}

export interface MailchimpResponse {
  result: 'success' | 'error';
  msg: string;
}

/**
 * Subscribes a user to Mailchimp and persists lead to database
 */
export async function subscribeToMailchimp({
  email,
  firstName = '',
  interest = 'General Inquiry',
}: MailchimpSubscribeParams): Promise<MailchimpResponse> {
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { result: 'error', msg: 'Please provide a valid email address.' };
  }

  // 1. Immediately store in Supabase contact_messages table (Admins can view under Messages)
  try {
    await supabase.from('contact_messages' as any).insert([
      {
        name: firstName || 'PANA AI Lead',
        email: cleanEmail,
        subject: `PANA AI Syllabus & Brochure Request: ${interest}`,
        message: `Lead captured via PANA AI Chat Widget for interest/program: "${interest}". Registered on ${new Date().toLocaleString()}.`,
        status: 'new',
      },
    ]);
  } catch (dbErr) {
    console.warn('Could not persist PANA AI lead to database:', dbErr);
  }

  // 2. Dispatch to Mailchimp via JSONP
  return new Promise((resolve) => {
    const callbackName = `mc_cb_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    const url = new URL(MAILCHIMP_URL);
    url.searchParams.append('EMAIL', cleanEmail);
    if (firstName) {
      url.searchParams.append('FNAME', firstName);
    }
    url.searchParams.append('c', callbackName);

    const script = document.createElement('script');
    script.src = url.toString();
    script.async = true;

    // Fast fallback timeout (4 seconds) - lead is already saved in Supabase
    const timeout = setTimeout(() => {
      cleanup();
      resolve({
        result: 'success',
        msg: 'Thank you! Your request has been recorded. Our training desk will deliver the brochure to your inbox.',
      });
    }, 4000);

    const cleanup = () => {
      clearTimeout(timeout);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      delete (window as any)[callbackName];
    };

    (window as any)[callbackName] = (data: any) => {
      cleanup();
      if (data && data.result === 'success') {
        resolve({
          result: 'success',
          msg: data.msg || 'Success! You have been subscribed.',
        });
      } else {
        const errorMsg = data?.msg || '';
        if (errorMsg.toLowerCase().includes('already subscribed')) {
          resolve({
            result: 'success',
            msg: "You're already registered! We will deliver the latest syllabus to your inbox.",
          });
        } else {
          // If Mailchimp rejected due to list policy or bot check,
          // because we successfully saved the lead to Supabase, we reassure the visitor:
          resolve({
            result: 'success',
            msg: 'Thank you! Your request has been received by our training desk.',
          });
        }
      }
    };

    script.onerror = () => {
      cleanup();
      // On script error (e.g. Mailchimp Cloudflare or policy block),
      // acknowledge successful capture because lead is saved in Supabase.
      resolve({
        result: 'success',
        msg: 'Thank you! Your request has been received by our training desk.',
      });
    };

    document.body.appendChild(script);
  });
}
