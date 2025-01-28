"use client";
import React from "react";
import Link from "next/link";
import { SidebarItemProps } from "@/utils/types";
import { usePathname } from "next/navigation";

const SidebarItem: React.FC<SidebarItemProps> = ({ href, ariaLabel, icon }) => {
  const pathname = usePathname();
  const isActive = pathname === href;


  return (
    <Link href={href} aria-label={ariaLabel} >
      <div className="relative group mt-5">
        <div
          className={`w-14 h-14 ${
            isActive ? "bg-[#6378fd]" : "bg-white"
          } rounded-xl border border-black shadow mb-8 flex items-center justify-center
        hover:bg-opacity-80 transition cursor-pointer text-${
          isActive ? "white" : "black"
        }`}
        >
          {icon}
        </div>

        {/* Tooltip */}
        <div
          className="opacity-0 group-hover:opacity-100 transition 
               absolute left-[55%] -translate-x-1/2 bottom-full mb-3 
               px-3 py-1 text-sm text-black bg-white
               rounded-md whitespace-nowrap z-10 arya-bold text-md"
        >
          {ariaLabel}

          {/* Tooltip Arrow with a different color (blue) */}
          <div
            className="absolute left-[50%] -translate-x-1/2 top-full
                 w-0 h-0
                 border-l-8 border-l-transparent
                 border-r-8 border-r-transparent
                 border-t-8 border-white"
          />
        </div>
      </div>
    </Link>
  );
};

export default SidebarItem;
