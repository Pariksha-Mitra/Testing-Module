"use client";
import React from "react";
import TableRow, { RowData } from "./TableRow"; // Adjust the import path as needed

interface PracticeTestTableProps {
  readonly rows: ReadonlyArray<RowData>;
}

const PracticeTestTable: React.FC<PracticeTestTableProps> = ({ rows }) => {
  // Callback when "SOLVE" is clicked
  const handleSolve = React.useCallback((row: RowData) => {
    console.log("Solving test:", row.description);
    // ... e.g., navigate or show a modal
  }, []);

  // Callback when "RETRY" is clicked
  const handleRetry = React.useCallback((row: RowData) => {
    console.log("Retrying test:", row.description);
    // ... e.g., reset attempt, navigate, etc.
  }, []);

  return (
    <table
      className="
        w-full 
        border
        border-black
        rounded-[20px]
        border-separate
        border-spacing-0
        overflow-hidden
        shadow-lg
      "
      aria-label="Practice Test Table"
    >
      {/* Table Header */}
      <thead>
        <tr>
          <th
            scope="col"
            className="px-6 py-3 w-[60%] text-lg font-bold text-gray-700 text-center border-r border-black last:border-r-0"
          >
            Description
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-center text-lg font-bold text-gray-700 border-r border-black last:border-r-0"
          >
            Duration
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-center text-lg font-bold text-gray-700 border-black last:border-r-0"
          >
            Total Marks
          </th>
          <th
            scope="col"
            className="px-6 py-3 w-[20%] text-center text-lg font-bold text-gray-700 border-l border-black last:border-r-0"
          >
            Status
          </th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="bg-white divide-y divide-gray-200">
        {rows.map((row) => (
          <TableRow
            key={row.id ?? row.description} 
            row={row}
            onSolve={handleSolve}
            onRetry={handleRetry}
          />
        ))}
      </tbody>
    </table>
  );
};

export default React.memo(PracticeTestTable);
