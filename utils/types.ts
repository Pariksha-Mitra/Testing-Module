/**
 * Enum for user roles
 */
export enum ROLE {
  Teacher = "teacher",
  Student = "student",
}

/**
 * ToggleGroupProps: Used for toggle groups (Teacher/Student).
 */
export interface ToggleGroupProps {
  id: string;
  label: string;
  selectedValue?: ROLE;
  onChange?: (value: ROLE) => void;
}

/**
 * SidebarItemProps: Represents a single item (link) in a sidebar.
 */
export interface SidebarItemProps {
  href: string;
  ariaLabel: string;
  icon: React.ReactNode;
}

/**
 * Enumerates the different question types we can support.
 */
export type QuestionType =
  | "MCQ"
  | "MCQ (IMG-Text)"
  | "MCQ (IMG-IMG)"
  | "MCQ (Text-IMG)"
  | "Match The Pairs"
  | "Subjective Answer"
  | "True/False";

/**
 * Question interface: Generic question structure, used in question bank.
 */
export interface Question {
  id: number;
  type: QuestionType;
  content: {
    questionText?: string;
    description?: string;

    // For text-based options (MCQ, MCQ(IMG-Text)):
    options?: string[];
    correctAnswerIndex?: number | null;

    // For question image (MCQ(IMG-Text), MCQ(IMG-IMG)):
    image?: string;

    // For image-based options (MCQ(IMG-IMG), MCQ(Text-IMG)):
    imageOptions?: (string | null)[];
  };
}

/**
 * Context shape for storing and managing question data + dropdown selections.
 */
export interface QuestionsContextProps {
  selection: {
    class: string;
    subject: string;
    lesson: string;
    homework: string;
  };
  setSelection: React.Dispatch<
    React.SetStateAction<{
      class: string;
      subject: string;
      lesson: string;
      homework: string;
    }>
  >;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  selectedQuestionIndex: number;
  setSelectedQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * DropdownProps: Reusable dropdown component properties.
 */
export interface DropdownProps {
  items: (string | number)[];
  label?: string;
  onSelect?: (value: string | number) => void;
  defaultValue?: string | number;
  className?: string;
  width?: string | number;
  id?: string;
  buttonBgColor?: string;
  containerClass?: string;
  buttonBorderWidth?: string;
  buttonBorderColor?: string;
  selected?: string | number;
  onChange?: (value: string | number) => void;
  allowAddOption?: boolean;
  allowAddOptionText?: string | number;
  onAddOption?: (newOption: string) => void;
}

/**
 * AddOptionModalProps: For a modal that allows users to add a new dropdown option.
 */
export interface AddOptionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (newValue: string) => void;
  title?: string;
  placeholder?: string;
  className?: string;
}

/**
 * ActionButtonProps: For a generic button with label and background color.
 */
export type ActionButtonProps = {
  label: string;
  bgColor: string;
  onClick?: () => void;
};

/**
 * MatchThePairs_FieldProps: For a 'match the pairs' question type,
 * to handle left and right pairs, connections, etc.
 */
export interface MatchThePairs_FieldProps {
  title: string;
  isRightSide?: boolean;
  values: Record<string, string>;
  onValueChange: (key: string, value: string) => void;
  onConnect: (key: string) => void;
  activeItem?: string | null;
  connections?: Record<string, string>;
}

/**
 * MatchThePairs_FieldItemProps: Single item in a 'match the pairs' field.
 */
export interface MatchThePairs_FieldItemProps {
  label: string;
  isRight?: boolean;
  value: string;
  onChange: (value: string) => void;
  id: string;
  isActive?: boolean;
  onSelect: () => void;
}

/**
 * NavButtonProps: For a custom nav button with an optional tooltip.
 */
export interface NavButtonProps {
  imageSrc: string;
  imageAlt?: string;
  onClick?: () => void;
  ariaLabel?: string;
  tooltipText?: string;
}

/**
 * QuestionProps:  Used in question-bank UI (list, card).
 */
export interface QuestionProps {
  id: string;
  questionNumber: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: () => void;
  // These added for filtering:
  class?: string;
  subject?: string;
  lesson?: string;
  homework?: string;
}

/**
 * QuestionListProps: For rendering a list of `QuestionProps`.
 */
export interface QuestionListProps {
  questions: QuestionProps[];
  selectedQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  onDeleteQuestion: (index: number) => void;
}


export interface NewsItemProps  {
  id: string; 
  isNew: boolean;
  title: string;
  onClick?: () => void;
}