import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ROLE,QuestionListProps } from "@/utils/types";
import { QuestionCard } from "./QuestionCard";

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  selectedQuestionIndex,
  onQuestionSelect,
  onDeleteQuestion,
}) => {
  // Get session data
  const { data: session } = useSession();
  const role = session?.user.role;        
  const isTeacher = role === ROLE.Teacher;  

  return (
    <div
      className="
        flex flex-col gap-3 
        w-full 
        mx-auto 
        p-2
        md:p-4
      "
    >
      {/** Show 'Add question' card (which links to /create-test) only if user is Teacher */}
      {isTeacher && (
        <Link href="/create-test">
          <QuestionCard
            q_no="+"
            questionText="Add question"
            isSelected={false}
            onClick={() => {}}
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
      )}

      {/* Render existing questions */}
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          q_no={`Q.${index + 1}`} // Add "Q." prefix
          questionText={question.questionText}
          isSelected={selectedQuestionIndex === index}
          onClick={() => onQuestionSelect(index)}
          // Only pass onDelete if user is Teacher
          onDelete={isTeacher ? () => onDeleteQuestion(index) : undefined}
        />
      ))}
    </div>
  );
};
