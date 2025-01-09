import React, { createContext, useState, ReactNode } from 'react';

interface Selection {
  class: string;
  subject: string;
  lesson: string;
  homework: string;
}

interface SelectionContextProps {
  selection: Selection;
  setSelection: React.Dispatch<React.SetStateAction<Selection>>;
}

export const SelectionContext = createContext<SelectionContextProps | undefined>(undefined);

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selection, setSelection] = useState<Selection>({
    class: "५",
    subject: "विषय १",
    lesson: "धडा १",
    homework: "स्वाध्याय १",
  });

  return (
    <SelectionContext.Provider value={{ selection, setSelection }}>
      {children}
    </SelectionContext.Provider>
  );
};
