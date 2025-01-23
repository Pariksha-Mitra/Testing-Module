import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Selection {
  standard: string | null;
  subject: string | null;
  chapter: string | null;
  exercise: string | null;
}

interface SelectionState {
  selection: Selection;
  setSelection: (selection: Partial<Selection>) => void;
}

export const useSelectionStore = create<SelectionState>()(
  devtools((set) => ({
    selection: {
      standard: null,
      subject: null,
      chapter: null,
      exercise: null,
    },
    setSelection: (partialSelection) =>
      set((state) => ({
        selection: { ...state.selection, ...partialSelection },
      })),
  }))
);
