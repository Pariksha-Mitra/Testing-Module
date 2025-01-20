"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useState
} from 'react';
import { Question, QuestionsContextProps, QuestionType } from '@/utils/types';

/**
 * Context for managing questions throughout the application
 * @description Provides question state and operations to child components
 */
const QuestionsContext = createContext<QuestionsContextProps | undefined>(
  undefined
);

/**
 * Custom hook to access the questions context
 * @returns {QuestionsContextProps} The questions context value
 * @throws {Error} If used outside of QuestionsProvider
 */
export const useQuestions = (): QuestionsContextProps => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error("useQuestions must be used within a QuestionsProvider");
  }
  return context;
};

/**
 * Props for the QuestionsProvider component
 */
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

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: QuestionType.MCQ,
      content: {
        questionText: "",
        description: "",
        options: ["", "", "", ""],
        correctAnswerIndex: null,
        image: null,
        imageOptions: [null, null, null, null],
      },
    },
  ]);

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // Add this state

  const value = React.useMemo(
    () => ({
      selection,
      setSelection,
      questions,
      setQuestions,
      selectedQuestionIndex,
      setSelectedQuestionIndex,
      isEditing, // Provide this state in the context
      setIsEditing, // Provide the setter in the context
    }),
    [selection, questions, selectedQuestionIndex, isEditing]
  );

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
};