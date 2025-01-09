"use client";

import React, { useContext, useMemo, useState } from "react";
import { QuestionProps } from "@/utils/types";
import { QuestionList } from "@/components/question-bank/QuestionList";
import "@/styles/scrollbar.css";
import { SelectionContext } from "@/context/SelectionContext";

const initialQuestions: QuestionProps[] = [
  {
    id: "1",
    questionNumber: "Q.1",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
    class: "५",
    subject: "विषय १",
    lesson: "धडा १",
    homework: "स्वाध्याय १",
  },
  {
    id: "2",
    questionNumber: "Q.2",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
    class: "५",
    subject: "विषय १",
    lesson: "धडा १",
    homework: "स्वाध्याय १",
  },
  {
    id: "3",
    questionNumber: "Q.3",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
    class: "५",
    subject: "विषय १",
    lesson: "धडा १",
    homework: "स्वाध्याय १",
  },
  {
    id: "4",
    questionNumber: "Q.4",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
    class: "५",
    subject: "विषय १",
    lesson: "धडा १",
    homework: "स्वाध्याय १",
  },
  {
    id: "5",
    questionNumber: "Q.5",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
    class: "५",
    subject: "विषय १",
    lesson: "धडा १",
    homework: "स्वाध्याय १",
  },

  {
    id: "6",
    questionNumber: "Q.6",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
    class: "५",
    subject: "विषय १",
    lesson: "धडा १",
    homework: "स्वाध्याय १",
  },

  {
    id: "7",
    questionNumber: "Q.7",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
    class: "५",
    subject: "विषय १",
    lesson: "धडा १",
    homework: "स्वाध्याय १",
  },

  {
    id: "8",
    questionNumber: "Q.1",
    description: "Another question description",
    isSelected: false,
    onClick: () => {},
    class: "५",
    subject: "विषय २",
    lesson: "धडा २",
    homework: "स्वाध्याय १",
  },
];

const Page = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("Page must be used within a SelectionProvider");
  }
  const { selection } = context;

  // 1) Keep track of the question list
  const [questionList, setQuestionList] =
    useState<QuestionProps[]>(initialQuestions);

  // 2) Keep track of which question is selected
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);

  // 3) Derived state: filter questions by dropdown selection
  const filteredQuestions = useMemo(() => {
    return questionList.filter((q) => {
      // Only show the question if it matches all filter fields
      return (
        q.class === selection.class &&
        q.subject === selection.subject &&
        q.lesson === selection.lesson &&
        q.homework === selection.homework
      );
    });
  }, [questionList, selection]);

  // 4) Handler for selecting a question
  const handleQuestionSelect = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  // 5) Handler for deleting a question
  const handleDeleteQuestion = (index: number) => {
    const questionToDelete = filteredQuestions[index];
    if (!questionToDelete) return;

    setQuestionList((prevQuestions) =>
      prevQuestions.filter((q) => q.id !== questionToDelete.id)
    );

    // Update selectedQuestionIndex if necessary
    if (selectedQuestionIndex === index) {
      setSelectedQuestionIndex(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-7 px-6 py-6 mt-4 bg-white rounded-3xl border border-black border-solid shadow-lg max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col grow shrink-0 max-md:max-w-full">
        <div
          className="custom-scrollbar overflow-y-auto h-[505px] pr-2"
          style={{
            maxHeight: "505px", // Ensure consistent height
          }}
        >
          {/* Render the filtered questions only */}
          <QuestionList
            questions={filteredQuestions}
            selectedQuestionIndex={selectedQuestionIndex ?? 0}
            onQuestionSelect={handleQuestionSelect}
            onDeleteQuestion={handleDeleteQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
