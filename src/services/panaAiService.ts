import { buildSystemPrompt, PanaAiRoleContext } from './panaAiKnowledge';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface SendMessageOptions {
  messages: { role: 'user' | 'assistant'; content: string }[];
  context: PanaAiRoleContext;
  onDelta?: (chunk: string) => void;
}

// Active high-performance Gemini endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent';

/**
 * Sends conversation to Gemini via Edge Function or direct Gemini API with fallback
 */
export async function sendPanaAiMessage({
  messages,
  context,
  onDelta,
}: SendMessageOptions): Promise<string> {
  const systemPrompt = buildSystemPrompt(context);

  // 1. Direct Gemini API call if key is provided in client env
  const clientGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (clientGeminiKey) {
    try {
      const geminiPayload = {
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      };

      const res = await fetch(`${GEMINI_API_URL}?key=${clientGeminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
      });

      if (res.ok) {
        const data = await res.json();
        const candidateText =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I'm sorry, I couldn't process that response. Please try again.";
        const cleaned = cleanPanaAiResponse(candidateText);
        if (onDelta) onDelta(cleaned);
        return cleaned;
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error('Gemini API Error in client:', errData);
      }
    } catch (directErr) {
      console.error('Direct Gemini call failed:', directErr);
    }
  }

  // 2. Fallback to Supabase Edge Function if deployed
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/pana-ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          messages,
          context,
          systemPrompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.text) {
          const cleaned = cleanPanaAiResponse(data.text);
          if (onDelta) onDelta(cleaned);
          return cleaned;
        }
      }
    } catch (err) {
      console.warn('Supabase edge function pana-ai-chat call fallback:', err);
    }
  }


  // 3. Graceful offline intelligent rule-based responder (ensures zero crashes and immediate assistance)
  return cleanPanaAiResponse(getOfflineSmartResponse(messages[messages.length - 1]?.content || '', context));
}

/**
 * Sanitizes response to eliminate raw ### headings and course calendar links
 */
export function cleanPanaAiResponse(text: string): string {
  if (!text) return '';
  return text
    // Convert markdown heading lines like "### Heading" or "## Heading" to "**Heading**"
    .replace(/^#{1,6}\s+(.+)$/gm, '**$1**')
    // Remove any remaining stray ### markers
    .replace(/#{2,6}\s*/g, '')
    // Replace any course/training calendar links or mentions with course catalog
    .replace(/\[([^\]]*(?:training|course)\s*calendar[^\]]*)\]\([^)]+\)/gi, '[Browse Courses](/courses)')
    .replace(/\/training-calendar/gi, '/courses');
}

/**
 * Intelligent local responder for common inquiries when API key is not yet configured
 */
function getOfflineSmartResponse(query: string, context: PanaAiRoleContext): string {
  const lower = query.toLowerCase();

  if (lower.includes('course') || lower.includes('program') || lower.includes('class') || lower.includes('training')) {
    return `Welcome to **PANA Institute**! We offer world-class technical engineering programs in:
- **Instrumentation & Process Automation**
- **Valves & Actuation Systems**
- **Power & Industrial Drives**
- **Safety & Process Hazard Analysis (HAZOP/LOPA)**
- **Sustainability & Energy Transition**
- **Field & Marine Operations**

👉 You can explore all our accredited programs on the [Course Catalog](/courses). Are you looking for beginner or advanced specialized modules?`;
  }

  if (lower.includes('certificate') || lower.includes('verify') || lower.includes('credential')) {
    return `Every credential issued by PANA Institute is cryptographically secured with a verification code and QR code.
- **To verify a credential:** Visit the public [Verify Certificate Portal](/verify-certificate) and enter the certificate ID.
- **For students:** You can access, share to LinkedIn, or download your certificates directly from [My Certificates](/student/certificates).`;
  }

  if (lower.includes('contact') || lower.includes('reach') || lower.includes('phone') || lower.includes('email') || lower.includes('location')) {
    return `You can reach the PANA Institute advisory and technical support team directly through our [Contact Page](/contact), or send an inquiry to our training coordinators for customized corporate workshops.`;
  }

  if (context.role === 'admin') {
    return `Hello Admin! As **PANA AI**, I can assist with platform operations:
- Manage enrolled accounts & roles in [User Management](/admin/users)
- Approve or publish courses in [Course Management](/admin/courses)
- Track revenue and transactions in [Payments](/admin/payments)
- Configure platform toggles in [Settings](/admin/settings)

How can I assist your workflow today?`;
  }

  if (context.role === 'student') {
    return `Hello! As your **PANA AI Co-Instructor**, I'm here to support your learning journey.
- Jump back into active lessons in [My Courses](/student/my-courses)
- Check upcoming deadlines and homework in [Assignments](/student/assignments)
- Track your completion scores in [Progress](/student/progress)

Feel free to ask me to explain any engineering concept from your lectures or guide you through your dashboard!`;
  }

  if (context.role === 'instructor') {
    return `Greetings Instructor! I am ready to help you:
- Structure modules and lesson descriptions
- Draft assessment quizzes and rubrics
- Manage student progress on your [Instructor Dashboard](/instructor/dashboard)

What course are you currently preparing?`;
  }

  return `Hello! I am **PANA AI**, your intelligent co-instructor and site guide at PANA Institute.

I can help you:
- 🎓 Discover specialized engineering and technical courses on our [Course Catalog](/courses)
- 📜 Learn about verified [Certificates](/verify-certificate)
- 🏢 Explore [Consulting Services](/consulting) & [Sustainability Solutions](/sustainability)
- 🧭 Navigate any part of your student, instructor, or admin dashboard

What would you like to explore today?`;
}
