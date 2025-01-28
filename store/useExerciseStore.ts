import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ExerciseStore,ExerciseResponse} from '@/utils/types';
import { fetchData } from '@/utils/hooks/fetchData';
import { useSelectionStore } from './useSelectionStore';


export const useExerciseStore = create<ExerciseStore>()(
  devtools((set) => ({
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

        const exercises = data.chapter_related_exercise.map((ex) => ({
          id: ex._id,
          name: ex.title,
        }));

        set({ exercises });

        // Only auto-select if nothing is currently selected
        if (exercises.length > 0) {
          const { exercise } = useSelectionStore.getState().selection;
          if (!exercise) {
            useSelectionStore.getState().setSelection({ exercise: exercises[0].id });
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching exercises:', err.message);
        } else {
          console.error('Error fetching exercises:', err);
        }
        set({ error: 'Failed to load exercises.' });
      } finally {
        set({ loading: false });
      }
    },
  }))
);
