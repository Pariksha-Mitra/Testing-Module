"use client";

import React, { ChangeEvent } from "react";
import ImgMCQ from "@/components/create-test/ImgMCQ";
import ImageUpload from "@/components/create-test/ImageUpload";

interface MCQImgImgLayoutProps {
  questionIndex: number;
  questionDescription: string;
  image: string;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onImageChange: (image: string) => void;
  onImageRemove: () => void;
  editable: boolean; // Added editable prop
}

export const MCQImgImgLayout: React.FC<MCQImgImgLayoutProps> = ({
  questionIndex,
  questionDescription,
  image,
  onDescriptionChange,
  onImageChange,
  onImageRemove,
  editable, // Destructure editable
}) => (
  <div className="flex flex-col md:flex-row px-3 py-3 mt-6 w-full border border-black space-y-3 md:space-y-0 md:space-x-3">
    {/* First Column: Q{questionIndex + 1} */}
    <div className="w-full md:w-[3%] p-3 mr-2 text-lg">
      Q{questionIndex + 1}
    </div>

    {/* Second Column: Split in half for two images, etc. */}
    <div className="flex flex-col md:flex-row w-full space-y-3 md:space-y-0 md:space-x-3">
      {/* Left Image Upload */}
      <div className="flex flex-col w-full md:w-1/2 space-y-1">
        <div className="w-full flex flex-col items-center justify-center border">
          <ImageUpload
            image={image || null}
            onImageChange={onImageChange}
            onRemove={onImageRemove}
            editable={editable} // Pass editable prop
            className="w-full h-[390px] border border-black overflow-hidden"
          />
        </div>
        <textarea
          style={{ resize: "none" }}
          className="w-full p-2 border border-black h-[100px]"
          placeholder="Enter question description here"
          value={questionDescription}
          onChange={onDescriptionChange}
          disabled={!editable} // Disable when not editable
          aria-disabled={!editable} // Accessibility attribute
        />
      </div>

      {/* Right side: ImgMCQ */}
      <div className="flex flex-col w-full md:w-1/2">
        <ImgMCQ editable={editable} /> {/* Pass editable prop */}
      </div>
    </div>
  </div>
);
