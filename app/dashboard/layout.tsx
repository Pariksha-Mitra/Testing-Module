import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex bg-gradient-to-b from-yellow-200 to-blue-300">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
