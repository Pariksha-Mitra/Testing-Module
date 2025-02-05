"use client";

import React, { useEffect, useState } from "react";
import PracticeTestTable from "@/components/practice-test/PracticeTestTable";
import { useDropdowns } from "@/utils/hooks/useDropdowns";
import Skeleton from "@mui/material/Skeleton";

export default function Page() {
  const { exercises, isAnyLoading, errorMessages } = useDropdowns();

  const [rows, setRows] = useState<
    Array<{
      description: string;
      duration: number;
      totalMarks: number;
      isSolved: boolean;
    }>
  >([]);

  useEffect(() => {
    console.log("Exercises from hook:", exercises);
    if (exercises.length > 0) {
      const mappedRows = exercises.map((exercise) => ({
        description: `${exercise.name}`,
        duration: exercise.duration,
        totalMarks: exercise.totalMarks,
        isSolved: false,
      }));
      setRows(mappedRows);
    } else {
      setRows([]);
    }
  }, [exercises]);

  const renderContent = () => {
    if (isAnyLoading) {
      return (
        <Skeleton
          className="rounded-3xl"
          sx={{ bgcolor: "#f2f2f2" }}
          variant="rectangular"
          width="100%"
          height="500px"
        />
      );
    }
  
    if (errorMessages.length > 0) {
      return (
        <div className="mb-4">
          {errorMessages.map((error, idx) => (
            <p key={idx} className="text-red-500">
              {error}
            </p>
          ))}
        </div>
      );
    }
  
    if (rows.length > 0) {
      return <PracticeTestTable rows={rows} />;
    }
  
    return <p>No exercises / practice test available.</p>;
  };
  
  return (
    <div className="p-4">
      {/* Dropdowns for selecting Standard, Subject, Chapter, Exercise */}
      <div className="relative overflow-y-auto h-[530px] custom-scrollbar pr-4 font-arya">
        {renderContent()}
      </div>
    </div>
  );
}
