import * as React from "react";
import Image from "next/image";

interface NavButtonProps {
  imageSrc: string;
  imageAlt?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export const NavButton: React.FC<NavButtonProps> = ({
  imageSrc,
  imageAlt = "",
  onClick,
  ariaLabel,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={ariaLabel || imageAlt}
        className="flex flex-col justify-center items-center px-16 py-1.5 bg-rose-400 rounded-3xl border border-white border-solid shadow-sm max-md:px-5 cursor-pointer hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 transition-colors"
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
    </>
  );
};
