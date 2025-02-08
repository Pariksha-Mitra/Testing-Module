"use client";
import ImageUpload from '@/components/create-test/ImageUpload';
import ImgMCQ from '@/components/create-test/ImgMCQ';
import React, { ChangeEvent } from 'react';

interface MCQImgImgLayoutProps {
  questionIndex: number;
  questionDescription: string;
  image: string | null |undefined;
  imageOptions: Array<string | null> |undefined ;
  selectedOption: number | null;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onImageChange: (image: string) => void;
  onImageRemove: () => void;
  onOptionSelect: (index: number) => void;
  onOptionChange: (index: number, value: string | null) => void;
  editable: boolean;
  className?: string;
}

const MCQImgImgLayout: React.FC<MCQImgImgLayoutProps> = ({
  questionIndex,
  questionDescription,
  image,
  imageOptions,
  selectedOption,
  onDescriptionChange,
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
      space-y-3 md:space-y-0 md:space-x-3
      ${!editable ? 'opacity-50 pointer-events-none' : ''}
      ${className}
    `}
    aria-label={`Question ${questionIndex + 1} Layout`}
  >
    {/* First Column: Q{questionIndex + 1} */}
    <div className="w-full md:w-[3%] p-3 mr-2 text-lg" aria-hidden="true">
      Q{questionIndex + 1}
    </div>

    {/* Second Column: Split in half for two images, etc. */}
    <div className="flex flex-col md:flex-row w-full space-y-3 md:space-y-0 md:space-x-3">
      {/* Left Image Upload */}
      <div className="flex flex-col w-full md:w-1/2 space-y-1">
        <div className="flex flex-col items-center justify-center border">
          <ImageUpload
            uniqueKey={`question-${questionIndex}-main-image`} // Unique key for main image
            image={image ?? null}
            onImageChange={onImageChange}
            onRemove={onImageRemove}
            editable={editable}
            className="w-full h-[390px] border border-black overflow-auto"
          />
          {!image && editable && (
            <span className="text-sm text-gray-500 mt-2">No main image uploaded</span>
          )}
        </div>
        <textarea
          style={{ resize: "none" }}
          className="w-full p-2 border border-black h-[100px]"
          placeholder="Enter question description here"
          value={questionDescription}
          onChange={onDescriptionChange}
          disabled={!editable}
          aria-label="Question description"
        />
      </div>

      {/* Right side: ImgMCQ */}
      <div className="flex flex-col w-full md:w-1/2">
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

export default MCQImgImgLayout;
