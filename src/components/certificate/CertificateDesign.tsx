import { useSiteImage } from '@/hooks/useSiteImage';

interface CertificateDesignProps {
  studentName: string;
  courseTitle: string;
  completionDate: string;
  courseDuration?: string;  // e.g., "3-Day", "5-Day", "2-Week"
  instructorName?: string;
  certificateId: string;
  customTitle?: string;
  className?: string;
  venueName?: string;
  venueAddress?: string;
  venueCity?: string;
  venueCountry?: string;
}

export function CertificateDesign({
  studentName,
  courseTitle,
  completionDate,
  courseDuration = '3-Day',
  instructorName,
  certificateId,
  className = '',
  venueName,
  venueAddress,
  venueCity,
  venueCountry,
}: CertificateDesignProps) {
  const { imageUrl: logoImage } = useSiteImage('logo_pana_why');

  // Helper to format date range like "from 2nd to 4th October 2024"
  const formatDateRange = () => {
    // This is a simplified version - in a real app we'd use the actual start/end dates
    // For now we'll format the completionDate into a nice display
    const date = new Date(completionDate);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const getOrdinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return `on ${getOrdinal(day)} ${month} ${year}`;
  };

  return (
    <div className={`certificate-container relative w-[1000px] h-[700px] bg-white border-[30px] border-black shadow-2xl overflow-hidden font-sans ${className}`}>
      {/* Background/Watermark potential here */}

      <div className="relative z-10 h-full flex flex-col items-center px-16 py-12 text-center">
        {/* Top Logo and Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-2">
            {/* Minimalist Lion Head Logo */}
            <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor" className="text-black">
              <path d="M50 10 L40 30 L60 30 Z M30 40 Q20 40 20 60 L80 60 Q80 40 70 40 M45 70 L55 70 L50 90 Z" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-medium tracking-[0.2em] uppercase text-gray-800">
              PANA <span className="text-red-800">Academy</span>
            </h2>
            <p className="text-[10px] tracking-[0.4em] uppercase text-gray-600 font-semibold">
              Competency Cultivation Hub
            </p>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="mt-4 mb-4">
          <h1 className="text-7xl font-serif tracking-widest text-[#1a1a1a] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            CERTIFICATE
          </h1>
          <div className="flex items-center justify-center gap-6">
            <div className="h-[3px] w-20 bg-[#c5a059]"></div>
            <h3 className="text-2xl font-serif tracking-[0.3em] text-[#c5a059] uppercase">
              OF COMPLETION
            </h3>
            <div className="h-[3px] w-20 bg-[#c5a059]"></div>
          </div>
        </div>

        {/* Presented To */}
        <div className="mt-8 mb-4">
          <p className="text-lg italic text-gray-700">Presented to:</p>
          <div className="mt-6 mb-2">
            <h2 className="text-5xl font-bold text-black border-b border-white px-8 inline-block">
              {studentName}
            </h2>
            {/* Blank line for visual parity with template */}
            <div className="h-[1px] w-full max-w-md bg-gray-200 mt-2 mx-auto"></div>
          </div>
        </div>

        {/* Completion Text */}
        <div className="mt-4 space-y-2 max-w-2xl">
          <p className="text-lg text-black font-medium">
            Having Successfully completed the {courseDuration} Training on
          </p>
          <p className="text-2xl font-bold text-black italic">
            "{courseTitle}" Course
          </p>
          <p className="text-lg text-black font-medium italic">
            {formatDateRange()}
          </p>
          {venueName && (
            <div className="mt-4 flex flex-col items-center text-sm text-gray-600">
              <p className="font-bold text-black uppercase tracking-tight flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="inline"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Venue: {venueName}
              </p>
              <p className="italic">{venueAddress}, {venueCity}, {venueCountry}</p>
            </div>
          )}
        </div>

        {/* Bottom Section: Medal and Signatures */}
        <div className="mt-auto w-full flex justify-between items-end pb-4">
          {/* Executive Director Signature */}
          <div className="flex flex-col items-center">
            <div className="w-48 border-t border-black mb-2 self-start"></div>
            <div className="text-left w-full">
              <p className="text-sm font-bold text-black uppercase">Iyenemi Akobo</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Executive Director</p>
            </div>
          </div>

          {/* Center Medal */}
          <div className="relative -mb-4">
            <div className="w-24 h-24 bg-[#e8c35d] rounded-full shadow-lg border-4 border-[#c5a059] flex items-center justify-center relative z-10 overflow-hidden">
              {/* Medal Inner Text/Emboss */}
              <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white to-black"></div>
              <div className="border border-[#c5a059] rounded-full w-[80%] h-[80%]"></div>
            </div>
            {/* Ribbons */}
            <div className="absolute top-[80%] left-1/2 -translate-x-1/2 flex gap-1 z-0">
              <div className="w-6 h-12 bg-[#e8c35d] border-b-8 border-l-8 border-r-8 border-[#c59c25] origin-top rotate-12"></div>
              <div className="w-6 h-12 bg-[#e8c35d] border-b-8 border-l-8 border-r-8 border-[#c59c25] origin-top -rotate-12"></div>
            </div>
          </div>

          {/* Dean Signature */}
          <div className="flex flex-col items-center">
            <div className="w-48 border-t border-black mb-2 self-end"></div>
            <div className="text-right w-full">
              <p className="text-sm font-bold text-black uppercase">Ifeyinwa E. Achumba</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Dean</p>
            </div>
          </div>
        </div>

        {/* Certificate ID Watermark */}
        <div className="absolute bottom-2 right-4 opacity-30 text-[8px] font-mono">
          ID: {certificateId}
        </div>
      </div>
    </div>
  );
}
