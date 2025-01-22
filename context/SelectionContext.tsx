// src/context/SelectionContext.tsx

"use client"; // Ensure this is the first line

import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';
import { Selection, SelectionContextProps } from '@/utils/types';

const SelectionContext = createContext<SelectionContextProps | undefined>(undefined);

export const useSelection = (): SelectionContextProps => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const SelectionProvider: React.FC<ProviderProps> = ({ children }) => {
  const [selection, setSelection] = useState<Selection>({
    standard: "५",
    subject: "विषय १",
    chapter: "धडा १",
    exercise: "अभ्यास १",
  });

  return (
    <SelectionContext.Provider value={{ selection, setSelection }}>
      {children}
    </SelectionContext.Provider>
  );
};
