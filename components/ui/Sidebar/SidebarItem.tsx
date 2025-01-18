"use client";
import React from "react";
import Link from "next/link";
import { SidebarItemProps } from "@/utils/types";
import { usePathname } from "next/navigation";
import { useQuestions } from "@/context/QuestionsContext";

const SidebarItem: React.FC<SidebarItemProps> = ({ href, ariaLabel, icon }) => {
  const pathname = usePathname();
  const { isEditing } = useQuestions(); // Access isEditing from context
  const isActive = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (isEditing) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?"
      );
      if (!confirmLeave) {
        e.preventDefault(); // Prevent navigation
      }
    }
  };

  return (
    <Link href={href} aria-label={ariaLabel} onClick={handleClick}>
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
