import React from 'react';
import { useSiteImage } from '@/hooks/useSiteImage';

export function Logo() {
  const { imageUrl, altText } = useSiteImage('logo_main', '/logo.png');

  return (
    <div className="flex items-center">
      <img
        src={imageUrl}
        alt={altText || "PANA Academy Logo"}
        className="h-14 w-auto"
      />
    </div>
  );
}
