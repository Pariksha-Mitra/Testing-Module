"use client";

import React, {
  useCallback,
  useMemo,
  useEffect,
  ChangeEvent,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { QuestionType, Question, Payload } from "@/utils/types";
import { QuestionLayout } from "@/components/create-test/question-layouts/QuestionLayout";
import { ActionButton } from "@/components/create-test/ActionButton";
import { NavButton } from "@/components/create-test/NavButton";
import { useToast } from "@/components/ui/ToastProvider";
import { Skeleton } from "@mui/material";
import Dropdown from "@/components/Dropdown/Dropdown";

// Import Zustand Stores
import { useQuestionStore } from "@/store/useQuestionStore";
import { useDropdowns } from "@/utils/hooks/useDropdowns";

// Define a separate QuestionLayout component for better modularity

const Page: React.FC = () => {
  // Accessing Questions Store
  const {
    questions,
    selectedQuestionIndex,
    deleteQuestion,
    updateQuestionField,
    setSelectedQuestionIndex,
  } = useQuestionStore();

  const { isAnyLoading } = useDropdowns();

  const router = useRouter();
  const pathname = usePathname();

  const currentQuestion = questions[selectedQuestionIndex];

  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast(); // Assuming you have a toast provider

  // Track previous pathname to detect route changes
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isEditing, setIsEditing] = useState(false);

  // General Error State
  const [error, setError] = useState<string | null>(null);

  // Validation State
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Unsaved Changes Warning Logic
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing) {
        e.preventDefault();
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
  const updateQuestionFieldHandler = useCallback(
    (
      questionIndex: number,
      field: keyof Question,
      value: Question[keyof Question]
    ) => {
      updateQuestionField(questionIndex, field, value);
    },
    [updateQuestionField]
  );

  // Validation Function
  const validateQuestion = useCallback((): boolean => {
    const errors: { [key: string]: string } = {};

    if (!currentQuestion) {
      showToast("No question selected.", "error");
      return false;
    }

    // Validate questionText
    if (!currentQuestion.questionText.trim()) {
      errors.questionText = "Question text cannot be empty.";
    }

    // Validate description (optional, but example rule)
    if (
      currentQuestion.description &&
      currentQuestion.description.length > 500
    ) {
      errors.description = "Description cannot exceed 500 characters.";
    }

    // Validate based on question type
    switch (currentQuestion.questionType) {
      case QuestionType.MCQ:
      case QuestionType.MCQ_IMG_TEXT:
      case QuestionType.MCQ_IMG_IMG:
      case QuestionType.MCQ_TEXT_IMG:
        // Ensure no empty options
        currentQuestion.options.forEach((option, index) => {
          if (!option.trim()) {
            errors[`option_${index}`] = `Option ${index + 1} cannot be empty.`;
          }
        });

        // Ensure a correct answer is selected
        if (
          currentQuestion.correctAnswer === null ||
          !currentQuestion.options.includes(currentQuestion.correctAnswer)
        ) {
          errors.correctAnswer = "A correct answer must be selected.";
        }

        break;

      case QuestionType["TRUE_FALSE"]:
        // For True/False, ensure an answer is selected
        if (currentQuestion.correctAnswer === null) {
          errors.correctAnswer =
            "Please select True or False as the correct answer.";
        }
        break;

      case QuestionType["MATCH_THE_PAIRS"]:
        // Implement specific validations for Match The Pairs
        // Example: Ensure there are pairs defined
        // Add your own validation logic here
        break;

      case QuestionType["SUBJECTIVE_ANSWER"]:
        // For subjective answers, ensure questionText is descriptive enough
        if (currentQuestion.questionText.length < 10) {
          errors.questionText =
            "Question text should be at least 10 characters long.";
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Display the first error as a toast
      const firstError = Object.values(errors)[0];
      showToast(firstError, "error");
      return false;
    }

    // No errors
    setValidationErrors({});
    return true;
  }, [currentQuestion, showToast]);

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
          if (!currentQuestion) {
            showToast("No question selected.", "error");
            return;
          }

          // Update question type and reset relevant fields
          updateQuestionFieldHandler(
            selectedQuestionIndex,
            "questionType",
            value as QuestionType
          );
          updateQuestionFieldHandler(selectedQuestionIndex, "questionText", "");
          updateQuestionFieldHandler(selectedQuestionIndex, "description", "");
          updateQuestionFieldHandler(selectedQuestionIndex, "options", [
            "Option 1",
            "Option 2",
            "Option 3",
            "Option 4",
          ]);
          updateQuestionFieldHandler(
            selectedQuestionIndex,
            "correctAnswer",
            null
          );
          updateQuestionFieldHandler(selectedQuestionIndex, "image", null);
          updateQuestionFieldHandler(selectedQuestionIndex, "imageOptions", [
            null,
            null,
            null,
            null,
          ]);

          setIsEditing(false); // Reset editing state after type change
          showToast("Question type changed successfully.", "success");
        } catch (error) {
          console.error("Error changing question type:", error);
          setError("Failed to change question type. Please try again."); // Set general error
          showToast("Failed to change question type.", "error");
        } finally {
          setIsLoading(false);
        }
      }
    },
    [
      isEditing,
      setIsEditing,
      selectedQuestionIndex,
      updateQuestionFieldHandler,
      showToast,
      currentQuestion,
    ]
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

  // Handlers for question fields with error clearing
  const handleQuestionTextChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      updateQuestionFieldHandler(
        selectedQuestionIndex,
        "questionText",
        e.target.value
      );

      // Clear the questionText error if it exists
      if (validationErrors.questionText) {
        setValidationErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.questionText;
          return newErrors;
        });
      }
    },
    [selectedQuestionIndex, updateQuestionFieldHandler, validationErrors]
  );

  const handleDescriptionChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      updateQuestionFieldHandler(
        selectedQuestionIndex,
        "description",
        e.target.value
      );

      // Clear the description error if it exists
      if (validationErrors.description) {
        setValidationErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.description;
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
        console.log("Handling main image change:", image); // Debugging
        updateQuestionFieldHandler(selectedQuestionIndex, "image", image);
        showToast("Image updated successfully.", "success");

        // Clear the image error if it exists (if any)
        if (validationErrors.image) {
          setValidationErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.image;
            return newErrors;
          });
        }
      } catch (error) {
        console.error("Error handling image change:", error);
        setError("Failed to update image. Please try again."); // Set general error
        showToast("Failed to update image.", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [
      selectedQuestionIndex,
      updateQuestionFieldHandler,
      showToast,
      validationErrors,
    ]
  );

  const handleImageRemove = useCallback(() => {
    console.log("Handling main image removal"); // Debugging
    updateQuestionFieldHandler(selectedQuestionIndex, "image", null);
    showToast("Image removed successfully.", "success");

    // Clear the image error if it exists (if any)
    if (validationErrors.image) {
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.image;
        return newErrors;
      });
    }
  }, [
    selectedQuestionIndex,
    updateQuestionFieldHandler,
    showToast,
    validationErrors,
  ]);

  // Handler to update correctAnswer when an option is selected
  const handleCorrectAnswerChange = useCallback(
    (newAnswer: string) => {
      updateQuestionFieldHandler(
        selectedQuestionIndex,
        "correctAnswer",
        newAnswer
      );

      // Clear the correctAnswer error if it exists
      if (validationErrors.correctAnswer) {
        setValidationErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.correctAnswer;
          return newErrors;
        });
      }
    },
    [selectedQuestionIndex, updateQuestionFieldHandler, validationErrors]
  );

  // Handlers for options with error clearing
  const handleOptionSelect = useCallback(
    (index: number) => {
      if (!currentQuestion) {
        showToast("No question selected.", "error");
        return;
      }
      const selectedOptionText = currentQuestion.options[index] || null;
      updateQuestionFieldHandler(
        selectedQuestionIndex,
        "correctAnswer",
        selectedOptionText
      );

      // Clear the correctAnswer error if it exists
      if (validationErrors.correctAnswer) {
        setValidationErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.correctAnswer;
          return newErrors;
        });
      }
    },
    [
      currentQuestion,
      selectedQuestionIndex,
      updateQuestionFieldHandler,
      showToast,
      validationErrors,
    ]
  );

  const handleOptionChange = useCallback(
    (index: number, value: string) => {
      if (!currentQuestion) {
        showToast("No question selected.", "error");
        return;
      }
      const field =
        currentQuestion.questionType === QuestionType.MCQ
          ? "options"
          : "imageOptions";
      const updatedOptions = [...(currentQuestion[field] as (string | null)[])];
      updatedOptions[index] = value;

      updateQuestionFieldHandler(
        selectedQuestionIndex,
        field as keyof Question,
        updatedOptions
      );

      // If the changed option was the correct answer, update correctAnswer
      if (currentQuestion.correctAnswer === currentQuestion.options[index]) {
        updateQuestionFieldHandler(
          selectedQuestionIndex,
          "correctAnswer",
          value
        );

        // Clear the correctAnswer error if it exists
        if (validationErrors.correctAnswer) {
          setValidationErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.correctAnswer;
            return newErrors;
          });
        }
      }

      // Clear the specific option error if it exists
      if (validationErrors[`option_${index}`]) {
        setValidationErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[`option_${index}`];
          return newErrors;
        });
      }
    },
    [
      currentQuestion,
      selectedQuestionIndex,
      updateQuestionFieldHandler,
      showToast,
      validationErrors,
    ]
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
    console.log("Questions:", questions);
    console.log("Selected Question Index:", selectedQuestionIndex);
    console.log("Current Question:", currentQuestion);
  }, [questions, selectedQuestionIndex, currentQuestion]);

  // -------------------- Action Handlers Refactored --------------------

  // Handler for EDIT action
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    showToast("Editing enabled.", "info");
  }, [showToast]);

  // Handler for SAVE or UPDATE action
  const handleSaveOrUpdate = useCallback(async () => {
    // Perform validation
    const isValid = validateQuestion();
    if (!isValid) return;

    if (!currentQuestion) {
      showToast("No question selected.", "error");
      return;
    }

    // Prepare payload
    const payload: Payload = {
      questionText: currentQuestion.questionText,
      questionDescription: currentQuestion.description,
      questionType: currentQuestion.questionType,
      answerFormat: currentQuestion.answerFormat,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer,
      numericalAnswer: currentQuestion.numericalAnswer,
      image: currentQuestion.image,
      imageOptions: currentQuestion.imageOptions?.filter((option): option is string => option !== null), // Filter out null values
    };

    // If the question is persisted, include the ID in the payload
    if (currentQuestion.isPersisted) {
      payload.id = currentQuestion.id;
    } else {
      payload.standardId = currentQuestion.standardId;
      payload.subjectId = currentQuestion.subjectId;
      payload.chapterId = currentQuestion.chapterId;
      payload.exerciseId = currentQuestion.exerciseId;
    }

    console.log("Payload:", JSON.stringify(payload));

    // Determine the HTTP method and endpoint
    const method = currentQuestion.isPersisted ? "PATCH" : "POST";
    const endpoint = "/api/questions";

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Question saved successfully.", "success");
        setIsEditing(false);

        if (currentQuestion.isPersisted) {
          // Update the local store with the updated question fields
          const updatedFields: Partial<Question> = {
            questionText: data.question.questionText,
            questionType: data.question.questionType,
            answerFormat: data.question.answerFormat,
            options: data.question.options,
            correctAnswer: data.question.correctAnswer,
            numericalAnswer: data.question.numericalAnswer,
          };

          Object.entries(updatedFields).forEach(([field, value]) => {
            updateQuestionFieldHandler(
              selectedQuestionIndex,
              field as keyof Question,
              value as Question[keyof Question]
            );
          });
        } else {
          // For newly created questions, mark them as persisted
          updateQuestionFieldHandler(
            selectedQuestionIndex,
            "id",
            data.question._id
          );
          updateQuestionFieldHandler(
            selectedQuestionIndex,
            "isPersisted",
            true
          );
        }
      } else {
        const errorMsg = data.error || "Failed to save changes.";
        showToast(errorMsg, "error");
        setError(errorMsg);
      }
    } catch (error) {
      console.error(`Error performing action "SAVE" or "UPDATE":`, error);
      setError(`An error occurred while performing "SAVE". Please try again.`);
      showToast(`An error occurred while performing "SAVE".`, "error");
    }
  }, [
    validateQuestion,
    showToast,
    currentQuestion,
    selectedQuestionIndex,
    updateQuestionFieldHandler,
  ]);

  // Handler for DELETE action
  const handleDelete = useCallback(async () => {
    if (!currentQuestion) {
      showToast("No question selected.", "error");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirmDelete) return;

    if (!currentQuestion.id) {
      showToast("Invalid question ID.", "error");
      return;
    }

    if (currentQuestion.isPersisted) {
      // Persisted question: Make DELETE request to backend
      console.log("Deleting persisted question with id:", currentQuestion.id);

      try {
        const response = await fetch(
          `/api/questions?id=${currentQuestion.id}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          deleteQuestion(selectedQuestionIndex);
          showToast("Question deleted successfully.", "success");
        } else {
          const errorMsg = data.error || "Failed to delete the question.";
          showToast(errorMsg, "error");
        }
      } catch (error) {
        console.error("Error deleting persisted question:", error);
        setError("Failed to delete the question. Please try again.");
        showToast("Failed to delete the question.", "error");
      }
    } else {
      // Unsaved question: Remove from UI only
      console.log("Removing unsaved question with id:", currentQuestion.id);

      deleteQuestion(selectedQuestionIndex);
      showToast("Question removed successfully.", "success");
    }
  }, [currentQuestion, selectedQuestionIndex, deleteQuestion, showToast]);

  // Main Action Button Click Handler
  const handleActionButtonClick = useCallback(
    async (buttonLabel: string) => {
      setIsLoading(true);
      try {
        switch (buttonLabel) {
          case "EDIT":
            handleEdit();
            break;
          case "SAVE":
          case "UPDATE":
            await handleSaveOrUpdate();
            break;
          case "DELETE":
            await handleDelete();
            break;
          default:
            console.error(`Unknown action: "${buttonLabel}"`);
            showToast(`Unknown action: "${buttonLabel}"`, "error");
            break;
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
    [handleEdit, handleSaveOrUpdate, handleDelete, showToast]
  );

  // -------------------- Delete Question Function --------------------
  // Note: Already handled in `handleDelete` above
  // Remove this if not needed
  // -------------------- End Delete Function --------------------

  // -------------------- Navigation Handlers --------------------
  const canGoNext = selectedQuestionIndex < questions.length - 1;
  const canGoPrevious = selectedQuestionIndex > 0;

  const navigateToPrevious = useCallback(() => {
    if (canGoPrevious) {
      setSelectedQuestionIndex(selectedQuestionIndex - 1);
      setIsEditing(false); // Reset editing state when navigating
    }
  }, [canGoPrevious, selectedQuestionIndex, setSelectedQuestionIndex]);

  const navigateToNext = useCallback(() => {
    if (canGoNext) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
      setIsEditing(false); // Reset editing state when navigating
    }
  }, [canGoNext, selectedQuestionIndex, setSelectedQuestionIndex]);
  // -------------------- End Navigation Handlers --------------------

  // -------------------- Rendering Question Layout --------------------
  // Utilize the extracted QuestionLayout component
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
  // -------------------- End Rendering Question Layout --------------------

  // -------------------- Button Data --------------------
  // Modify button labels based on editing state and persistence
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

  // -------------------- End Button Data --------------------

  // -------------------- Loading State Handling --------------------
  if (isLoading || isAnyLoading) {
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
  // -------------------- End Loading State Handling --------------------

  // -------------------- No Questions Handling --------------------
  // Prevent rendering if there are no questions
  if (!Array.isArray(questions) || questions.length === 0 || isAnyLoading) {
    return (
      <div className="bg-white text-black flex flex-col items-center p-4 mt-2 rounded-3xl shadow border border-black laila-regular">
        <div className="text-red-500 text-lg">No questions available!</div>
      </div>
    );
  }
  // -------------------- End No Questions Handling --------------------

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
              selected={currentQuestion?.questionType}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(value) =>
                handleQuestionTypeChange(value, "dropdown-2")
              }
              disabled={!isEditing || !currentQuestion}
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
                disabled={
                  (button.label === "SAVE" && !isEditing) ||
                  (button.label === "UPDATE" && !isEditing) ||
                  (button.label === "DELETE" && isEditing) ||
                  isLoading
                }
              />
            ))}
          </div>
        </div>

        {/* Display General Error */}
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Question Layout */}
        <div
          className={`flex w-full ${!isEditing ? "pointer-events-none " : ""}`}
          aria-live="polite"
        >
          {renderQuestionLayout(currentQuestion)}
        </div>
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
