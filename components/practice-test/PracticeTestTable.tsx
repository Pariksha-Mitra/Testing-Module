"use client";
import React, {
  useCallback,
  useState,
  useEffect,
  startTransition,
} from "react";
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

  // Manage a single state for the selected row (and modal visibility).
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);

  // Prefetch the /attempt-test route for faster navigation.
  useEffect(() => {
    router.prefetch("/attempt-test");
  }, [router]);

  // When a user clicks "सोडवा" (solve) on a row, open the modal.
  const handleSolveClick = useCallback((row: RowData) => {
    setSelectedRow(row);
  }, []);

  // When the user confirms in the modal, set up test state and navigate.
  const handleConfirmSolve = useCallback(async () => {
    if (!selectedRow) return;

    // Clear persisted storage and reset test state.
    useAttemptTestStore.persist.clearStorage();
    resetTest();

    // Set up exercise details.
    setExerciseWithDuration(selectedRow.id, selectedRow.duration);
    setSelection({ exercise: selectedRow.id });
    setTestTitle(selectedRow.title);

    // Option 1: Immediately navigate to /attempt-test.
    // You can fetch questions on the /attempt-test page (recommended).
    startTransition(() => {
      router.push("/attempt-test");
    });

    
    // Option 2: If you want to fetch questions before navigating:
    await useQuestionStore.getState().fetchQuestions(selectedRow.id);
    const fetchedQuestions = useQuestionStore.getState().questions;
    setQuestions(fetchedQuestions);
    startTransition(() => {
      router.push("/attempt-test");
    });
    

    // Clear the modal.
    setSelectedRow(null);
  }, [
    selectedRow,
    resetTest,
    setExerciseWithDuration,
    setTestTitle,
    setSelection,
    router,
     setQuestions  
  ]);

  const handleCancelSolve = useCallback(() => {
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
        className="w-full border border-black rounded-[20px] border-separate border-spacing-0 overflow-hidden shadow-lg"
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

      {/* Render the modal when a row is selected */}
      {selectedRow && (
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
