import Header from '@/components/Header';
import React from 'react';
import Sidebar from '@/components/ui/Sidebar/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  if (!children) {
    throw new Error('DashboardLayout requires children');
  }

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
