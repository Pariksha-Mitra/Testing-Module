"use client";
import React, { ChangeEvent } from "react";
import MCQ from "@/components/create-test/MCQ";
import ImageUpload from "@/components/create-test/ImageUpload";

export const MCQImgTextLayout: React.FC<{
  questionIndex: number;
  questionDescription: string;
  questionText: string;
  image: string;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onQuestionTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onImageChange: (image: string) => void;
  onImageRemove: () => void;
  editable: boolean; // Receive the editable prop
}> = ({
  questionIndex,
  questionDescription,
  questionText,
  image,
  onDescriptionChange,
  onQuestionTextChange,
  onImageChange,
  onImageRemove,
  editable, // Destructure editable
}) => (
  <div className="flex flex-col md:flex-row px-3 py-3 mt-6 w-full border border-black">
    {/* Left Column: Question Number */}
    <div className="w-full md:w-[3%] p-3 text-lg">Q{questionIndex + 1}</div>

    {/* Right Content: Input, Text Areas, and MCQ */}
    <div className="flex flex-col w-full space-y-3">
      {/* Top Section: Image Upload and Text Areas */}
      <div className="flex flex-col md:flex-row w-full space-y-3 md:space-y-0 md:space-x-3">
        {/* Image Upload */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center border border-black">
          <ImageUpload
            image={image || ""}
            onImageChange={onImageChange}
            onRemove={onImageRemove}
            editable={editable} // Pass editable prop
            className="w-full md:w-1/2 h-[216px] items-center justify-center object-contain overflow-auto"
          />
        </div>
        {/* Text Areas */}
        <div className="flex flex-col w-full md:w-1/2 space-y-3">
          <textarea
            style={{ resize: "none" }}
            rows={3}
            className="w-full p-2 border border-black"
            placeholder="Add question description here"
            value={questionDescription}
            onChange={onDescriptionChange}
            disabled={!editable} // Disable when not editable
          />
          <textarea
            style={{ resize: "none" }}
            rows={4}
            className="w-full p-2 border border-black"
            placeholder="Enter the question text here"
            value={questionText}
            onChange={onQuestionTextChange}
            disabled={!editable} // Disable when not editable
          />
        </div>
      </div>

      {/* Bottom Section: MCQ */}
      <div className="w-full">
        <MCQ editable={editable} /> {/* Pass editable prop */}
      </div>
    </div>
  </div>
);
