"use client";

import React from "react";
import DonutChart from "@/components/dashboard/student/DonutChart";

interface AnalysisContentProps {
  data: { color: string; value: number; label: string }[];
  total: number;
  centerValue?: number; // Optional prop for the center value
}

const AnalysisContent: React.FC<AnalysisContentProps> = ({
  data,
  total,
  centerValue = 75,
}) => {
  return (
    <div className="flex-grow bg-white border border-black rounded-2xl p-4 flex items-center justify-center overflow-hidden">
      <DonutChart segments={data} total={total} centerValue={centerValue} />
    </div>
  );
};

export default AnalysisContent;
