import * as React from "react";
import { QuestionCard } from "./QuestionCard";
import { QuestionListProps } from "@/utils/types";
import Link from "next/link";

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  selectedQuestionIndex,
  onQuestionSelect,
  onDeleteQuestion,
}) => {
  const handleAddQuestion = () => {
    console.log("Add question clicked");
  };

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
        />
      </Link>
      {/* Map over existing questions */}
      {questions.map((question, index) => (
        <QuestionCard
          id={question.id}
          key={question.id} // Ensure each question has a unique id
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
