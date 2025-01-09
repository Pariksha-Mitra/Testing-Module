"use client";
import React, { ChangeEvent } from "react";
import { useQuestions } from "@/context/QuestionsContext";

interface MCQProps {
  editable: boolean; // Add the editable prop
}

const MCQ: React.FC<MCQProps> = ({ editable }) => {
  const { questions, setQuestions, selectedQuestionIndex } = useQuestions();

  const currentQuestion = questions[selectedQuestionIndex];

  if (!currentQuestion || !currentQuestion.content) {
    // Optionally, render a fallback UI or return null
    return <div>No question data available.</div>;
  }

  /**
   * Handles changing the text of an option.
   * @param index - The index of the option to change.
   * @param value - The new value for the option.
   */
  const handleOptionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[selectedQuestionIndex].content.options) {
      updatedQuestions[selectedQuestionIndex].content.options = [];
    }
    updatedQuestions[selectedQuestionIndex].content.options[index] = value;
    setQuestions(updatedQuestions);
  };

  /**
   * Handles selecting the correct option.
   * @param index - The index of the selected correct option.
   */
  const handleOptionSelect = (index: number) => {
    if (!editable) return; // Prevent selecting if not editable

    const updatedQuestions = [...questions];
    updatedQuestions[selectedQuestionIndex].content.correctAnswerIndex = index;
    setQuestions(updatedQuestions);
  };

  const options = currentQuestion.content.options || [];
  const selectedOption = currentQuestion.content.correctAnswerIndex;

  return (
    <div className="space-y-4">
      {options.map((option: string, index: number) => (
        <div key={index} className="flex items-center space-x-3 ">
          <button
            onClick={() => handleOptionSelect(index)}
            disabled={!editable} // Disable button when not editable
            className={`flex flex-wrap gap-5 justify-between items-center px-6 py-2.5 max-w-full text-center bg-white rounded-3xl border border-black border-solid shadow-lg w-full max-md:pl-5 max-md:mr-2.5 ${
              selectedOption === index
                ? "bg-green-200 border-green-500 border-2"
                : "bg-white border-black"
            }`}
          >
            <span
              className={`h-6 w-6 rounded-full shadow-sm border-2 ${
                selectedOption === index
                  ? "bg-green-300 border-green-500"
                  : "border-gray-300 bg-zinc-300"
              }`}
            ></span>
            <span className="flex-1">
              <input
                type="text"
                value={option}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleOptionChange(index, e.target.value)
                }
                className="w-full p-2 border rounded-lg border-gray-300"
                placeholder={`Option ${index + 1}`}
                disabled={!editable} // Disable input when not editable
              />
            </span>
          </button>
          {/* Uncomment below if you implement add/remove option functionality */}
          {/* <button onClick={() => removeOption(index)} disabled={!editable}>
            Remove
          </button> */}
        </div>
      ))}

      {/* Uncomment below if you implement add option functionality */}
      {/* <button
        onClick={addOption}
        className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
          !editable ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!editable} // Disable button when not editable
      >
        Add Option
      </button> */}

      <div className="text-lg mt-2">
        Correct answer: {selectedOption !== null ? options[selectedOption] : "None"}
      </div>
    </div>
  );
};

export default MCQ;
