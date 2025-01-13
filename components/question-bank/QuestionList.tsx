import * as React from 'react';
import Link from 'next/link';
import { QuestionCard } from './QuestionCard';
import { QuestionListProps } from '@/utils/types';

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  selectedQuestionIndex,
  onQuestionSelect,
  onDeleteQuestion,
}) => {
  // Example of added logic that doesn't affect the UI:
  React.useEffect(() => {
    console.log("Current number of questions:", questions.length);
  }, [questions]);

  const handleAddQuestion = () => {
    console.log("Add question clicked");
    // Any extra logic you want here that won't affect the UI
  };

  if (!questions) {
    return <div>No questions available</div>;
  }

  return (
    <div className="flex flex-col gap-3 text-2xl mr-3 p-2">
      {/* Special card for adding a question */}
      <Link href={"/create-test"}>
        <QuestionCard
          id="add-question"
          questionNumber="+"
          description="Add question"
          isSelected={false}
          onClick={handleAddQuestion}
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 44 44"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.098 43.3068V0.147724H24.9276V43.3068H19.098ZM0.416193 24.625V18.8295H43.6094V24.625H0.416193Z" />
            </svg>
          }
        />
      </Link>

      {/* Map over existing questions */}
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          id={question.id}
          questionNumber={question.questionNumber}
          description={question.description}
          isSelected={selectedQuestionIndex === index}
          onClick={() => onQuestionSelect(index)}
          onDelete={() => onDeleteQuestion(index)}
        />
      ))}
    </div>
  );
};
