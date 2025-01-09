"use client";
import React from "react";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import TestHeader from "@/components/TestHeader";
import { QuestionsProvider } from "@/context/QuestionsContext";

const TestPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <QuestionsProvider>
      <div className="relative flex bg-gradient-to-b from-yellow-200 to-blue-300 min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 ml-24">
          <TestHeader />
          {children}
        </div>
      </div>
    </QuestionsProvider>
  );
};

export default TestPageLayout;
