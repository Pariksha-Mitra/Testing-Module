import React from "react";

//
// ────────────────────────────────────────────────────────────────────────────────
// 1. Enums
// ────────────────────────────────────────────────────────────────────────────────
/**
 * Enum for user roles.
 */
export enum ROLE {
    Teacher = "teacher",
    Student = "student",
}

/**
 * Enumerates the different types of questions supported in the system.
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

//
// ────────────────────────────────────────────────────────────────────────────────
// 2. Domain Models (Core Data Structures)
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Represents a standard/grade in the system.
 */
export interface BackendStandard {
    _id: string;
    standardName: string;
}

/**
 * Represents a subject in the system.
 */
export interface Subject {
    _id: string;
    subjectName: string;
}

/**
 * Represents a chapter in the system.
 */
export interface Chapter {
    _id: string;
    title: string;
}

/**
 * Represents an exercise associated with a chapter.
 */
export interface Exercise {
    _id: string;
    title: string;
}

/**
 * Represents the current selection state for standard/subject/chapter/exercise.
 */
export interface Selection {
    standard: string | null;
    subject: string | null;
    chapter: string | null;
    exercise: string | null;
}

/**
 * Represents a question in the system.
 */
export interface Question {
    /**
     * Local unique identifier (could match _id if persisted).
     */
    id: string;

    /**
     * Optional _id from the backend.
     */
    _id?: string;

    standardId: string;
    subjectId: string;
    chapterId: string;
    exerciseId: string;
    questionText: string;
    questionType: QuestionType;
    answerFormat: string;
    options: string[];
    correctAnswer: string | null;
    numericalAnswer?: number | null;
    questionDescription?: string;
    image?: string | null;
    imageOptions?: (string | null)[];
    isPersisted?: boolean;
}

//
// ────────────────────────────────────────────────────────────────────────────────
// 3. API Response Interfaces
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Standard API response structure.
 */
export interface StandardResponse {
    classes: BackendStandard[];
}

/**
 * Subject API response structure.
 */
export interface SubjectResponse {
    standard_related_subjects: Subject[];
}

/**
 * Chapter API response structure.
 */
export interface ChapterResponse {
    subject_related_chapters: Chapter[];
}

/**
 * Exercise API response structure.
 */
export interface ExerciseResponse {
    chapter_related_exercise: Exercise[];
}

/**
 * Represents the shape of a question returned from the backend.
 */
export interface BackendQuestion {
    _id: string;
    questionText: string;
    questionType: string;
    answerFormat: string;
    questionDescription: string;
    options: string[];
    correctAnswer: string | null;
    description: string;
    image: string | null;
    imageOptions: (string | null)[];
    numericalAnswer: number | null;
}

export interface Payload {
    questionText: string;
    questionDescription?: string;
    questionType: string;
    answerFormat: string;
    options: string[];
    correctAnswer?: string | null;
    numericalAnswer?: number | null;
    image?: string | null;
    imageOptions: string[] | null | undefined;
    id?: string;
    standardId?: string;
    subjectId?: string;
    chapterId?: string;
    exerciseId?: string;
}

/**
 * Question list API response structure.
 */
export interface QuestionResponse {
    exercise_related_questions: BackendQuestion[];
}

/**
 * Add-Option endpoint response for newly created resource.
 */
export interface AddOptionResponse {
    _id: string;
    subjectId?: string;
    chapterId?: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

//
// ────────────────────────────────────────────────────────────────────────────────
// 4. Store Interfaces (e.g., for Zustand/Redux)
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Store for handling standards.
 */
export interface StandardStore {
    standards: { id: string; name: string }[];
    loading: boolean;
    error: string | null;
    fetchStandards: () => Promise<void>;
}

/**
 * Store for handling subjects.
 */
export interface SubjectStore {
    subjects: { id: string; name: string }[];
    loading: boolean;
    error: string | null;
    fetchSubjects: () => Promise<void>;
}

/**
 * Store for handling chapters.
 */
export interface ChapterStore {
    chapters: { id: string; name: string }[];
    loading: boolean;
    error: string | null;
    fetchChapters: () => Promise<void>;
}

/**
 * Store for handling exercises.
 */
export interface ExerciseStore {
  exercises: { id: string; name: string; duration:number,totalMarks:number }[];
  loading: boolean;
  error: string | null;
  updateExerciseMetrics: (exerciseId: string, questionCount: number) => void;
  updateMetricsForAllExercises: () => Promise<void>;
  fetchExercises: () => Promise<void>;
}

/**
 * Store for handling the selected standard/subject/chapter/exercise.
 */
export interface SelectionStore {
    selection: Selection;
    setSelection: (selection: Partial<Selection>) => void;
    resetSelection: () => void;
}

/**
 * Store for handling questions.
 */
export interface QuestionStore {
  questions: Question[];
  selectedQuestionIndex: number;
  loading: boolean;
  error: string | null;
  // New flag to control which exercise ID to use
  useSelectionExercise: boolean;
  // Setter for the above flag
  setUseSelectionExercise: (flag: boolean) => void;
  // Updated fetchQuestions accepts an optional exerciseId override.
  fetchQuestions: (exerciseIdOverride?: string) => Promise<void>;
  addQuestion: (exerciseId: string, replace?: boolean) => void;
  setSelectedQuestionIndex: (index: number) => void;
  deleteQuestion: (index: number) => void;
  updateQuestionField: <K extends keyof Question>(
    questionIndex: number,
    field: K,
    value: Question[K]
  ) => void;
  resetQuestions: () => void;
}

//
// ────────────────────────────────────────────────────────────────────────────────
// 5. Component Props (UI-Related Interfaces)
// ────────────────────────────────────────────────────────────────────────────────

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
 * Reusable dropdown component properties.
 */
export interface DropdownItem {
    id: string | number;
    name: string | number;
}

/**
 * DropdownProps: Reusable dropdown component properties.
 */
export interface DropdownProps {
  items: DropdownItem[] | string[];
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
 * to handle left/right pairs, connections, etc.
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
export interface NavButtonProps {
    imageSrc: string;
    imageAlt?: string;
    onClick?: () => void;
    ariaLabel?: string;
    tooltipText?: string;
    disabled?: boolean;
}

/**
 * QuestionCardProps: Represents props for a single question card item.
 */
export interface QuestionCardProps {
    q_no: string;
    questionText: string;
    isSelected: boolean;
    onClick: () => void;
    onDelete?: () => void;
}

/**
 * QuestionListProps: For rendering a list of Questions.
 */
export interface QuestionListProps {
    questions: Question[];
    selectedQuestionIndex: number;
    onQuestionSelect: (index: number) => void;
    onDeleteQuestion: (index: number) => void;
}

/**
 * NewsItemProps: Represents a single news item.
 */
export interface NewsItemProps {
    id: string;
    isNew: boolean;
    title: string;
    onClick?: () => void;
}

export interface GameCardProps {
    text?: string;
    description?: string;
    class?: string;
    subject?: string;
    lesson?: string;
    homework?: string;
    thumbnail: string;
    src: string;
}

export interface SubjectInputProps {
    label: string;
    width: string | number;
    iconSrc: string;
}
