import * as React from "react";
import Image from "next/image";
import { NavButtonProps } from "@/utils/types";

export const NavButton: React.FC<NavButtonProps> = ({
  imageSrc,
  imageAlt = "",
  onClick,
  ariaLabel,
  tooltipText = "Default Tooltip",
  disabled = false, // Default to false
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  return (
    <div className="relative group">
      {/* Button */}
      <button
        type="button"
        aria-label={ariaLabel ?? imageAlt}
        disabled={disabled}
        className={`flex flex-col justify-center items-center px-16 py-1.5 bg-rose-400 rounded-3xl border-[1.5px] border-white border-solid shadow-sm max-md:px-5 cursor-pointer hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 transition-colors ${
          disabled
            ? "opacity-50 cursor-not-allowed pointer-events-none"
            : ""
        }`}
        onClick={handleClick}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={42}
          height={42}
          className="object-contain aspect-square"
        />
      </button>

      {/* Tooltip */}
      {!disabled && (
        <div className="laila-medium text-black  absolute bottom-[90%] border border-black border-solid right-1/1 transform translate-x-1/2 mb-2 px-11 py-1 bg-white rounded-t-3xl rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity">
          {tooltipText}
        </div>
      )}
    </div>
  );
};
