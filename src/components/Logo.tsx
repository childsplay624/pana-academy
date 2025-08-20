import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/logo.png" // Replace with your logo path
        alt="PANA Academy Logo"
        className="h-10 w-auto" // Adjust height as needed
      />
    </Link>
  );
};

export default Logo;
