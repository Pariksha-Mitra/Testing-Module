
"use client";
import ImageUpload from '@/components/create-test/ImageUpload';
import React, { KeyboardEvent } from 'react';

interface ImgMCQProps {
  questionIndex: number;
  editable: boolean;
  imageOptions: Array<string | null>;
  selectedOption: number | null;
  onOptionSelect: (index: number) => void;
  onOptionChange: (index: number, value: string | null) => void;
  className?: string;
}

const ImgMCQ: React.FC<ImgMCQProps> = ({ 
  questionIndex,
  editable, 
  imageOptions, 
  selectedOption, 
  onOptionSelect, 
  onOptionChange,
  className = '',
}) => {
  const handleOptionSelectInternal = (index: number) => {
    if (!editable) return;
    onOptionSelect(index);
  };

  const handleImageChangeInternal = (index: number, image: string) => {
    console.log(`Image changed for question ${questionIndex}, option ${index}:`, image);
    if (!editable) return;
    onOptionChange(index, image);
  };

  const handleImageRemoveInternal = (index: number) => {
    console.log(`Image removed for question ${questionIndex}, option ${index}`);
    if (!editable) return;
    onOptionChange(index, null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOptionSelectInternal(index);
    }
  };

  return (
    <div className={`space-y-6 p-4 ${className}`}>
      <div
        role="radiogroup"
        aria-label={`Image options for question ${questionIndex + 1}`}
        className="img-mcq-container"
      >
        <div className="grid grid-cols-2 gap-6">
          {imageOptions.map((imageSrc, index) => (
            <div
              key={`question-${questionIndex}-option-${index}`} // Ensure global uniqueness
              role="radio"
              aria-checked={selectedOption === index}
              tabIndex={editable ? 0 : -1}
              className={`relative flex flex-col items-center justify-center h-[220px] p-4 bg-white rounded-2xl border shadow-md transition-all duration-300 ease-in-out
                ${
                  selectedOption === index
                    ? "bg-green-100 border-green-500 scale-105"
                    : "bg-white border-gray-300 scale-100"
                }
                focus:outline-none focus:ring-2 focus:ring-green-500
                ${editable ? "cursor-pointer" : "cursor-not-allowed"}
              `}
              onClick={() => handleOptionSelectInternal(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={`Option ${index + 1}${selectedOption === index ? ', selected' : ''}`}
            >
              <span
                className={`absolute top-2 left-2 h-6 w-6 rounded-full shadow-sm border-2 transition-colors
                  ${
                    selectedOption === index
                      ? "bg-green-300 border-green-500"
                      : "border-gray-300 bg-zinc-300"
                  }
                `}
                aria-hidden="true"
              />
              <div className="w-full h-[80%] flex flex-col items-center justify-center border mt-2">
                <ImageUpload
                  uniqueKey={`question-${questionIndex}-option-${index}`} // Pass uniqueKey prop with questionIndex
                  image={imageSrc}
                  onImageChange={(img) => handleImageChangeInternal(index, img)}
                  onRemove={() => handleImageRemoveInternal(index)}
                  editable={editable}
                  className="overflow-auto"
                />
                {!imageSrc && editable && (
                  <span className="text-sm text-gray-500 ">No image uploaded</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-lg mt-4">
        <strong>Selected Answer:</strong>{" "}
        {selectedOption != null ? `Option ${selectedOption + 1}` : "None"}
      </div>
    </div>
  );
};

export default ImgMCQ;
