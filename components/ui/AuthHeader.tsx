import Image from 'next/image';
import React from 'react';

const AuthHeader = () => {
  return (
    <div className="w-full flex justify-center">
      <Image 
        src="/auth-header.png"
        alt="Authentication Header"
        fill
        priority
       
      />
    </div>
  );
};

export default AuthHeader;
