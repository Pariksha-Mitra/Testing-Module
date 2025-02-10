"use client";
import React from "react";

export interface RowData {
  readonly id: string;
  readonly title: string;
  readonly duration: number;
  readonly totalMarks: number;
  readonly isSolved: boolean; // true if attempted
}

interface TableRowProps {
  readonly row: RowData;
  readonly onSolve: (row: RowData) => void;
  readonly onRetry: (row: RowData) => void;
}

export default function TableRow({ row, onSolve, onRetry }: TableRowProps) {
  return (
    <tr className="hover:bg-gray-50 border-r border-black">
      {/* DESCRIPTION */}
      <td className="px-6 py-2 font-inter whitespace-nowrap text-lg text-gray-900 text-center border-r border-t border-black last:border-r-0">
        {row.title}
      </td>

      {/* DURATION */}
      <td className="px-6 py-2 font-inter whitespace-nowrap text-lg text-gray-900 text-center border-r border-t border-black last:border-r-0">
        {row.duration} min
      </td>

      {/* TOTAL MARKS */}
      <td className="px-6 py-2 font-inter whitespace-nowrap text-lg text-gray-900 text-center border-r border-t border-black last:border-r-0">
        {row.totalMarks}
      </td>

      {/* STATUS / ACTION */}
      <td className="px-6 py-2 whitespace-nowrap text-center border-t border-black arya-bold">
        {row.isSolved ? (
          <div className="flex items-center justify-center gap-3">
            <span className="text-green-600 text-lg font-medium">
              attempted
            </span>
            <button
              onClick={() => onRetry(row)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white text-lg font-medium py-1 px-4 rounded"
            >
              RETRY
            </button>
          </div>
        ) : (
          <button
            onClick={() => onSolve(row)}
            className="bg-green-500 hover:bg-green-600 text-white text-lg font-medium py-1 px-10 rounded"
          >
            SOLVE
          </button>
        )}
      </td>
    </tr>
  );
}
