import React, { ChangeEvent } from "react";
import Mcq from "@/components/create-test/MCQ";
import TrueFalseComponent from "@/components/create-test/TrueFalse";
import MatchThePairs from "@/components/create-test/match-the-pairs/MatchThePairs";
import { QuestionType } from "@/utils/types";

interface GeneralQuestionLayoutProps {
  questionIndex: number;
  questionType: QuestionType;
  questionText: string;
  questionDescription: string;
  correctAnswer?: string | null; // Optional, can be null
  onQuestionTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onOptionSelect?: (index: number) => void; // Optional, for MCQ
  onOptionChange?: (index: number, value: string) => void; // Optional, for MCQ
  onCorrectAnswerChange?: (value: string) => void; // Optional, for MCQ
  options?: string[]; // Optional, for MCQ
  selectedOption?: number | null; // Optional, for MCQ
  editable: boolean; // Required, to enable editing
  className?: string; // Optional className for custom styling
  validationErrors?: { [key: string]: string }; // Optional, for validation errors
}

export const GeneralQuestionLayout: React.FC<GeneralQuestionLayoutProps> = ({
  questionIndex,
  questionType,
  questionText,
  questionDescription,
  correctAnswer = null, // Default to null if undefined
  onQuestionTextChange,
  onDescriptionChange,
  onOptionSelect,
  onOptionChange,
  onCorrectAnswerChange,
  options = [],
  editable,
  className = "",
  validationErrors = {},
}) => (
  <div
    className={`flex flex-col md:flex-row px-3 py-3 mt-6 w-full border border-black ${
      !editable ? "opacity-50 pointer-events-none" : ""
    } ${className}`}
    aria-label={`Question ${questionIndex + 1}`}
  >
    {/* First Column: Q{questionIndex + 1} */}
    <div className="w-full md:w-[3%] p-3 mr-2 text-lg">
      Q{questionIndex + 1}
    </div>

    {/* Second Column */}
    <div className="flex flex-col w-full space-y-3">
      {/* Question Text */}
      <p className="text-xl">Question</p>
      <textarea
        style={{ resize: "none" }}
        rows={2}
        value={questionText}
        onChange={onQuestionTextChange}
        className={`self-stretch w-full p-2 border ${
          validationErrors.questionText ? "border-red-500" : "border-black"
        }`}
        placeholder="Enter question here"
        disabled={!editable}
        aria-disabled={!editable}
        required
      />
      {validationErrors.questionText && (
        <span className="text-red-500 text-sm">
          {validationErrors.questionText}
        </span>
      )}

      {/* Description */}
      <p className="text-xl">Description</p>
      <textarea
        style={{ resize: "none" }}
        rows={2}
        value={questionDescription}
        onChange={onDescriptionChange}
        className={`w-full p-2 border ${
          validationErrors.description ? "border-red-500" : "border-black"
        }`}
        placeholder="Enter question description here"
        disabled={!editable}
        aria-disabled={!editable}
        required
      />
      {validationErrors.description && (
        <span className="text-red-500 text-sm">
          {validationErrors.description}
        </span>
      )}

      {/* Question-Type-Specific Component */}
      <div className="w-full">
        {questionType === QuestionType.MCQ && (
          <Mcq
            editable={editable}
            options={options}
            selectedOption={
              correctAnswer ? options.indexOf(correctAnswer) : null
            }
            correctAnswer={correctAnswer}
            onOptionSelect={onOptionSelect}
            onOptionChange={onOptionChange}
            onCorrectAnswerChange={onCorrectAnswerChange}
            validationErrors={validationErrors}
          />
        )}
        {questionType === QuestionType["True/False"] && (
          <TrueFalseComponent
            editable={editable}
            correctAnswer={correctAnswer}
            onCorrectAnswerChange={onCorrectAnswerChange}
            validationErrors={validationErrors}
          />
        )}
        {questionType === QuestionType["Match The Pairs"] && (
          <MatchThePairs
            editable={editable}
            correctAnswer={correctAnswer}
            onCorrectAnswerChange={onCorrectAnswerChange}
            validationErrors={validationErrors}
          />
        )}
        {questionType === QuestionType["Subjective Answer"] && (
          <div className="bg-red-100 p-2">
            <h2 className="font-bold">Subjective Answer</h2>
            {/* Add more fields or explanation if needed */}
            {validationErrors.subjectiveAnswer && (
              <span className="text-red-500 text-sm">
                {validationErrors.subjectiveAnswer}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Display General Errors */}
      {validationErrors.options && (
        <span className="text-red-500 text-sm">{validationErrors.options}</span>
      )}
      {validationErrors.correctAnswer && (
        <span className="text-red-500 text-sm">
          {validationErrors.correctAnswer}
        </span>
      )}
    </div>
  </div>
);

export default GeneralQuestionLayout;
