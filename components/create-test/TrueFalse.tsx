import React from 'react';

interface TrueFalseProps {
  editable: boolean;
  correctAnswer: string | null;
  onCorrectAnswerChange: (value: string) => void;
  validationErrors?: { [key: string]: string }; // Optional, for validation errors
}

const TrueFalseComponent: React.FC<TrueFalseProps> = ({
  editable,
  correctAnswer,
  onCorrectAnswerChange,
  validationErrors = {},
}) => {
  return (
    <div className="space-y-4">
      <div
        role="radiogroup"
        aria-label="True or False options"
        className="text-lg mt-2"
      >
        {['True', 'False'].map((option, index) => (
          <div key={`true-false-option-${index}`} className="flex items-center space-x-3 mt-3">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="true-false"
                value={option}
                checked={correctAnswer === option}
                onChange={() => onCorrectAnswerChange(option)}
                disabled={!editable}
                className="form-radio h-5 w-5 text-blue-600"
                required
              />
              <span>{option}</span>
            </label>
          </div>
        ))}
      </div>

      {/* Correct Answer Error */}
      {validationErrors.correctAnswer && (
        <span className="text-red-500 text-sm">
          {validationErrors.correctAnswer}
        </span>
      )}
    </div>
  );
};

export default TrueFalseComponent;
