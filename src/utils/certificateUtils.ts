import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Certificate } from '@/hooks/useCertificates';

export const generateCertificateHtml = (certificate: Certificate, studentName: string): string => {
    const date = new Date(certificate.completion_date);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const dateFormatted = `on ${getOrdinal(day)} ${month} ${year}`;
    const courseDuration = certificate.course_duration_hours ? `${Math.ceil(certificate.course_duration_hours / 8)}-Day` : '3-Day';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificate - ${certificate.certificate_number}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        body {
            font-family: 'Montserrat', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            width: 297mm;
            height: 210mm;
            background-color: #fff;
            border: 20px solid #000;
            box-sizing: border-box;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 60px;
            text-align: center;
        }
        .logo-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 25px;
        }
        .lion-logo {
            width: 50px;
            height: 50px;
            margin-bottom: 5px;
        }
        .brand-name {
            font-size: 20px;
            font-weight: 600;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #1a1a1a;
        }
        .brand-name span {
            color: #8b0000;
        }
        .brand-tagline {
            font-size: 9px;
            letter-spacing: 4.5px;
            text-transform: uppercase;
            color: #666;
            font-weight: 700;
            margin-top: 2px;
        }
        .main-title {
            font-family: 'Cinzel', serif;
            font-size: 64px;
            letter-spacing: 12px;
            color: #1a1a1a;
            margin: 15px 0 5px 0;
            line-height: 1;
        }
        .subtitle-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            margin-bottom: 30px;
        }
        .gold-bar {
            height: 3px;
            width: 70px;
            background-color: #c5a059;
        }
        .subtitle {
            font-family: 'Cinzel', serif;
            font-size: 22px;
            letter-spacing: 6px;
            color: #c5a059;
            text-transform: uppercase;
        }
        .presented-to {
            font-style: italic;
            font-size: 18px;
            color: #333;
            margin-bottom: 35px;
        }
        .student-name {
            font-size: 48px;
            font-weight: 700;
            color: #000;
            margin-bottom: 5px;
            display: inline-block;
        }
        .name-underline {
            width: 450px;
            height: 1px;
            background-color: #eee;
            margin: 0 auto 35px auto;
        }
        .course-statement {
            font-size: 18px;
            color: #000;
            font-weight: 500;
            max-width: 800px;
            line-height: 1.6;
        }
        .course-title {
            font-size: 24px;
            font-weight: 700;
            margin: 10px 0;
        }
        .date-statement {
            font-style: italic;
            font-size: 18px;
        }
        .footer {
            margin-top: auto;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-bottom: 20px;
        }
        .signature-block {
            text-align: left;
            width: 220px;
        }
        .signature-block.right {
            text-align: right;
        }
        .signature-line {
            border-top: 1.5px solid #000;
            margin-bottom: 8px;
        }
        .signer-name {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            margin: 0;
        }
        .signer-title {
            font-size: 9px;
            text-transform: uppercase;
            color: #666;
            letter-spacing: 0.5px;
            margin: 2px 0 0 0;
        }
        .medal-container {
            position: relative;
            bottom: -30px;
        }
        .medal-circle {
            width: 90px;
            height: 90px;
            background: radial-gradient(circle at 30% 30%, #f7da85, #c5a059);
            border-radius: 50%;
            border: 4px solid #c59c25;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .medal-circle::after {
            content: '';
            width: 80%;
            height: 80%;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 50%;
        }
        .ribbon {
            position: absolute;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 2px;
            z-index: 1;
        }
        .ribbon-part {
            width: 24px;
            height: 50px;
            background-color: #e8c35d;
            border-bottom: 8px solid #c59c25;
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%);
        }
        .ribbon-part.left { transform: rotate(15deg) translateX(-5px); }
        .ribbon-part.right { transform: rotate(-15deg) translateX(5px); }
        .id-watermark {
            position: absolute;
            bottom: 5px;
            right: 5px;
            font-size: 8px;
            color: rgba(0,0,0,0.2);
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo-section">
            <svg class="lion-logo" viewBox="0 0 100 100" fill="#000">
                <path d="M50 10 L40 30 L60 30 Z M30 40 Q20 40 20 60 L80 60 Q80 40 70 40 M45 70 L55 70 L50 90 Z" />
            </svg>
            <div class="brand-name">PANA <span>Academy</span></div>
            <div class="brand-tagline">Competency Cultivation Hub</div>
        </div>

        <h1 class="main-title">CERTIFICATE</h1>
        <div class="subtitle-row">
            <div class="gold-bar"></div>
            <div class="subtitle">OF COMPLETION</div>
            <div class="gold-bar"></div>
        </div>

        <div class="presented-to">Presented to:</div>
        
        <div class="student-name">${studentName}</div>
        <div class="name-underline"></div>

        <div class="course-statement">
            Having Successfully completed the ${courseDuration} Training on<br>
            <div class="course-title">"${certificate.course_title}" Course</div>
            <div class="date-statement">${dateFormatted}</div>
            ${certificate.venue_name ? `
            <div style="margin-top: 15px; font-size: 14px; color: #666; display: flex; flex-direction: column; align-items: center; gap: 5px;">
                <div style="display: flex; align-items: center; gap: 5px; font-weight: 600; color: #333;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    Venue: ${certificate.venue_name}
                </div>
                <div style="font-style: italic;">${certificate.venue_address}, ${certificate.venue_city}, ${certificate.venue_country}</div>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            <div class="signature-block">
                <div class="signature-line"></div>
                <p class="signer-name">Iyenemi Akobo</p>
                <p class="signer-title">Executive Director</p>
            </div>

            <div class="medal-container">
                <div class="medal-circle"></div>
                <div class="ribbon">
                    <div class="ribbon-part left"></div>
                    <div class="ribbon-part right"></div>
                </div>
            </div>

            <div class="signature-block right">
                <div class="signature-line"></div>
                <p class="signer-name">Ifeyinwa E. Achumba</p>
                <p class="signer-title">Dean</p>
            </div>
        </div>

        <div class="id-watermark">ID: ${certificate.certificate_number}</div>
    </div>
</body>
</html>
`;
};

export const downloadCertificateAsPDF = async (certificate: Certificate, studentName: string) => {
    const html = generateCertificateHtml(certificate, studentName);

    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    // A4 Landscape dimensions in pixels (approx) at 96 DPI
    container.style.width = '1123px';
    container.style.height = '794px';
    container.innerHTML = html;
    document.body.appendChild(container);

    try {
        // Wait for images to load if any
        const images = container.getElementsByTagName('img');
        await Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        }));

        const canvas = await html2canvas(container, {
            scale: 2, // Higher quality
            useCORS: true,
            logging: false,
            backgroundColor: null,
        } as any);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`certificate-${certificate.certificate_number}.pdf`);

        return true;
    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw error;
    } finally {
        document.body.removeChild(container);
    }
};
