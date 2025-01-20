import React from 'react';
import { useRouter } from 'next/router';

interface DashboardCard {
  color: string;
  title: string;
  ariaLabel: string;
  onClick?: () => void;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const dashboardCards: DashboardCard[] = [
    {
      color: "bg-[#7CD9FE]",
      title: "Card 1",
      ariaLabel: "Dashboard statistics 1",
    },
    {
      color: "bg-[#FA8097]",
      title: "Card 2",
      ariaLabel: "Dashboard statistics 2",
    },
    {
      color: "bg-[#6AD9A1]",
      title: "Card 3",
      ariaLabel: "Dashboard statistics 3",
      onClick: () => router.push('/games'),
    },
    {
      color: "bg-[#FFC756]",
      title: "Card 4",
      ariaLabel: "Dashboard statistics 4",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {dashboardCards.map((card, index) => (
        <section
          key={index}
          aria-label={card.ariaLabel}
          className={`${card.color} rounded-lg h-64 shadow hover:shadow-lg transition-all duration-300 p-4`}
          onClick={card.onClick}
        >
          <h2 className="text-xl font-semibold text-white">{card.title}</h2>
        </section>
      ))}
    </div>
  );
};

export default Dashboard;
