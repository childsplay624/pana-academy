import React from 'react';
import { useSiteImage } from '@/hooks/useSiteImage';

export function Logo() {
  const { imageUrl, altText } = useSiteImage('logo_main');

  return (
    <div className="flex items-center">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={altText || "PANA Institute Logo"}
          className="h-16 w-auto object-contain filter drop-shadow-sm transition-all duration-200 hover:drop-shadow-md"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
          loading="eager"
          decoding="async"
        />
      ) : (
        <div className="h-16 w-auto bg-gradient-to-r from-pana-navy to-pana-gold rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md">
          <span className="text-white font-bold text-xl tracking-wide">PANA</span>
        </div>
      )}
    </div>
  );
}
