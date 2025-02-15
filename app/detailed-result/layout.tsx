"use client";

import React from "react";
import DetailedResultHeader from "@/components/DetailedResultHeader";
import { ToastProvider } from "@/components/ui/ToastProvider";

const DetailedResultPageLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  if (!children) {
    throw new Error("QuestionBankPageLayout requires children");
  }
  return (
    <div
      className="relative flex flex-col md:flex-row min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #FBFFB7 0%, #FFFFFF 56%, #65D4FF 100%)",
      }}
    >
      {/* Main Content wrapped with SelectionProvider */}

      {/* Use md:ml-24 only on medium screens and up so it doesn't push content on mobile */}
      <div className="flex-1 mx-4 my-2  md:my-10  md:mx-32 bg-[#FFFFFF] rounded-[20px] border border-[#000000] shadow-lg">
        <ToastProvider>
          <DetailedResultHeader />
          <div className="p-4 ">{children}</div>
        </ToastProvider>
      </div>
    </div>
  );
};

export default DetailedResultPageLayout
