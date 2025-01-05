"use client";
import React from "react";
import { QuestionProps } from "@/utils/types";
import { QuestionList } from "@/components/question-bank/QuestionList";
import "@/styles/scrollbar.css";

const initialQuestions: QuestionProps[] = [
  {
    id: "1",
    questionNumber: "Q.no. 1",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "2",
    questionNumber: "Q.no. 2",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "3",
    questionNumber: "Q.no. 3",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "4",
    questionNumber: "Q.no. 4",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "5",
    questionNumber: "Q.no. 5",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "6",
    questionNumber: "Q.no. 6",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "7",
    questionNumber: "Q.no. 7",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "8",
    questionNumber: "Q.no. 8",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "9",
    questionNumber: "Q.no. 9",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "10",
    questionNumber: "Q.no. 10",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "11",
    questionNumber: "Q.no. 11",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "12",
    questionNumber: "Q.no. 12",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "13",
    questionNumber: "Q.no. 13",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "14",
    questionNumber: "Q.no. 14",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "15",
    questionNumber: "Q.no. 15",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "16",
    questionNumber: "Q.no. 16",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "17",
    questionNumber: "Q.no. 17",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "18",
    questionNumber: "Q.no. 18",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "19",
    questionNumber: "Q.no. 19",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "20",
    questionNumber: "Q.no. 20",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "21",
    questionNumber: "Q.no. 21",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "22",
    questionNumber: "Q.no. 22",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "23",
    questionNumber: "Q.no. 23",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "24",
    questionNumber: "Q.no. 24",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "25",
    questionNumber: "Q.no. 25",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "26",
    questionNumber: "Q.no. 26",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "27",
    questionNumber: "Q.no. 27",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "28",
    questionNumber: "Q.no. 28",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "29",
    questionNumber: "Q.no. 29",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "30",
    questionNumber: "Q.no. 30",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "31",
    questionNumber: "Q.no. 31",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "32",
    questionNumber: "Q.no. 32",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "33",
    questionNumber: "Q.no. 33",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "34",
    questionNumber: "Q.no. 34",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
  {
    id: "35",
    questionNumber: "Q.no. 35",
    description: "Question description here",
    isSelected: false,
    onClick: () => {},
  },
];

const Page = () => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState<number | null>(null);
  const [questionList, setQuestionList] =
    React.useState<QuestionProps[]>(initialQuestions);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newQuestion, setNewQuestion] = React.useState({
    questionNumber: "",
    description: "",
  });

  const handleQuestionSelect = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestionList((prevQuestions) =>
      prevQuestions.filter((_, i) => i !== index)
    );
    // Update selectedQuestionIndex if necessary
    if (selectedQuestionIndex === index) {
      setSelectedQuestionIndex(0);
    } else if (selectedQuestionIndex !== null && selectedQuestionIndex > index) {
      setSelectedQuestionIndex((prev) => (prev !== null ? prev - 1 : null));
    }
  };

  const handleSubmitNewQuestion = () => {
    if (newQuestion.questionNumber && newQuestion.description) {
      setQuestionList((prevQuestions) => [
        ...prevQuestions,
        {
          id: (prevQuestions.length + 1).toString(),
          questionNumber: newQuestion.questionNumber,
          description: newQuestion.description,
          isSelected: false,
          onClick: () => {},
        },
      ]);
      setIsModalOpen(false);
      setNewQuestion({ questionNumber: "", description: "" });
    } else {
      // Handle validation errors
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="flex flex-wrap gap-7 px-6 py-6 mt-4 bg-white rounded-3xl border border-black border-solid shadow-lg max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col grow shrink-0 max-md:max-w-full">
        <div
          className="custom-scrollbar overflow-y-auto h-[505px] pr-2"
          style={{
            maxHeight: "505px", // Ensure consistent height
          }}
        >
          <QuestionList
            questions={questionList}
            selectedQuestionIndex={selectedQuestionIndex ?? 0}
            onQuestionSelect={handleQuestionSelect}
            onDeleteQuestion={handleDeleteQuestion}
          />
        </div>
      </div>

      {/* Modal for Adding a New Question */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">Add New Question</h2>
            <input
              type="text"
              placeholder="Question Number"
              value={newQuestion.questionNumber}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  questionNumber: e.target.value,
                })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Description"
              value={newQuestion.description}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, description: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSubmitNewQuestion}
                className="bg-emerald-500 text-white px-4 py-2 rounded mr-2"
              >
                Add
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
