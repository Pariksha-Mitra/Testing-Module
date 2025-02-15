// /store/useCustomTestStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Question, QuestionType } from '@/utils/types';
import { v4 as uuidv4 } from 'uuid';

interface CustomTestStore {
  questions: Question[];
  selectedQuestionIndex: number;
  addQuestion: (question: Question) => void;
  addDefaultQuestion: () => void;
  updateQuestion: (index: number, updatedFields: Partial<Question>) => void;
  deleteQuestion: (index: number) => void;
  setSelectedQuestionIndex: (index: number) => void;
  resetTest: () => void;
}

export const useCustomTestStore = create<CustomTestStore>()(
  devtools(
    persist(
      (set) => ({
        questions: [],
        selectedQuestionIndex: 0,
        addQuestion: (question: Question) =>
          set((state) => ({
            
            questions: state.questions.some((q) => q.id === question.id)
              ? state.questions
              : [...state.questions, question],
            selectedQuestionIndex: state.questions.length, 
          })),
          addDefaultQuestion: () => {
            const defaultQuestion: Question = {
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
            };
  
            set((state) => ({
              questions: [...state.questions, defaultQuestion],
              selectedQuestionIndex: state.questions.length,
            }));
          },
        updateQuestion: (index: number, updatedFields: Partial<Question>) =>
          set((state) => {
            const questions = [...state.questions];
            if (questions[index]) {
              questions[index] = { ...questions[index], ...updatedFields };
            }
            return { questions };
          }),
        deleteQuestion: (index: number) =>
          set((state) => {
            const questions = [...state.questions];
            questions.splice(index, 1);
            const newIndex = index > 0 ? index - 1 : 0;
            return { questions, selectedQuestionIndex: newIndex };
          }),
        setSelectedQuestionIndex: (index: number) =>
          set({ selectedQuestionIndex: index }),
        resetTest: () => set({ questions: [], selectedQuestionIndex: 0 }),
      }),
      {
        name: 'custom-test-store',
        partialize: (state) => ({
          questions: state.questions,
          selectedQuestionIndex: state.selectedQuestionIndex,
        }),
      }
    )
  )
);
