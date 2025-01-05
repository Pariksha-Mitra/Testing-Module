"use client";
import React, { useState } from "react";

const ImgMCQ = () => {
  const [options] = useState<string[]>([
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
  ]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  return (
    <div className="space-y-4">
      {/* 2x2 grid container */}
      <div className="grid grid-cols-2 gap-4 ">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            className={`relative flex flex-col items-center justify-center h-[240px] px-4 py-2 bg-white rounded-[20px] border shadow-lg transition-colors
              ${
                selectedOption === index
                  ? "bg-green-200 border-green-500 border-2"
                  : "bg-white border-black"
              }
            `}
          >
            {/* The circle in top-left corner */}
            <span
              className={`absolute top-2 left-2 h-6 w-6 rounded-full shadow-sm border-2 transition-colors
                ${
                  selectedOption === index
                    ? "bg-green-300 border-green-500"
                    : "border-gray-300 bg-zinc-300"
                }
              `}
            />

            {/* The editable text field (or image, etc.) */}
            <div className="text-center">
              answer image here
            </div>
          </button>
        ))}
      </div>

      <div className="text-lg mt-2">
        Correct answer: {selectedOption !== null ? options[selectedOption] : "None"}
      </div>
    </div>
  );
};

export default ImgMCQ;
