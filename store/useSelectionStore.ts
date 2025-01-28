import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SelectionStore } from '@/utils/types';

// Custom wrapper for localStorage
const localStorageWrapper = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useSelectionStore = create<SelectionStore>()(
  persist(
    devtools((set) => ({
      selection: {
        standard: null,
        subject: null,
        chapter: null,
        exercise: null,
      },
      setSelection: (selection: Partial<Selection>) =>
        set((state) => ({
          selection: { ...state.selection, ...selection },
        })),
      resetSelection: () =>
        set({
          selection: {
            standard: null,
            subject: null,
            chapter: null,
            exercise: null,
          },
        }),
    })),
    {
      name: 'selection-storage',
      version: 1,
      storage: localStorageWrapper, // Use the custom wrapper
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          const state = persistedState as SelectionStore;
          return {
            ...state,
            selection: {
              ...state.selection,
            },
          };
        }
        return persistedState;
      },
      partialize: (state) => ({ selection: state.selection }),
    }
  )
);
