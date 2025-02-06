import Sidebar from "@/components/ui/Sidebar/Sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col md:flex-row bg-gradient-to-b from-yellow-200 to-blue-300 h-screen">
      <Sidebar />

      {/* Use md:ml-24 only on medium screens and up so it doesn't push content on mobile */}
      <div className="flex-1  ml-28 mr-4 my-3 bg-gradient-to-b from-yellow-100 via-blue-200 to-blue-100 p-4 w-full rounded-md">
        <div className="p-4 ">{children}</div>
      </div>
    </div>
  );
};

export default layout;
