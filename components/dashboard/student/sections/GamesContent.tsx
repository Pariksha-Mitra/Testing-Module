"use client";

import React from "react";
import Image from "next/image";

const GamesContent: React.FC = () => {
  return (
    <div className=" flex flex-col items-center justify-center w-full h-full ">
      {/* Top-Right Image */}
      <Image
        src="/top-right.png"
        alt="Top Right"
        width={160}
        height={160}
        priority
        className="absolute top-0 right-0 w-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 max-w-full h-auto overflow-hidden"
      />

      {/* Bottom-Left Image */}
      <Image
        src="/bottom-left.png"
        alt="Bottom Left"
        width={160}
        height={160}
        priority
        className="absolute bottom-0 left-0 w-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 max-w-full h-auto overflow-hidden"
      />

      {/* Centered Text */}
      <p className="z-10 text-2xl md:text-4xl text-center text-wrap text-white arya-bold md:w-[40%] ">
        गेम खेळून तुमचे ज्ञान सुधारा
      </p>

      {/* Bottom Button */}
      <button className="z-10 absolute bottom-2 mt-1 arya-bold px-16 py-2 rounded-[16px] bg-white text-[#727809] text-lg md:text-2xl font-bold border border-[#727809] shadow-lg hover:bg-[#727809] hover:text-white hover:border-white transition">
        आता खेळा!
      </button>
    </div>
  );
};

export default GamesContent;
