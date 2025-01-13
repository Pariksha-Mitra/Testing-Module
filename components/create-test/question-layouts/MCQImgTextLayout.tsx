"use client"
import ImageUpload from '@/components/create-test/ImageUpload';
import MCQ from '@/components/create-test/MCQ';
import React, { ChangeEvent } from 'react';

interface MCQImgTextLayoutProps {
  questionIndex: number;
  questionDescription: string;
  questionText: string;
  image: string;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onQuestionTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onImageChange: (image: string) => void;
  onImageRemove: () => void;
  editable: boolean;
  className?: string;
}

export const MCQImgTextLayout: React.FC<MCQImgTextLayoutProps> = ({
  questionIndex,
  questionDescription,
  questionText,
  image,
  onDescriptionChange,
  onQuestionTextChange,
  onImageChange,
  onImageRemove,
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
    role="region"
    aria-label={`Question ${questionIndex + 1}`}
  >
    <div className="w-full md:w-[3%] p-3 text-lg">
      Q{questionIndex + 1}
    </div>

    <div className="flex flex-col w-full space-y-3">
      <div className="flex flex-col md:flex-row w-full space-y-3 md:space-y-0 md:space-x-3">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center border border-black">
          <ImageUpload
            image={image || ""}
            onImageChange={onImageChange}
            onRemove={onImageRemove}
            editable={editable}
            className="w-full md:w-1/2 h-[216px] items-center justify-center object-contain overflow-auto"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2 space-y-3">
          <textarea
            style={{ resize: "none" }}
            rows={3}
            className="w-full p-2 border border-black"
            placeholder="Add question description here"
            value={questionDescription}
            onChange={onDescriptionChange}
            disabled={!editable}
          />
          <textarea
            style={{ resize: "none" }}
            rows={4}
            className="w-full p-2 border border-black"
            placeholder="Enter the question text here"
            value={questionText}
            onChange={onQuestionTextChange}
            disabled={!editable}
          />
        </div>
      </div>
      <div className="w-full">
        <MCQ 
          editable={editable}
          options={[]}  
          selectedOption={null}
          onOptionSelect={() => {}}
        />
      </div>
    </div>
  </div>
);
