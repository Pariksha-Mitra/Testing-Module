import React, {
  createContext,
  ReactNode,
  useContext,
  useState
  } from 'react';

export interface Selection {
  class: string;
  subject: string;
  lesson: string;
  homework: string;
}

const DEFAULT_SELECTION: Selection = {
  class: "५",
  subject: "विषय १",
  lesson: "धडा १",
  homework: "स्वाध्याय १",
};

interface SelectionContextProps {
  selection: Selection;
  setSelection: React.Dispatch<React.SetStateAction<Selection>>;
}

export const SelectionContext = createContext<
  SelectionContextProps | undefined
>(undefined);

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selection, setSelection] = useState<Selection>(DEFAULT_SELECTION);

  return (
    <SelectionContext.Provider value={{ selection, setSelection }}>
      {children}
    </SelectionContext.Provider>
  );
};
