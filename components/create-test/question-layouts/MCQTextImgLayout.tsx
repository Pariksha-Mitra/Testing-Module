"use client"
import ImgMCQ from '@/components/create-test/ImgMCQ';
import React, { ChangeEvent } from 'react';

interface MCQTextImgLayoutProps {
  questionIndex: number;
  questionText: string;
  questionDescription: string;
  onQuestionTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  editable: boolean;
  className?: string;
  
  // New Props for ImgMCQ
  imageOptions: (string | null)[];
  selectedOption: number | null;
  onOptionSelect: (index: number) => void;
  onOptionChange: (index: number, value: string | null) => void;
}

export const MCQTextImgLayout: React.FC<MCQTextImgLayoutProps> = ({
  questionIndex,
  questionText,
  questionDescription,
  onQuestionTextChange,
  onDescriptionChange,
  editable,
  className = '',
  
  // Destructure new props
  imageOptions,
  selectedOption,
  onOptionSelect,
  onOptionChange,
}) => (
  <div
    className={`
      flex flex-col md:flex-row 
      px-3 py-3 mt-6 w-full 
      border border-black 
      space-y-3 md:space-y-0 md:space-x-3
      ${!editable ? "pointer-events-none opacity-50" : ""}
      ${className}
    `}
    aria-disabled={!editable}
    role="group"
    aria-label={`Question ${questionIndex + 1}`}
  >
    {/* First Column: Q{questionIndex + 1} */}
    <div className="w-full md:w-[3%] p-3 mr-2 text-lg">
      Q{questionIndex + 1}
    </div>

    {/* Second Column: Text on the left, image on the right */}
    <div className="flex flex-col md:flex-row w-full space-y-3 md:space-y-0 md:space-x-3">
      {/* Left side: Question text & description */}
      <div className="flex flex-col w-full md:w-1/2 space-y-1">
        <textarea
          style={{ resize: "none" }}
          className="w-full p-2 h-[240px] border border-black"
          placeholder="Question text here"
          value={questionText}
          onChange={onQuestionTextChange}
          disabled={!editable}
          aria-disabled={!editable}
        />
        <textarea
          style={{ resize: "none" }}
          className="w-full p-2 border mt-3 h-[240px] border-black"
          placeholder="Enter question description here"
          value={questionDescription}
          onChange={onDescriptionChange}
          disabled={!editable}
          aria-disabled={!editable}
        />
      </div>

      {/* Right side: ImgMCQ */}
      <div className="flex flex-col w-full md:w-1/2 space-y-3">
      <ImgMCQ
          questionIndex={questionIndex} // Pass questionIndex prop
          editable={editable}
          imageOptions={imageOptions}
          selectedOption={selectedOption}
          onOptionSelect={onOptionSelect}
          onOptionChange={onOptionChange}
        />
      </div>
    </div>
  </div>
);

export default MCQTextImgLayout;
