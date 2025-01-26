"use client";
import React from "react";
import PracticeTestTable from "@/components/practice-test/PracticeTestTable";

export default function Page() {
  //sample data
  const rows = Array.from({ length: 10 }, (_, idx) => ({
    description: "Test name / description",
    duration: 30,
    totalMarks: 100,
    status: !(idx % 5),
  }));

  return (
    <div className="p-4">
      <div className="relative overflow-y-auto h-[530px] custom-scrollbar pr-4 font-arya">
        <PracticeTestTable rows={rows} />
      </div>
    </div>
  );
}
