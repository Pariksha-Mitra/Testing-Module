import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ExerciseStore, ExerciseResponse, QuestionResponse } from '@/utils/types';
import { fetchData } from '@/utils/hooks/fetchData';
import { useSelectionStore } from './useSelectionStore';

export const useExerciseStore = create<ExerciseStore>()(
  devtools((set, get) => ({
    exercises: [],
    loading: false,
    error: null,

    fetchExercises: async () => {
      const { chapter } = useSelectionStore.getState().selection;
      if (!chapter) return;

      set({ loading: true, error: null });
      try {
        const data = await fetchData<ExerciseResponse>('/api/exercises/get-exercise', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chapterId: chapter }),
        });

        // Map each exercise and initialize metrics to 0.
        const exercises = data.chapter_related_exercise.map((ex) => ({
          id: ex._id,
          name: ex.title,
          duration: 0,    // default initial value
          totalMarks: 0,  // default initial value
        }));

        set({ exercises });

        // Optionally auto-select the first exercise if none is selected.
        if (exercises.length > 0) {
          const { exercise } = useSelectionStore.getState().selection;
          if (!exercise) {
            useSelectionStore.getState().setSelection({ exercise: exercises[0].id });
          }
        }

        // Update metrics for all exercises after fetching them.
        await get().updateMetricsForAllExercises();

      } catch (err: unknown) {
        console.error('Error fetching exercises:', err instanceof Error ? err.message : err);
        set({ error: 'Failed to load exercises.' });
      } finally {
        set({ loading: false });
      }
    },

    // Action to update metrics for a single exercise.
    updateExerciseMetrics: (exerciseId: string, questionCount: number) => {
      set((state) => ({
        exercises: state.exercises.map((ex) =>
          ex.id === exerciseId
            ? { ...ex, duration: questionCount * 2, totalMarks: questionCount * 5 }
            : ex
        ),
      }));
    },

    // New action: update metrics for all exercises in the chapter.
    updateMetricsForAllExercises: async () => {
      const exercises = get().exercises;
      await Promise.all(
        exercises.map(async (exercise) => {
          try {
            // Fetch questions for each exercise.
            const data = await fetchData<QuestionResponse>('/api/questions/get-question', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ exerciseId: exercise.id }),
            });
            const count = data.exercise_related_questions.length;
            // Update the specific exercise's metrics.
            set((state) => ({
              exercises: state.exercises.map((ex) =>
                ex.id === exercise.id
                  ? { ...ex, duration: count * 2, totalMarks: count * 5 }
                  : ex
              ),
            }));
          } catch (err: unknown) {
            console.error(
              `Error fetching questions for exercise ${exercise.id}:`,
              err instanceof Error ? err.message : err
            );
          }
        })
      );
    },
  }))
);
