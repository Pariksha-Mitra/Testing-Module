"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ROLE } from "@/utils/types";         
import { QuestionList } from "@/components/question-bank/QuestionList";
import { useQuestionStore } from "@/store/useQuestionStore";
import "@/styles/scrollbar.css";
import { useToast } from "@/components/ui/ToastProvider";
import { useSelectionStore } from "@/store/useSelectionStore";
import { Skeleton } from "@mui/material";

const Page: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();

  // Get the user's role from session
  const { data: session } = useSession();
  const isTeacher = session?.user?.role === ROLE.Teacher;

  // Hooks from your question store
  const {
    questions,
    selectedQuestionIndex,
    setSelectedQuestionIndex,
    deleteQuestion,
    fetchQuestions,
    loading,
    error,
  } = useQuestionStore();

  const selection = useSelectionStore((state) => state.selection);

  useEffect(() => {
    // Fetch questions when exercise changes
    if (selection.exercise) {
      fetchQuestions();
    } else {
      // Reset questions if no exercise is selected
      useQuestionStore.getState().resetQuestions();
    }
  }, [selection.exercise, fetchQuestions]);

  const handleQuestionSelect = useCallback(
    (index: number): void => {
      // Always set the selected index
      setSelectedQuestionIndex(index);

      // Only navigate to "/create-test" if the user is a Teacher
      if (isTeacher) {
        router.push(`/create-test?question=${index}`);
      }
    },
    [isTeacher, setSelectedQuestionIndex, router]
  );

  const handleDeleteQuestion = useCallback(async () => {
    const currentQuestion = questions[selectedQuestionIndex];
    if (!currentQuestion) {
      showToast("No question selected.", "error");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirmDelete) return;

    if (!currentQuestion.id) {
      showToast("Invalid question ID.", "error");
      return;
    }

    if (currentQuestion.isPersisted) {
      // Persisted question => DELETE request to backend
      console.log("Deleting persisted question with id:", currentQuestion.id);

      try {
        const response = await fetch(`/api/questions?id=${currentQuestion.id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          deleteQuestion(selectedQuestionIndex);
          showToast("Question deleted successfully.", "success");
        } else {
          const errorMsg = data.error || "Failed to delete the question.";
          showToast(errorMsg, "error");
        }
      } catch (error) {
        console.error("Error deleting persisted question:", error);
        showToast("Failed to delete the question.", "error");
      }
    } else {
      // Unsaved question => remove only in UI
      console.log("Removing unsaved question with id:", currentQuestion.id);
      deleteQuestion(selectedQuestionIndex);
      showToast("Question removed successfully.", "success");
    }
  }, [questions, selectedQuestionIndex, deleteQuestion, showToast]);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-7 px-6 py-6 mt-4 bg-white rounded-3xl border border-black border-solid shadow-lg max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col grow shrink-0 w-full">
          <Skeleton
            sx={{ bgcolor: "#f1f1f1" }}
            variant="rectangular"
            width="100%"
            height={505}
            animation="wave"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-wrap gap-7 px-6 py-6 mt-4 bg-white rounded-3xl border border-black border-solid shadow-lg max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col grow shrink-0 w-full">
        <div
          className="custom-scrollbar overflow-y-auto h-[505px] pr-2"
          style={{ maxHeight: "505px" }}
        >
          <QuestionList
            questions={questions}
            selectedQuestionIndex={selectedQuestionIndex}
            onQuestionSelect={handleQuestionSelect}
            onDeleteQuestion={handleDeleteQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
