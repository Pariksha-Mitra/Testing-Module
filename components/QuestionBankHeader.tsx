// File: src/components/QuestionBankHeader.tsx

"use client";

import React from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import { useDropdowns } from "@/utils/hooks/useDropdowns";
import { useSession } from "next-auth/react";
import { ROLE } from "@/utils/types";

const QuestionBankHeader: React.FC = () => {
  const {
    selection,
    standards,
    subjects,
    chapters,
    exercises,
    isAnyLoading,
    errorMessages,
    handleSelect,
    handleAddOption,
  } = useDropdowns();

  const skeletonPlaceholders = ["skel-1", "skel-2", "skel-3", "skel-4"];
  const { data: session } = useSession();
  const role = session?.user.role;
  const isTeacher = role === ROLE.Teacher;
  return (
    <div
      className="
        bg-[#6378fd] 
        text-white 
        flex flex-col 
        items-center 
        p-4 
        rounded-lg 
        shadow
      "
    >
      {/* Title Section */}
      <div
        className="
          flex flex-wrap 
          items-center 
          justify-center 
          w-full 
          text-center 
          gap-4 
          sm:gap-2
        "
      >
        <Image
          src="/question.svg"
          alt="test-paper"
          width={80}
          height={80}
          className="max-sm:mb-2"
        />
        <p className="font-rozhaOne text-4xl sm:text-6xl md:text-8xl">
          प्रश्न संच
        </p>
        <Image
          src="/paper.svg"
          alt="test-paper"
          width={60}
          height={60}
          className="max-sm:mt-2"
        />
      </div>

      {/* Dropdowns Section */}
      <div
        className="
          flex flex-col 
          sm:flex-row 
          justify-between 
          w-full 
          mt-4 
          gap-2 
          laila-regular
        "
      >
        {isAnyLoading ? (
          <div className="flex flex-col sm:flex-row justify-between w-full mt-4 gap-2 laila-regular">
            {/* Skeleton placeholders */}
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
              disabled={false} // Since data is loaded
              allowAddOption={isTeacher}
              allowAddOptionText={"Add Standard"}
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
              allowAddOption={isTeacher}
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
              allowAddOption={isTeacher}
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
              allowAddOption={isTeacher}
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
  );
};

export default QuestionBankHeader;
