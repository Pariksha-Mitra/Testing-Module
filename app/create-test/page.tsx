// app/create-test/page.tsx
"use client"; // Must be the first line

import Dropdown from '@/components/Dropdown/Dropdown';
import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { ActionButton } from '@/components/create-test/ActionButton';
import { GeneralQuestionLayout } from '@/components/create-test/question-layouts/GeneralQuestionLayout';
import MCQImgImgLayout from '@/components/create-test/question-layouts/MCQImgImgLayout';
import MCQImgTextLayout from '@/components/create-test/question-layouts/MCQImgTextLayout';
import MCQTextImgLayout from '@/components/create-test/question-layouts/MCQTextImgLayout';
import { NavButton } from '@/components/create-test/NavButton';
import { QuestionType } from '@/utils/types';
import { useQuestions } from '@/context/QuestionsContext';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname for tracking path changes

const Page: React.FC = () => {
  const {
    questions,
    setQuestions,
    selectedQuestionIndex,
    setSelectedQuestionIndex,
    isEditing, // Assuming isEditing is part of the context; if not, keep it as local state
    setIsEditing, // Similarly, adjust based on your context
  } = useQuestions();

  const router = useRouter();
  const pathname = usePathname();

  const currentQuestion = questions[selectedQuestionIndex];
  const [isLoading, setIsLoading] = useState(false);

  // Track previous pathname to detect route changes
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Unsaved Changes Warning Logic
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing) {
        e.preventDefault();
        e.returnValue = ''; // Required to trigger the confirmation dialog
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Detect in-app navigation by monitoring pathname changes
    if (isEditing) {
      if (prevPathname !== pathname) {
        const confirmLeave = window.confirm(
          'You have unsaved changes. Are you sure you want to leave this page?'
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
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEditing, pathname, prevPathname, router]);

  // Helper function to update any field in currentQuestion.content
  const updateQuestionField = useCallback(
    (
      questionIndex: number,
      field: keyof typeof currentQuestion.content,
      value: typeof currentQuestion.content[typeof field]
    ) => {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          content: {
            ...updatedQuestions[questionIndex].content,
            [field]: value,
          },
        };
        console.log(`Updating question ${questionIndex} field ${field} to`, value); // Debugging
        return updatedQuestions;
      });
    },
    [setQuestions, currentQuestion]
  );

  // Handler for changing the question type
  const handleQuestionTypeChange = useCallback(
    async (value: string | number, dropdownId: string) => {
      if (dropdownId === "dropdown-2") {
        setIsLoading(true);
        try {
          setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[selectedQuestionIndex] = {
              ...updatedQuestions[selectedQuestionIndex],
              type: value as QuestionType,
              content: {
                questionText: "",
                description: "",
                options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                correctAnswerIndex: null,
                image: null,
                imageOptions: [null, null, null, null],
              },
            };
            console.log(`Changing question type to`, value); // Debugging
            return updatedQuestions;
          });
        } catch (error) {
          console.error("Error changing question type:", error);
          // Optionally, set an error state to display to the user
        } finally {
          setIsLoading(false);
        }
      }
    },
    [selectedQuestionIndex, setQuestions, setIsLoading]
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
      } catch (error) {
        console.error("Error handling image change:", error);
        // Optionally, set an error state to display to the user
      } finally {
        setIsLoading(false);
      }
    },
    [selectedQuestionIndex, updateQuestionField]
  );

  const handleImageRemove = useCallback(() => {
    console.log("Handling main image removal"); // Debugging
    updateQuestionField(selectedQuestionIndex, "image", null); // Set to null
  }, [selectedQuestionIndex, updateQuestionField]);

  // Handlers for ImgMCQ
  const handleOptionSelect = useCallback(
    (index: number) => {
      console.log(`Selecting option ${index}`); // Debugging
      updateQuestionField(selectedQuestionIndex, "correctAnswerIndex", index);
    },
    [selectedQuestionIndex, updateQuestionField]
  );

  

  const handleOptionChange = useCallback(
    (index: number, value: string | null) => {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        const currentQ = updatedQuestions[selectedQuestionIndex];
  
        // If it's a plain MCQ, update `content.options`.
        // If it's an image-based MCQ, update `content.imageOptions`.
        if (currentQ.type === "MCQ") {
          const updatedOptions = [...(currentQ.content.options ?? [])];
          updatedOptions[index] = value ?? ""; // or just value if you prefer
          currentQ.content.options = updatedOptions;
        } else {
          // default: assume image-based
          const updatedImageOptions = [
            ...(currentQ.content.imageOptions ?? [null, null, null, null]),
          ];
          updatedImageOptions[index] = value;
          currentQ.content.imageOptions = updatedImageOptions;
        }
  
        updatedQuestions[selectedQuestionIndex] = {
          ...currentQ,
          content: { ...currentQ.content },
        };
  
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
  }, [questions]);

  // Buttons Data with unique ids
  const buttonData = useMemo(
    () => [
      {
        id: 'edit-save',
        label: isEditing ? "SAVE" : "EDIT",
        bgColor: isEditing ? "bg-[#6ad9a1]" : "bg-[#6378fd]",
      },
      {
        id: 'delete',
        label: "DELETE",
        bgColor: "bg-[#f44144]"
      },
    ],
    [isEditing]
  );

  const canGoNext = selectedQuestionIndex < questions.length - 1;
  const canGoPrevious = selectedQuestionIndex > 0;

  // Handler for action buttons with confirmation for delete
  const handleActionButtonClick = useCallback(
    async (buttonLabel: string) => {
      setIsLoading(true);
      try {
        if (buttonLabel === "EDIT") {
          setIsEditing(true);
        } else if (buttonLabel === "SAVE") {
          setIsEditing(false);
          // Optionally, perform save operations here
        } else if (buttonLabel === "DELETE") {
          const confirmDelete = window.confirm("Are you sure you want to delete this question?");
          if (!confirmDelete) return;

          setQuestions((prevQuestions) => {
            const updatedQuestions = prevQuestions.filter(
              (_, idx) => idx !== selectedQuestionIndex
            );
            console.log("Deleting question at index:", selectedQuestionIndex); // Debugging
            return updatedQuestions;
          });
          setSelectedQuestionIndex((prev) =>
            prev > 0 ? prev - 1 : 0
          );
        }
      } catch (error) {
        console.error(`Error performing action "${buttonLabel}":`, error);
        // Optionally, set an error state to display to the user
      } finally {
        setIsLoading(false);
      }
    },
    [selectedQuestionIndex, setQuestions, setSelectedQuestionIndex, setIsEditing]
  );

  // Helper function to render the appropriate question layout
  const renderQuestionLayout = useCallback(
    (
      question: typeof currentQuestion,
      isEditing: boolean,
      questionIndex: number
    ) => {
      switch (question.type) {
        case "MCQ (IMG-Text)":
          return (
            <MCQImgTextLayout
              questionIndex={questionIndex}
              questionDescription={question.content.description ?? ""}
              questionText={question.content.questionText ?? ""}
              image={question.content.image ?? null}
              options={question.content.options ?? []}
              selectedOption={question.content.correctAnswerIndex ?? null}
              onDescriptionChange={handleDescriptionChange}
              onQuestionTextChange={handleQuestionTextChange}
              onImageChange={handleImageChange}
              onImageRemove={handleImageRemove}
              onOptionSelect={handleOptionSelect}
              onOptionChange={handleOptionChange}
              editable={isEditing}
            />
          );

        case "MCQ (IMG-IMG)":
          return (
            <MCQImgImgLayout
              questionIndex={questionIndex}
              questionDescription={question.content.description ?? ""}
              image={question.content.image ?? null}
              imageOptions={question.content.imageOptions || [null, null, null, null]}
              selectedOption={question.content.correctAnswerIndex ?? null}
              onDescriptionChange={handleDescriptionChange}
              onImageChange={handleImageChange}
              onImageRemove={handleImageRemove}
              onOptionSelect={handleOptionSelect}
              onOptionChange={handleOptionChange}
              editable={isEditing}
            />
          );

        case "MCQ (Text-IMG)":
          return (
            <MCQTextImgLayout
              questionIndex={questionIndex}
              questionDescription={question.content.description ?? ""}
              questionText={question.content.questionText ?? ""}
              onQuestionTextChange={handleQuestionTextChangeForLayout}
              onDescriptionChange={handleDescriptionChange}
              editable={isEditing}
              imageOptions={question.content.imageOptions || [null, null, null, null]}
              selectedOption={question.content.correctAnswerIndex ?? null}
              onOptionSelect={handleOptionSelect}
              onOptionChange={handleOptionChange}
            />
          );

        default:
          return (
            <GeneralQuestionLayout
              questionIndex={questionIndex}
              questionType={question.type}
              questionText={question.content.questionText ?? ""}
              questionDescription={question.content.description ?? ""}
              onQuestionTextChange={handleQuestionTextChange}
              onDescriptionChange={handleDescriptionChange}
              onOptionSelect={handleOptionSelect} // Required for MCQ
              onOptionChange={handleOptionChange} // Required for MCQ
              options={question.content.options ?? []} // Required for MCQ
              selectedOption={question.content.correctAnswerIndex ?? null} // Required for MCQ
              editable={isEditing}
            />
          );
      }
    },
    [
      handleDescriptionChange,
      handleQuestionTextChange,
      handleImageChange,
      handleImageRemove,
      handleOptionSelect,
      handleOptionChange,
      handleQuestionTextChangeForLayout,
    ]
  );

  // Handlers for navigation buttons
  const navigateToPrevious = useCallback(() => {
    if (canGoPrevious) {
      console.log("Navigating to previous question");
      setSelectedQuestionIndex(selectedQuestionIndex - 1);
    }
  }, [canGoPrevious, selectedQuestionIndex, setSelectedQuestionIndex]);

  const navigateToNext = useCallback(() => {
    if (canGoNext) {
      console.log("Navigating to next question");
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
    }
  }, [canGoNext, selectedQuestionIndex, setSelectedQuestionIndex]);

  // Loading state handling
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

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
            {buttonData.map((button) => (
              <ActionButton
                key={button.id} // Use unique id as key
                label={button.label}
                bgColor={button.bgColor}
                onClick={() => handleActionButtonClick(button.label)}
              />
            ))}
          </div>
        </div>

        {/* Question Layout */}
        <div
          className={`flex w-full ${!isEditing ? "pointer-events-none opacity-80" : ""
            }`}
          aria-live="polite"
        >
          {/* Render the appropriate layout based on question type */}
          {renderQuestionLayout(currentQuestion, isEditing, selectedQuestionIndex)}
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
