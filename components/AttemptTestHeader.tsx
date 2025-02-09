"use client";
import React from "react";
import { useAttemptTestStore } from "@/store/useAttemptTestStore";

export default function AttemptTestHeader() {
  const {
    questions,
    testTitle,
    setCurrentQuestionIndex,
    attemptedAnswers,
    visitedQuestions,
  } = useAttemptTestStore();

  return (
    <div
      className="
        bg-[#9747FF] 
        text-white 
        flex flex-col md:flex-row gap-2
        p-2 
        rounded-t-[20px]
        shadow
      "
    >
      <div className="flex flex-col items-center justify-center w-full md:w-3/4">
        <div className="flex items-center p-4 justify-center w-full text-center gap-8">
          <h1 className="text-4xl laila-bold">{testTitle}</h1>
        </div>
      </div>

      <div className="flex flex-col p-4 w-full md:w-1/2">
        <div className="grid grid-cols-7 gap-4 p-4">
          {questions.map((question, index) => {
            // Determine if the question was attempted or visited.
            const isAttempted = attemptedAnswers[question.id] !== null;
            const isVisited = visitedQuestions.includes(question.id);

            // Set the background color based on the question status.
            let bgClass = "bg-[#959595]"; // default: not visited
            if (isAttempted) {
              bgClass = "bg-[#11CE6E]";
            } else if (isVisited) {
              bgClass = "bg-[#F3AA01]";
            }

            return (
              <button
                key={question.id || index}
                className={`flex pt-1 items-center justify-center laila-semibold ${bgClass} w-10 h-10 text-white rounded-full font-bold`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
