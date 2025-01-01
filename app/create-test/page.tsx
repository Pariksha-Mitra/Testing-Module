"use client";
import React, { useCallback, useMemo, useState } from "react";
import Dropdown from "@/components/create-test/dropdown";
import { NavButton } from "@/components/create-test/NavButton";
import MCQ from "@/components/create-test/MCQ";
import MatchThePairs from "@/components/create-test/match-the-pairs/MatchThePairs";

const Page = () => {
  // This state tracks the selected question type from the dropdown
  const [questionType, setQuestionType] = useState("MCQ");

  // Handle dropdown change
  const handleSelect = useCallback(
    (value: string | number, dropdownId: string) => {
      console.log(`Dropdown ID: ${dropdownId}, Selected value: ${value}`);

      // If the user is selecting from the "question type" dropdown, update `questionType`.
      if (dropdownId === "dropdown-2") {
        setQuestionType(value as string);
      }
    },
    [setQuestionType]
  );

  const QuestionTypeDropdownItems = useMemo(
    () => ["MCQ", "Image Question", "Match The Pairs", "Subjective Answer"],
    []
  );
  const QuestionsDropdownItems = useMemo(
    () => [
      "(q. no. / q. type) : question description",
      "(q. no. / q. type) : question description",
      "(q. no. / q. type) : question description",
    ],
    []
  );

  return (
    <>
      <div className="bg-white text-black flex flex-col items-center p-4 mt-2 rounded-3xl shadow  border border-black laila-regular">
        <div className="flex flex-col md:flex-row items-center justify-around flex-wrap w-full gap-4">
          {/* Dropdown (प्रकार:) */}
          <div className="w-full md:w-[30%]">
            <label htmlFor="dropdown-2" className="sr-only">
              प्रकार:
            </label>
            <Dropdown
              id="dropdown-2"
              items={QuestionTypeDropdownItems}
              label="प्रकार:"
              defaultValue={questionType}
              onSelect={(value) => handleSelect(value, "dropdown-2")}
              width="100%"
              className="text-lg"
            />
          </div>

          {/* Dropdown 3 (प्रश्न:) */}
          <div className="w-full md:w-[68%]">
            <label htmlFor="dropdown-3" className="sr-only">
              प्रश्न:
            </label>
            <Dropdown
              id="dropdown-3"
              items={QuestionsDropdownItems}
              label="प्रश्न:"
              defaultValue={"(q. no. / q. type) : question description"}
              onSelect={(value) => handleSelect(value, "dropdown-3")}
              width="100%"
              className="text-lg"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row px-3 py-3 mt-6 w-full border border-black max-md:px-5 max-md:max-w-full space-y-3 md:space-y-0 md:space-x-3">

          {/* First Column: Q1 */}
          <div className="w-full md:w-[3%] p-3 mr-2 text-lg">
            {"Q1"}
          </div>

          {/* Second Column: Question Details */}
          <div className="flex flex-col w-full md:w-full space-y-3">

            {/* Question Text */}
            <div className="px-4 py-4 mt-2.5 w-full border border-black border-solid max-md:px-5 max-md:max-w-full">
              <p>Question text here</p>
            </div>

            {/* Description */}
            <div className="px-4 py-4 mt-2.5 w-full border border-black border-solid max-md:px-5 max-md:max-w-full">
              <p>Description here</p>
            </div>

            {/* Question Type */}
            <div className=" w-full max-md:px-5">
              {questionType === "MCQ" && <MCQ />}

              {questionType === "Image Question" && (
                <div className="bg-green-100 p-2">
                  <h2 className="font-bold">Image Question</h2>
                  {/* Add your Image Question content here */}
                </div>
              )}

              {questionType === "Match The Pairs" && <MatchThePairs />}

              {questionType === "Subjective Answer" && (
                <div className="bg-red-100 p-2">
                  <h2 className="font-bold">Subjective Answer</h2>
                  {/* Add your Subjective Answer content here */}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      <div className="flex space-x-4 mt-2 w-[30%] text-white items-center justify-center mx-auto">
        
      </div>

      <div 
      className="flex flex-wrap gap-10 self-center mt-4 max-w-full w-[506px] mx-auto items-center justify-center"
      role="group"
      aria-label="Navigation cards"
    >
<NavButton imageSrc="/nav-left.png" onClick={() => { }} />
<NavButton imageSrc="/nav-right.png" onClick={() => { }} />
    </div>
    </>
  );
};

export default Page;