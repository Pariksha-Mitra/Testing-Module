"use client"
import Dropdown from '@/components/Dropdown/Dropdown';
import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useState
  } from 'react';
import { ActionButton } from '@/components/create-test/ActionButton';
import { GeneralQuestionLayout } from '@/components/create-test/question-layouts/GeneralQuestionLayout';
import { MCQImgImgLayout } from '@/components/create-test/question-layouts/MCQImgImgLayout';
import { MCQImgTextLayout } from '@/components/create-test/question-layouts/MCQImgTextLayout';
import { MCQTextImgLayout } from '@/components/create-test/question-layouts/MCQTextImgLayout';
import { NavButton } from '@/components/create-test/NavButton';
import { QuestionType } from '@/utils/types';
import { useQuestions } from '@/context/QuestionsContext';

const Page: React.FC = () => {
  const {
    questions,
    setQuestions,
    selectedQuestionIndex,
    setSelectedQuestionIndex,
  } = useQuestions();

  const currentQuestion = questions[selectedQuestionIndex];
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to update any field in currentQuestion.content
  const updateQuestionField = useCallback(
    (
      questionIndex: number,
      field: keyof typeof currentQuestion.content,
      value: typeof currentQuestion.content[typeof field] // Type inferred based on the field
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
    async (value: string | number, dropdownId: string) => {
      if (dropdownId === "dropdown-2") {
        setIsLoading(true);
        try {
          const updatedQuestions = [...questions];
          updatedQuestions[selectedQuestionIndex] = {
            ...currentQuestion,
            type: value as QuestionType,
            content: {
              questionText: "",
              description: "",
              options: ["Option 1", "Option 2", "Option 3", "Option 4"],
              correctAnswerIndex: null,
              image: "",
            },
          };
          setQuestions(updatedQuestions);
        } finally {
          setIsLoading(false);
        }
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
  const handleQuestionTextChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      updateQuestionField(
        selectedQuestionIndex,
        "questionText",
        e.target.value
      );
    },
    [selectedQuestionIndex, updateQuestionField]
  );

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateQuestionField(selectedQuestionIndex, "description", e.target.value);
  };

  const handleImageChange = async (image: string) => {
    setIsLoading(true);
    try {
      updateQuestionField(selectedQuestionIndex, "image", image);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageRemove = () => {
    updateQuestionField(selectedQuestionIndex, "image", "");
  };

  // Early return if no question data
  if (!currentQuestion?.content) {
    return <div>No question data available.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Buttons Data
  const buttonData = [
    {
      label: isEditing ? "SAVE" : "EDIT",
      bgColor: isEditing ? "bg-[#6ad9a1]" : "bg-[#6378fd]",
    },
    { label: "DELETE", bgColor: "bg-[#f44144]" },
  ];

  const canGoNext = selectedQuestionIndex < questions.length - 1;
  const canGoPrevious = selectedQuestionIndex > 0;

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
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    if (button.label === "EDIT") {
                      setIsEditing(true);
                    } else if (button.label === "SAVE") {
                      setIsEditing(false);
                    } else if (button.label === "DELETE") {
                      // Handle delete action
                    }
                  } finally {
                    setIsLoading(false);
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
            try {
              switch (currentQuestion.type) {
                case "MCQ (IMG-Text)":
                  return (
                    <MCQImgTextLayout
                      questionIndex={selectedQuestionIndex}
                      questionDescription={
                        currentQuestion.content.description ?? ""
                      }
                      questionText={currentQuestion.content.questionText ?? ""}
                      image={currentQuestion.content.image ?? ""}
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
                        currentQuestion.content.description ?? ""
                      }
                      image={currentQuestion.content.image ?? ""}
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
                      questionText={currentQuestion.content.questionText ?? ""}
                      questionDescription={
                        currentQuestion.content.description ?? ""
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
                      questionText={currentQuestion.content.questionText ?? ""}
                      questionDescription={
                        currentQuestion.content.description ?? ""
                      }
                      onQuestionTextChange={handleQuestionTextChange}
                      onDescriptionChange={handleDescriptionChange}
                      editable={isEditing}
                    />
                  );
              }
            } catch (error) {
              console.error(error);
              return <div>Error loading question</div>;
            }
          })()}
        </div>
      </div>

      {/* Nav Buttons (Previous/Next) */}
      <fieldset className="flex flex-wrap gap-10 self-center mt-4 max-w-full w-[506px] mx-auto items-center justify-center border-none">
        <legend className="sr-only">Navigation cards</legend>
        <NavButton
          imageSrc="/nav-left.png"
          tooltipText="मागील"
          onClick={() => {
            if (canGoPrevious) {
              setSelectedQuestionIndex(selectedQuestionIndex - 1);
            }
          }}
        />
        <NavButton
          imageSrc="/nav-right.png"
          tooltipText="पुढील"
          onClick={() => {
            if (canGoNext) {
              setSelectedQuestionIndex(selectedQuestionIndex + 1);
            }
          }}
        />
      </fieldset>
    </>
  );
};

export default Page;
