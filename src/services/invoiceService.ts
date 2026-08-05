import { supabase } from '@/integrations/supabase/client';

export interface InvoiceData {
  invoiceNumber: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  coursePrice: number;
  taxAmount: number;
  platformFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentReference: string;
  paymentDate: string;
  currency: string;
}

export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}${day}-${random}`;
};

export const generateInvoiceHTML = (data: InvoiceData): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${data.invoiceNumber}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .invoice-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 40px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        .invoice-details {
          text-align: right;
        }
        .invoice-number {
          font-size: 18px;
          font-weight: bold;
          color: #2563eb;
        }
        .invoice-date {
          color: #666;
          font-size: 14px;
        }
        .billing-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .bill-to, .bill-from {
          flex: 1;
        }
        .section-title {
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .course-details {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 30px;
        }
        .course-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }
        .payment-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .payment-method {
          background: #e3f2fd;
          padding: 8px 12px;
          border-radius: 4px;
          display: inline-block;
          margin-top: 10px;
          font-size: 12px;
          color: #1976d2;
        }
        .amount-breakdown {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .amount-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .amount-row.total {
          font-weight: bold;
          font-size: 18px;
          border-top: 2px solid #2563eb;
          padding-top: 10px;
          margin-top: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          color: #666;
          font-size: 14px;
        }
        .thank-you {
          font-size: 18px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="logo">PANA INSTITUTE</div>
          <div class="invoice-details">
            <div class="invoice-number">Invoice #${data.invoiceNumber}</div>
            <div class="invoice-date">Date: ${data.paymentDate}</div>
          </div>
        </div>

        <div class="billing-info">
          <div class="bill-to">
            <div class="section-title">Bill To:</div>
            <div><strong>${data.studentName}</strong></div>
            <div>${data.studentEmail}</div>
          </div>
          <div class="bill-from">
            <div class="section-title">Bill From:</div>
            <div><strong>PANA INSTITUTE</strong></div>
            <div>Online Education Platform</div>
            <div>support@pana-academy.com</div>
          </div>
        </div>

        <div class="course-details">
          <div class="course-title">${data.courseTitle}</div>
          <div class="payment-info">
            <span><strong>Payment Reference:</strong></span>
            <span>${data.paymentReference}</span>
          </div>
          <div class="payment-method">
            Payment Method: ${data.paymentMethod}
          </div>
        </div>

        <div class="amount-breakdown">
          <div class="amount-row">
            <span>Course Price:</span>
            <span>${data.currency} ${data.coursePrice.toLocaleString()}</span>
          </div>
          ${data.taxAmount > 0 ? `
          <div class="amount-row">
            <span>VAT:</span>
            <span>${data.currency} ${data.taxAmount.toLocaleString()}</span>
          </div>
          ` : ''}
          ${data.platformFee > 0 ? `
          <div class="amount-row">
            <span>Platform Fee:</span>
            <span>${data.currency} ${data.platformFee.toLocaleString()}</span>
          </div>
          ` : ''}
          <div class="amount-row total">
            <span>Total Amount Paid:</span>
            <span>${data.currency} ${data.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div class="footer">
          <div class="thank-you">Thank you for your purchase!</div>
          <div>This is a computer-generated invoice and does not require a signature.</div>
          <div>For any questions, please contact support@pana-academy.com</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendInvoiceEmail = async (
  studentEmail: string,
  invoiceData: InvoiceData
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Generate invoice HTML
    const invoiceHTML = generateInvoiceHTML(invoiceData);

    // In a real implementation, you would use an email service like SendGrid, Resend, etc.
    // For now, we'll simulate the email sending and store the invoice
    const { error } = await (supabase as any)
      .from('invoices')
      .insert({
        invoice_number: invoiceData.invoiceNumber,
        student_email: studentEmail,
        student_name: invoiceData.studentName,
        course_title: invoiceData.courseTitle,
        course_price: invoiceData.coursePrice,
        tax_amount: invoiceData.taxAmount,
        platform_fee: invoiceData.platformFee,
        total_amount: invoiceData.totalAmount,
        payment_method: invoiceData.paymentMethod,
        payment_reference: invoiceData.paymentReference,
        payment_date: invoiceData.paymentDate,
        currency: invoiceData.currency,
        invoice_html: invoiceHTML,
        created_at: new Date().toISOString()
      });

    if (error) throw error;

    // Send email via the secure Edge Function (Resend key stays server-side)
    try {
      await supabase.functions.invoke('send-transactional-email', {
        headers: {
          'x-pana-signature': import.meta.env.VITE_PANA_SIGNATURE,
        },
        body: {
          to: studentEmail,
          subject: `Invoice ${invoiceData.invoiceNumber} - PANA Institute Course Purchase`,
          html: invoiceHTML,
        }
      });
      console.log(`Invoice ${invoiceData.invoiceNumber} sent to ${studentEmail}`);
    } catch (emailError) {
      console.error('Failed to send invoice email:', emailError);
      // Don't fail the entire process if email fails
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return { success: false, error };
  }
};

export const createAndSendInvoice = async (
  userId: string,
  courseId: string,
  paymentReference: string,
  paymentMethod: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Get user details — profiles table has no email column; retrieve email
    // from the current auth session or fall back to the stored full_name only.
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Get the user's email from Supabase auth metadata
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const userEmail = authUser?.email || 'student@pana-academy.com';

    // Get course details
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('title, price')
      .eq('id', courseId)
      .single();

    if (courseError) throw courseError;

    // Get payment details
    const { data: paymentData, error: paymentError } = await (supabase as any)
      .from('payments')
      .select('amount, metadata, created_at')
      .eq('reference', paymentReference)
      .single();

    if (paymentError) throw paymentError;

    const metadata = paymentData.metadata || {};

    const invoiceData: InvoiceData = {
      invoiceNumber: generateInvoiceNumber(),
      studentName: userData.full_name || 'Student',
      studentEmail: userEmail,
      courseTitle: courseData.title,
      coursePrice: metadata.original_amount || courseData.price,
      taxAmount: metadata.tax_amount || 0,
      platformFee: metadata.platform_fee || 0,
      totalAmount: paymentData.amount,
      paymentMethod: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
      paymentReference: paymentReference,
      paymentDate: new Date().toLocaleDateString(),
      currency: metadata.currency || 'NGN'
    };

    return await sendInvoiceEmail(userEmail, invoiceData);
  } catch (error) {
    console.error('Error creating and sending invoice:', error);
    return { success: false, error };
  }
};
