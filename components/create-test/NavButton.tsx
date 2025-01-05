import * as React from "react";
import Image from "next/image";
import { NavButtonProps } from "@/utils/types";

export const NavButton: React.FC<NavButtonProps> = ({
  imageSrc,
  imageAlt = "",
  onClick,
  ariaLabel,
  tooltipText = "Default Tooltip",
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  return (
    <div className="relative group">
      {/* Button */}
      <div
        role="button"
        tabIndex={0}
        aria-label={ariaLabel || imageAlt}
        className="flex flex-col justify-center items-center px-16 py-1.5 bg-rose-400 rounded-3xl border border-[1.5px] border-white border-solid shadow-sm max-md:px-5 cursor-pointer hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 transition-colors"
        onClick={handleClick}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={42}
          height={42}
          className="object-contain aspect-square"
        />
      </div>

      {/* Tooltip */}
      <div className="laila-medium  text-black w-[80%] absolute bottom-full border border-black border-solid left-1/2 transform -translate-x-1/2 mb-2 px-11 py-1 bg-white rounded-t-3xl rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity">
        {tooltipText}
      </div>
    </div>
  );
};
