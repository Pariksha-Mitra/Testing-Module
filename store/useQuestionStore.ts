import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Question, QuestionType, QuestionStore, QuestionResponse } from '@/utils/types';
import { fetchData } from '@/utils/hooks/fetchData';
import { useSelectionStore } from './useSelectionStore';
import { v4 as uuidv4 } from 'uuid';
import { useExerciseStore } from './useExerciseStore'; 

export const useQuestionStore = create<QuestionStore>()(
  devtools(
    persist(
      (set, get) => ({
        questions: [],
        selectedQuestionIndex: 0,
        loading: false,
        error: null,
        // New flag and setter:
        useSelectionExercise: true,
        setUseSelectionExercise: (flag: boolean) => set({ useSelectionExercise: flag }),

        fetchQuestions: async (exerciseIdOverride?: string) => {
          let exercise: string | null = null;
          let standard: string | null = null;
          let subject: string | null = null;
          let chapter: string | null = null;

          if (get().useSelectionExercise) {
            const selection = useSelectionStore.getState().selection;
            exercise = selection.exercise;
            standard = selection.standard;
            subject = selection.subject;
            chapter = selection.chapter;
          } else {
            exercise = exerciseIdOverride ?? null;
            standard = '';
            subject = '';
            chapter = '';
          }

          if (!exercise) return;

          set({ loading: true, error: null });
          try {
            const data = await fetchData<QuestionResponse>('/api/questions/get-question', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ exerciseId: exercise }),
            });

            if (data.exercise_related_questions.length > 0) {
              const mappedQuestions: Question[] = data.exercise_related_questions.map((q) => ({
                id: q._id || uuidv4(),
                _id: q._id,
                isPersisted: true,
                standardId: standard ?? '',
                subjectId: subject ?? '',
                chapterId: chapter ?? '',
                exerciseId: exercise,
                questionText: q.questionText,
                questionDescription: q.questionDescription,
                questionType: q.questionType as QuestionType,
                answerFormat: q.answerFormat,
                options: q.options,
                correctAnswer: q.correctAnswer,
                description: q.description,
                image: q.image,
                imageOptions: q.imageOptions,
                numericalAnswer: q.numericalAnswer,
              }));
              set({ questions: mappedQuestions });

              // Compute the number of questions
              const questionsCount = mappedQuestions.length;
              // Update the exercise metrics based on questions count
              useExerciseStore.getState().updateExerciseMetrics(exercise, questionsCount);
            } else {
              useQuestionStore.getState().resetQuestions();
              useExerciseStore.getState().updateExerciseMetrics(exercise, 0);
            }
          } catch (err: unknown) {
            if (err instanceof Error) {
              console.error('Error fetching questions:', err.message);
            } else {
              console.error('Error fetching questions:', err);
            }
            set({ error: 'Failed to load questions.' });
          } finally {
            set({ loading: false });
          }
        },

        addQuestion: (exerciseId, replace = false) => {
          const { standard, subject, chapter } = useSelectionStore.getState().selection;

          const newQuestion: Question = {
            id: uuidv4(),
            standardId: standard ?? '',
            subjectId: subject ?? '',
            chapterId: chapter ?? '',
            exerciseId: exerciseId,
            questionText: '',
            questionDescription: '',
            questionType: QuestionType.MCQ,
            answerFormat: 'SINGLE_CHOICE',
            options: ['', '', '', ''],
            correctAnswer: null,
            image: null,
            imageOptions: [null, null, null, null],
            isPersisted: false,
            numericalAnswer: null,
          };

          const currentQuestions = get().questions;
          const newCount = replace ? 1 : currentQuestions.length + 1;

          set((state) => ({
            questions: replace ? [newQuestion] : [...state.questions, newQuestion],
            selectedQuestionIndex: replace ? 0 : state.questions.length,
          }));

          useExerciseStore.getState().updateExerciseMetrics(exerciseId, newCount);
        },

        setSelectedQuestionIndex: (index) => set({ selectedQuestionIndex: index }),

        deleteQuestion: (index) => {
          set((state) => {
            const updatedQuestions = [...state.questions];
            updatedQuestions.splice(index, 1);
            const newIndex = index > 0 ? index - 1 : 0;
            if (updatedQuestions.length) {
              useExerciseStore.getState().updateExerciseMetrics(
                updatedQuestions[0].exerciseId,
                updatedQuestions.length
              );
            }
            return {
              questions: updatedQuestions,
              selectedQuestionIndex: newIndex,
            };
          });
        },

        updateQuestionField: <K extends keyof Question>(
          questionIndex: number,
          field: K,
          value: Question[K]
        ) => {
          set((state) => {
            const updatedQuestions = [...state.questions];
            updatedQuestions[questionIndex] = {
              ...updatedQuestions[questionIndex],
              [field]: value,
            };
            return { questions: updatedQuestions };
          });
        },

        resetQuestions: () => {
          set({
            questions: [],
            selectedQuestionIndex: 0,
            loading: false,
            error: null,
          });
        },
      }),
      {
        name: 'question-store',
        partialize: (state) => ({
          questions: state.questions,
          selectedQuestionIndex: state.selectedQuestionIndex,
        }),
      }
    )
  )
);
