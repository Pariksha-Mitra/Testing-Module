// File: src/pages/create-test/page.tsx

"use client"; // Must be the first line for client-side rendering in Next.js

import React, {
  useCallback,
  useMemo,
  useEffect,
  ChangeEvent,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { QuestionType, Question } from "@/utils/types";
import { useQuestions } from "@/context/QuestionsContext";
import MCQImgTextLayout from "@/components/create-test/question-layouts/MCQImgTextLayout";
import MCQImgImgLayout from "@/components/create-test/question-layouts/MCQImgImgLayout";
import MCQTextImgLayout from "@/components/create-test/question-layouts/MCQTextImgLayout";
import GeneralQuestionLayout from "@/components/create-test/question-layouts/GeneralQuestionLayout";
import { ActionButton } from "@/components/create-test/ActionButton";
import { NavButton } from "@/components/create-test/NavButton";
import Dropdown from "@/components/Dropdown/Dropdown";
import { useToast } from "@/components/ui/ToastProvider";
import { Skeleton } from "@mui/material";

const Page: React.FC = () => {
  // Accessing Questions Context
  const {
    questions,
    setQuestions,
    selectedQuestionIndex,
    setSelectedQuestionIndex,
    isEditing,
    setIsEditing,
  } = useQuestions();

  const router = useRouter();
  const pathname = usePathname();

  const currentQuestion = questions[selectedQuestionIndex];

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // For error handling

  const { showToast } = useToast(); // Assuming you have a toast provider

  // Track previous pathname to detect route changes
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Unsaved Changes Warning Logic
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing) {
        e.preventDefault();
        e.returnValue = ""; // Required for some browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Detect in-app navigation by monitoring pathname changes
    if (isEditing) {
      if (prevPathname !== pathname) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to leave this page?"
        );
        if (!confirmLeave) {
          // Revert to previous pathname
          router.push(prevPathname);
        } else {
          setPrevPathname(pathname);
        }
      }
    } else {
      setPrevPathname(pathname);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditing, pathname, prevPathname, router]);

  // Helper function to update any field in currentQuestion
  const updateQuestionField = useCallback(
    (
      questionIndex: number,
      field: keyof Question,
      value: Question[keyof Question]
    ) => {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          [field]: value,
        };
        console.log(
          `Updating question ${questionIndex} field ${field} to`,
          value
        ); // Debugging
        return updatedQuestions;
      });
    },
    [setQuestions]
  );

  // Handler for changing the question type
  const handleQuestionTypeChange = useCallback(
    async (value: string | number, dropdownId: string) => {
      if (dropdownId === "dropdown-2") {
        if (isEditing) {
          const confirmChange = window.confirm(
            "You have unsaved changes. Are you sure you want to change the question type? All unsaved changes will be lost."
          );
          if (!confirmChange) return;
        }

        setIsLoading(true);
        try {
          setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[selectedQuestionIndex] = {
              ...updatedQuestions[selectedQuestionIndex],
              questionType: value as QuestionType,
              questionText: "",
              description: "",
              options: ["Option 1", "Option 2", "Option 3", "Option 4"],
              correctAnswer: null,
              numericalAnswer: undefined,
              image: null,
              imageOptions: [null, null, null, null],
            };
            console.log("Changing question type to", value); // Debugging
            return updatedQuestions;
          });
          setIsEditing(false); // Reset editing state after type change
          showToast("Question type changed successfully.", "success");
        } catch (error) {
          console.error("Error changing question type:", error);
          setError("Failed to change question type. Please try again."); // Optional: Set error state
          showToast("Failed to change question type.", "error");
        } finally {
          setIsLoading(false);
        }
      }
    },
    [isEditing, selectedQuestionIndex, setQuestions, setIsEditing, showToast]
  );

  // Dropdown Items using Enum
  const QuestionTypeDropdownItems = useMemo(
    () =>
      Object.values(QuestionType).map((item) => ({
        id: item,
        name: item.replace(/_/g, " "), // Replace underscores with spaces for better display
      })),
    []
  );

  console.log(QuestionTypeDropdownItems);

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

  const handleDescriptionChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      updateQuestionField(selectedQuestionIndex, "description", e.target.value);
    },
    [selectedQuestionIndex, updateQuestionField]
  );

  const handleImageChange = useCallback(
    (image: string) => {
      setIsLoading(true);
      try {
        console.log("Handling main image change:", image); // Debugging
        updateQuestionField(selectedQuestionIndex, "image", image);
        showToast("Image updated successfully.", "success");
      } catch (error) {
        console.error("Error handling image change:", error);
        setError("Failed to update image. Please try again."); // Optional: Set error state
        showToast("Failed to update image.", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedQuestionIndex, updateQuestionField, showToast]
  );

  const handleImageRemove = useCallback(() => {
    console.log("Handling main image removal"); // Debugging
    updateQuestionField(selectedQuestionIndex, "image", null);
    showToast("Image removed successfully.", "success");
  }, [selectedQuestionIndex, updateQuestionField, showToast]);

  // Handler to update correctAnswer when an option is selected
  const handleCorrectAnswerChange = useCallback(
    (newAnswer: string) => {
      updateQuestionField(selectedQuestionIndex, "correctAnswer", newAnswer);
    },
    [selectedQuestionIndex, updateQuestionField]
  );

  // Handlers for options
  const handleOptionSelect = useCallback(
    (index: number) => {
      const selectedOptionText = currentQuestion.options[index] || null;
      setQuestions((prevQuestions) =>
        prevQuestions.map((q, idx) =>
          idx === selectedQuestionIndex
            ? { ...q, correctAnswer: selectedOptionText }
            : q
        )
      );
    },
    [currentQuestion.options, selectedQuestionIndex, setQuestions]
  );

  const handleOptionChange = useCallback(
    (index: number, value: string) => {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        const currentQ = { ...updatedQuestions[selectedQuestionIndex] };

        if (currentQ.questionType === QuestionType.MCQ) {
          const updatedOptions = [...(currentQ.options ?? [])];
          updatedOptions[index] = value;
          currentQ.options = updatedOptions;
        } else {
          const updatedImageOptions = [
            ...(currentQ.imageOptions ?? [null, null, null, null]),
          ];
          updatedImageOptions[index] = value;
          currentQ.imageOptions = updatedImageOptions;
        }

        // If the changed option was the correct answer, update correctAnswer
        if (currentQ.correctAnswer === currentQ.options[index]) {
          currentQ.correctAnswer = value;
        }

        updatedQuestions[selectedQuestionIndex] = currentQ;

        return updatedQuestions;
      });
    },
    [selectedQuestionIndex, setQuestions]
  );

  // Handlers for questionText change (for MCQTextImgLayout)
  const handleQuestionTextChangeForLayout = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      handleQuestionTextChange(e);
    },
    [handleQuestionTextChange]
  );

  // Log current questions state
  useEffect(() => {
    console.log("Current Questions State:", questions);
  }, [questions, currentQuestion]);

  // Buttons Data with unique ids
  const buttonData = useMemo(
    () => [
      {
        id: "edit-save",
        label: isEditing ? "SAVE" : "EDIT",
        bgColor: isEditing ? "bg-[#6ad9a1]" : "bg-[#6378fd]",
      },
      {
        id: "delete",
        label: "DELETE",
        bgColor: "bg-[#f44144]",
      },
    ],
    [isEditing]
  );

  const canGoNext = selectedQuestionIndex < questions.length - 1;
  const canGoPrevious = selectedQuestionIndex > 0;

  // Handler for action buttons with confirmation for delete
  // Inside your Page component in page.tsx

  const handleActionButtonClick = useCallback(
    async (buttonLabel: string) => {
      setIsLoading(true);
      try {
        if (buttonLabel === "EDIT") {
          setIsEditing(true);
          showToast("Editing enabled.", "info");
        } else if (buttonLabel === "SAVE") {
          // Validate that the question has an ID (i.e., it's an existing question)
          if (!currentQuestion.id) {
            showToast("Cannot save a question without an ID.", "error");
            return;
          }

          // Prepare the payload
          const payload = {
            standardId: currentQuestion.standardId,
            subjectId: currentQuestion.subjectId,
            chapterId: currentQuestion.chapterId,
            exerciseId: currentQuestion.exerciseId,
            questionText: currentQuestion.questionText,
            questionType: currentQuestion.questionType,
            answerFormat: currentQuestion.answerFormat,
            options: currentQuestion.options,
            correctAnswer: currentQuestion.correctAnswer,
            numericalAnswer: currentQuestion.numericalAnswer,
          };

          console.log(JSON.stringify(payload));

          // Send PUT request to update the question
          const response = await fetch(`/api/questions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (response.ok) {
            showToast("Question saved successfully.", "success");
            setIsEditing(false);
            // Update the questions state with the updated question
            setQuestions((prevQuestions) => {
              const updatedQuestions = [...prevQuestions];
              updatedQuestions[selectedQuestionIndex] = data.question;
              return updatedQuestions;
            });
          } else {
            const errorMsg = data.error || "Failed to save changes.";
            showToast(errorMsg, "error");
            setError(errorMsg);
          }
        } else if (buttonLabel === "DELETE") {
          // Existing DELETE logic...
          const confirmDelete = window.confirm(
            "Are you sure you want to delete this question?"
          );
          if (!confirmDelete) return;

          if (!currentQuestion.id) {
            showToast("Invalid question ID.", "error");
            return;
          }

          console.log("Deleting question with id:", currentQuestion.id); // Debugging

          const response = await fetch(
            `/api/questions?id=${currentQuestion.id}`,
            {
              method: "DELETE",
            }
          );

          const data = await response.json();

          if (response.ok && data.success) {
            setQuestions((prevQuestions) => {
              const updatedQuestions = prevQuestions.filter(
                (_, idx) => idx !== selectedQuestionIndex
              );
              return updatedQuestions;
            });
            setSelectedQuestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
            showToast("Question deleted successfully.", "success");
          } else {
            const errorMsg = data.error || "Failed to delete the question.";
            showToast(errorMsg, "error");
          }
        }
      } catch (error) {
        console.error(`Error performing action "${buttonLabel}":`, error);
        setError(
          `An error occurred while performing "${buttonLabel}". Please try again.`
        );
        showToast(
          `An error occurred while performing "${buttonLabel}".`,
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentQuestion, 
      selectedQuestionIndex,
      setQuestions,
      setSelectedQuestionIndex,
      setIsEditing,
      showToast,
    ]
  );

  // Helper function to render the appropriate question layout
  const renderQuestionLayout = useCallback(
    (question: Question, index: number) => {
      switch (question.questionType) {
        case QuestionType.MCQ_IMG_TEXT:
          return (
            <MCQImgTextLayout
              editable={isEditing}
              key={question.id}
              questionIndex={index}
              questionText={question.questionText}
              questionDescription={question.description ?? ""}
              options={question.options}
              selectedOption={
                question.correctAnswer
                  ? question.options.indexOf(question.correctAnswer)
                  : null
              }
              onOptionSelect={handleOptionSelect}
              image={question.image}
              onImageChange={handleImageChange}
              onImageRemove={handleImageRemove}
              onOptionChange={handleOptionChange}
              onQuestionTextChange={handleQuestionTextChangeForLayout}
              onDescriptionChange={handleDescriptionChange}
              onCorrectAnswerChange={handleCorrectAnswerChange}
            />
          );

        case QuestionType.MCQ_IMG_IMG:
          return (
            <MCQImgImgLayout
              editable={isEditing}
              key={question.id}
              questionIndex={index}
              questionDescription={question.description ?? ""}
              selectedOption={
                question.correctAnswer
                  ? question.options.indexOf(question.correctAnswer)
                  : null
              }
              onOptionSelect={handleOptionSelect}
              image={question.image}
              imageOptions={question.imageOptions}
              onImageChange={handleImageChange}
              onImageRemove={handleImageRemove}
              onOptionChange={handleOptionChange}
              onDescriptionChange={handleDescriptionChange}
              onCorrectAnswerChange={handleCorrectAnswerChange}
            />
          );

        case QuestionType.MCQ_TEXT_IMG:
          return (
            <MCQTextImgLayout
              editable={isEditing}
              key={question.id}
              questionIndex={index}
              questionText={question.questionText}
              description={question.description ?? ""}
              selectedOption={
                question.correctAnswer
                  ? question.options.indexOf(question.correctAnswer)
                  : null
              }
              onOptionSelect={handleOptionSelect}
              imageOptions={question.imageOptions}
              onOptionChange={handleOptionChange}
              onQuestionTextChange={handleQuestionTextChangeForLayout}
              onDescriptionChange={handleDescriptionChange}
              onCorrectAnswerChange={handleCorrectAnswerChange}
            />
          );

        default:
          return (
            <GeneralQuestionLayout
              editable={isEditing}
              questionType={question.questionType}
              key={question.id}
              questionIndex={index}
              questionText={question.questionText}
              questionDescription={question.description ?? ""}
              options={question.options}
              selectedOption={
                question.correctAnswer
                  ? question.options.indexOf(question.correctAnswer)
                  : null
              }
              correctAnswer={question.correctAnswer}
              onOptionSelect={handleOptionSelect}
              onOptionChange={handleOptionChange}
              onCorrectAnswerChange={handleCorrectAnswerChange}
              onQuestionTextChange={handleQuestionTextChangeForLayout}
              onDescriptionChange={handleDescriptionChange}
              className=""
            />
          );
      }
    },
    [
      isEditing,
      handleOptionSelect,
      handleImageChange,
      handleImageRemove,
      handleOptionChange,
      handleQuestionTextChangeForLayout,
      handleDescriptionChange,
      handleCorrectAnswerChange,
    ]
  );

  // Handlers for navigation buttons
  const navigateToPrevious = useCallback(() => {
    if (canGoPrevious) {
      console.log("Navigating to previous question");
      setSelectedQuestionIndex((prev) => prev - 1);
    }
  }, [canGoPrevious, setSelectedQuestionIndex]);

  const navigateToNext = useCallback(() => {
    if (canGoNext) {
      console.log("Navigating to next question");
      setSelectedQuestionIndex((prev) => prev + 1);
    }
  }, [canGoNext, setSelectedQuestionIndex]);

  // Loading state handling
  if (isLoading) {
    return (
      <div className="bg-white text-black flex flex-col items-center p-4 mt-2 rounded-3xl shadow border border-black laila-regular">
        <Skeleton sx={{ bgcolor: "#a6b1ff" }} variant="rectangular" width="100%" height="500px" />
      </div>
    );
  }

  return (
    <>
      
      <div className="bg-white text-black flex flex-col items-center p-4 mt-2 rounded-3xl shadow border border-black laila-regular">
        <div className="flex flex-col md:flex-row items-center justify-between flex-wrap w-full gap-4">
          {/* Dropdown (प्रकार:) */}
          <div className="w-full md:w-[30%] flex-start">
            <Dropdown
              id="dropdown-2"
              items={QuestionTypeDropdownItems}
              label="प्रकार:"
              selected={currentQuestion.questionType}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(value) =>
                handleQuestionTypeChange(value, "dropdown-2")
              }
             
              disabled={!isEditing}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6 text-center whitespace-nowrap rounded-3xl md:ml-auto laila-bold">
            {buttonData.map((button) => (
              <ActionButton
                key={button.id}
                label={button.label}
                bgColor={button.bgColor}
                onClick={() => handleActionButtonClick(button.label)}
              />
            ))}
          </div>
        </div>

        {/* Question Layout */}
        <div
          className={`flex w-full ${!isEditing ? "pointer-events-none " : ""}`}
          aria-live="polite"
        >
          {renderQuestionLayout(currentQuestion, selectedQuestionIndex)}
        </div>
      </div>

      {/* Navigation Buttons */}
      <fieldset className="flex flex-wrap gap-10 self-center mt-4 max-w-full w-[506px] mx-auto items-center justify-center border-none">
        <legend className="sr-only">Navigation buttons</legend>
        <NavButton
          imageSrc="/nav-left.png"
          tooltipText="मागील"
          onClick={navigateToPrevious}
          disabled={!canGoPrevious || isEditing} // Disabled during editing
        />
        <NavButton
          imageSrc="/nav-right.png"
          tooltipText="पुढील"
          onClick={navigateToNext}
          disabled={!canGoNext || isEditing} // Disabled during editing
        />
      </fieldset>
    </>
  );
};

export default Page;
