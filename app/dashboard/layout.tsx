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
    <div className="relative flex bg-gradient-to-b from-yellow-200 to-blue-300 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 ml-24">
        <Header />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
