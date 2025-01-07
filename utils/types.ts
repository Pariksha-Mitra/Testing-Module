export type dropDownProps = {
  id: string;
  label: string;
  options?: options[];
  placeholder: string;
  onChange?: () => Promise<void>;
  value?: string;
};

export type options = {
  label: string;
  value: string;
};

export enum ROLE {
  Teacher = "teacher",
  Student = "student",
}

export interface ToggleGroupProps {
  id: string;
  label: string;
  selectedValue?: ROLE;
  onChange?: (value: ROLE) => void;
}



