import * as React from 'react';
import { QuestionProps } from '@/utils/types';

interface ExtendedQuestionProps extends QuestionProps {
  isSelected: boolean;
  onClick: () => void;
}

export const QuestionCard: React.FC<ExtendedQuestionProps> = ({
  questionNumber,
  description,
  isSelected,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex justify-between items-center bg-white rounded-3xl border border-solid shadow-lg 
        ${isSelected ? 'border-emerald-400 bg-emerald-50' : 'border-zinc-400'} 
        cursor-pointer transition-all duration-200 hover:border-emerald-300 p-4`}
    >
      <div className="px-2.5 py-1 text-white bg-emerald-300 rounded-lg shadow">
        {questionNumber}
      </div>
      <div className="flex-1 ml-4 text-black">
        {description}
      </div>
    </div>
  );
};
