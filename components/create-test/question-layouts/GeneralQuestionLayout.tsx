// components/create-test/question-layouts/GeneralQuestionLayout.tsx

"use client"
import MatchThePairs from '@/components/create-test/match-the-pairs/MatchThePairs';
import Mcq from '@/components/create-test/MCQ';
import React, { ChangeEvent } from 'react';
import TrueFalseComponent from '@/components/create-test/TrueFalse';
import { QuestionType } from '@/utils/types';

/**
 * General Question Layout (MCQ, True/False, Match The Pairs, Subjective Answer, etc.)
 */

interface GeneralQuestionLayoutProps {
  questionIndex: number;
  questionType: QuestionType;
  questionText: string;
  questionDescription: string;
  onQuestionTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onOptionSelect?: (index: number) => void; // Optional, for MCQ
  onOptionChange?: (index: number, value: string) => void; // Optional, for MCQ
  options?: string[]; // Optional, for MCQ
  selectedOption?: number | null; // Optional, for MCQ
  editable: boolean; // Added editable prop
  className?: string; // Add optional className prop
}

export const GeneralQuestionLayout: React.FC<GeneralQuestionLayoutProps> = ({
  questionIndex,
  questionType,
  questionText,
  questionDescription,
  onQuestionTextChange,
  onDescriptionChange,
  onOptionSelect, // Destructure the new prop
  onOptionChange, // Destructure the new prop
  options = [], // Default to empty array
  selectedOption = null, // Default to null
  editable, // Destructure editable
  className = '', // Default value
}) => (
  <div
    className={`
      flex flex-col md:flex-row 
      px-3 py-3 mt-6 w-full 
      border border-black 
      ${!editable ? 'opacity-50 pointer-events-none' : ''}
      ${className}
    `}
    aria-label={`Question ${questionIndex + 1}`}
  >
    {/* First Column: Q{questionIndex + 1} */}
    <div className="w-full md:w-[3%] p-3 mr-2 text-lg">
      Q{questionIndex + 1}
    </div>

    {/* Second Column */}
    <div className="flex flex-col w-full space-y-3">
      {/* Question Text */}
      <p className='text-xl'>Question</p> {/* Fixed typo */}
      <textarea
        style={{ resize: "none" }}
        rows={2}
        value={questionText}
        onChange={onQuestionTextChange}
        className="self-stretch w-full p-2 border border-black"
        placeholder="Enter question here"
        disabled={!editable} // Disable when not editable
        aria-disabled={!editable} // Accessibility attribute
      />

      {/* Description */}
      <p className='text-xl'>Description</p> {/* Fixed typo */}
      <textarea
        style={{ resize: "none" }}
        rows={2}
        value={questionDescription}
        onChange={onDescriptionChange}
        className="w-full p-2 border border-black"
        placeholder="Enter question description here"
        disabled={!editable} // Disable when not editable
        aria-disabled={!editable} // Accessibility attribute
      />

      {/* Question-Type-Specific Component */}
      <div className="w-full">
        {questionType === "MCQ" && (
          <Mcq
            editable={editable}
            options={options}
            selectedOption={selectedOption}
            onOptionSelect={onOptionSelect!} // Non-null assertion
            onOptionChange={onOptionChange!} // Non-null assertion
          />
        )}
        {questionType === "True/False" && (
          <TrueFalseComponent
            editable={editable}
            // Pass additional props if needed
          />
        )}
        {questionType === "Match The Pairs" && (
          <MatchThePairs
            editable={editable}
            // Pass additional props if needed
          />
        )}
        {questionType === "Subjective Answer" && (
          <div className="bg-red-100 p-2">
            <h2 className="font-bold">Subjective Answer</h2>
            {/* Add more fields or explanation if needed */}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default GeneralQuestionLayout;
