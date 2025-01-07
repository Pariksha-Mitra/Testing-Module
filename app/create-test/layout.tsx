import Sidebar from "@/components/Sidebar";
import TestHeader from "@/components/TestHeader";
import React from "react";

const TestPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex bg-gradient-to-b from-yellow-200 to-blue-300">
      <Sidebar />
      <div className="flex-1 p-6">
        <TestHeader />
        {children}
      </div>
    </div>
  );
};

export default TestPageLayout;
