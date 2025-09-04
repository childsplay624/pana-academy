import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/logo.png"
        alt="PANA Academy Logo"
        className="h-16 w-auto transition-all duration-200 hover:scale-105"
      />
    </Link>
  );
};

export default Logo;
