"use client";
import React from "react";
import SidebarItem from "./SidebarItem";
import DashboardIcon from "@/assets/sidebar-icons/dashboard.svg";
import QuestionBankIcon from "@/assets/sidebar-icons/question-bank.svg";
import CreateTestIcon from "@/assets/sidebar-icons/create-test.svg";
import ResultIcon from "@/assets/sidebar-icons/result.svg";
import ProfileIcon from "@/assets/sidebar-icons/profile.svg";

export default function Sidebar() {
  // TODO: Display SidebarItem based on user role
  return (
    <div className="fixed top-0 left-0 h-screen w-24 backdrop-blur-md bg-gradient-to-b from-yellow-50 to-blue-200  border-r border-black flex flex-col">
      {/* Top Section */}
      <div className="flex flex-col items-center p-4">
        <div className="w-16 h-16 bg-[#FF7878] rounded-full mb-4"></div>
      </div>

      {/* SidebarItem Section */}
      <div className="flex flex-col items-center mt-28 p-4">
        <SidebarItem
          href="/dashboard"
          ariaLabel="डैशबोर्ड"
          icon={<DashboardIcon />}
        />

        <SidebarItem
          href="/question-bank"
          ariaLabel="प्रश्न संच"
          icon={<QuestionBankIcon />}
        />

        <SidebarItem
          href="/create-test"
          ariaLabel="चाचणी तयार करा"
          icon={<CreateTestIcon />}
        />

        <SidebarItem href="/result" ariaLabel="निकाल" icon={<ResultIcon />} />

        <SidebarItem
          href="/profile"
          ariaLabel="प्रोफाइल"
          icon={<ProfileIcon />}
        />
      </div>
    </div>
  );
}
