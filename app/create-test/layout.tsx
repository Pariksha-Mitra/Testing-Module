"use client";

import React, { Suspense } from "react";
import TestHeader from "@/components/TestHeader";
import { ToastProvider } from "@/components/ui/ToastProvider";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import { Skeleton } from "@mui/material";

const TestPageLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  if (!children) {
    return <div>Error: No content provided for this layout.</div>;
  }

  return (
    <ToastProvider>
      <div className="relative flex bg-gradient-to-b from-yellow-200 to-blue-300 min-h-screen">
        <Suspense fallback={<div>Loading Sidebar...</div>}>
          <Sidebar />
        </Suspense>
        <div className="flex-1 p-6 ml-24 overflow-auto">
          <Suspense
            fallback={
              <div className="flex flex-col items-center p-4 rounded-lg shadow bg-[#6378fd] w-full">
                <Skeleton variant="rectangular" height={"200px"}></Skeleton>
              </div>
            }
          >
            <TestHeader />
          </Suspense>
          {children}
        </div>
      </div>
    </ToastProvider>
  );
};

export default TestPageLayout;
