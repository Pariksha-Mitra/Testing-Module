import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Question, QuestionType } from '@/utils/types';
import { v4 as uuidv4 } from 'uuid';

interface CustomTestStore {
  questions: Question[];
  selectedQuestionIndex: number;
  isEditing: boolean; // New state flag
  addQuestion: (question: Question) => void;
  addDefaultQuestion: () => void;
  updateQuestion: (index: number, updatedFields: Partial<Question>) => void;
  deleteQuestion: (index: number) => void;
  setSelectedQuestionIndex: (index: number) => void;
  setIsEditing: (value: boolean) => void; // New setter action
  resetTest: () => void;
}

// Helper: Create a default question
const createDefaultQuestion = (): Question => ({
  id: uuidv4(),
  standardId: '',
  subjectId: '',
  chapterId: '',
  exerciseId: '',
  questionText: '',
  questionType: QuestionType.MCQ,
  answerFormat: 'SINGLE_CHOICE',
  options: ['', '', '', ''],
  correctAnswer: null,
  isPersisted: false,
  numericalAnswer: null,
  questionDescription: '',
  image: null,
  imageOptions: [null, null, null, null],
});

export const useCustomTestStore = create<CustomTestStore>()(
  devtools(
    persist(
      (set) => ({
        questions: [],
        selectedQuestionIndex: 0,
        isEditing: false, // Initialize isEditing to false
        addQuestion: (question: Question) =>
          set((state) => {
            if (state.questions.some((q) => q.id === question.id)) {
              return {}; // Already exists, do nothing.
            }
            const newQuestions = [...state.questions, question];
            return {
              questions: newQuestions,
              selectedQuestionIndex: newQuestions.length - 1,
            };
          }),
        addDefaultQuestion: () => {
          const defaultQuestion = createDefaultQuestion();
          set((state) => {
            const newQuestions = [...state.questions, defaultQuestion];
            return {
              questions: newQuestions,
              selectedQuestionIndex: newQuestions.length - 1,
            };
          });
        },
        updateQuestion: (index: number, updatedFields: Partial<Question>) =>
          set((state) => {
            if (index < 0 || index >= state.questions.length) {
              console.warn(`updateQuestion: Index ${index} is out of bounds`);
              return {};
            }
            const questions = [...state.questions];
            questions[index] = { ...questions[index], ...updatedFields };
            return { questions };
          }),
        deleteQuestion: (index: number) =>
          set((state) => {
            if (index < 0 || index >= state.questions.length) {
              console.warn(`deleteQuestion: Index ${index} is out of bounds`);
              return {};
            }
            const questions = [...state.questions];
            questions.splice(index, 1);
            const newIndex = questions.length > 0 ? Math.min(index, questions.length - 1) : 0;
            return { questions, selectedQuestionIndex: newIndex };
          }),
        setSelectedQuestionIndex: (index: number) =>
          set({ selectedQuestionIndex: index }),
        setIsEditing: (value: boolean) => set({ isEditing: value }), // Set editing state
        resetTest: () => set({ questions: [], selectedQuestionIndex: 0, isEditing: false }),
      }),
      {
        name: 'custom-test-store',
        partialize: (state) => ({
          questions: state.questions,
          selectedQuestionIndex: state.selectedQuestionIndex,
          isEditing: state.isEditing, // Persist the isEditing state as well
        }),
      }
    )
  )
);
