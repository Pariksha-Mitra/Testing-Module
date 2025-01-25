import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { fetchData } from '@/utils/hooks/fetchData';
import { useSelectionStore } from './useSelectionStore';
import { SubjectStore, SubjectResponse } from '@/utils/types';

export const useSubjectStore = create<SubjectStore>()(
  devtools((set) => ({
    subjects: [],
    loading: false,
    error: null,

    fetchSubjects: async () => {
      const { standard } = useSelectionStore.getState().selection;
      if (!standard) return;

      set({ loading: true, error: null });
      try {
        const data = await fetchData<SubjectResponse>('/api/subject/get-subject', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ standardId: standard }),
        });
        const subjects = data.standard_related_subjects.map((sub) => ({
          id: sub._id,
          name: sub.subjectName,
        }));
        set({ subjects });

        // Automatically select the first subject if available
        if (subjects.length > 0) {
          const { subject } = useSelectionStore.getState().selection;
          if (!subject) {
            useSelectionStore.getState().setSelection({ subject: subjects[0].id });
          }
        }
      } catch (err) {
        // Check if the error is an instance of Error
        if (err instanceof Error) {
          console.error('Error fetching subjects:', err.message);
          set({ error: 'Failed to load subjects.' });
        } else {
          console.error('Unexpected error fetching subjects:', err);
          set({ error: 'An unexpected error occurred.' });
        }
      } finally {
        set({ loading: false });
      }
    },
  }))
);
