import React, { ChangeEvent } from 'react';

interface McqProps {
  editable: boolean;
  options: string[];
  selectedOption: number | null;
  correctAnswer: string | null;
  onOptionSelect: (index: number) => void;
  onOptionChange: (index: number, value: string) => void;
  onCorrectAnswerChange: (answer: string) => void;
  validationErrors?: { [key: string]: string }; // Optional, for other validation errors
}

const Mcq: React.FC<McqProps> = ({
  editable,
  options,
  selectedOption,
  correctAnswer,
  onOptionSelect,
  onOptionChange,
  onCorrectAnswerChange,
  validationErrors = {},
}) => {
  const handleOptionChange = (index: number, value: string) => {
    onOptionChange(index, value);

    // Update the correct answer if the option that was changed is currently set as the correct answer
    if (options[index] === correctAnswer) {
      onCorrectAnswerChange(value);
    }
  };

  // Compute a count of each trimmed option to detect duplicates
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
          // If the trimmed option appears more than once, we want to show a duplicate error.
          const duplicateError =
            counts[trimmedOption] > 1 ? "Each option must be unique" : "";
          // Use either a passed in error or our duplicate error message.
          const error = validationErrors[`option_${index}`] || duplicateError;

          return (
            <div
              key={`mcq-option-${index}`}
              className="flex items-center space-x-3 mt-3"
            >
              <label
                className={`flex flex-wrap gap-5 justify-between items-center px-6 py-2.5 max-w-full text-center rounded-3xl border border-solid shadow-lg w-full ${
                  selectedOption === index
                    ? 'bg-green-200 border-green-500 border-2'
                    : 'bg-white border-black'
                }`}
              >
                <input
                  type="radio"
                  name={`mcq-options-${index}`}
                  checked={selectedOption === index}
                  onChange={() => onOptionSelect(index)}
                  disabled={!editable}
                  className="hidden"
                  required
                />
                <span
                  className={`h-6 w-6 rounded-full shadow-sm border-2 ${
                    selectedOption === index
                      ? 'bg-green-300 border-green-500'
                      : 'border-gray-300 bg-zinc-300'
                  }`}
                ></span>
                <span className="flex-1">
                  <input
                    type="text"
                    value={option}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleOptionChange(index, e.target.value)
                    }
                    className={`w-full p-2 border rounded-lg ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={`Option ${index + 1}`}
                    disabled={!editable}
                  />
                </span>
              </label>
              {error && (
                <span className="text-red-500 text-sm">{error}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* General Options Error */}
      {validationErrors.options && (
        <span className="text-red-500 text-sm">{validationErrors.options}</span>
      )}

      {/* Correct Answer Display */}
      <div className="text-lg mt-2">
        Correct answer: {correctAnswer ?? 'None selected'}
        {validationErrors.correctAnswer && (
          <span className="text-red-500 text-sm block">
            {validationErrors.correctAnswer}
          </span>
        )}
      </div>
    </div>
  );
};

export default Mcq;
