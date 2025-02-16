// /components/Header/QuestionNavigation.tsx
import React from 'react';
import { Question } from '@/utils/types';

interface QuestionNavigationProps {
  questions: Question[];
  selectedQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  onAddQuestion: () => void;
  selectionExercise: boolean;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  selectedQuestionIndex,
  onSelectQuestion,
  onAddQuestion,
  selectionExercise,
}) => {
  return (
    <div className="flex flex-col laila-semibold p-4 rounded-lg shadow bg-[#6378fd] h-[80%] border border-black">
      <div className="grid grid-cols-7 gap-4 md:p-4">
        {questions.map((question, index) => (
          <button
            key={question.id}
            className={`flex pt-1 items-center justify-center ${
              selectedQuestionIndex === index ? 'bg-green-400' : 'bg-[#a6b1ff]'
            } w-10 h-10 text-white rounded-full font-bold`}
            onClick={() => onSelectQuestion(index)}
            aria-label={`Question ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="flex items-center justify-center bg-[#a6b1ff] w-10 h-10 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onAddQuestion}
          disabled={!selectionExercise}
          title={!selectionExercise ? 'Select an exercise first' : 'Add Question'}
          aria-label="Add Question"
        >
          <svg width="15" height="15" viewBox="0 0 44 44" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.098 43.3068V0.147724H24.9276V43.3068H19.098ZM0.416193 24.625V18.8295H43.6094V24.625H0.416193Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuestionNavigation;
