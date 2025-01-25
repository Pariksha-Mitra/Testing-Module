import React, { ChangeEvent } from 'react';

interface McqProps {
  editable: boolean;
  options: string[];
  selectedOption: number | null;
  correctAnswer: string | null;
  onOptionSelect: (index: number) => void;
  onOptionChange: (index: number, value: string) => void;
  onCorrectAnswerChange: (answer: string) => void;
  validationErrors?: { [key: string]: string }; // Optional, for validation errors
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

    if (options[index] === correctAnswer) {
      onCorrectAnswerChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <div
        role="radiogroup"
        aria-label="Multiple choice options"
        className="text-lg mt-2"
      >
        {options.map((option, index) => (
          <div key={`mcq-option-${index}`} className="flex items-center space-x-3 mt-3">
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
                    validationErrors[`option_${index}`]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder={`Option ${index + 1}`}
                  disabled={!editable}
                />
              </span>
            </label>
            {validationErrors[`option_${index}`] && (
              <span className="text-red-500 text-sm">
                {validationErrors[`option_${index}`]}
              </span>
            )}
          </div>
        ))}
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
