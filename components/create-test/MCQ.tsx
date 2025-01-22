import React, { ChangeEvent } from 'react';

interface McqProps {
  editable: boolean;
  options: string[];
  selectedOption: number | null;
  correctAnswer: string | null;
  onOptionSelect: (index: number) => void;
  onOptionChange: (index: number, value: string) => void;
  onCorrectAnswerChange: (answer: string) => void;
}

const Mcq: React.FC<McqProps> = ({
  editable,
  options,
  selectedOption,
  correctAnswer,
  onOptionSelect,
  onOptionChange,
  onCorrectAnswerChange,
}) => {
  const handleOptionChange = (index: number, value: string) => {
    onOptionChange(index, value);

    if (options[index] === correctAnswer) {
      onCorrectAnswerChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <div role="radiogroup" aria-label="Multiple choice options" className="text-lg mt-2">
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
                  className="w-full p-2 border rounded-lg border-gray-300"
                  placeholder={`Option ${index + 1}`}
                  disabled={!editable}
                />
              </span>
            </label>
          </div>
        ))}
      </div>

      <div className="text-lg mt-2">
        Correct answer: {correctAnswer ?? 'None selected'}
      </div>
    </div>
  );
};

export default Mcq;
