"use client"
import React, { ChangeEvent } from 'react';

// Define the interface with all necessary props as required
interface McqProps {
  editable: boolean;
  options: string[];
  selectedOption: number | null;
  onOptionSelect: (index: number) => void;
  onOptionChange: (index: number, value: string) => void;
}

// Extract button styles into a constant
const optionButtonStyles = (isSelected: boolean) => `
  flex flex-wrap gap-5 justify-between items-center 
  px-6 py-2.5 max-w-full text-center 
  rounded-3xl border border-solid shadow-lg w-full 
  max-md:pl-5 max-md:mr-2.5
  ${isSelected
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

const MCQOption: React.FC<MCQOptionProps> = ({
  option,
  index,
  selected,
  editable,
  onSelect,
  onChange,
}) => (
  <div className="flex items-center space-x-3 mt-3">
    <label
      className={optionButtonStyles(selected)}
      aria-label={`Option ${index + 1}: ${option}`}
    >
      <input
        type="radio"
        name={`mcq-options-${index}`} // Ensure unique name per option
        checked={selected}
        onChange={() => onSelect(index)}
        disabled={!editable}
        className="hidden"
      />
      <span
        className={`h-6 w-6 rounded-full shadow-sm border-2 ${selected
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


const Mcq: React.FC<McqProps> = ({
  editable,
  options,
  selectedOption,
  onOptionSelect,
  onOptionChange,
}) => {
  try {
    if (!options || options.length === 0) {
      return <div>No options available.</div>;
    }

    return (
      <div className="space-y-4">
        <div
          role="radiogroup"
          aria-label="Multiple choice options"
          className="text-lg mt-2"
        >
          {options.map((option, index) => (
            <MCQOption
              key={`mcq-option-${index}`}
              option={option}
              index={index}
              selected={selectedOption === index}
              editable={editable}
              onSelect={onOptionSelect}
              onChange={onOptionChange}
            />
          ))}
        </div>

        {/* (Add Option button is commented out) */}

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
    return (
      <div className="error-message p-4 text-red-600 border border-red-300 rounded">
        An error occurred: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
};


export default Mcq;
