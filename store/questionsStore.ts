// File: src/store/questionsStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Question, QuestionType } from '@/utils/types';
import { v4 as uuidv4 } from 'uuid';

interface QuestionsState {
  questions: Question[];
  selectedQuestionIndex: number;
  isEditing: boolean;
  setQuestions: (questions: Question[]) => void;
  addQuestion: (
    exerciseId: string,
    standardId: string,
    subjectId: string,
    chapterId: string,
    replace?: boolean
  ) => void;
  deleteQuestion: (index: number) => void;
  setSelectedQuestionIndex: (index: number) => void;
  setIsEditing: (isEditing: boolean) => void;
  updateQuestionField: (
    questionIndex: number,
    field: keyof Question,
    value: Question[keyof Question]
  ) => void;
}

export const useQuestionsStore = create<QuestionsState>()(
  devtools((set) => ({
    questions: [],
    selectedQuestionIndex: 0,
    isEditing: false,
    setQuestions: (questions) => set({ questions }),
    addQuestion: (
      exerciseId,
      standardId,
      subjectId,
      chapterId,
      replace = false
    ) => {
      const newQuestion: Question = {
        id: uuidv4(),
        standardId: standardId,
        subjectId: subjectId,
        chapterId: chapterId,
        exerciseId: exerciseId,
        questionText: '',
        questionType: QuestionType.MCQ,
        answerFormat: 'SINGLE_CHOICE',
        options: ['', '', '', ''],
        correctAnswer: null,
        description: '',
        image: null,
        imageOptions: [null, null, null, null],
        isPersisted: false,
      };
      set((state) => {
        const updatedQuestions = replace
          ? [newQuestion]
          : [...state.questions, newQuestion];
        const newIndex = replace ? 0 : state.questions.length;
        return {
          questions: updatedQuestions,
          selectedQuestionIndex: newIndex,
        };
      });
    },
    deleteQuestion: (index) => {
      set((state) => {
        const updatedQuestions = state.questions.filter(
          (_, idx) => idx !== index
        );
        const newIndex = index > 0 ? index - 1 : 0;
        return {
          questions: updatedQuestions,
          selectedQuestionIndex: newIndex,
        };
      });
    },
    setSelectedQuestionIndex: (index) => set({ selectedQuestionIndex: index }),
    setIsEditing: (isEditing) => set({ isEditing }),
    updateQuestionField: (questionIndex, field, value) => {
      set((state) => {
        const updatedQuestions = [...state.questions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          [field]: value,
        };
        return { questions: updatedQuestions };
      });
    },
  }))
);
