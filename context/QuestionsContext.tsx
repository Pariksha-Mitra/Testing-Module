import React, {
  createContext,
  ReactNode,
  useContext,
  useState
  } from 'react';
import { Question, QuestionsContextProps, QuestionType } from '@/utils/types';

// Constants for default values
const DEFAULT_CONTEXT: QuestionsContextProps = {
  questions: [],
  selectedQuestionIndex: 0,
  setSelectedQuestionIndex: () => {},
  selection: {
    class: "५",
    subject: "विषय १",
    lesson: "धडा १",
    homework: "स्वाध्याय १",
  },
  setSelection: () => {},
  setQuestions: () => {},
};

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

  // Initialize with one default question
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: QuestionType.MCQ,
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
