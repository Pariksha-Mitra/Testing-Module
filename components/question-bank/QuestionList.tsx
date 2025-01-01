import * as React from 'react';
import { QuestionCard } from './QuestionCard';
import { QuestionListProps } from '@/utils/types';

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  selectedQuestionIndex,
  onQuestionSelect
}) => {
  return (
    <div className="flex flex-col gap-3 text-2xl mr-3 p-2">
      {questions.map((question, index) => (
        <QuestionCard
          key={index}
          questionNumber={question.questionNumber}
          description={question.description}
          isSelected={selectedQuestionIndex === index}
          onClick={() => onQuestionSelect(index)}
        />
      ))}
    </div>
  );
};
