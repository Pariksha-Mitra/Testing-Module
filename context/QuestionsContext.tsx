// context/QuestionsContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Question, QuestionsContextProps } from "@/utils/types";

const QuestionsContext = createContext<QuestionsContextProps | undefined>(
  undefined
);

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error("useQuestions must be used within a QuestionsProvider");
  }
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const QuestionsProvider: React.FC<ProviderProps> = ({ children }) => {
  const [selection, setSelection] = useState({
    class: "५",
    subject: "विषय १",
    lesson: "धडा १",
    homework: "स्वाध्याय १",
  });

  // Initialize with one default question
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: "MCQ",
      content: {
        questionText: "",
        description: "",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswerIndex: null,
      },
    },
  ]);

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  return (
    <QuestionsContext.Provider
      value={{
        selection,
        setSelection,
        questions,
        setQuestions,
        selectedQuestionIndex,
        setSelectedQuestionIndex,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};
