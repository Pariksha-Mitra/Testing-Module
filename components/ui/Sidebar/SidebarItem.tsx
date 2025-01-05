"use client";

import React from "react";
import Link from "next/link";
import { SidebarItemProps } from "@/utils/types";
import { usePathname } from "next/navigation";

const SidebarItem: React.FC<SidebarItemProps> = ({ href, ariaLabel, icon }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} aria-label={ariaLabel}>
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
    </Link>
  );
};

export default SidebarItem;
