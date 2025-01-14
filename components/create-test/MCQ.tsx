"use client"
import React, { ChangeEvent } from 'react';
import { useQuestions } from '@/context/QuestionsContext';

// Expand the interface to include all necessary props
interface MCQProps {
  editable: boolean;
  options?: string[];
  selectedOption?: number | null;
  onOptionSelect?: (index: number) => void;
  onOptionChange?: (index: number, value: string) => void;
}





// 1. Extract button styles into a constant
const optionButtonStyles = (isSelected: boolean) => `
  flex flex-wrap gap-5 justify-between items-center 
  px-6 py-2.5 max-w-full text-center 
  rounded-3xl border border-solid shadow-lg w-full 
  max-md:pl-5 max-md:mr-2.5
  ${
    isSelected
      ? "bg-green-200 border-green-500 border-2"
      : "bg-white border-black"
  }
`;

interface MCQOptionProps {
  option: string;
  index: number;
  selected: boolean;
  editable: boolean;
  onSelect: (index: number) => void;
  onChange: (index: number, value: string) => void;
}

const MCQOption = ({
  option,
  index,
  selected,
  editable,
  onSelect,
  onChange,
}: MCQOptionProps) => (
  <div className="flex items-center space-x-3">
    <label
      className={optionButtonStyles(selected)}
      aria-label={`Option ${index + 1}: ${option}`}
    >
      <input
        type="radio"
        name="mcq-options"
        checked={selected}
        onChange={() => onSelect(index)}
        disabled={!editable}
        className="hidden"
      />
      <span
        className={`h-6 w-6 rounded-full shadow-sm border-2 ${
          selected
            ? "bg-green-300 border-green-500"
            : "border-gray-300 bg-zinc-300"
        }`}
      ></span>
      <span className="flex-1">
        <input
          type="text"
          value={option}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(index, e.target.value)
          }
          className="w-full p-2 border rounded-lg border-gray-300"
          placeholder={`Option ${index + 1}`}
          disabled={!editable}
        />
      </span>
    </label>
  </div>
);

const MCQ: React.FC<MCQProps> = ({ editable }) => {
  // Add error boundaries
  const { questions, setQuestions, selectedQuestionIndex } = useQuestions();
  try {
    // Early return with proper loading state
    if (!questions || questions.length === 0) {
      return <div>Loading questions...</div>;
    }

    const currentQuestion = questions[selectedQuestionIndex];

    // Validate currentQuestion structure
    if (!currentQuestion?.content?.options) {
      return <div>Invalid question format</div>;
    }

    const options = currentQuestion.content.options || [];
    const selectedOption = currentQuestion.content.correctAnswerIndex;

    /**
     * Handles changing the text of an option.
     * @param index - The index of the option to change.
     * @param value - The new value for the option.
     */
    const handleOptionChange = (index: number, value: string) => {
      const updatedQuestions = [...questions];
      if (!updatedQuestions[selectedQuestionIndex].content.options) {
        updatedQuestions[selectedQuestionIndex].content.options = [];
      }
      updatedQuestions[selectedQuestionIndex].content.options[index] = value;
      setQuestions(updatedQuestions);
    };

    /**
     * Handles selecting the correct option.
     * @param index - The index of the selected correct option.
     */
    const handleOptionSelect = (index: number) => {
      if (!editable) return; // Prevent selecting if not editable

      const updatedQuestions = [...questions];
      updatedQuestions[selectedQuestionIndex].content.correctAnswerIndex =
        index;
      setQuestions(updatedQuestions);
    };

    return (
      <div className="space-y-4">
        <div
          role="radiogroup"
          aria-label="Multiple choice options"
          className="text-lg mt-2"
        >
          {options.map((option: string, index: number) => (
            <MCQOption
              key={index}
              option={option}
              index={index}
              selected={selectedOption === index}
              editable={editable}
              onSelect={handleOptionSelect}
              onChange={handleOptionChange}
            />
          ))}
        </div>

        {/* Uncomment below if you implement add option functionality */}
        {/* {editable && (
          <button
            onClick={addOption}
            className={`${buttonClasses} disabled:opacity-50`}
            disabled={!editable}
            aria-label="Add new option"
          >
            Add Option
          </button>
        )} */}

        <div className="text-lg mt-2">
          Correct answer:{" "}
          {(() => {
            if (typeof selectedOption !== "number") return "None selected";
            if (selectedOption < 0) return "None selected";
            if (!options[selectedOption]) return "Invalid selection";
            return options[selectedOption];
          })()}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in MCQ component:", error);
    // Add error boundary pattern
    return (
      <div className="error-message p-4 text-red-600 border border-red-300 rounded">
        An error occurred:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
};

export default MCQ;
