"use client";

import React, { useEffect, useState } from "react";
import PracticeTestTable from "@/components/practice-test/PracticeTestTable";
import { useDropdowns } from "@/utils/hooks/useDropdowns";
import Skeleton from "@mui/material/Skeleton";

export default function Page() {
  const { exercises, isAnyLoading, errorMessages } = useDropdowns();

  const [rows, setRows] = useState<
    Array<{
      id: string;
      title: string;
      duration: number;
      totalMarks: number;
      isSolved: boolean;
    }>
  >([]);

  useEffect(() => {
    console.log("Exercises from hook:", exercises);
    if (exercises.length > 0) {
      // Filter out exercises with duration 0
      const filteredExercises = exercises.filter(
        (exercise) => exercise.duration !== 0
      );
      if (filteredExercises.length > 0) {
        const mappedRows = filteredExercises.map((exercise) => ({
          id: `${exercise.id}`,
          title: `${exercise.name}`,
          duration: exercise.duration,
          totalMarks: exercise.totalMarks,
          isSolved: false,
        }));
        setRows(mappedRows);
        console.log("Mapped rows:", mappedRows);
      } else {
        // If no exercises have a duration > 0, clear the rows.
        setRows([]);
      }
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
            <p key={idx + error.charCodeAt(0)} className="text-red-500">
              {error}
            </p>
          ))}
        </div>
      );
    }

    // If there are no rows (for example, if the only exercise(s) have duration 0)
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
