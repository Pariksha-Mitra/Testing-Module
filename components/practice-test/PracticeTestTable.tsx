"use client";
import React, { useCallback } from "react";
import TableRow, { RowData } from "./TableRow"; 
import { useAttemptTestStore } from "@/store/useAttemptTestStore";
import { useRouter } from "next/navigation";
import { useQuestionStore } from "@/store/useQuestionStore";
import { useSelectionStore } from "@/store/useSelectionStore";
import PracticeTestModal from "./PracticeTestModal"; 

interface PracticeTestTableProps {
  readonly rows: ReadonlyArray<RowData>;
}

const PracticeTestTable: React.FC<PracticeTestTableProps> = ({ rows }) => {
  const { setSelection } = useSelectionStore();
  const router = useRouter();

  const setExerciseWithDuration = useAttemptTestStore(
    (state) => state.setExerciseWithDuration
  );
  const setQuestions = useAttemptTestStore((state) => state.setQuestions);
  const setTestTitle = useAttemptTestStore((state) => state.setTestTitle);
  const resetTest = useAttemptTestStore.getState().resetTest;

  // Local state for controlling the modal and the selected row (exercise)
  const [showDialog, setShowDialog] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<RowData | null>(null);

  // When a user clicks “solve”, store the row details and open the modal
  const handleSolveClick = useCallback((row: RowData) => {
    setSelectedRow(row);
    setShowDialog(true);
  }, []);

  // Actual test start logic once the user confirms in the modal
  const handleConfirmSolve = useCallback(async () => {
    if (!selectedRow) return;

    // Clear the storage and reset the test state
    useAttemptTestStore.persist.clearStorage();
    resetTest();

    // Set up the exercise using the selected row details
    setExerciseWithDuration(selectedRow.id, selectedRow.duration);
    setSelection({ exercise: selectedRow.id });

    // Fetch questions for the selected exercise
    await useQuestionStore.getState().fetchQuestions(selectedRow.id);
    const fetchedQuestions = useQuestionStore.getState().questions;
    setQuestions(fetchedQuestions);
    setTestTitle(selectedRow.title);

    // Navigate to the attempt-test page
    router.push("/attempt-test");

    // Close the modal and clear the selected row
    setShowDialog(false);
    setSelectedRow(null);
  }, [
    selectedRow,
    resetTest,
    setExerciseWithDuration,
    setTestTitle,
    setSelection,
    setQuestions,
    router,
  ]);

  const handleCancelSolve = useCallback(() => {
    setShowDialog(false);
    setSelectedRow(null);
  }, []);

  const handleRetry = useCallback(
    (row: RowData) => {
      console.log("Retrying test:", row.title);
      resetTest();
      router.push("/attempt-test");
    },
    [router, resetTest]
  );

  return (
    <>
      {/* Table of exercises */}
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

        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              onSolve={handleSolveClick}
              onRetry={handleRetry}
            />
          ))}
        </tbody>
      </table>

      {/* Render the separated modal when needed */}
      {showDialog && selectedRow && (
        <PracticeTestModal
          row={selectedRow}
          onConfirm={handleConfirmSolve}
          onCancel={handleCancelSolve}
        />
      )}
    </>
  );
};

export default React.memo(PracticeTestTable);
