"use client";
import React, { ChangeEvent } from "react";

interface McqProps {
  /**
   * If `editable` is true, the text of the options can be changed (in edit mode).
   */
  editable: boolean;

  /** The list of MCQ options to display. */
  options: string[];

  /**
   * If `isSolving` is false (edit mode), `selectedOption` indicates
   * which option is marked as correct by the teacher.
   * If `isSolving` is true, this prop is ignored.
   */
  selectedOption: number | null;

  /**
   * Called when the teacher sets which option is correct (only in edit mode).
   * In solving mode, this is not used.
   */
  onOptionSelect: (index: number) => void;

  /**
   * Called when the teacher edits an option's text (only in edit mode).
   * In solving mode, this is not used.
   */
  onOptionChange: (index: number, value: string) => void;

  /**
   * If `isSolving` is true, the user cannot edit options but can select one as the student's "chosen answer."
   */
  isSolving: boolean;

  /**
   * In solving mode, `selectedAnswer` indicates which option the student has chosen.
   * <strong>Note:</strong> We now expect this to be the option's text.
   */
  selectedAnswer: string | number | null;

  /**
   * Called when the student selects an option in solving mode.
   * <strong>Note:</strong> This now receives the option text.
   */
  onSelectedAnswerChange: (option: string) => void;

  /**
   * The teacher’s correct answer (optional). Only relevant if `isSolving` is false.
   */
  correctAnswer?: string | null;

  /**
   * Called in edit mode if the user changes the text of the currently correct option.
   * (Optional, used only if you care to track the correct answer text.)
   */
  onCorrectAnswerChange?: (answer: string) => void;

  /**
   * Optional validation errors object to handle duplicates, etc.
   */
  validationErrors?: { [key: string]: string };

  /**
   * If true, display the MCQ in result mode.
   * In result mode the component uses the same (read‑only) UI style as `isSolving`
   * but wraps the options in a grid (2 columns on larger screens, 1 column on smaller screens)
   * and applies result-specific styling.
   */
  isResult?: boolean;
}

const Mcq: React.FC<McqProps> = ({
  editable,
  options,
  selectedOption,
  onOptionSelect,
  onOptionChange,
  validationErrors = {},
  isSolving,
  selectedAnswer,
  onSelectedAnswerChange,
  correctAnswer,
  onCorrectAnswerChange,
  isResult = false,
}) => {
  // In solving or result mode, we render in a read-only style.
  const isReadOnly = isSolving || isResult;
  // In result mode, wrap options in a responsive grid: 1 column on small screens, 2 on medium+
  const containerClass = isResult ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4";

  // In edit mode, allow option text changes.
  const handleOptionTextChange = (index: number, value: string) => {
    if (isReadOnly) return;
    onOptionChange(index, value);
    if (!isSolving && onCorrectAnswerChange && options[index] === correctAnswer) {
      onCorrectAnswerChange(value);
    }
  };

  // Check for duplicate options.
  const counts: { [key: string]: number } = {};
  options.forEach((option) => {
    const trimmed = option.trim();
    counts[trimmed] = (counts[trimmed] || 0) + 1;
  });

  return (
    <div className="space-y-4">
      <div
        role="radiogroup"
        aria-label="Multiple choice options"
        className={`text-lg mt-2 ${containerClass}`}
      >
        {options.map((option, index) => {
          const trimmedOption = option.trim();
          const duplicateError =
            counts[trimmedOption] > 1 ? "Each option must be unique" : "";
          const error = validationErrors[`option_${index}`] || duplicateError;
          // For read-only (solving/result) mode, we use the option text for selection check.
          const isSelected = isReadOnly ? selectedAnswer === option : selectedOption === index;
          const isCorrectOption = option === correctAnswer;
          const handleRadioChange = isReadOnly
            ? () => onSelectedAnswerChange(option)
            : () => onOptionSelect(index);
          // In result mode, disable all interactions.
          const inputDisabled = isResult ? true : isSolving ? false : !editable;

          if (isResult) {
            // Determine result-specific styling.
            let resultClass = "flex flex-wrap gap-5 justify-between items-center px-6 py-2.5 text-center rounded-3xl border border-solid shadow-lg w-full ";
            if (selectedAnswer !== null && selectedAnswer !== undefined) {
              if (isSelected && isCorrectOption) {
                // Correct answer selected.
                resultClass += "bg-green-200 border-green-400 border-2";
              } else if (isSelected && !isCorrectOption) {
                // Wrong answer selected.
                resultClass += "bg-red-200 border-red-400 border-2";
              } else if (!isSelected && isCorrectOption) {
                // Correct answer not selected.
                resultClass += "bg-green-200 border-green-500 border-2";
              } else {
                resultClass += "bg-white border-black";
              }
            } else {
              resultClass += "bg-white border-black";
            }

            return (
              <label key={`mcq-option-${index}`} className={resultClass}>
                <input
                  type="radio"
                  name={`mcq-options-${index}`}
                  checked={isSelected}
                  onChange={handleRadioChange}
                  disabled={true}
                  className="hidden"
                  required
                />
                <span
                  className={`h-6 w-6 rounded-full shadow-sm border-2 ${
                    isSelected
                      ? isCorrectOption
                        ? "bg-green-300 border-green-500"
                        : "bg-red-300 border-red-500"
                      : "border-gray-300 bg-zinc-300"
                  }`}
                ></span>
                <span className="flex-1">
                  <div className="w-full p-2">{option}</div>
                </span>
              </label>
            );
          } else {
            // Non-result: either solving (read-only with flex layout) or editing mode.
            return (
              <div key={`mcq-option-${index}`} className="flex items-center space-x-3 mt-3">
                <label
                  className={`flex flex-wrap gap-5 justify-between items-center px-6 py-2.5 max-w-full text-center rounded-3xl border border-solid shadow-lg w-full ${
                    isSelected ? "bg-green-200 border-green-500 border-2" : "bg-white border-black"
                  }`}
                >
                  <input
                    type="radio"
                    name={`mcq-options-${index}`}
                    checked={isSelected}
                    onChange={handleRadioChange}
                    disabled={inputDisabled}
                    className="hidden"
                    required
                  />
                  <span
                    className={`h-6 w-6 rounded-full shadow-sm border-2 ${
                      isSelected
                        ? "bg-green-300 border-green-500"
                        : "border-gray-300 bg-zinc-300"
                    }`}
                  ></span>
                  <span className="flex-1">
                    {isReadOnly ? (
                      <div className="w-full p-2">{option}</div>
                    ) : (
                      <input
                        type="text"
                        value={option}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleOptionTextChange(index, e.target.value)
                        }
                        className={`w-full p-2 border rounded-lg ${
                          error ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={`Option ${index + 1}`}
                        disabled={!editable}
                      />
                    )}
                  </span>
                </label>
                {!isReadOnly && error && <span className="text-red-500 text-sm">{error}</span>}
              </div>
            );
          }
        })}
      </div>
      {!isReadOnly && validationErrors.options && (
        <span className="text-red-500 text-sm">{validationErrors.options}</span>
      )}
      {!isReadOnly && typeof correctAnswer === "string" && (
        <div className="text-lg mt-2">
          Correct answer: {correctAnswer ?? "None selected"}
          {validationErrors.correctAnswer && (
            <span className="text-red-500 text-sm block">{validationErrors.correctAnswer}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Mcq;
