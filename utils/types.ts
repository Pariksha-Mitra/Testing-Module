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

export interface SidebarItemProps {
  href: string;
  ariaLabel: string;
  icon: React.ReactNode;
}

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

export interface AddOptionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (newValue: string) => void;
  title?: string;
  placeholder?: string;
  className?: string;
}

export type ActionButtonProps = {
  label: string;
  bgColor: string;
  onClick?: () => void;
};

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

export interface NavButtonProps {
  imageSrc: string;
  imageAlt?: string;
  onClick?: () => void;
  ariaLabel?: string;
  tooltipText?: string;
}

export interface QuestionProps {
  id: string;
  questionNumber: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: () => void;
}

export interface QuestionListProps {
  questions: QuestionProps[];
  selectedQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  onDeleteQuestion: (index: number) => void;
}
