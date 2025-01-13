import Header from "@/components/Header";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div
      className="relative flex h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #FBFFB7 0%, #FFFFFF 56%, #65D4FF 100%)",
      }}
    >
      <Sidebar />
      <div className="flex-1 p-6 lg:ml-24 overflow-y-auto">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
