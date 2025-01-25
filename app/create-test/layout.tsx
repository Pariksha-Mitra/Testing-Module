"use client";

import React from "react";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import TestHeader from "@/components/TestHeader";
import { ToastProvider } from "@/components/ui/ToastProvider";

const TestPageLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  if (!children) {
    throw new Error("TestPageLayout requires children");
  }

  return (
    <ToastProvider>
      <div className="relative flex bg-gradient-to-b from-yellow-200 to-blue-300 min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 ml-24">
          <TestHeader />
          {children}
        </div>
      </div>
    </ToastProvider>
  );
};

export default TestPageLayout;
