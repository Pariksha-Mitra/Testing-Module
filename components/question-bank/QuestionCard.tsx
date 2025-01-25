import React from "react";
import { QuestionCardPros } from "@/utils/types";


export const QuestionCard: React.FC<
  QuestionCardPros & { icon?: React.ReactNode }
> = ({ q_no, questionText, isSelected, icon, onClick, onDelete }) => {
  const showAddQuestion = !questionText;

  // Handle keyboard interactions for the main card
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Prevent scrolling when space is pressed
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      aria-label={showAddQuestion ? "Add new question" : `Question ${q_no}`}
      className={`
        rozha-one-regular 
        flex flex-col md:flex-row 
        gap-3 md:gap-5 
        justify-between 
        items-center
        w-full 
        bg-white 
        rounded-3xl 
        border border-solid 
        shadow-lg 
        px-4 py-3 
        ${
          isSelected
            ? "border-emerald-400 bg-emerald-50"
            : "border-zinc-300 bg-white"
        }
        transition-colors
        cursor-pointer
        focus:outline-none
        focus:ring-2 focus:ring-emerald-400
      `}
    >
      {/* Left badge or icon */}
      <div
        className="
          flex 
          justify-center 
          items-center 
          text-white 
          text-center 
          whitespace-nowrap 
          bg-emerald-300 
          rounded-3xl 
          shadow-lg
          px-4 py-2 
          md:py-[19px]
        "
        style={{ minWidth: "80px" }}
      >
        {icon ? (
          <div className="flex justify-center items-center h-[32px] w-[32px]">
            {icon}
          </div>
        ) : (
          <span className="text-lg md:text-xl">{q_no}</span>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between">
        <div className="overflow-hidden">
          {showAddQuestion ? (
            <p className="text-[#2836ff] text-lg md:text-xl">Add question</p>
          ) : (
            <p className="text-sm text-wrap md:text-xl truncate">
              {questionText}
            </p>
          )}
        </div>

        {/** Only show delete button if onDelete is defined (i.e., if user is a Teacher) */}
        {onDelete && !showAddQuestion && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onDelete();
              }
            }}
            className="text-red-400 hover:text-red-600 transition-colors mt-2 md:mt-0 ml-0 md:ml-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
            aria-label="Delete question"
          >
            {/* Delete icon */}
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 106 106"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0,106) scale(0.1,-0.1)"
                fill="#ff967b"
                stroke="none"
              >
                <path
                  d="M455 1050 c-109 -17 -238 -83 -306 -156 -168 -181 -189 -459 -52
                  -660 49 -71 80 -100 154 -147 176 -111 403 -107 575 10 71 49 100 80 147 154
                  111 176 107 403 -10 575 -49 71 -80 100 -154 147 -101 64 -243 95 -354 77z
                  m247 -69 c119 -46 223 -148 275 -272 25 -57 27 -76 27 -179 0 -96 -4 -125 -23
                  -172 -48 -123 -159 -233 -280 -279 -70 -26 -197 -35 -273 -20 -263 55 -431
                  332 -363 596 42 161 174 294 336 340 77 21 226 14 301 -14z"
                />
                <path
                  d="M272 784 c-50 -53 -57 -38 73 -166 l90 -89 -102 -101 c-57 -55 -103
                  -103 -103 -106 0 -3 21 -25 46 -49 53 -51 38 -58 165 72 l89 90 104 -104 104
                  -103 47 46 c55 54 61 38 -70 167 l-90 89 104 104 103 104 -46 47 c-54 55 -38
                  61 -168 -70 l-89 -90 -101 103 c-55 56 -104 102 -107 102 -3 0 -25 -21 -49
                  -46z"
                />
              </g>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
