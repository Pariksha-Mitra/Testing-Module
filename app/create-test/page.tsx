"use client";

import React, { useCallback, ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionType, Question } from "@/utils/types";
import { QuestionLayout } from "@/components/create-test/question-layouts/QuestionLayout";
import { NavButton } from "@/components/create-test/NavButton";
import { useToast } from "@/components/ui/ToastProvider";
import { Skeleton } from "@mui/material";
import Dropdown from "@/components/Dropdown/Dropdown";
import { useCustomTestStore } from "@/store/useCustomTestStore";
import { useQuestionStore } from "@/store/useQuestionStore";
import { useDropdowns } from "@/utils/hooks/useDropdowns";
import { useUnsavedChangesWarning } from "@/utils/hooks/useUnsavedChangesWarning";

const Page: React.FC = () => {
  // Destructure the custom test store including isEditing & setIsEditing.
  const {
    questions,
    selectedQuestionIndex,
    updateQuestion,
    setSelectedQuestionIndex,
    addQuestion,
    isEditing,
    setIsEditing,
  } = useCustomTestStore();

  // Fetch the original questions.
  const { questions: questionStoreQuestions } = useQuestionStore();

  const { isAnyLoading } = useDropdowns();
  const router = useRouter();

  // Get the current question from the custom test store.
  const currentQuestion = questions[selectedQuestionIndex];
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Remove local state for isEditing – we use the store’s isEditing.
  // const [isEditing, setIsEditing] = useState(true); // REMOVED

  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Warn the user about unsaved changes.
  useUnsavedChangesWarning(isEditing);

  // Helper: Update a field in the current question and clear any validation error.
  const updateQuestionFieldHandler = useCallback(
    <K extends keyof Question>(questionIndex: number, field: K, value: Question[K]) => {
      updateQuestion(questionIndex, { [field]: value } as Partial<Question>);
      if (validationErrors[field as string]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    },
    [updateQuestion, validationErrors]
  );

  // Handler: When a question is selected from the dropdown.
  const handleQuestionDropdownChange = useCallback(
    (value: string | number) => {
      const selected = questionStoreQuestions.find((q) => q.id === value);
      if (selected) {
        const customTestIndex = questions.findIndex((q) => q.id === selected.id);
        if (customTestIndex === -1) {
          addQuestion(selected);
          // Assume new question is appended at the end.
          const newIndex = questions.length;
          setSelectedQuestionIndex(newIndex);
          router.push(`?question=${newIndex}`);
        } else {
          setSelectedQuestionIndex(customTestIndex);
          router.push(`?question=${customTestIndex}`);
        }
        showToast("Question selected.", "success");
      } else {
        showToast("Selected question not found.", "error");
      }
    },
    [questionStoreQuestions, questions, addQuestion, setSelectedQuestionIndex, router, showToast]
  );

  // Handler: Change Question Type.
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
          if (!currentQuestion) {
            showToast("No question selected.", "error");
            return;
          }
          // Update question type and reset relevant fields.
          updateQuestionFieldHandler(selectedQuestionIndex, "questionType", value as QuestionType);
          updateQuestionFieldHandler(selectedQuestionIndex, "questionText", "");
          updateQuestionFieldHandler(selectedQuestionIndex, "questionDescription", "");
          updateQuestionFieldHandler(selectedQuestionIndex, "options", [
            "Option 1",
            "Option 2",
            "Option 3",
            "Option 4",
          ]);
          updateQuestionFieldHandler(selectedQuestionIndex, "correctAnswer", null);
          updateQuestionFieldHandler(selectedQuestionIndex, "image", null);
          updateQuestionFieldHandler(selectedQuestionIndex, "imageOptions", [null, null, null, null]);
          // Set editing mode to true using the store setter.
          setIsEditing(true);
          showToast("Question type changed successfully.", "success");
          setError(null);
        } catch (err) {
          console.error("Error changing question type:", err);
          setError("Failed to change question type. Please try again.");
          showToast("Failed to change question type.", "error");
        } finally {
          setIsLoading(false);
        }
      }
    },
    [
      isEditing,
      currentQuestion,
      selectedQuestionIndex,
      updateQuestionFieldHandler,
      showToast,
      setIsEditing,
    ]
  );

  // Field Handlers.
  const handleQuestionTextChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      updateQuestionFieldHandler(selectedQuestionIndex, "questionText", e.target.value);
      if (validationErrors.questionText) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.questionText;
          return newErrors;
        });
      }
    },
    [selectedQuestionIndex, updateQuestionFieldHandler, validationErrors]
  );

  const handleDescriptionChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      updateQuestionFieldHandler(selectedQuestionIndex, "questionDescription", e.target.value);
      if (validationErrors.questionDescription) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.questionDescription;
          return newErrors;
        });
      }
    },
    [selectedQuestionIndex, updateQuestionFieldHandler, validationErrors]
  );

  const handleImageChange = useCallback(
    (image: string) => {
      setIsLoading(true);
      try {
        updateQuestionFieldHandler(selectedQuestionIndex, "image", image);
        showToast("Image updated successfully.", "success");
        if (validationErrors.image) {
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.image;
            return newErrors;
          });
        }
      } catch (err) {
        console.error("Error handling image change:", err);
        setError("Failed to update image. Please try again.");
        showToast("Failed to update image.", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedQuestionIndex, updateQuestionFieldHandler, showToast, validationErrors]
  );

  const handleImageRemove = useCallback(() => {
    updateQuestionFieldHandler(selectedQuestionIndex, "image", null);
    showToast("Image removed successfully.", "success");
    if (validationErrors.image) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  }, [selectedQuestionIndex, updateQuestionFieldHandler, showToast, validationErrors]);

  const handleCorrectAnswerChange = useCallback(
    (newAnswer: string) => {
      updateQuestionFieldHandler(selectedQuestionIndex, "correctAnswer", newAnswer);
      if (validationErrors.correctAnswer) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.correctAnswer;
          return newErrors;
        });
      }
    },
    [selectedQuestionIndex, updateQuestionFieldHandler, validationErrors]
  );

  const handleOptionSelect = useCallback(
    (index: number) => {
      if (!currentQuestion) {
        showToast("No question selected.", "error");
        return;
      }
      const selectedOptionText = currentQuestion.options[index] || null;
      updateQuestionFieldHandler(selectedQuestionIndex, "correctAnswer", selectedOptionText);
      if (validationErrors.correctAnswer) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.correctAnswer;
          return newErrors;
        });
      }
    },
    [currentQuestion, selectedQuestionIndex, updateQuestionFieldHandler, showToast, validationErrors]
  );

  const handleOptionChange = useCallback(
    (index: number, value: string) => {
      if (!currentQuestion) {
        showToast("No question selected.", "error");
        return;
      }
      const field = currentQuestion.questionType === QuestionType.MCQ ? "options" : "imageOptions";
      const updatedOptions = [...(currentQuestion[field] as (string | null)[])];
      updatedOptions[index] = value;
      updateQuestionFieldHandler(selectedQuestionIndex, field as keyof Question, updatedOptions);

      if (currentQuestion.correctAnswer === currentQuestion.options[index]) {
        updateQuestionFieldHandler(selectedQuestionIndex, "correctAnswer", value);
        if (validationErrors.correctAnswer) {
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.correctAnswer;
            return newErrors;
          });
        }
      }

      if (validationErrors[`option_${index}`]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`option_${index}`];
          return newErrors;
        });
      }
    },
    [currentQuestion, selectedQuestionIndex, updateQuestionFieldHandler, showToast, validationErrors]
  );

  const handleQuestionTextChangeForLayout = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      handleQuestionTextChange(e);
    },
    [handleQuestionTextChange]
  );

  // Navigation.
  const canGoNext = selectedQuestionIndex < questions.length - 1;
  const canGoPrevious = selectedQuestionIndex > 0;

  const navigateToPrevious = useCallback(() => {
    if (canGoPrevious) {
      const newIndex = selectedQuestionIndex - 1;
      setSelectedQuestionIndex(newIndex);
      router.push(`?question=${newIndex}`);
      setIsEditing(true);
    }
  }, [canGoPrevious, selectedQuestionIndex, setSelectedQuestionIndex, router, setIsEditing]);

  const navigateToNext = useCallback(() => {
    if (canGoNext) {
      const newIndex = selectedQuestionIndex + 1;
      setSelectedQuestionIndex(newIndex);
      router.push(`?question=${newIndex}`);
      setIsEditing(true);
    }
  }, [canGoNext, selectedQuestionIndex, setSelectedQuestionIndex, router, setIsEditing]);

  // Render the current question layout.
  const renderQuestionLayout = useCallback(
    (question: Question) => {
      return (
        <QuestionLayout
          question={question}
          isEditing={isEditing}
          validationErrors={validationErrors}
          handleOptionSelect={handleOptionSelect}
          handleImageChange={handleImageChange}
          handleImageRemove={handleImageRemove}
          handleOptionChange={handleOptionChange}
          handleQuestionTextChangeForLayout={handleQuestionTextChangeForLayout}
          handleDescriptionChange={handleDescriptionChange}
          handleCorrectAnswerChange={handleCorrectAnswerChange}
        />
      );
    },
    [
      isEditing,
      validationErrors,
      handleOptionSelect,
      handleImageChange,
      handleImageRemove,
      handleOptionChange,
      handleQuestionTextChangeForLayout,
      handleDescriptionChange,
      handleCorrectAnswerChange,
    ]
  );

  if (isAnyLoading || isLoading) {
    return (
      <div className="bg-white text-black flex flex-col items-center p-4 mt-2 rounded-3xl shadow border border-black laila-regular">
        <Skeleton
          className="rounded-3xl"
          sx={{ bgcolor: "#f2f2f2" }}
          variant="rectangular"
          width="100%"
          height="500px"
        />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white text-black flex flex-col items-center p-4 mt-2 rounded-3xl shadow border border-black laila-regular">
        <div className="flex flex-col md:flex-row items-center justify-between flex-wrap w-full gap-4">
          {/* Dropdown for Question Type */}
          <div className="w-full md:w-[30%]">
            <Dropdown
              isDynamic
              id="dropdown-2"
              items={Object.values(QuestionType).map((type) => ({
                id: type,
                name: type.replace(/_/g, " "),
              }))}
              label="प्रकार:"
              selected={currentQuestion?.questionType}
              buttonBgColor="bg-[#6378FD]"
              buttonBorderColor="border-black"
              buttonBorderWidth="border-[1.2px]"
              onSelect={(value) => handleQuestionTypeChange(value, "dropdown-2")}
              disabled={!currentQuestion}
            />
          </div>

          {/* Dropdown for Question Navigation */}
          <div className="flex md:w-[50%] text-center whitespace-nowrap md:ml-auto laila-bold">
            <Dropdown
              isDynamic
              id="questions-dropdown"
              items={questionStoreQuestions.map((question) => ({
                id: question.id,
                name: question.questionText || "Untitled",
              }))}
              label="प्रश्न:"
              selected={currentQuestion?.id}
              buttonBgColor="bg-[#6378FD]"
              buttonBorderColor="border-black"
              buttonBorderWidth="border-[1.2px]"
              onSelect={(value) => handleQuestionDropdownChange(value)}
              disabled={!questionStoreQuestions}
            />
          </div>
        </div>

        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Render the selected question layout or a fallback message */}
        {currentQuestion ? (
          <div className={`flex w-full ${!isEditing ? "pointer-events-none" : ""}`} aria-live="polite">
            {renderQuestionLayout(currentQuestion)}
          </div>
        ) : (
          <div className="text-red-500 text-lg mt-4">No questions available!</div>
        )}
      </div>

      {/* Navigation Buttons */}
      <fieldset className="flex flex-wrap gap-10 self-center mt-4 max-w-full w-[506px] mx-auto items-center justify-center border-none">
        <legend className="sr-only">Navigation buttons</legend>
        <NavButton
          imageSrc="/nav-left.png"
          tooltipText="मागील"
          onClick={navigateToPrevious}
          disabled={!canGoPrevious || isEditing || Object.keys(validationErrors).length > 0 || isLoading}
        />
        <NavButton
          imageSrc="/nav-right.png"
          tooltipText="पुढील"
          onClick={navigateToNext}
          disabled={!canGoNext || isEditing || Object.keys(validationErrors).length > 0 || isLoading}
        />
      </fieldset>
    </>
  );
};

export default Page;
