"use client";

import React from "react";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import QuestionBankHeader from "@/components/QuestionBankHeader";
import { ToastProvider } from "@/components/ui/ToastProvider";
const QuestionBankPageLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  if (!children) {
    throw new Error("QuestionBankPageLayout requires children");
  }
  return (
    // On very small screens, stack the sidebar on top.
    // Once we hit `md`, display them side-by-side.
    <div className="relative flex flex-col md:flex-row bg-gradient-to-b from-yellow-200 to-blue-300 min-h-screen">
      {/* Sidebar */}

      <Sidebar />
      {/* Use md:ml-24 only on medium screens and up so it doesn't push content on mobile */}
      <div className="flex-1 p-6 ml-24">
        <ToastProvider>
          <QuestionBankHeader />
          {children}
        </ToastProvider>
      </div>
    </div>
  );
};

export default QuestionBankPageLayout;
