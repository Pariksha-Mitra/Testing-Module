// import Header from "@/components/Header";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import QuestionBankHeader from "@/components/QuestionBankHeader";
import React from "react";

const TestPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="relative flex bg-gradient-to-b from-yellow-200 to-blue-300 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 ml-24">
        <QuestionBankHeader />
        {children}
      </div>
    </div>
  );
};

export default TestPageLayout;