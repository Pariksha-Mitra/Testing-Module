"use client";
import React, { ChangeEvent } from "react";
import MCQ from "@/components/create-test/MCQ";
import MatchThePairs from "@/components/create-test/match-the-pairs/MatchThePairs";
import TrueFalseComponent from "@/components/create-test/TrueFalse";
import { QuestionType } from "@/utils/types";

/**
 * General Question Layout (MCQ, True/False, Match The Pairs, Subjective Answer, etc.)
 */

interface GeneralQuestionLayoutProps {
  questionIndex: number;
  questionType: QuestionType;
  questionText: string;
  questionDescription: string;
  onQuestionTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  editable: boolean; // Added editable prop
}

export const GeneralQuestionLayout: React.FC<GeneralQuestionLayoutProps> = ({
  questionIndex,
  questionType,
  questionText,
  questionDescription,
  onQuestionTextChange,
  onDescriptionChange,
  editable, // Destructure editable
}) => (
  <div
    className={`flex flex-col md:flex-row px-3 py-3 mt-6 w-full border border-black space-y-3 md:space-y-0 md:space-x-3 ${
      !editable ? "pointer-events-none opacity-50" : ""
    }`}
    aria-disabled={!editable} // Accessibility attribute
  >
    {/* First Column: Q{questionIndex + 1} */}
    <div className="w-full md:w-[3%] p-3 mr-2 text-lg">
      Q{questionIndex + 1}
    </div>

    {/* Second Column */}
    <div className="flex flex-col w-full space-y-3">
      {/* Question Text */}
      <textarea
        style={{ resize: "none" }}
        rows={2}
        value={questionText}
        onChange={onQuestionTextChange}
        className="self-stretch w-full p-2 border border-black"
        placeholder="Enter question here"
        disabled={!editable} // Disable when not editable
        aria-disabled={!editable} // Accessibility attribute
      />

      {/* Description */}
      <textarea
        style={{ resize: "none" }}
        rows={2}
        value={questionDescription}
        onChange={onDescriptionChange}
        className="w-full p-2 border border-black"
        placeholder="Enter question description here"
        disabled={!editable} // Disable when not editable
        aria-disabled={!editable} // Accessibility attribute
      />

      {/* Question-Type-Specific Component */}
      <div className="w-full">
        {questionType === "MCQ" && <MCQ editable={editable} />}
        {questionType === "True/False" && (
          <TrueFalseComponent editable={editable} />
        )}
        {questionType === "Match The Pairs" && (
          <MatchThePairs editable={editable} />
        )}
        {questionType === "Subjective Answer" && (
          <div className="bg-red-100 p-2">
            <h2 className="font-bold">Subjective Answer</h2>
            {/* Add more fields or explanation if needed */}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default GeneralQuestionLayout;
