"use client";
import React from "react";
import { QuestionProps } from "@/utils/types";
import { QuestionList } from "@/components/question-bank/QuestionList";
import "@/styles/scrollbar.css";

const questions: QuestionProps[] = [
  { questionNumber: "Q.no. 1", description: "Question description here" },
  { questionNumber: "Q.no. 2", description: "Question description here" },
  { questionNumber: "Q.no. 3", description: "Question description here" },
  { questionNumber: "Q.no. 4", description: "Question description here" },
  { questionNumber: "Q.no. 5", description: "Question description here" },
  { questionNumber: "Q.no. 6", description: "Question description here" },
  { questionNumber: "Q.no. 7", description: "Question description here" },
  { questionNumber: "Q.no. 8", description: "Question description here" },
  { questionNumber: "Q.no. 9", description: "Question description here" },
  { questionNumber: "Q.no. 10", description: "Question description here" },
  { questionNumber: "Q.no. 11", description: "Question description here" },
  { questionNumber: "Q.no. 12", description: "Question description here" },
  { questionNumber: "Q.no. 13", description: "Question description here" },
  { questionNumber: "Q.no. 14", description: "Question description here" },
  { questionNumber: "Q.no. 15", description: "Question description here" },
  { questionNumber: "Q.no. 16", description: "Question description here" },
  { questionNumber: "Q.no. 17", description: "Question description here" },
  { questionNumber: "Q.no. 18", description: "Question description here" },
  { questionNumber: "Q.no. 19", description: "Question description here" },
  { questionNumber: "Q.no. 20", description: "Question description here" },
  { questionNumber: "Q.no. 21", description: "Question description here" },
  // Add more questions as needed
];

const Page = () => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);

  const handleQuestionSelect = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  return (
    <div className="flex flex-wrap gap-7 px-6 py-6 mt-4 bg-white rounded-3xl border border-black border-solid shadow-lg max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col grow shrink-0 max-md:max-w-full">
        <div
          className="custom-scrollbar overflow-y-auto h-[656px] pr-2"
          style={{
            maxHeight: "656px", // Ensure consistent height
          }}
        >
          <QuestionList
            questions={questions}
            selectedQuestionIndex={selectedQuestionIndex}
            onQuestionSelect={handleQuestionSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
