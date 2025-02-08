import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DropdownItem, StandardStore, StandardResponse } from '@/utils/types';
import { fetchData } from '@/utils/hooks/fetchData';
import { useSelectionStore } from './useSelectionStore';

export const useStandardStore = create<StandardStore>()(
  devtools((set) => ({
    standards: [],
    loading: false,
    error: null,

    fetchStandards: async () => {
      set({ loading: true, error: null });
      try {
        const data = await fetchData<StandardResponse>('/api/standard');
        const standards: DropdownItem[] = data.classes.map((cls) => ({
          id: String(cls._id), // Convert the id to a string
          name: cls.standardName,
        }));
        set({ standards });

        // Automatically select the first standard if available and not already selected
        if (standards.length > 0) {
          const { standard } = useSelectionStore.getState().selection;
          if (!standard) {
            useSelectionStore
              .getState()
              .setSelection({ standard: String(standards[0].id) });
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching standards:', err.message);
        } else {
          console.error('Error fetching standards:', err);
        }
        set({ error: 'Failed to load standards.' });
      } finally {
        set({ loading: false });
      }
    },
  }))
);
