"use client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Question } from "@/utils/types";

export interface AttemptTestState {
  exerciseId: string | null;
  exerciseDuration: number; // in seconds
  questions: Question[];
  attemptedAnswers: Record<string, AnswerType>;
  visitedQuestions: string[];
  currentQuestionIndex: number;
  timeElapsed: number;
  isSubmitted: boolean;
  testTitle: string;

  // Anti-cheat related fields
  cheatCount: number;
  maxCheatAttempts: number; // if exceeded, we auto-submit or take action

  // Basic setters & actions
  setExercise: (exerciseId: string) => void;
  setExerciseWithDuration: (exerciseId: string, duration: number) => void;
  setTestTitle: (title: string) => void;
  setQuestions: (questions: Question[]) => void;
  markQuestionVisited: (questionId: string) => void;
  attemptQuestion: (questionId: string, answer: AnswerType) => void;
  setCurrentQuestionIndex: (index: number) => void;
  incrementTime: (delta: number) => void;
  submitTest: () => void;
  resetTest: () => void;

  // Anti-cheat methods
  incrementCheatCount: () => void;
}

type AnswerType = string | number | null;

export const useAttemptTestStore = create<AttemptTestState>()(
  persist(
    devtools(
      immer((set, get) => ({
        exerciseId: null,
        exerciseDuration: 0,
        questions: [],
        attemptedAnswers: {},
        visitedQuestions: [],
        currentQuestionIndex: 0,
        timeElapsed: 0,
        isSubmitted: false,
        testTitle: "",

        // Anti-cheat
        cheatCount: 0,
        maxCheatAttempts: 3, 

        setExercise: (exerciseId: string) =>
          set((state) => {
            state.exerciseId = exerciseId;
          }),

        setExerciseWithDuration: (exerciseId: string, durationInMinutes: number) =>
          set((state) => {
            state.exerciseId = exerciseId;
            state.exerciseDuration = durationInMinutes * 60;
          }),

        setTestTitle: (title: string) =>
          set((state) => {
            state.testTitle = title;
          }),

        setQuestions: (questions: Question[]) =>
          set((state) => {
            const initialAnswers = questions.reduce<Record<string, string | number | null>>(
              (acc, q) => {
                acc[q.id] = null;
                return acc;
              },
              {}
            );
            state.questions = questions;
            state.attemptedAnswers = initialAnswers;
            state.visitedQuestions = [];
            state.currentQuestionIndex = 0;
            state.timeElapsed = 0;
            state.isSubmitted = false;
            state.testTitle = "";
            state.cheatCount = 0;
          }),

        markQuestionVisited: (questionId: string) =>
          set((state) => {
            if (!state.visitedQuestions.includes(questionId)) {
              state.visitedQuestions.push(questionId);
            }
          }),

        attemptQuestion: (questionId: string, answer: string | number | null) =>
          set((state) => {
            state.attemptedAnswers[questionId] = answer;
          }),

        setCurrentQuestionIndex: (index: number) =>
          set((state) => {
            state.currentQuestionIndex = index;
          }),

        incrementTime: (delta: number) =>
          set((state) => {
            state.timeElapsed += delta;
          }),

        submitTest: () =>
          set((state) => {
            state.isSubmitted = true;
          }),

        resetTest: () =>
          set((state) => {
            state.exerciseId = null;
            state.exerciseDuration = 0;
            state.questions = [];
            state.attemptedAnswers = {};
            state.visitedQuestions = [];
            state.currentQuestionIndex = 0;
            state.timeElapsed = 0;
            state.isSubmitted = false;
            state.testTitle = "";
            state.cheatCount = 0;
          }),

        incrementCheatCount: () => {
          const { cheatCount, maxCheatAttempts } = get();
          const updatedCount = cheatCount + 1;
          set((state) => {
            state.cheatCount = updatedCount;
            if (updatedCount >= maxCheatAttempts) {
              state.isSubmitted = true;
            }
          });
        },
      }))
    ),
    {
      name: "attempt-test-store",
    }
  )
);
