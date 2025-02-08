"use client";

import React from "react";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import PracticeTestHeader from "@/components/PracticeTestHeader";

const PracticeTestPageLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  if (!children) {
    throw new Error("QuestionBankPageLayout requires children");
  }
  return (
    // On very small screens, stack the sidebar on top.
    // Once we hit `md`, display them side-by-side.
    <div className="relative flex flex-col md:flex-row bg-gradient-to-b from-yellow-200 to-blue-300 h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content wrapped with SelectionProvider */}

      {/* Use md:ml-24 only on medium screens and up so it doesn't push content on mobile */}
      <div className="flex-1  ml-28 mr-4 my-3 bg-white rounded-[20px]">
        <PracticeTestHeader />
        <div className="p-4 ">{children}</div>
      </div>
    </div>
  );
};

export default PracticeTestPageLayout;
