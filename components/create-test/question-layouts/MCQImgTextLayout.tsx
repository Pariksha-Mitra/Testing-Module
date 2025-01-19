"use client";
import ImageUpload from '@/components/create-test/ImageUpload';
import Mcq from '@/components/create-test/MCQ';
import React, { ChangeEvent } from 'react';

interface MCQImgTextLayoutProps {
  questionIndex: number;
  questionDescription: string;
  questionText: string;
  image: string | null; // Accepts null
  options: string[]; // MCQ options
  selectedOption: number | null; // Selected option index
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onQuestionTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onImageChange: (image: string) => void;
  onImageRemove: () => void;
  onOptionSelect: (index: number) => void; // Handles option selection
  onOptionChange: (index: number, value: string) => void; // Handles option text changes
  editable: boolean;
  className?: string;
}

const MCQImgTextLayout: React.FC<MCQImgTextLayoutProps> = ({
  questionIndex,
  questionDescription,
  questionText,
  image,
  options,
  selectedOption,
  onDescriptionChange,
  onQuestionTextChange,
  onImageChange,
  onImageRemove,
  onOptionSelect,
  onOptionChange,
  editable,
  className = '',
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
    {/* Question Number */}
    <div className="w-full md:w-[3%] p-3 text-lg">
      Q{questionIndex + 1}
    </div>

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
          <p className='text-xl'>Question</p> {/* Fixed typo: 'texl-xl' to 'text-xl' */}
          <textarea
            style={{ resize: "none" }}
            rows={7}
            className="w-full p-2 border border-black"
            placeholder="Enter the question text here"
            value={questionText}
            onChange={onQuestionTextChange}
            disabled={!editable}
          />
          <p className='text-xl'>Description</p> {/* Fixed typo: 'texl-xl' to 'text-xl' */}
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
          options={options} // Pass actual options
          selectedOption={selectedOption} // Pass actual selected option
          onOptionSelect={onOptionSelect} // Pass handler for selection
          onOptionChange={onOptionChange} // Pass handler for option text changes
        />
      </div>
    </div>
  </div>
);

export default MCQImgTextLayout;
