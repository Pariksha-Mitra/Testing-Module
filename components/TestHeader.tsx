"use client";

import React, { useEffect } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import { useDropdowns } from "@/utils/hooks/useDropdowns";
import { useQuestionStore } from "@/store/useQuestionStore";
import { useSearchParams, useRouter } from "next/navigation";

const TestHeader: React.FC = () => {
  const {
    selection,
    standards,
    subjects,
    chapters,
    exercises,
    questions,
    isAnyLoading,
    errorMessages,
    handleSelect,
    handleAddOption,
    handleAddQuestion,
  } = useDropdowns();

  const { selectedQuestionIndex, setSelectedQuestionIndex, fetchQuestions } =
    useQuestionStore();

  const searchParams = useSearchParams();
  const questionIndexParam = searchParams.get("question");

  const router = useRouter();

  useEffect(() => {
    const initializeSelectedQuestion = async () => {
      if (questionIndexParam !== null) {
        const index = Number(questionIndexParam);
        if (!isNaN(index) && index >= 0 && index < questions.length) {
          // Ensure questions are fetched before setting the index
          if (questions.length === 0) {
            await fetchQuestions();
          }
          setSelectedQuestionIndex(index);
        }
      }
    };

    initializeSelectedQuestion();
  }, [
    questionIndexParam,
    setSelectedQuestionIndex,
    fetchQuestions,
    questions.length,
  ]);

  const skeletonPlaceholders = ["skel-1", "skel-2", "skel-3", "skel-4"];

  return (
    <div className="text-white rounded-lg">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Left Section: Dropdowns and Header */}
        <div className="flex flex-col items-center p-4 rounded-lg shadow bg-[#6378fd] w-full md:w-1/2">
          {/* Header */}
          <div className="flex items-center justify-center w-full text-center gap-8">
            <Image
              src="/test-paper.png"
              alt="test-paper"
              width={70}
              height={70}
            />
            <h1 className="text-7xl rozha-one-regular">चाचणी तयार करा</h1>
          </div>

          {/* Dropdowns */}
          <div className="flex flex-wrap justify-between w-full mr-3 ml-3 gap-2">
            {isAnyLoading ? (
              <div className="grid grid-cols-2 gap-4 w-full">
                {skeletonPlaceholders.map((skeletonKey) => (
                  <Skeleton
                    key={skeletonKey}
                    sx={{ bgcolor: "#a6b1ff" }}
                    variant="rectangular"
                    width="100%"
                    height={45}
                    className="rounded-[20px]"
                    animation="wave"
                  />
                ))}
              </div>
            ) : (
              <>
                {/* Standard Dropdown */}
                <Dropdown
                  isDynamic
                  id="standard-dropdown"
                  items={standards}
                  label="इयत्ता:"
                  selected={selection.standard ?? undefined}
                  buttonBgColor="bg-[#fc708a]"
                  buttonBorderColor="border-white"
                  buttonBorderWidth="border-[2px]"
                  onSelect={(val) => handleSelect(val, "standard")}
                  className="sm:w-[48%]"
                  disabled={false}
                  allowAddOption={true}
                  allowAddOptionText="Add Standard"
                  onAddOption={(newOptionName) =>
                    handleAddOption(newOptionName, "standard")
                  }
                />

                {/* Subject Dropdown */}
                <Dropdown
                  isDynamic
                  id="subject-dropdown"
                  items={subjects}
                  label="विषय:"
                  selected={selection.subject ?? undefined}
                  buttonBgColor="bg-[#fc708a]"
                  buttonBorderColor="border-white"
                  buttonBorderWidth="border-[2px]"
                  onSelect={(val) => handleSelect(val, "subject")}
                  className="sm:w-[48%]"
                  disabled={!selection.standard}
                  allowAddOption={true}
                  allowAddOptionText="Add Subject"
                  onAddOption={(newOptionName) =>
                    handleAddOption(newOptionName, "subject")
                  }
                />

                {/* Chapter Dropdown */}
                <Dropdown
                  isDynamic
                  id="chapter-dropdown"
                  items={chapters}
                  label="धडा:"
                  selected={selection.chapter ?? undefined}
                  buttonBgColor="bg-[#fc708a]"
                  buttonBorderColor="border-white"
                  buttonBorderWidth="border-[2px]"
                  onSelect={(val) => handleSelect(val, "chapter")}
                  className="sm:w-[48%]"
                  disabled={!selection.subject}
                  allowAddOption={true}
                  allowAddOptionText="Add Chapter"
                  onAddOption={(newOptionName) =>
                    handleAddOption(newOptionName, "chapter")
                  }
                />

                {/* Exercise Dropdown */}
                <Dropdown
                  isDynamic
                  id="exercise-dropdown"
                  items={exercises}
                  label="अभ्यास:"
                  selected={selection.exercise ?? undefined}
                  buttonBgColor="bg-[#fc708a]"
                  buttonBorderColor="border-white"
                  buttonBorderWidth="border-[2px]"
                  onSelect={(val) => handleSelect(val, "exercise")}
                  className="sm:w-[48%]"
                  disabled={!selection.chapter}
                  allowAddOption={true}
                  allowAddOptionText="Add Exercise"
                  onAddOption={(newOptionName) =>
                    handleAddOption(newOptionName, "exercise")
                  }
                />
              </>
            )}
          </div>

          {/* Error Messages */}
          {errorMessages.length > 0 && (
            <div className="mt-2">
              {errorMessages.map((msg, idx) => (
                <div key={`${msg}-${idx}`} className="text-red-500 text-sm">
                  {msg}
                </div>
              ))}
            </div>
          )}

          {/* Empty Data Messages */}
          {!isAnyLoading && selection.standard && subjects.length === 0 && (
            <div className="mt-2 text-yellow-500 text-sm">
              No subjects available for the selected standard.
            </div>
          )}
          {!isAnyLoading && selection.subject && chapters.length === 0 && (
            <div className="mt-2 text-yellow-500 text-sm">
              No chapters available for the selected subject.
            </div>
          )}
          {!isAnyLoading && selection.chapter && exercises.length === 0 && (
            <div className="mt-2 text-yellow-500 text-sm">
              No exercises available for the selected chapter.
            </div>
          )}
        </div>

        {/* Right Section: Question Navigation */}
        <div className="flex flex-col p-4 rounded-lg shadow bg-[#6378fd] w-full md:w-1/2">
          <div className="grid grid-cols-7 gap-4 p-4">
            {questions.map((question, index) => (
              <button
                key={question.id || index}
                className={`flex pt-1 laila-semibold items-center justify-center ${
                  selectedQuestionIndex === index
                    ? "bg-green-400"
                    : "bg-[#a6b1ff]"
                } w-10 h-10 text-white rounded-full font-bold`}
                onClick={() => {
                  // Update state...
                  setSelectedQuestionIndex(index);
                  // Update the URL query parameter "question"
                  router.push(`?question=${index}`);
                }}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="flex items-center justify-center bg-[#a6b1ff] w-10 h-10 rounded-full cursor-pointer"
              // When adding a new question, update the URL as well.
              onClick={async () => {
                // Capture the current length as the new question's index.
                const currentLength = questions.length;
                // Add a new question.
                await handleAddQuestion();
                // Set the newly added question as selected.
                setSelectedQuestionIndex(currentLength);
                // Update the URL query parameter "question" to the new index.
                router.push(`?question=${currentLength}`);
              }}
              disabled={!selection.exercise}
              title={
                !selection.exercise
                  ? "Select an exercise first"
                  : "Add Question"
              }
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 44 44"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.098 43.3068V0.147724H24.9276V43.3068H19.098ZM0.416193 24.625V18.8295H43.6094V24.625H0.416193Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHeader;
