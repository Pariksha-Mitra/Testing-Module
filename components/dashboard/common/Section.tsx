"use client";

import React, { ReactNode } from "react";

interface SectionProps {
  title: string;
  backgroundColor: string; // e.g., "bg-[#7CD9FE]"
  borderColor?: string; // e.g., "border-black"
  rounded?: string; // e.g., "rounded-[20px]"
  padding?: string; // e.g., "p-6"
  shadow?: string; // e.g., "shadow-lg"
  children: ReactNode;
  className?: string; // Additional custom classes
}

const Section: React.FC<SectionProps> = ({
  title,
  backgroundColor,
  borderColor = "border-black",
  rounded = "rounded-[20px]",
  padding = "p-5",
  shadow = "shadow-lg",
  children,
  className = "",
}) => {
  return (
    <div
      className={`${backgroundColor} ${rounded} ${shadow} ${borderColor} ${padding} pt-2 pb-3 border flex flex-col ${className} transition-all duration-300`}
    >
      <h2 className="text-4xl text-center text-black font-bold mb-2 arya-bold">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default Section;
