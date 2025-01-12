"use client";

import React from "react";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import QuestionBankHeader from "@/components/QuestionBankHeader";
import { SelectionProvider } from "@/context/SelectionContext";

const QuestionBankPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="relative flex bg-gradient-to-b from-yellow-200 to-blue-300 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content wrapped with SelectionProvider */}
      <SelectionProvider>
        <div className="flex-1 p-6 ml-24">
          {/* Header and Children can now consume SelectionContext */}
          <QuestionBankHeader />
          {children}
        </div>
      </SelectionProvider>
    </div>
  );
};

export default QuestionBankPageLayout;