import { Dispatch, SetStateAction } from 'react';


/**
 * Enum for user roles
 */
/**
 * Represents the possible roles that can be assigned to users in the system.
 * @enum {string}
 * @readonly
 * @property {string} Teacher - Role for users who teach or instruct
 * @property {string} Student - Role for users who learn or study
 */
export enum ROLE {
  Teacher = "teacher",
  Student = "student",
}

/**
 * ToggleGroupProps: Used for toggle groups (Teacher/Student).
 */
/**
 * Props interface for the ToggleGroup component.
 * @interface ToggleGroupProps
 * @property {string} id - Unique identifier for the toggle group
 * @property {string} label - Display label for the toggle group
 * @property {ROLE} [selectedValue] - Currently selected role value (optional)
 * @property {function} [onChange] - Callback function triggered when selection changes, receives new role value (optional)
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
/**
 * Properties for a sidebar item component
 * @interface SidebarItemProps
 * @property {string} href - The URL or path that the sidebar item links to
 * @property {string} ariaLabel - Accessible label for screen readers describing the sidebar item
 * @property {React.ReactNode} icon - Icon element to be displayed alongside the sidebar item
 */
export interface SidebarItemProps {
  href: string;
  ariaLabel: string;
  icon: React.ReactNode;
}

/**
 * Enumerates the different types of questions supported in the system.
 * @enum {string}
 * @readonly
 * @property {string} MCQ - Multiple Choice Questions with text options
 * @property {string} MCQ_IMG_TEXT - MCQ with image question and text options
 * @property {string} MCQ_IMG_IMG - MCQ with image question and image options
 * @property {string} MCQ_TEXT_IMG - MCQ with text question and image options
 * @property {string} MATCH_THE_PAIRS - Match corresponding pairs of items
 * @property {string} SUBJECTIVE_ANSWER - Open-ended questions requiring written answers
 * @property {string} TRUE_FALSE - Binary choice questions (True/False)
 * @property {string} NUMERICAL - Numerical answer questions
 * @property {string} SHORT_ANSWER - Short answer questions
 */
export enum QuestionType {
  MCQ = "MCQ",
  MCQ_IMG_TEXT = "MCQ_IMG_TEXT",
  MCQ_IMG_IMG = "MCQ_IMG_IMG",
  MCQ_TEXT_IMG = "MCQ_TEXT_IMG",
  MATCH_THE_PAIRS = "MATCH_THE_PAIRS",
  SUBJECTIVE_ANSWER = "SUBJECTIVE_ANSWER",
  TRUE_FALSE = "TRUE_FALSE",
  NUMERICAL = "NUMERICAL",
  SHORT_ANSWER = "SHORT_ANSWER",
}


export interface StandardRelatedSubject {
  _id: string;
  subjectName: string;
  fk_standard_id: string;
}

export interface ChapterRelatedExercise {
  _id: string;
  fk_chapter_id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


/**
 * Represents a question in the system.
 * @interface Question
 * 
 * @property {number} id - Unique identifier for the question
 * @property {string} standard - The standard or grade level of the question
 * @property {string} chapter - The chapter associated with the question
 * @property {string} exercise - The exercise identifier associated with the question
 * @property {string} questionText - The main text of the question
 * @property {QuestionType} questionType - Type of the question (e.g., MCQ, IMG-Text, etc.)
 * @property {string} answerFormat - Format of the answer expected
 * @property {string[]} options - Array of text options for MCQ or MCQ(IMG-Text) type questions
 * @property {number | null} correctAnswerIndex - Index of the correct answer in the options array
 * @property {number} [numericalAnswer] - Optional numerical answer for numerical questions
 * @property {string} [description] - Optional additional description or context for the question
 * @property {string | null} [image] - URL or path to the question image for MCQ(IMG-Text) or MCQ(IMG-IMG) type questions
 * @property {(string | null)[]} [imageOptions] - Array of image URLs/paths for MCQ(IMG-IMG) or MCQ(Text-IMG) type questions
 */


export interface Question {
  id: string;
  standardId: string;
  subjectId: string;
  chapterId: string;
  exerciseId: string;
  questionText: string;
  questionType: QuestionType;
  answerFormat: string;
  options: string[];
  correctAnswer: string | null;
  numericalAnswer?: number;
  description?: string;
  image?: string | null;
  imageOptions?: (string | null)[];
}

/**
 * Context shape for storing and managing question data + dropdown selections.
 */
/**
 * Interface representing the props for the Questions context.
 * @interface QuestionsContextProps
 * 
 * @property {Question[]} questions - Array of Question objects representing the current questions
 * @property {Dispatch<SetStateAction<Question[]>>} setQuestions - React setState function to update the questions array
 * @property {number} selectedQuestionIndex - Index of currently selected/active question
 * @property {Dispatch<SetStateAction<number>>} setSelectedQuestionIndex - React setState function to update selected question index
 * @property {boolean} isEditing - Flag indicating if a question is currently being edited
 * @property {Dispatch<SetStateAction<boolean>>} setIsEditing - React setState function to update editing state
 */
export interface QuestionsContextProps {
  questions: Question[];
  setQuestions: Dispatch<SetStateAction<Question[]>>;
  selectedQuestionIndex: number;
  setSelectedQuestionIndex: Dispatch<SetStateAction<number>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

/**
 * Represents the current selection state.
 * @interface Selection
 * @property {string} standard - Selected standard or grade level
 * @property {string} subject - Selected subject
 * @property {string} chapter - Selected chapter
 * @property {string} exercise - Selected exercise identifier
 */
export interface Selection {
  standard: string | null;
  subject: string | null;
  chapter: string | null;
  exercise: string | null;
}

/**
 * Context shape for storing and managing selection data.
 */
/**
 * Interface representing the props for the Selection context.
 * @interface SelectionContextProps
 * 
 * @property {Selection} selection - Current selection state containing standard, subject, chapter, and exercise
 * @property {Dispatch<SetStateAction<Selection>>} setSelection - React setState function to update the selection object
 */
export interface SelectionContextProps {
  selection: Selection;
  setSelection: Dispatch<SetStateAction<Selection>>;
}

/**
 * DropdownProps: Reusable dropdown component properties.
 */
/**
 * Props interface for a customizable dropdown component.
 * @interface DropdownProps
 * 
 * @property {(string | number)[]} items - Array of items to be displayed in the dropdown
 * @property {string} [label] - Optional label text for the dropdown
 * @property {(value: string | number) => void} [onSelect] - Optional callback function when an item is selected
 * @property {string | number} [defaultValue] - Optional initial value for the dropdown
 * @property {string} [className] - Optional CSS class name for styling the dropdown button
 * @property {string | number} [width] - Optional width specification for the dropdown
 * @property {string} [id] - Optional unique identifier for the dropdown
 * @property {string} [buttonBgColor] - Optional background color for the dropdown button
 * @property {string} [containerClass] - Optional CSS class name for styling the dropdown container
 * @property {string} [buttonBorderWidth] - Optional border width for the dropdown button
 * @property {string} [buttonBorderColor] - Optional border color for the dropdown button
 * @property {string | number} [selected] - Optional currently selected value
 * @property {(value: string | number) => void} [onChange] - Optional callback function when selection changes
 * @property {boolean} [allowAddOption] - Optional flag to enable adding new options
 * @property {string | number} [allowAddOptionText] - Optional text to display for add option button
 * @property {(newOption: string) => void} [onAddOption] - Optional callback function when a new option is added
 */

export interface DropdownItem {
  id: string | number;
  name: string | number;
}

export interface DropdownProps {
  items: DropdownItem[];
  label?: string;
  onSelect?: (value: string | number) => void;
  defaultValue?: string | number;
  className?: string;
  id?: string;
  buttonBgColor?: string;
  buttonBorderWidth?: string;
  buttonBorderColor?: string;
  containerClass?: string;
  selected?: string | number;
  onChange?: (value: string | number) => void;
  allowAddOption?: boolean;
  allowAddOptionText?: string;
  onAddOption?: (newOptionName: string) => void;
  isDynamic?: boolean;
  disabled?: boolean;
}


/**
 * AddOptionModalProps: For a modal that allows users to add a new dropdown option.
 */
/**
 * Props interface for the AddOptionModal component.
 * @interface AddOptionModalProps
 * 
 * @property {boolean} visible - Controls the visibility state of the modal
 * @property {() => void} onClose - Callback function triggered when the modal is closed
 * @property {(newValue: string) => void} onConfirm - Callback function triggered when the modal input is confirmed, receives the new value as parameter
 * @property {string} [title] - Optional title text to be displayed in the modal header
 * @property {string} [placeholder] - Optional placeholder text for the modal input field
 * @property {string} [className] - Optional CSS class name for additional styling
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
 * MatchPairsFieldProperties: For a 'match the pairs' question type,
 * to handle left and right pairs, connections, etc.
 */
/**
 * Interface representing properties for a match pairs field component.
 * @interface MatchPairsFieldProperties
 * 
 * @property {string} title - The title of the match pairs field
 * @property {boolean} [isRightSide] - Optional flag indicating if this is the right side of the matching pairs
 * @property {Record<string, string>} values - Key-value pairs of items to be matched
 * @property {function} onValueChange - Callback function triggered when a value changes
 * @param {string} key - The key of the changed value
 * @param {string} value - The new value
 * @property {function} onConnect - Callback function triggered when items are connected
 * @param {string} key - The key of the connected item
 * @property {string | null} [activeItem] - Optional currently active/selected item
 * @property {Record<string, string>} [connections] - Optional record of established connections between pairs
 */
export interface MatchPairsFieldProperties {
  title: string;
  isRightSide?: boolean;
  values: Record<string, string>;
  onValueChange: (key: string, value: string) => void;
  onConnect: (key: string) => void;
  activeItem?: string | null;
  connections?: Record<string, string>;
}

/**
 * PairItemFieldProps: Single item in a 'match the pairs' field.
 */
/**
 * Props interface for a pair item field component
 * @interface PairItemFieldProps
 * 
 * @property {string} label - The display label for the field
 * @property {boolean} [isRight] - Optional flag indicating if the item is positioned on the right
 * @property {string} value - The current value of the field
 * @property {(value: string) => void} onChange - Callback function triggered when the field value changes
 * @property {string} id - Unique identifier for the field
 * @property {boolean} [isActive] - Optional flag indicating if the field is in active state
 * @property {() => void} onSelect - Callback function triggered when the field is selected
 */
export interface PairItemFieldProps {
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
/**
 * Props interface for a navigation button component.
 * 
 * @interface NavButtonProps
 * @property {string} imageSrc - The source URL/path for the button's image
 * @property {string} [imageAlt] - Optional alternative text for the button's image
 * @property {() => void} [onClick] - Optional click handler function for the button
 * @property {string} [ariaLabel] - Optional ARIA label for accessibility
 * @property {string} [tooltipText] - Optional text to display in a tooltip
 * @property {boolean} [disabled] - Optional flag to disable the button
 */
export interface NavButtonProps {
  imageSrc: string;
  imageAlt?: string;
  onClick?: () => void;
  ariaLabel?: string;
  tooltipText?: string;
  disabled?: boolean;
}

/**
 * QuestionProps:  Used in question-bank UI (list, card).
 */
/**
 * Properties for the Question component.
 * @interface QuestionProps
 * @property {string} id - Unique identifier for the question
 * @property {string} questionNumber - Display number/sequence of the question
 * @property {string} description - Main content/text of the question
 * @property {boolean} isSelected - Flag indicating if question is currently selected
 * @property {Function} onClick - Click handler for when question is selected
 * @property {Function} [onDelete] - Optional handler for question deletion
 * @property {string} [class] - Optional class/grade level for filtering
 * @property {string} [subject] - Optional subject category for filtering
 * @property {string} [lesson] - Optional lesson identifier for filtering
 * @property {string} [homework] - Optional homework identifier for filtering
 */
export interface QuestionProps {
  id: string;
  questionNumber: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: () => void;
  class?: string;
  subject?: string;
  lesson?: string;
  homework?: string;
}

/**
 * QuestionListProps: For rendering a list of `QuestionProps`.
 */
/**
 * Props interface for the QuestionList component.
 * @interface QuestionListProps
 * @property {QuestionProps[]} questions - Array of question objects to be displayed in the list
 * @property {number} selectedQuestionIndex - Index of the currently selected question
 * @property {(index: number) => void} onQuestionSelect - Callback function triggered when a question is selected
 * @property {(index: number) => void} onDeleteQuestion - Callback function triggered when a question is deleted
 */
export interface QuestionListProps {
  questions: QuestionProps[];
  selectedQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  onDeleteQuestion: (index: number) => void;
}

/**
 * NewsItemProps: Represents a single news item.
 */
/**
 * Props interface for the NewsItem component.
 * @interface NewsItemProps
 * @property {string} id - Unique identifier for the news item
 * @property {boolean} isNew - Flag indicating if the news item is new
 * @property {string} title - Title of the news item
 * @property {() => void} [onClick] - Optional click handler for the news item
 */
export interface NewsItemProps {
  id: string;
  isNew: boolean;
  title: string;
  onClick?: () => void;
}
