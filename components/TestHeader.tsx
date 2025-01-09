"use client";
import React, { useCallback, useMemo } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import Image from "next/image";
import { useQuestions } from "@/context/QuestionsContext";

export default function TestHeader() {
  const {
    selection,
    setSelection,
    questions,
    setQuestions,
    selectedQuestionIndex,
    setSelectedQuestionIndex,
  } = useQuestions();

  // Define dropdown options using useMemo for performance optimization
  const classOptions = useMemo(() => ["५", "६", "७", "८", "९", "१०"], []);
  const subjectOptions = useMemo(() => ["विषय १", "विषय २", "विषय ३"], []);
  const lessonOptions = useMemo(() => ["धडा १", "धडा २", "धडा ३"], []);
  const homeworkOptions = useMemo(() => ["स्वाध्याय १", "स्वाध्याय २"], []);

  /**
   * Handler for dropdown selection changes.
   * @param value - The selected value from the dropdown.
   * @param dropdownKey - The key corresponding to the dropdown (e.g., 'class', 'subject').
   */
  const handleSelect = useCallback(
    async (value: string | number, dropdownKey: string) => {
      console.log(`Dropdown Key: ${dropdownKey}, Selected value: ${value}`);

      setSelection((prevSelection) => ({
        ...prevSelection,
        [dropdownKey]: value,
      }));

      setQuestions([]);
      setSelectedQuestionIndex(0);

      const fetchedQuestions = [
        {
          id: 1,
          type: "MCQ" as const,
          content: {
            questionText: "",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswerIndex: 0,
            description: "",
          },
        },
        // Add more questions as needed
      ];

      setQuestions(fetchedQuestions);
    },
    [setSelection, setQuestions, setSelectedQuestionIndex]
  );

  /**
   * Handles adding a new question.
   */
  const handleAddQuestion = useCallback(() => {
    const newQuestion = {
      id: questions.length + 1,
      type: "MCQ" as const, // Default to MCQ or any default type
      content: {
        questionText: "",
        description: "",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswerIndex: null,
      },
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestionIndex(questions.length); // Select the new question
  }, [questions, setQuestions, setSelectedQuestionIndex]);

  /**
   * Handles selecting a specific question.
   * @param index - The index of the selected question.
   */
  const handleSelectQuestion = useCallback(
    (index: number) => {
      setSelectedQuestionIndex(index);
    },
    [setSelectedQuestionIndex]
  );

  return (
    <div className="text-white rounded-lg">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Left Section: Dropdowns and Header */}
        <div className="flex flex-col items-center p-4 rounded-lg shadow bg-[#6378fd] w-full md:w-1/2">
          {/* Header Section */}
          <div className="flex items-center justify-center w-full text-center gap-8">
            <Image
              src="/test-paper.png"
              alt="test-paper"
              width={70}
              height={70}
            />
            <h1 className="text-7xl rozha-one-regular">चाचणी तयार करा</h1>
          </div>

          {/* Dropdowns Section */}
          <div className="flex flex-wrap justify-between w-full mr-3 ml-3 gap-2">
            <Dropdown
              id="class-dropdown"
              items={classOptions}
              label="इयत्ता:"
              selected={selection.class}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(value) => handleSelect(value, "class")}
              className="sm:w-[48%]"
            />
            <Dropdown
              id="subject-dropdown"
              label="विषय:"
              items={subjectOptions}
              selected={selection.subject}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(value) => handleSelect(value, "subject")}
              className="sm:w-[48%]"
            />
            <Dropdown
              id="lesson-dropdown"
              label="धडा:"
              items={lessonOptions}
              selected={selection.lesson}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(value) => handleSelect(value, "lesson")}
              className="sm:w-[48%]"
              allowAddOption
              allowAddOptionText="add lesson"
            />
            <Dropdown
              id="homework-dropdown"
              label="स्वाध्याय:"
              items={homeworkOptions}
              selected={selection.homework}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(value) => handleSelect(value, "homework")}
              className="sm:w-[48%]"
              allowAddOption
              allowAddOptionText="add homework"
            />
          </div>
        </div>

        {/* Right Section: Question Navigation */}
        <div className="flex flex-col p-4 rounded-lg shadow bg-[#6378fd] w-full md:w-1/2 ">
          <div className="grid grid-cols-7 gap-4 p-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`flex pt-1 laila-semibold items-center justify-center ${
                  selectedQuestionIndex === index ? "bg-green-400" : "bg-[#a6b1ff]"
                } w-10 h-10 text-white rounded-full font-bold cursor-pointer`}
                onClick={() => handleSelectQuestion(index)}
              >
                {question.id}
              </div>
            ))}
            <div
              className="flex items-center justify-center bg-[#a6b1ff] w-10 h-10 rounded-full cursor-pointer"
              onClick={handleAddQuestion}
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
            </div>
            {Array.from({ length: 21 - questions.length - 1 }, (_, i) => (
              <div
                key={`placeholder-${i}`}
                className="w-10 h-10 bg-[#a6b1ff] rounded-full opacity-50"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
