"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAttemptTestStore } from "@/store/useAttemptTestStore";
import RightArrow from "@/public/test-modal-icons/right-arrow.svg";

export default function DetailedResultHeader() {
  const router = useRouter();
  const {
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
  } = useAttemptTestStore();

  // Handler to pop the current page when "मागे" is clicked.
  const handleBackClick = () => {
    router.back();
  };

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
      <div className="flex flex-row items-center justify-center w-full md:w-3/4">
        {/* Back button with onClick handler */}
        <div
          className="flex ml-10 flex-col items-center justify-center arya-regular text-center cursor-pointer"
          onClick={handleBackClick}
        >
          <RightArrow />
          मागे
        </div>

        <div className="flex items-center p-4 justify-center w-full text-center gap-8">
          <h1 className="text-4xl laila-bold">DETAILED TEST RESULT</h1>
        </div>
      </div>

      <div className="flex flex-col p-4 w-full md:w-1/2">
        <div className="grid grid-cols-7 gap-4 p-4">
          {questions.map((question, index) => (
            <button
              key={question.id || index}
              className={`flex pt-1 laila-semibold items-center justify-center ${
                currentQuestionIndex === index
                  ? "bg-green-400"
                  : "bg-[#a6b1ff]"
              } w-10 h-10 text-white rounded-full font-bold`}
              onClick={() => {
                setCurrentQuestionIndex(index);
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
