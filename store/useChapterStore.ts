import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { fetchData } from '@/utils/hooks/fetchData';
import { useSelectionStore } from './useSelectionStore';
import { ChapterStore,ChapterResponse } from '@/utils/types';


export const useChapterStore = create<ChapterStore>()(
  devtools((set) => ({
    chapters: [],
    loading: false,
    error: null,

    fetchChapters: async () => {
      const { subject } = useSelectionStore.getState().selection;
      if (!subject) return;

      set({ loading: true, error: null });

      try {
        const data = await fetchData<ChapterResponse>('/api/chapters/get-chapter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subjectId: subject }),
        });

        const chapters = data.subject_related_chapters.map((chap) => ({
          id: chap._id,
          name: chap.title,
        }));

        set({ chapters });

        // Only auto-select if nothing is currently selected
        if (chapters.length > 0) {
          const { chapter } = useSelectionStore.getState().selection;
          if (!chapter) {
            useSelectionStore.getState().setSelection({ chapter: chapters[0].id });
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching chapters:', err.message);
        } else {
          console.error('Error fetching chapters:', err);
        }
        set({ error: 'Failed to load chapters.' });
      } finally {
        set({ loading: false });
      }
    },
  }))
);
