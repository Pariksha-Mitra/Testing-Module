import React, { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import { useDropdowns } from "@/utils/hooks/useDropdowns";
import { useCustomTestStore } from "@/store/useCustomTestStore";
import { useSearchParams, useRouter } from "next/navigation";
import { Pencil, Check, Trash2 } from "lucide-react";
import { DropdownItem, Question } from "@/utils/types";
import { useToast } from "@/components/ui/ToastProvider";

// ----- Dropdown Section Component -----
interface DropdownSectionProps {
  isAnyLoading: boolean;
  skeletonPlaceholders: string[];
  standards: DropdownItem[];
  subjects: DropdownItem[];
  chapters: DropdownItem[];
  exercises: DropdownItem[];
  selection: {
    standard?: string | null;
    subject?: string | null;
    chapter?: string | null;
    exercise?: string | null;
  };
  handleSelect: (val: string, type: string) => void;
  handleAddOption: (newOptionName: string, type: string) => void;
  errorMessages: string[];
}

const DropdownSection: React.FC<DropdownSectionProps> = ({
  isAnyLoading,
  skeletonPlaceholders,
  standards,
  subjects,
  chapters,
  exercises,
  selection,
  handleSelect,
  handleAddOption,
  errorMessages,
}) => {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg shadow bg-[#6378fd] border border-black w-full md:w-1/2">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full text-center gap-8">
        <Image src="/test-paper.png" alt="test-paper" width={70} height={70} />
        <h1 className="text-7xl rozha-one-regular">चाचणी तयार करा</h1>
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap justify-between w-full mr-3 ml-3 gap-2">
        {isAnyLoading ? (
          <div className="grid grid-cols-2 gap-4 w-full">
            {skeletonPlaceholders.map((skeletonKey) => (
              <Skeleton
                key={skeletonKey}
                sx={{ bgcolor: "#a6b1ff" }}
                variant="rectangular"
                width="100%"
                height={45}
                className="rounded-[20px]"
                animation="wave"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Standard Dropdown */}
            <Dropdown
              isDynamic
              id="standard-dropdown"
              items={standards}
              label="इयत्ता:"
              selected={selection.standard ?? undefined}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(val) => handleSelect(val, "standard")}
              className="sm:w-[48%]"
              disabled={false}
              allowAddOption={true}
              allowAddOptionText="Add Standard"
              onAddOption={(newOptionName) =>
                handleAddOption(newOptionName, "standard")
              }
            />

            {/* Subject Dropdown */}
            <Dropdown
              isDynamic
              id="subject-dropdown"
              items={subjects}
              label="विषय:"
              selected={selection.subject ?? undefined}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(val) => handleSelect(val, "subject")}
              className="sm:w-[48%]"
              disabled={!selection.standard}
              allowAddOption={true}
              allowAddOptionText="Add Subject"
              onAddOption={(newOptionName) =>
                handleAddOption(newOptionName, "subject")
              }
            />

            {/* Chapter Dropdown */}
            <Dropdown
              isDynamic
              id="chapter-dropdown"
              items={chapters}
              label="धडा:"
              selected={selection.chapter ?? undefined}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(val) => handleSelect(val, "chapter")}
              className="sm:w-[48%]"
              disabled={!selection.subject}
              allowAddOption={true}
              allowAddOptionText="Add Chapter"
              onAddOption={(newOptionName) =>
                handleAddOption(newOptionName, "chapter")
              }
            />

            {/* Exercise Dropdown */}
            <Dropdown
              isDynamic
              id="exercise-dropdown"
              items={exercises}
              label="स्वाध्याय:"
              selected={selection.exercise ?? undefined}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(val) => handleSelect(val, "exercise")}
              className="sm:w-[48%]"
              disabled={!selection.chapter}
              allowAddOption={true}
              allowAddOptionText="Add Exercise"
              onAddOption={(newOptionName) =>
                handleAddOption(newOptionName, "exercise")
              }
            />
          </>
        )}
        {/* Total Duration Input */}
        <div className="flex flex-col md:flex-row justify-start items-center mt-2 laila-regular text-lg">
          <div className="inline-flex items-center text-white bg-[#FC708A] px-3 py-1 rounded-[15px] border-2 border-white">
            <label htmlFor="total-duration" className="mr-2">
              Total Duration:
            </label>
            <input
              id="total-duration"
              className="rounded-[10px] py-1 text-black w-16 text-center"
              type="number"
              placeholder="0"
              min="0"
            />
          </div>
          <div>
            <span className="px-3 py-2">(in minutes)</span>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errorMessages.length > 0 && (
        <div className="mt-2">
          {errorMessages.map((msg, idx) => (
            <div key={`${msg}-${idx}`} className="text-red-500 text-sm">
              {msg}
            </div>
          ))}
        </div>
      )}

      {/* Empty Data Messages */}
      {!isAnyLoading && selection.standard && subjects.length === 0 && (
        <div className="mt-2 text-yellow-500 text-sm">
          No subjects available for the selected standard.
        </div>
      )}
      {!isAnyLoading && selection.subject && chapters.length === 0 && (
        <div className="mt-2 text-yellow-500 text-sm">
          No chapters available for the selected subject.
        </div>
      )}
      {!isAnyLoading && selection.chapter && exercises.length === 0 && (
        <div className="mt-2 text-yellow-500 text-sm">
          No exercises available for the selected chapter.
        </div>
      )}
    </div>
  );
};

// ----- Question Navigation Component -----
interface QuestionNavigationProps {
  questions: Question[];
  selectedQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  onAddQuestion: () => void;
  selectionExercise: boolean;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  selectedQuestionIndex,
  onSelectQuestion,
  onAddQuestion,
  selectionExercise,
}) => {
  return (
    <div className="flex flex-col p-4 rounded-lg shadow bg-[#6378fd] h-[80%] border border-black">
      <div className="grid grid-cols-7 gap-4 md:p-4">
      {questions
  .filter((question) => question !== null)
  .map((question, index) => (
    <button
      key={question.id}
      className={`flex pt-1 laila-semibold items-center justify-center ${
        selectedQuestionIndex === index ? "bg-green-400" : "bg-[#a6b1ff]"
      } w-10 h-10 text-white rounded-full font-bold`}
      onClick={() => onSelectQuestion(index)}
      aria-label={`Question ${index + 1}`}
    >
      {index + 1}
    </button>
  ))}
        <button
          className="flex items-center justify-center bg-[#a6b1ff] w-10 h-10 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onAddQuestion}
          disabled={!selectionExercise}
          title={!selectionExercise ? "Select an exercise first" : "Add Question"}
          aria-label="Add Question"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 44 44"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.098 43.3068V0.147724H24.9276V43.3068H19.098ZM0.416193 24.625V18.8295H43.6094V24.625H0.416193Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ----- Question Controls Component -----
interface QuestionControlsProps {
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onCreateTest: () => void;
}

const QuestionControls: React.FC<QuestionControlsProps> = ({
  onEdit,
  onSave,
  onDelete,
  onCreateTest,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-2 gap-2">
      {/* Marks Input */}
      <div className="flex flex-row justify-center items-center laila-regular text-lg">
        <div className="inline-flex items-center text-white bg-[#FC708A] px-3 py-2 rounded-[15px] border border-black">
          <label htmlFor="marks-input" className="mr-2">
            Marks:
          </label>
          <input
            id="marks-input"
            className="rounded-[10px] py-1 text-black w-16 text-center"
            type="number"
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-4">
        <button
          className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors"
          title="Edit Question"
          onClick={onEdit}
          aria-label="Edit Question"
        >
          <Pencil size={24} />
        </button>
        <button
          className="bg-green-500 p-2 rounded-full hover:bg-green-600 transition-colors"
          title="Save Question"
          onClick={onSave}
          aria-label="Save Question"
        >
          <Check size={24} />
        </button>
        <button
          className="bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors"
          title="Delete Question"
          onClick={onDelete}
          aria-label="Delete Question"
        >
          <Trash2 size={24} />
        </button>
      </div>

      <button
        className="bg-[#D4FFC0] text-[#015613] border border-[#ACACAC] px-4 py-2 rounded-lg transition-colors font-semibold text-lg cursor-pointer"
        onClick={onCreateTest}
        aria-label="Create Test"
      >
        Create Test
      </button>
    </div>
  );
};

// ----- Main CustomTestHeader Component -----
const CustomTestHeader: React.FC = () => {
  const {
    selection,
    standards,
    subjects,
    chapters,
    exercises,
    isAnyLoading,
    errorMessages,
    handleSelect,
    handleAddOption,
    handleAddQuestion,
  } = useDropdowns();

  // Get question-related state and methods from the custom test store.
  const {
    questions,
    selectedQuestionIndex,
    setSelectedQuestionIndex,
    addQuestion,
    deleteQuestion,
    addDefaultQuestion,
  } = useCustomTestStore();


  const searchParams = useSearchParams();
  const questionIndexParam = searchParams.get("question");
  const router = useRouter();
  const [initError, setInitError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Local state to track whether the current question is in edit mode.
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const initializeSelectedQuestion = async () => {
      try {
        if (questionIndexParam !== null) {
          let index = Number(questionIndexParam);
          if (!isNaN(index)) {
            if (questions.length === 0) {
              // Optionally, add a default question here.
            }
            if (isMounted) {
              if (index >= questions.length) {
                index = 0;
                setSelectedQuestionIndex(0);
                router.replace(`?question=0`);
              } else {
                setSelectedQuestionIndex(index);
              }
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          setInitError("Failed to initialize questions.");
          console.error("Error initializing selected question:", error);
        }
      }
    };

    initializeSelectedQuestion();
    return () => {
      isMounted = false;
    };
  }, [questionIndexParam, setSelectedQuestionIndex, questions.length, router]);

  const skeletonPlaceholders = ["skel-1", "skel-2", "skel-3", "skel-4"];

  // Handler for selecting a question from the navigation buttons.
  const handleQuestionSelect = (index: number) => {
    setSelectedQuestionIndex(index);
    router.push(`?question=${index}`);
  };

  // Handler for adding a new question to the custom test store.
  const handleAddQuestionClick = () => {
    const currentLength = questions.length;
    // Pass the selected exercise (or fallback) to addQuestion.
    addDefaultQuestion();
    setSelectedQuestionIndex(currentLength);
    router.push(`?question=${currentLength}`);
  };

  // --- Implementing Edit / Save / Delete functionality ---

  // Enable editing mode for the current question.
  const handleEditQuestion = () => {
    setIsEditing(true);
    showToast("Editing enabled", "info");
  };

  // Save/update the current question (here we simply exit edit mode).
  const handleSaveQuestion = () => {
    // Optionally add validation before saving.
    setIsEditing(false);
    showToast("Question saved successfully", "success");
  };

  // Delete the current question from the custom test store.
  const handleDeleteQuestion = () => {
    if (questions.length > 0) {
      if (window.confirm("Are you sure you want to delete this question?")) {
        deleteQuestion(selectedQuestionIndex);
        const newIndex = selectedQuestionIndex > 0 ? selectedQuestionIndex - 1 : 0;
        setSelectedQuestionIndex(newIndex);
        router.push(`?question=${newIndex}`);
        showToast("Question deleted successfully", "success");
      }
    }
  };

  const handleCreateTest = () => {
    console.log("Create test clicked");
  };

  return (
    <div className="text-white rounded-lg">
      <div className="flex flex-col md:flex-row gap-3">
        <DropdownSection
          isAnyLoading={isAnyLoading}
          skeletonPlaceholders={skeletonPlaceholders}
          standards={standards}
          subjects={subjects}
          chapters={chapters}
          exercises={exercises}
          selection={selection}
          handleSelect={handleSelect}
          handleAddOption={handleAddOption}
          errorMessages={errorMessages}
        />
        <div className="flex flex-col w-full md:w-1/2">
          <QuestionNavigation
            questions={questions}
            selectedQuestionIndex={selectedQuestionIndex}
            onSelectQuestion={handleQuestionSelect}
            onAddQuestion={handleAddQuestionClick}
            selectionExercise={!!selection.exercise}
          />
          <QuestionControls
            onEdit={handleEditQuestion}
            onSave={handleSaveQuestion}
            onDelete={handleDeleteQuestion}
            onCreateTest={handleCreateTest}
          />
          {initError && (
            <div className="mt-2 text-red-500 text-sm">{initError}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomTestHeader;
