import Image from 'next/image';
import React from 'react';

const AuthHeader = () => {
  return (
    <Image 
      src="/auth-header.png"
      alt="Authentication Header"
      width={500} // Set appropriate width
      height={200} // Set appropriate height
      priority // For above-the-fold images
      className="w-full" // Make responsive
    />
  );
};

export default AuthHeader;
