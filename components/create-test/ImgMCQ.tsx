"use client"
import ImageUpload from './ImageUpload';
import React from 'react';
import { useQuestions } from '@/context/QuestionsContext';

interface ImageOption {
  url: string;
  alt?: string;
  id: number;
  selected?: boolean;
}

interface ImgMCQProps {
  editable: boolean;
  maxOptions?: number;
  onOptionSelect?: (index: number) => void;
  defaultOptions?: ImageOption[]; // Add default options
  className?: string; // Add styling flexibility
}

const ImgMCQ: React.FC<ImgMCQProps> = ({ editable }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { questions, setQuestions, selectedQuestionIndex } = useQuestions();

  const handleError = (error: Error) => {
    console.error("Error in ImgMCQ:", error);
    // Add error reporting
    return <div className="error-message">Error loading questions</div>;
  };

  try {

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-[220px]">
          <span>Loading images...</span>
        </div>
      );
    }

    if (!questions?.length) {
      return <div>No questions available</div>;
    }
  } catch (error) {
    return handleError(error as Error);
  }

  const currentQuestion = questions[selectedQuestionIndex];

  // If for some reason imageOptions is not defined yet, create a fallback
  const imageOptions = currentQuestion.content.imageOptions || [
    null,
    null,
    null,
    null,
  ];

  try {
    // Handle selecting correct image-based answer
    const handleOptionSelect = (index: number) => {
      if (!editable) return;
      if (index < 0 || index >= imageOptions.length) {
        console.error("Invalid option index");
        return;
      }

      setIsLoading(true);
      try {
        const updated = [...questions];
        updated[selectedQuestionIndex].content.correctAnswerIndex = index;
        setQuestions(updated);
      } finally {
        setIsLoading(false);
      }
    };

    // Handle changing an individual option’s image
    const handleImageChange = async (index: number, image: string) => {
      if (!editable) return; // Prevent changes if not editable

      try {
        setIsLoading(true);
        // ... image upload logic
      } catch (error) {
        console.error("Error uploading image:", error);
        // Handle error appropriately
      } finally {
        setIsLoading(false);
      }

      const updated = [...questions];
      // Ensure imageOptions array is always present
      if (!updated[selectedQuestionIndex].content.imageOptions) {
        updated[selectedQuestionIndex].content.imageOptions = [
          null,
          null,
          null,
          null,
        ];
      }
      updated[selectedQuestionIndex].content.imageOptions[index] = image;
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
        <div
          role="radiogroup"
          aria-label="Image options"
          className="img-mcq-container"
        >
          <div className="grid grid-cols-2 gap-6">
            {imageOptions.map((imageSrc, index) => (
              <button
                key={`image-option-${index}-${imageSrc?.substring(0, 8) ?? 'empty'}`}
                className={`relative flex flex-col items-center justify-center h-[220px] p-4 bg-white rounded-2xl border shadow-md transition-all duration-300 ease-in-out
                  ${
                    selectedOption === index
                      ? "bg-green-100 border-green-500 scale-105"
                      : "bg-white border-gray-300 scale-100"
                  }
                  focus:outline-none focus:ring-2 focus:ring-green-500
                  ${editable ? "cursor-pointer" : "cursor-not-allowed"}
                `}
                onClick={() => handleOptionSelect(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleOptionSelect(index);
                  }
                }}
                disabled={!editable}
                type="button"
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
              </button>
            ))}
          </div>
        </div>

        <div className="text-lg mt-4">
          <strong>Selected Answer:</strong>{" "}
          {selectedOption != null ? `Option ${selectedOption + 1}` : "None"}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ImgMCQ:", error);
    return <div className="error-message">Error loading image options</div>;
  }
};

export default ImgMCQ;
