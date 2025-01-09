"use client";
import React from "react";
import { useQuestions } from "@/context/QuestionsContext";

interface TrueFalseComponentProps {
  editable: boolean; // Added editable prop
}

const TrueFalseComponent: React.FC<TrueFalseComponentProps> = ({ editable }) => {
  const { questions, setQuestions, selectedQuestionIndex } = useQuestions();
  const currentQuestion = questions[selectedQuestionIndex];

  if (!currentQuestion || !currentQuestion.content) {
    return <div>No question data available.</div>;
  }

  const handleAnswerChange = (value: boolean) => {
    if (!editable) return; // Prevent changes if not editable

    const updatedQuestions = [...questions];
    updatedQuestions[selectedQuestionIndex].content.correctAnswerIndex = value ? 1 : 0;
    setQuestions(updatedQuestions);
  };

  return (
    <div className="flex space-x-4 mt-4">
      <button
        onClick={() => handleAnswerChange(true)}
        disabled={!editable} // Disable button when not editable
        className={`px-4 py-2 rounded ${
          currentQuestion.content.correctAnswerIndex === 1
            ? "bg-green-500 text-white cursor-not-allowed"
            : editable
            ? "bg-gray-200 hover:bg-gray-300 cursor-pointer"
            : "bg-gray-200 cursor-not-allowed"
        }`}
        aria-disabled={!editable} // Accessibility attribute
      >
        True
      </button>
      <button
        onClick={() => handleAnswerChange(false)}
        disabled={!editable} // Disable button when not editable
        className={`px-4 py-2 rounded ${
          currentQuestion.content.correctAnswerIndex === 0
            ? "bg-red-500 text-white cursor-not-allowed"
            : editable
            ? "bg-gray-200 hover:bg-gray-300 cursor-pointer"
            : "bg-gray-200 cursor-not-allowed"
        }`}
        aria-disabled={!editable} // Accessibility attribute
      >
        False
      </button>
    </div>
  );
};

export default TrueFalseComponent;
