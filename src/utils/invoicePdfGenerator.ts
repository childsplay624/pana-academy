import jsPDF from 'jspdf';

interface InvoiceData {
    invoice_number: string;
    student_name: string;
    student_email: string;
    course_title: string;
    course_price: number;
    tax_amount: number;
    platform_fee: number;
    total_amount: number;
    payment_method: string;
    payment_reference: string;
    payment_date: string;
    currency: string;
    created_at: string;
}

// PANA Institute brand colors
const COLORS = {
    black: '#1a1a1a',
    darkGray: '#333333',
    mediumGray: '#666666',
    lightGray: '#999999',
    borderGray: '#e0e0e0',
    bgLight: '#f8f9fa',
    red: '#b91c1c',       // PANA Institute red
    darkRed: '#991b1b',
    greenAccent: '#16a34a',
    white: '#ffffff',
};

/**
 * Converts the PANA Institute logo to a base64 data URL.
 * We load it at runtime from /logo.png.
 */
async function loadLogoAsBase64(): Promise<string | null> {
    try {
        const response = await fetch('/logo.png');
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
}

function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [0, 0, 0];
}

function drawLine(doc: jsPDF, y: number, x1: number, x2: number, color = COLORS.borderGray) {
    const [r, g, b] = hexToRgb(color);
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(0.3);
    doc.line(x1, y, x2, y);
}

export async function generateInvoicePdf(invoice: InvoiceData): Promise<void> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 20;
    const marginRight = 20;
    const contentWidth = pageWidth - marginLeft - marginRight;
    let y = 20; // current Y position

    // ── HEADER SECTION ──────────────────────────────────────────────────────

    // Load and draw logo
    const logoBase64 = await loadLogoAsBase64();
    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', marginLeft, y, 35, 28);
    }

    // Company info (right side of header)
    const rightX = pageWidth - marginRight;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    const [rB, gB, bB] = hexToRgb(COLORS.black);
    doc.setTextColor(rB, gB, bB);
    doc.text('PANA', rightX - 42, y + 8);

    doc.setFont('helvetica', 'bold');
    const [rR, gR, bR] = hexToRgb(COLORS.red);
    doc.setTextColor(rR, gR, bR);
    doc.text('Academy', rightX - 23, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const [rG, gG, bG] = hexToRgb(COLORS.mediumGray);
    doc.setTextColor(rG, gG, bG);
    doc.text('Competency Cultivation Hub', rightX, y + 14, { align: 'right' });
    doc.text('support@pana-academy.com', rightX, y + 18, { align: 'right' });
    doc.text('www.pana-academy.com', rightX, y + 22, { align: 'right' });
    doc.text('Port Harcourt, Rivers State, Nigeria', rightX, y + 26, { align: 'right' });

    y += 34;

    // ── INVOICE TITLE BAR ───────────────────────────────────────────────────

    // Red accent bar
    const [rRed, gRed, bRed] = hexToRgb(COLORS.red);
    doc.setFillColor(rRed, gRed, bRed);
    doc.rect(marginLeft, y, contentWidth, 10, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('INVOICE', marginLeft + 5, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(invoice.invoice_number, rightX - 5, y + 7, { align: 'right' });

    y += 16;

    // ── INVOICE META INFO ───────────────────────────────────────────────────

    const metaLeftX = marginLeft;
    const metaRightX = marginLeft + contentWidth / 2 + 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const [rMG, gMG, bMG] = hexToRgb(COLORS.mediumGray);
    doc.setTextColor(rMG, gMG, bMG);

    doc.text('Invoice Date:', metaLeftX, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(rB, gB, bB);
    doc.text(new Date(invoice.payment_date).toLocaleDateString('en-NG', {
        year: 'numeric', month: 'long', day: 'numeric'
    }), metaLeftX + 28, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(rMG, gMG, bMG);
    doc.text('Payment Ref:', metaRightX, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(rB, gB, bB);
    doc.text(invoice.payment_reference, metaRightX + 28, y);

    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(rMG, gMG, bMG);
    doc.text('Payment Method:', metaLeftX, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(rB, gB, bB);
    doc.text(invoice.payment_method.charAt(0).toUpperCase() + invoice.payment_method.slice(1), metaLeftX + 32, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(rMG, gMG, bMG);
    doc.text('Currency:', metaRightX, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(rB, gB, bB);
    doc.text(invoice.currency, metaRightX + 20, y);

    y += 12;

    // ── BILL TO / BILL FROM ─────────────────────────────────────────────────

    const halfWidth = contentWidth / 2 - 5;

    // Bill To
    const [rBG, gBG, bBG] = hexToRgb(COLORS.bgLight);
    doc.setFillColor(rBG, gBG, bBG);
    doc.roundedRect(metaLeftX, y, halfWidth, 28, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(rR, gR, bR);
    doc.text('BILL TO', metaLeftX + 5, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(rB, gB, bB);
    doc.text(invoice.student_name, metaLeftX + 5, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(rMG, gMG, bMG);
    doc.text(invoice.student_email, metaLeftX + 5, y + 19);

    // Bill From
    doc.setFillColor(rBG, gBG, bBG);
    doc.roundedRect(metaRightX, y, halfWidth, 28, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(rR, gR, bR);
    doc.text('BILL FROM', metaRightX + 5, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(rB, gB, bB);
    doc.text('PANA Institute', metaRightX + 5, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(rMG, gMG, bMG);
    doc.text('Competency Cultivation Hub', metaRightX + 5, y + 19);
    doc.text('support@pana-academy.com', metaRightX + 5, y + 24);

    y += 36;

    // ── ITEMS TABLE ─────────────────────────────────────────────────────────

    // Table header
    const col1X = marginLeft;         // Description
    const col2X = marginLeft + 100;    // Qty
    const col3X = marginLeft + 120;   // Price
    const col4X = rightX;             // Amount (right-aligned)

    doc.setFillColor(rB, gB, bB);
    doc.rect(marginLeft, y, contentWidth, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('DESCRIPTION', col1X + 4, y + 5.5);
    doc.text('QTY', col2X, y + 5.5);
    doc.text('PRICE', col3X, y + 5.5);
    doc.text('AMOUNT', col4X - 5, y + 5.5, { align: 'right' });

    y += 8;

    // Table row - Course
    doc.setFillColor(255, 255, 255);
    doc.rect(marginLeft, y, contentWidth, 10, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(rB, gB, bB);

    // Truncate long course titles
    const maxTitleWidth = 90;
    const courseTitle = doc.getTextWidth(invoice.course_title) > maxTitleWidth
        ? invoice.course_title.substring(0, 50) + '...'
        : invoice.course_title;

    doc.text(courseTitle, col1X + 4, y + 6.5);
    doc.text('1', col2X + 3, y + 6.5);
    doc.text(`${invoice.currency} ${invoice.course_price.toLocaleString()}`, col3X, y + 6.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${invoice.currency} ${invoice.course_price.toLocaleString()}`, col4X - 5, y + 6.5, { align: 'right' });

    y += 10;
    drawLine(doc, y, marginLeft, rightX, COLORS.borderGray);

    y += 6;

    // ── TOTALS SECTION ──────────────────────────────────────────────────────

    const totalsLabelX = marginLeft + contentWidth - 70;
    const totalsValueX = rightX - 5;

    // Subtotal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(rMG, gMG, bMG);
    doc.text('Subtotal:', totalsLabelX, y);
    doc.setTextColor(rB, gB, bB);
    doc.text(`${invoice.currency} ${invoice.course_price.toLocaleString()}`, totalsValueX, y, { align: 'right' });
    y += 6;

    // Tax
    if (invoice.tax_amount > 0) {
        doc.setTextColor(rMG, gMG, bMG);
        doc.text('Tax/VAT:', totalsLabelX, y);
        doc.setTextColor(rB, gB, bB);
        doc.text(`${invoice.currency} ${invoice.tax_amount.toLocaleString()}`, totalsValueX, y, { align: 'right' });
        y += 6;
    }

    // Platform fee
    if (invoice.platform_fee > 0) {
        doc.setTextColor(rMG, gMG, bMG);
        doc.text('Platform Fee:', totalsLabelX, y);
        doc.setTextColor(rB, gB, bB);
        doc.text(`${invoice.currency} ${invoice.platform_fee.toLocaleString()}`, totalsValueX, y, { align: 'right' });
        y += 6;
    }

    y += 2;
    drawLine(doc, y, totalsLabelX, rightX, COLORS.darkGray);
    y += 6;

    // Total
    doc.setFillColor(rRed, gRed, bRed);
    doc.roundedRect(totalsLabelX - 3, y - 4.5, 73, 10, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL:', totalsLabelX, y + 2);
    doc.text(`${invoice.currency} ${invoice.total_amount.toLocaleString()}`, totalsValueX, y + 2, { align: 'right' });

    y += 18;

    // ── PAYMENT STATUS ──────────────────────────────────────────────────────

    const [rGreen, gGreen, bGreen] = hexToRgb(COLORS.greenAccent);
    doc.setFillColor(rGreen, gGreen, bGreen);
    doc.roundedRect(marginLeft, y, 34, 8, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('PAID', marginLeft + 17, y + 5.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(rMG, gMG, bMG);
    doc.text(`Payment confirmed on ${new Date(invoice.payment_date).toLocaleDateString('en-NG', {
        year: 'numeric', month: 'long', day: 'numeric'
    })}`, marginLeft + 38, y + 5.5);

    y += 20;

    // ── FOOTER ──────────────────────────────────────────────────────────────

    drawLine(doc, y, marginLeft, rightX, COLORS.borderGray);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(rMG, gMG, bMG);

    const footerLines = [
        'Thank you for choosing PANA Institute!',
        'This is a computer-generated invoice and does not require a signature.',
        'For questions about this invoice, please contact support@pana-academy.com',
        '',
        'PANA Institute Limited | Competency Cultivation Hub | Port Harcourt, Rivers State, Nigeria',
        'www.pana-academy.com',
    ];

    footerLines.forEach((line) => {
        doc.text(line, pageWidth / 2, y, { align: 'center' });
        y += 4;
    });

    // Save the PDF
    doc.save(`${invoice.invoice_number}.pdf`);
}
