"use client";
import React, { useCallback, useMemo, ChangeEvent, useState } from "react";
import { useQuestions } from "@/context/QuestionsContext";
import { QuestionType } from "@/utils/types";
import Dropdown from "@/components/Dropdown/Dropdown";
import { ActionButton } from "@/components/create-test/ActionButton";
import { MCQImgTextLayout } from "@/components/create-test/question-layouts/MCQImgTextLayout";
import { MCQImgImgLayout } from "@/components/create-test/question-layouts/MCQImgImgLayout";
import { MCQTextImgLayout } from "@/components/create-test/question-layouts/MCQTextImgLayout";
import { GeneralQuestionLayout } from "@/components/create-test/question-layouts/GeneralQuestionLayout";
import { NavButton } from "@/components/create-test/NavButton";

const Page = () => {
  const {
    questions,
    setQuestions,
    selectedQuestionIndex,
    setSelectedQuestionIndex,
  } = useQuestions();

  const currentQuestion = questions[selectedQuestionIndex];
  const [isEditing, setIsEditing] = useState(false);

  // Helper function to update any field in currentQuestion.content
  const updateQuestionField = useCallback(
    (
      questionIndex: number,
      field: keyof typeof currentQuestion.content,
      value: any
    ) => {
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        content: {
          ...updatedQuestions[questionIndex].content,
          [field]: value,
        },
      };
      setQuestions(updatedQuestions);
    },
    [questions, setQuestions, currentQuestion]
  );

  // Handler for changing the question type
  const handleQuestionTypeChange = useCallback(
    (value: string | number, dropdownId: string) => {
      if (dropdownId === "dropdown-2") {
        const updatedQuestions = [...questions];
        updatedQuestions[selectedQuestionIndex] = {
          ...currentQuestion,
          type: value as QuestionType,
          // You could reset content here or partially reset
          content: {
            questionText: "",
            description: "",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswerIndex: null,
            image: "", // Initialize image field
          },
        };
        setQuestions(updatedQuestions);
      }
    },
    [questions, selectedQuestionIndex, setQuestions, currentQuestion]
  );

  // Dropdown Items
  const QuestionTypeDropdownItems = useMemo(
    () => [
      "MCQ",
      "MCQ (IMG-Text)",
      "MCQ (IMG-IMG)",
      "MCQ (Text-IMG)",
      "Match The Pairs",
      "Subjective Answer",
      "True/False",
    ],
    []
  );

  // Handlers for question fields
  const handleQuestionTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateQuestionField(selectedQuestionIndex, "questionText", e.target.value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateQuestionField(selectedQuestionIndex, "description", e.target.value);
  };

  const handleImageChange = (image: string) => {
    updateQuestionField(selectedQuestionIndex, "image", image);
  };

  const handleImageRemove = () => {
    updateQuestionField(selectedQuestionIndex, "image", "");
  };

  // Early return if no question data
  if (!currentQuestion || !currentQuestion.content) {
    return <div>No question data available.</div>;
  }

  // Buttons Data
  const buttonData = [
    {
      label: isEditing ? "SAVE" : "EDIT",
      bgColor: isEditing ? "bg-[#6ad9a1]" : "bg-[#6378fd]",
    },
    { label: "DELETE", bgColor: "bg-[#f44144]" },
  ];

  return (
    <>
      <div className="bg-white text-black flex flex-col items-center p-4 mt-2 rounded-3xl shadow border border-black laila-regular">
        <div className="flex flex-col md:flex-row items-center justify-between flex-wrap w-full gap-4">
          {/* Dropdown (प्रकार:) */}
          <div className="w-full md:w-[30%] flex-start">
            <label htmlFor="dropdown-2" className="sr-only">
              प्रकार:
            </label>
            <Dropdown
              id="dropdown-2"
              items={QuestionTypeDropdownItems}
              label="प्रकार:"
              defaultValue={currentQuestion.type}
              onSelect={(value) =>
                handleQuestionTypeChange(value, "dropdown-2")
              }
              width="100%"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6 text-center whitespace-nowrap rounded-3xl md:ml-auto laila-bold">
            {buttonData.map((button, index) => (
              <ActionButton
                key={index}
                label={button.label}
                bgColor={button.bgColor}
                onClick={() => {
                  if (button.label === "EDIT") {
                    setIsEditing(true);
                  } else if (button.label === "SAVE") {
                    setIsEditing(false);
                  } else if (button.label === "DELETE") {
                    // Handle delete action
                    console.log("DELETE clicked");
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div
          className={`flex w-full ${
            !isEditing ? "pointer-events-none opacity-80" : ""
          }`}
        >
          {/* Render the appropriate layout based on question type */}
          {(() => {
            switch (currentQuestion.type) {
              case "MCQ (IMG-Text)":
                return (
                  <MCQImgTextLayout
                    questionIndex={selectedQuestionIndex}
                    questionDescription={
                      currentQuestion.content.description || ""
                    }
                    questionText={currentQuestion.content.questionText || ""}
                    image={currentQuestion.content.image || ""}
                    onDescriptionChange={handleDescriptionChange}
                    onQuestionTextChange={handleQuestionTextChange}
                    onImageChange={handleImageChange}
                    onImageRemove={handleImageRemove}
                    editable={isEditing} 
                  />
                );

              case "MCQ (IMG-IMG)":
                return (
                  <MCQImgImgLayout
                    questionIndex={selectedQuestionIndex}
                    questionDescription={
                      currentQuestion.content.description || ""
                    }
                    image={currentQuestion.content.image || ""}
                    onDescriptionChange={handleDescriptionChange}
                    onImageChange={handleImageChange}
                    onImageRemove={handleImageRemove}
                    editable={isEditing} 
                  />
                );

              case "MCQ (Text-IMG)":
                return (
                  <MCQTextImgLayout
                    questionIndex={selectedQuestionIndex}
                    questionText={currentQuestion.content.questionText || ""}
                    questionDescription={
                      currentQuestion.content.description || ""
                    }
                    onQuestionTextChange={handleQuestionTextChange}
                    onDescriptionChange={handleDescriptionChange}
                    editable={isEditing} 
                  />
                );

              default:
                return (
                  <GeneralQuestionLayout
                    questionIndex={selectedQuestionIndex}
                    questionType={currentQuestion.type}
                    questionText={currentQuestion.content.questionText || ""}
                    questionDescription={
                      currentQuestion.content.description || ""
                    }
                    onQuestionTextChange={handleQuestionTextChange}
                    onDescriptionChange={handleDescriptionChange}
                    editable={isEditing} 
                  />
                );
            }
          })()}
        </div>
      </div>

      {/* Nav Buttons (Previous/Next) */}
      <div
        className="flex flex-wrap gap-10 self-center mt-4 max-w-full w-[506px] mx-auto items-center justify-center"
        role="group"
        aria-label="Navigation cards"
      >
        <NavButton
          imageSrc="/nav-left.png"
          tooltipText="मागील"
          onClick={() => {
            if (selectedQuestionIndex > 0) {
              setSelectedQuestionIndex(selectedQuestionIndex - 1);
            }
          }}
        />
        <NavButton
          imageSrc="/nav-right.png"
          tooltipText="पुढील"
          onClick={() => {
            if (selectedQuestionIndex < questions.length - 1) {
              setSelectedQuestionIndex(selectedQuestionIndex + 1);
            }
          }}
        />
      </div>
    </>
  );
};

export default Page;
