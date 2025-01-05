"use client";
import React, { useCallback, useMemo, useState } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import { NavButton } from "@/components/create-test/NavButton";
import { ActionButton } from "@/components/create-test/ActionButton";
import MCQ from "@/components/create-test/MCQ";
import MatchThePairs from "@/components/create-test/match-the-pairs/MatchThePairs";
import TrueFalseComponent from "@/components/create-test/TrueFalse";
import ImgMCQ from "@/components/create-test/ImgMCQ";

const Page = () => {
  // This state tracks the selected question type from the dropdown
  const [questionType, setQuestionType] = useState("MCQ");

  const [questionText, setQuestionText] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");

  // Handle dropdown change
  const handleSelect = useCallback(
    (value: string | number, dropdownId: string) => {
      console.log(`Dropdown ID: ${dropdownId}, Selected value: ${value}`);
      // If the user is selecting from the "question type" dropdown, update `questionType`.
      if (dropdownId === "dropdown-2") {
        setQuestionType(value as string);
      }
    },
    []
  );

  // Include the new item "MCQ (IMG-Text)"
  const QuestionTypeDropdownItems = useMemo(
    () => [
      "MCQ",
      "MCQ (IMG-Text)",
      "MCQ (IMG-IMG)",
      "MCQ (Text-IMG)",
      "True/False",
      "Match The Pairs",
      "Subjective Answer",
    ],
    []
  );

  const buttonData = [
    { label: "EDIT", bgColor: "bg-[#6378fd]" },
    { label: "SAVE", bgColor: "bg-[#6ad9a1]" },
    { label: "DELETE", bgColor: "bg-[#f44144]" },
  ];

  // Handle question text change
  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
  };

  // Handle question description change
  const handleQuestionDescriptionChange = (value: string) => {
    setQuestionDescription(value);
  };

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
              defaultValue={questionType}
              onSelect={(value) => handleSelect(value, "dropdown-2")}
              width="100%"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-6 text-center whitespace-nowrap rounded-3xl md:ml-auto laila-bold">
            {buttonData.map((button, index) => (
              <ActionButton
                key={index}
                label={button.label}
                bgColor={button.bgColor}
                onClick={() => console.log(`${button.label} clicked`)}
              />
            ))}
          </div>
        </div>

        {/*
          Split into four checks now:
            - MCQ (IMG-Text)
            - MCQ (IMG-IMG)
            - MCQ (Text-IMG)
            - Everything else
        */}
        {questionType === "MCQ (IMG-Text)" ? (
          // --- Layout for "MCQ (IMG-Text)" ---
          <>
            <div className="flex flex-col md:flex-row px-3 py-3 mt-6 w-full border border-black">
              {/* Left Column: Question Number */}
              <div className="w-full md:w-[3%] p-3 text-lg">Q1</div>

              {/* Right Content: Input, Text Areas, and MCQ */}
              <div className="flex flex-col w-full space-y-3">
                {/* Top Section: Input and Text Areas */}
                <div className="flex flex-col md:flex-row w-full space-y-3 md:space-y-0 md:space-x-3">
                  {/* Left: Image Input */}
                  <div className="flex flex-col w-full md:w-1/2 border border-black h-[216px] items-center justify-center">
                    <input
                      type="file"
                      className="w-full p-2"
                      // Add onChange handler if needed
                    />
                  </div>

                  {/* Right: Text Areas */}
                  <div className="flex flex-col w-full md:w-1/2 space-y-3">
                    <textarea
                      style={{ resize: "none" }}
                      rows={3}
                      className="w-full p-2 border border-black"
                      placeholder="Add question description here"
                    />
                    <textarea
                      style={{ resize: "none" }}
                      rows={4}
                      className="w-full p-2 border border-black"
                      placeholder="Enter the question text here"
                    />
                  </div>
                </div>

                {/* Bottom Section: MCQ */}
                <div className="w-full ">
                  <MCQ />
                </div>
              </div>
            </div>
          </>
        ) : questionType === "MCQ (IMG-IMG)" ? (
          // --- Layout for "MCQ (IMG-IMG)" ---
          <div className="flex flex-col md:flex-row px-3 py-3 mt-6 w-full border border-black space-y-3 md:space-y-0 md:space-x-3">
            {/* First Column: Q1 */}
            <div className="w-full md:w-[3%] p-3 mr-2 text-lg">{"Q1"}</div>

            {/* Second Column: Split in half for two images, etc. */}
            <div className="flex flex-col md:flex-row w-full space-y-3 md:space-y-0 md:space-x-3">
              {/* Left part: Upload an image + question description */}
              <div className="flex flex-col w-full md:w-1/2 space-y-1">
                <div className="h-[390px] text-center w-full border border-black">
                  <input
                    type="file"
                    value={questionText}
                    onChange={(e) => handleQuestionChange(e.target.value)}
                    className="w-full p-2"
                    placeholder="Insert image here"
                  />
                </div>

                <div className="w-full h-[100px]">
                  <textarea
                    style={{ resize: "none" }}
                  
                    value={questionDescription}
                    onChange={(e) =>
                      handleQuestionDescriptionChange(e.target.value)
                    }
                    className="w-full p-2 h-[100px]  border border-black"
                    placeholder="Enter question description here"
                  />
                </div>
              </div>

              {/* Right part: ImgMCQ or other input fields */}
              <div className="flex flex-col w-full md:w-1/2">
                <ImgMCQ />
              </div>
            </div>
          </div>
        ) : questionType === "MCQ (Text-IMG)" ? (
          // --- Layout for "MCQ (Text-IMG)" ---
          <div className="flex flex-col md:flex-row px-3 py-3 mt-6 w-full border border-black space-y-3 md:space-y-0 md:space-x-3">
            {/* First Column: Q1 */}
            <div className="w-full md:w-[3%] p-3 mr-2 text-lg">{"Q1"}</div>

            {/* Second Column: Text on the left, image on the right */}
            <div className="flex flex-col md:flex-row w-full space-y-3 md:space-y-0 md:space-x-3">
              {/* Left side: Question text & description */}
              <div className="flex flex-col w-full md:w-1/2 space-y-1">
                <div className="h-[85%]">
                  <textarea
                    style={{ resize: "none" }}  
                    value={questionText}
                    onChange={(e) => handleQuestionChange(e.target.value)}
                    className="w-full p-2 border border-black h-[85%]"
                    placeholder="Question text here"
                  />
                </div>

                <div className="mt-2 w-full h-[85%]">
                  <textarea
                    style={{ resize: "none" }}
                   
                    value={questionDescription}
                    onChange={(e) =>
                      handleQuestionDescriptionChange(e.target.value)
                    }
                    className="w-full p-2 border border-black h-[85%]"
                    placeholder="Enter question description here"
                  />
                </div>
              </div>

              {/* Right side: Image-related input (e.g., single image) */}
              <div className="flex flex-col w-full md:w-1/2 space-y-3">
                {/* If you want MCQ or other inputs under the image, place them here */}
                <ImgMCQ />
              </div>
            </div>
          </div>
        ) : (
          // --- Old layout for everything else ---
          <div className="flex flex-col md:flex-row px-3 py-3 mt-6 w-full border border-black space-y-3 md:space-y-0 md:space-x-3">
            {/* First Column: Q1 */}
            <div className="w-full md:w-[3%] p-3 mr-2 text-lg">{"Q1"}</div>

            {/* Second Column: Question Details */}
            <div className="flex flex-col w-full md:w-full space-y-3">
              {/* Question Text */}
              <div className="mt-2.5 w-full">
                <textarea
                  style={{ resize: "none" }}
                  rows={2}
                  value={questionText}
                  onChange={(e) => handleQuestionChange(e.target.value)}
                  className="self-stretch w-full p-2 border border-black"
                  placeholder="Enter question here"
                />
              </div>

              {/* Description */}
              <div className="mt-2.5 w-full">
                <textarea
                  style={{ resize: "none" }}
                  rows={2}
                  value={questionDescription}
                  onChange={(e) =>
                    handleQuestionDescriptionChange(e.target.value)
                  }
                  className="w-full p-2 border border-black"
                  placeholder="Enter question description here"
                />
              </div>

              {/* Question Type */}
              <div className="w-full">
                {questionType === "MCQ" && <MCQ />}

                {questionType === "True/False" && <TrueFalseComponent />}

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
        )}
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
          onClick={() => {}}
        />
        <NavButton
          imageSrc="/nav-right.png"
          tooltipText="पुढील"
          onClick={() => {}}
        />
      </div>
    </>
  );
};

export default Page;
