"use client";
import ImageUpload from "@/components/create-test/ImageUpload";
import Mcq from "@/components/create-test/MCQ";
import React, { ChangeEvent } from "react";

interface MCQImgTextLayoutProps {
  questionIndex: number;
  questionDescription: string;
  questionText: string;
  image: string | null | undefined; // Accepts null
  correctAnswer?: string | null;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onQuestionTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onImageChange: (image: string) => void;
  onImageRemove: () => void;
  onOptionSelect?: (index: number) => void; // Optional, for MCQ
  onOptionChange?: (index: number, value: string) => void; // Optional, for MCQ
  onCorrectAnswerChange?: (value: string) => void; // Optional, for MCQ
  options?: string[]; // Optional, for MCQ
  selectedOption?: number | null; // Optional, for MCQ
  editable: boolean;
  className?: string;
}

const MCQImgTextLayout: React.FC<MCQImgTextLayoutProps> = ({
  questionIndex,
  questionDescription,
  questionText,
  image,
  options,
  correctAnswer,
  onDescriptionChange,
  onQuestionTextChange,
  onImageChange,
  onImageRemove,
  onOptionSelect,
  onOptionChange,
  onCorrectAnswerChange,
  editable,
  className = "",
}) => (
  <div
    className={`
      flex flex-col md:flex-row 
      px-3 py-3 mt-6 w-full 
      border border-black 
      ${!editable ? "opacity-50 pointer-events-none" : ""}
      ${className}
    `}
    aria-label={`Question ${questionIndex + 1}`}
  >
    {/* Question Number */}
    <div className="w-full md:w-[3%] p-3 text-lg">Q{questionIndex + 1}</div>

    {/* Question Content */}
    <div className="flex flex-col w-full space-y-3">
      {/* Image Upload and Text Fields */}
      <div className="flex flex-col md:flex-row w-full space-y-3 md:space-y-0 md:space-x-3">
        {/* Image Upload Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center border border-black">
          <ImageUpload
            uniqueKey={`main-image-${questionIndex}`} // Pass uniqueKey prop
            image={image ?? null}
            onImageChange={onImageChange}
            onRemove={onImageRemove}
            editable={editable}
            className="w-full h-[390px] border border-black overflow-auto"
          />
        </div>

        {/* Text Fields for Question and Description */}
        <div className="flex flex-col w-full md:w-1/2 space-y-3">
          <p className="text-xl">Question</p>{" "}
          {/* Fixed typo: 'texl-xl' to 'text-xl' */}
          <textarea
            style={{ resize: "none" }}
            rows={7}
            className="w-full p-2 border border-black"
            placeholder="Enter the question text here"
            value={questionText}
            onChange={onQuestionTextChange}
            disabled={!editable}
          />
          <p className="text-xl">Description</p>{" "}
          {/* Fixed typo: 'texl-xl' to 'text-xl' */}
          <textarea
            style={{ resize: "none" }}
            rows={4}
            className="w-full p-2 border border-black"
            placeholder="Add question description here"
            value={questionDescription}
            onChange={onDescriptionChange}
            disabled={!editable}
          />
        </div>
      </div>

      {/* MCQ Options */}
      <div className="w-full">
        <Mcq
          editable={editable}
          options={options}
          selectedOption={correctAnswer ? options.indexOf(correctAnswer) : null}
          correctAnswer={correctAnswer}
          onOptionSelect={onOptionSelect}
          onOptionChange={onOptionChange}
          onCorrectAnswerChange={onCorrectAnswerChange}
        />
      </div>
    </div>
  </div>
);

export default MCQImgTextLayout;
