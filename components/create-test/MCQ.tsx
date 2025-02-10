import React, { ChangeEvent } from "react";

interface McqProps {
  /**
   * If `editable` is true, the text of the options can be changed
   * (in edit mode).
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
   * Called when the teacher sets which option is correct
   * (only in edit mode). In solving mode, this is not used.
   */
  onOptionSelect: (index: number) => void;

  /**
   * Called when the teacher edits an option's text (only in edit mode).
   * In solving mode, this is not used.
   */
  onOptionChange: (index: number, value: string) => void;

  /**
   * If `isSolving` is true, the user cannot edit options but can select
   * one as the student's "chosen answer."
   */
  isSolving: boolean;

  /**
   * In solving mode, `selectedAnswer` indicates which option
   * the student has chosen.
   *
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
   * Called in edit mode if the user changes the text of the currently
   * correct option. (Optional, used only if you care to track the correct answer text.)
   */
  onCorrectAnswerChange?: (answer: string) => void;

  /**
   * Optional validation errors object to handle duplicates, etc.
   */
  validationErrors?: { [key: string]: string };
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
  // Optional props
  correctAnswer,
  onCorrectAnswerChange,
}) => {
  /**
   * Handle changes to the text of an option in edit mode (when NOT solving).
   */
  const handleOptionTextChange = (index: number, value: string) => {
    // Do nothing if we are in solving mode.
    if (isSolving) return;

    onOptionChange(index, value);

    // If this option was the currently marked "correct answer" (by text),
    // update the correctAnswer text as well—only if `onCorrectAnswerChange` is provided.
    if (
      !isSolving &&
      onCorrectAnswerChange &&
      options[index] === correctAnswer
    ) {
      onCorrectAnswerChange(value);
    }
  };

  // Detect duplicate options by trimming
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
        className="text-lg mt-2"
      >
        {options.map((option, index) => {
          const trimmedOption = option.trim();
          // If the trimmed option appears more than once, show a duplicate error.
          const duplicateError =
            counts[trimmedOption] > 1 ? "Each option must be unique" : "";
          // Use either a passed-in error or our duplicate error message.
          const error = validationErrors[`option_${index}`] || duplicateError;

          // Determine which radio is checked, depending on mode.
          // In solving mode, compare the stored answer text to the option text.
          const radioChecked = isSolving
            ? selectedAnswer === option
            : selectedOption === index;

          // In solving mode, call onSelectedAnswerChange with the option text.
          const handleRadioChange = isSolving
            ? () => onSelectedAnswerChange(option)
            : () => onOptionSelect(index);

          return (
            <div
              key={`mcq-option-${index}`}
              className="flex items-center space-x-3 mt-3"
            >
              <label
                className={`flex flex-wrap gap-5 justify-between items-center px-6 py-2.5 max-w-full text-center rounded-3xl border border-solid shadow-lg w-full ${
                  radioChecked
                    ? "bg-green-200 border-green-500 border-2"
                    : "bg-white border-black"
                }`}
              >
                <input
                  type="radio"
                  name={`mcq-options-${index}`}
                  checked={radioChecked}
                  onChange={handleRadioChange}
                  disabled={isSolving ? false : !editable}
                  className="hidden"
                  required
                />
                <span
                  className={`h-6 w-6 rounded-full shadow-sm border-2 ${
                    radioChecked
                      ? "bg-green-300 border-green-500"
                      : "border-gray-300 bg-zinc-300"
                  }`}
                ></span>
                <span className="flex-1">
                  {isSolving ? (
                    // In solving mode, display static text
                    <div className="w-full p-2">{option}</div>
                  ) : (
                    // In edit mode, display text input
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
              {error && <span className="text-red-500 text-sm">{error}</span>}
            </div>
          );
        })}
      </div>

      {/* General Options Error */}
      {validationErrors.options && (
        <span className="text-red-500 text-sm">{validationErrors.options}</span>
      )}

      {/* Show the correct-answer display only if we are NOT solving 
          and if a correctAnswer was provided. */}
      {!isSolving && typeof correctAnswer === "string" && (
        <div className="text-lg mt-2">
          Correct answer: {correctAnswer ?? "None selected"}
          {validationErrors.correctAnswer && (
            <span className="text-red-500 text-sm block">
              {validationErrors.correctAnswer}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Mcq;
