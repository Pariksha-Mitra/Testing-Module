"use client";

import React, {
  useCallback,
  useMemo,
  useEffect,
  ChangeEvent,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { QuestionType, Question } from "@/utils/types";
import { QuestionLayout } from "@/components/create-test/question-layouts/QuestionLayout";
import { NavButton } from "@/components/create-test/NavButton";
import { useToast } from "@/components/ui/ToastProvider";
import { Skeleton } from "@mui/material";
import Dropdown from "@/components/Dropdown/Dropdown";

// Import both stores
import { useCustomTestStore } from "@/store/useCustomTestStore";
import { useQuestionStore } from "@/store/useQuestionStore";
import { useDropdowns } from "@/utils/hooks/useDropdowns";

const Page: React.FC = () => {
  // Custom test store for rendering and editing the test questions.
  const {
    questions,
    selectedQuestionIndex,
    updateQuestion,
    deleteQuestion,
    setSelectedQuestionIndex,
    addQuestion,
  } = useCustomTestStore();

  // Use question-store to fetch the original questions.
  const { questions: questionStoreQuestions } = useQuestionStore();

  const { isAnyLoading } = useDropdowns();
  const router = useRouter();
  const pathname = usePathname();

  // Current question from custom-test-store
  const currentQuestion = questions[selectedQuestionIndex];
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Track previous pathname for unsaved changes warning.
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isEditing, setIsEditing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // ---------------------
  // Unsaved Changes Warning Logic
  // ---------------------
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    if (isEditing && prevPathname !== pathname) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?"
      );
      if (!confirmLeave) {
        router.push(prevPathname);
      } else {
        setPrevPathname(pathname);
      }
    } else {
      setPrevPathname(pathname);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditing, pathname, prevPathname, router]);

  // ---------------------
  // Helper: Update a field in the current question
  // ---------------------
  const updateQuestionFieldHandler = useCallback(
    <K extends keyof Question>(
      questionIndex: number,
      field: K,
      value: Question[K]
    ) => {
      // Update by passing a partial update.
      updateQuestion(questionIndex, { [field]: value } as Partial<Question>);
    },
    [updateQuestion]
  );

  // ---------------------
  // Validate the current question
  // ---------------------
  const validateQuestion = useCallback((): boolean => {
    const errors: { [key: string]: string } = {};

    if (!currentQuestion) {
      showToast("No question selected.", "error");
      return false;
    }

    if (!currentQuestion.questionText.trim()) {
      errors.questionText = "Question text cannot be empty.";
    }

    if (
      currentQuestion.questionDescription &&
      currentQuestion.questionDescription.length > 500
    ) {
      errors.questionDescription = "Description cannot exceed 500 characters.";
    }

    switch (currentQuestion.questionType) {
      case QuestionType.MCQ:
      case QuestionType.MCQ_IMG_TEXT:
      case QuestionType.MCQ_IMG_IMG:
      case QuestionType.MCQ_TEXT_IMG:
        currentQuestion.options.forEach((option, index) => {
          if (!option.trim()) {
            errors[`option_${index}`] = `Option ${index + 1} cannot be empty.`;
          }
        });

        const counts: { [key: string]: number } = {};
        currentQuestion.options.forEach((option) => {
          const trimmed = option.trim();
          if (trimmed) {
            counts[trimmed] = (counts[trimmed] || 0) + 1;
          }
        });
        currentQuestion.options.forEach((option, index) => {
          const trimmed = option.trim();
          if (trimmed && counts[trimmed] > 1) {
            errors[`option_${index}`] = "Each option must be unique.";
          }
        });

        if (
          currentQuestion.correctAnswer === null ||
          !currentQuestion.options.includes(currentQuestion.correctAnswer)
        ) {
          errors.correctAnswer = "A correct answer must be selected.";
        }
        break;

      case QuestionType.TRUE_FALSE:
        if (currentQuestion.correctAnswer === null) {
          errors.correctAnswer = "Please select True or False as the correct answer.";
        }
        break;

      case QuestionType.MATCH_THE_PAIRS:
        // Add specific validation as needed.
        break;

      case QuestionType.SUBJECTIVE_ANSWER:
        if (currentQuestion.questionText.length < 10) {
          errors.questionText = "Question text should be at least 10 characters long.";
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast(Object.values(errors)[0], "error");
      return false;
    }

    setValidationErrors({});
    return true;
  }, [currentQuestion, showToast]);

  // ---------------------
  // Handler: When a question is selected from the dropdown
  // (Fetch questions from question-store, then add/select it in custom-test-store)
  // ---------------------
  const handleQuestionDropdownChange = useCallback(
    (value: string | number, dropdownId: string) => {
      // Find the selected question in the question-store.
      const selected = questionStoreQuestions.find((q) => q.id === value);
      if (selected) {
        // Check if the question already exists in the custom-test-store.
        const customTestIndex = questions.findIndex((q) => q.id === selected.id);
        if (customTestIndex === -1) {
          // Add the question if not present.
          addQuestion(selected);
          // Since addQuestion may update the store asynchronously, assume new question is at the end.
          const newIndex = questions.length; // Note: Adjust based on your store implementation.
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
    [
      questionStoreQuestions,
      questions,
      addQuestion,
      setSelectedQuestionIndex,
      router,
      showToast,
    ]
  );

  // ---------------------
  // Handler: Change Question Type
  // ---------------------
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
          updateQuestionFieldHandler(selectedQuestionIndex, "imageOptions", [
            null,
            null,
            null,
            null,
          ]);

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
    [isEditing, currentQuestion, selectedQuestionIndex, updateQuestionFieldHandler, showToast]
  );

  // ---------------------
  // Field Handlers
  // ---------------------
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

  // ---------------------
  // Navigation
  // ---------------------
  const canGoNext = selectedQuestionIndex < questions.length - 1;
  const canGoPrevious = selectedQuestionIndex > 0;

  const navigateToPrevious = useCallback(() => {
    if (canGoPrevious) {
      const newIndex = selectedQuestionIndex - 1;
      setSelectedQuestionIndex(newIndex);
      router.push(`?question=${newIndex}`);
      setIsEditing(true);
    }
  }, [canGoPrevious, selectedQuestionIndex, setSelectedQuestionIndex, router]);

  const navigateToNext = useCallback(() => {
    if (canGoNext) {
      const newIndex = selectedQuestionIndex + 1;
      setSelectedQuestionIndex(newIndex);
      router.push(`?question=${newIndex}`);
      setIsEditing(true);
    }
  }, [canGoNext, selectedQuestionIndex, setSelectedQuestionIndex, router]);

  // ---------------------
  // Render the current question layout
  // ---------------------
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

  const buttonData = useMemo(() => {
    let editSaveLabel: string;
    let editSaveBgColor: string;

    if (isEditing) {
      if (currentQuestion?.isPersisted) {
        editSaveLabel = "UPDATE";
        editSaveBgColor = "bg-[#f9bc16]";
      } else {
        editSaveLabel = "SAVE";
        editSaveBgColor = "bg-[#6ad9a1]";
      }
    } else {
      editSaveLabel = "EDIT";
      editSaveBgColor = "bg-[#6378fd]";
    }

    return [
      {
        id: "edit-save",
        label: editSaveLabel,
        bgColor: editSaveBgColor,
      },
      {
        id: "delete",
        label: "DELETE",
        bgColor: "bg-[#f44144]",
      },
    ];
  }, [isEditing, currentQuestion?.isPersisted]);

  // If loading, only show the skeleton loader.
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
              disabled={ !currentQuestion }
            />
          </div>

          {/* Dropdown for Question Navigation using questions from question-store */}
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
              onSelect={(value) =>
                handleQuestionDropdownChange(value, "questions-dropdown")
              }
              disabled={!questionStoreQuestions}
            />
          </div>
        </div>

        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Render the selected question layout if available; otherwise, show a fallback message */}
        {currentQuestion ? (
          <div
            className={`flex w-full ${!isEditing ? "pointer-events-none" : ""}`}
            aria-live="polite"
          >
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
          disabled={
            !canGoPrevious ||
            isEditing ||
            Object.keys(validationErrors).length > 0 ||
            isLoading
          }
        />
        <NavButton
          imageSrc="/nav-right.png"
          tooltipText="पुढील"
          onClick={navigateToNext}
          disabled={
            !canGoNext ||
            isEditing ||
            Object.keys(validationErrors).length > 0 ||
            isLoading
          }
        />
      </fieldset>
    </>
  );
};

export default Page;
