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
 * @property {string} MATCH_PAIRS - Match corresponding pairs of items
 * @property {string} SUBJECTIVE - Open-ended questions requiring written answers
 * @property {string} TRUE_FALSE - Binary choice questions (True/False)
 */
export enum QuestionType {
  MCQ = "MCQ",
  MCQ_IMG_TEXT = "MCQ (IMG-Text)",
  MCQ_IMG_IMG = "MCQ (IMG-IMG)",
  MCQ_TEXT_IMG = "MCQ (Text-IMG)",
  MATCH_PAIRS = "Match The Pairs",
  SUBJECTIVE = "Subjective Answer",
  TRUE_FALSE = "True/False"
}

/**
 * Question interface: Generic question structure, used in question bank.
 */
/**
 * Represents a question in the system.
 * @interface Question
 * 
 * @property {number} id - Unique identifier for the question
 * @property {QuestionType} type - Type of the question (e.g., MCQ, IMG-Text, etc.)
 * @property {object} content - Contains all the content-related information for the question
 * @property {string} [content.questionText] - The main text of the question
 * @property {string} [content.description] - Additional description or context for the question
 * @property {string[]} [content.options] - Array of text options for MCQ or MCQ(IMG-Text) type questions
 * @property {number | null} [content.correctAnswerIndex] - Index of the correct answer in the options array
 * @property {string} [content.image] - URL or path to the question image for MCQ(IMG-Text) or MCQ(IMG-IMG) type questions
 * @property {(string | null)[]} [content.imageOptions] - Array of image URLs/paths for MCQ(IMG-IMG) or MCQ(Text-IMG) type questions
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
/**
 * Interface representing the props for the Questions context.
 * @interface QuestionsContextProps
 * 
 * @property {Object} selection - Current selection state containing class, subject, lesson and homework
 * @property {string} selection.class - Selected class name/ID
 * @property {string} selection.subject - Selected subject name
 * @property {string} selection.lesson - Selected lesson name/number
 * @property {string} selection.homework - Selected homework identifier
 * 
 * @property {Function} setSelection - React setState function to update the selection object
 * @property {Question[]} questions - Array of Question objects representing the current questions
 * @property {Function} setQuestions - React setState function to update the questions array
 * @property {number} selectedQuestionIndex - Index of currently selected/active question
 * @property {Function} setSelectedQuestionIndex - React setState function to update selected question index
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
/**
 * Props interface for the AddOptionModal component.
 * @interface
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
 * @interface
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
  // These added for filtering:
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