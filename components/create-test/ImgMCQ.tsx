"use client";

import React from "react";
import { useQuestions } from "@/context/QuestionsContext";
import ImageUpload from "./ImageUpload";

interface ImgMCQProps {
  editable: boolean; // Added editable prop
}

const ImgMCQ: React.FC<ImgMCQProps> = ({ editable }) => {
  const { questions, setQuestions, selectedQuestionIndex } = useQuestions();
  const currentQuestion = questions[selectedQuestionIndex];

  // If for some reason imageOptions is not defined yet, create a fallback
  const imageOptions = currentQuestion.content.imageOptions || [null, null, null, null];

  // Handle selecting correct image-based answer
  const handleOptionSelect = (index: number) => {
    if (!editable) return; // Prevent selection if not editable

    const updated = [...questions];
    updated[selectedQuestionIndex].content.correctAnswerIndex = index;
    setQuestions(updated);
  };

  // Handle changing an individual option’s image
  const handleImageChange = (index: number, image: string) => {
    if (!editable) return; // Prevent changes if not editable

    const updated = [...questions];
    // Ensure imageOptions array is always present
    if (!updated[selectedQuestionIndex].content.imageOptions) {
      updated[selectedQuestionIndex].content.imageOptions = [null, null, null, null];
    }
    updated[selectedQuestionIndex].content.imageOptions![index] = image;
    setQuestions(updated);
  };

  // Handle removing an image
  const handleImageRemove = (index: number) => {
    if (!editable) return; // Prevent removal if not editable

    const updated = [...questions];
    updated[selectedQuestionIndex].content.imageOptions![index] = null;
    setQuestions(updated);
  };

  const selectedOption = currentQuestion.content.correctAnswerIndex;

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-2 gap-6">
        {imageOptions.map((imageSrc, index) => (
          <div
            key={index}
            className={`relative flex flex-col items-center justify-center h-[220px] p-4 bg-white rounded-2xl border shadow-md transition-all duration-300
              ${
                selectedOption === index
                  ? "bg-green-100 border-green-500 scale-105"
                  : "bg-white border-gray-300"
              }
              focus:outline-none focus:ring-2 focus:ring-green-500
              ${editable ? "cursor-pointer" : "cursor-not-allowed"}
            `}
            onClick={() => handleOptionSelect(index)}
            aria-disabled={!editable} // Accessibility attribute
            tabIndex={editable ? 0 : -1} // Remove from tab order if not editable
          >
            <span
              className={`absolute top-2 left-2 h-6 w-6 rounded-full shadow-sm border-2 transition-colors
                ${
                  selectedOption === index
                    ? "bg-green-300 border-green-500"
                    : "border-gray-300 bg-zinc-300"
                }
              `}
            />
            <div className="w-full h-[80%] flex flex-col items-center justify-center  border mt-2">
              <ImageUpload
                image={imageSrc ?? null}
                onImageChange={(img) => handleImageChange(index, img)}
                onRemove={() => handleImageRemove(index)}
                editable={editable} // Pass editable prop
                className="overflow-auto"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-lg mt-4">
        <strong>Selected Answer:</strong>{" "}
        {selectedOption !== null ? `Option ${selectedOption + 1}` : "None"}
      </div>
    </div>
  );
};

export default ImgMCQ;
