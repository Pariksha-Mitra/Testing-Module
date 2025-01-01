interface Option {
  value: string;
  label: string;
}

export interface DropdownProps {
  label: string;
  options: Option[];
  title?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  id: string;
  containerClass?: string;
  selectClass?: string;
  disabled?: boolean;
}

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

// Create Test Page

export interface MatchThePairs_FieldProps {
  title: string;
  isRightSide?: boolean;
  values: Record<string, string>;
  onValueChange: (key: string, value: string) => void;
  onConnect: (key: string) => void;
  activeItem?: string | null;
  connections?: Record<string, string>;
}

export interface MatchThePairs_FieldItemProps {
  label: string;
  isRight?: boolean;
  value: string;
  onChange: (value: string) => void;
  id: string;
  isActive?: boolean;
  onSelect: () => void;
}

// ------------------------------

// Question Bank Page

export interface QuestionProps {
  questionNumber: string;
  description: string;
}

export interface QuestionListProps {
  questions: QuestionProps[];
  selectedQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
}

export interface ScrollbarProps {
  contentHeight: number; // Height of the scrollbar track
  scrollPosition: number; // A value between 0 and 1
  onScroll: (position: number) => void;
  totalContent: number; // Total number of items or total scrollable units
  visibleContent: number; // Number of visible items or units
}
// ------------------------------
