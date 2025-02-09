"use client";
import React from "react";
import SidebarItem from "./SidebarItem";
import DashboardIcon from "@/public/sidebar-icons/dashboard.svg";
import QuestionBankIcon from "@/public/sidebar-icons/question-bank.svg";
import CreateTestIcon from "@/public/sidebar-icons/create-test.svg";
import ResultIcon from "@/public/sidebar-icons/result.svg";
import ProfileIcon from "@/public/sidebar-icons/profile.svg";
import { useSession } from "next-auth/react";
import { ROLE } from "@/utils/types";
export default function Sidebar() {
  const { data: session } = useSession();

  const role = session?.user.role;

  return (
    <div className="fixed top-0 left-0 h-screen w-24  bg-white bg-opacity-60 border-r border-black flex flex-col">
      {/* backdrop-blur-md bg-gradient-to-b from-yellow-50 to-blue-200  */}
      
      
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

        {role === ROLE.Teacher && (
             <SidebarItem
             href="/create-test"
             ariaLabel="चाचणी तयार करा"
             icon={<CreateTestIcon />}
           />
         
        )}
          
           
         
        

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
