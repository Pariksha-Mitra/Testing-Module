"use client"; // Ensure this is the first line

import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useMemo,
} from 'react';
import { Question, QuestionsContextProps, QuestionType } from '@/utils/types';

const QuestionsContext = createContext<QuestionsContextProps | undefined>(undefined);

export const useQuestions = (): QuestionsContextProps => {
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
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "",
      standardId: "",
      subjectId:"",
      chapterId: "",
      exerciseId: "",
      questionText: "",
      questionType: QuestionType.MCQ,
      answerFormat: "SINGLE_CHOICE",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: null,
      numericalAnswer: undefined,
      description: "",
      image: null,
      imageOptions: [null, null, null, null],
    },
  ]);

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      questions,
      setQuestions,
      selectedQuestionIndex,
      setSelectedQuestionIndex,
      isEditing,
      setIsEditing,
    }),
    [questions, selectedQuestionIndex, isEditing]
  );

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
};
