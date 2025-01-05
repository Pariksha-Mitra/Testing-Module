import * as React from "react";
import { QuestionProps } from "@/utils/types";

export const QuestionCard: React.FC<QuestionProps> = ({
  questionNumber,
  description,
  isSelected,
  onClick,
  onDelete,
}) => {
  // We'll treat an empty description as the “Add question” state
  const showAddQuestion = !description;

  return (
    <div
      onClick={onClick}
      className={`
         rozha-one-regular flex flex-wrap gap-5 justify-between items-center pr-6 w-full bg-white rounded-3xl border border-solid shadow-lg border-zinc-400 max-md:pr-5 max-md:max-w-full
        ${
          isSelected
            ? "border-emerald-400 bg-emerald-50"
            : "border-zinc-300 bg-white"
        }
      `}
    >
      {/* Left "Q.no." badge covering full height */}
      <div
        className=" self-stretch px-2 py-[19px] text-white text-center whitespace-nowrap bg-emerald-300 rounded-3xl shadow-lg"
        style={{ minWidth: "120px" }}
      >
        {questionNumber}
      </div>

      {/* Main content area (flex-1 so it expands) */}
      <div className="flex-1 flex items-center justify-between px-4 py-3">
        {/* If there's no description, show "Add question" text */}
        <div className="overflow-hidden rozha-one-regular text-2xl">
          {showAddQuestion ? (
            <p className="text-blue-600  text-base">Add question</p>
          ) : (
            <p className="text-black text-base truncate">{description}</p>
          )}
        </div>

        {/* Delete icon (if onDelete is passed and we’re not in 'Add question' mode) */}
        {onDelete && !showAddQuestion && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-400 hover:text-red-600 transition-colors ml-4"
            aria-label="Delete question"
          >
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
