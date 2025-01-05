import Header from "@/components/Header";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="relative flex bg-gradient-to-b from-yellow-200 to-blue-300 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 ml-24">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
