"use client";

import React, { ChangeEvent } from "react";
import { QuestionType, Question } from "@/utils/types";
import MCQImgTextLayout from "@/components/create-test/question-layouts/MCQImgTextLayout";
import MCQImgImgLayout from "@/components/create-test/question-layouts/MCQImgImgLayout";
import MCQTextImgLayout from "@/components/create-test/question-layouts/MCQTextImgLayout";
import GeneralQuestionLayout from "@/components/create-test/question-layouts/GeneralQuestionLayout";

export const QuestionLayout: React.FC<{
  question: Question;
  isEditing: boolean;
  validationErrors: { [key: string]: string };
  handleOptionSelect: (index: number) => void;
  handleImageChange: (image: string) => void;
  handleImageRemove: () => void;
  handleOptionChange: (index: number, value: string) => void;
  handleQuestionTextChangeForLayout: (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleCorrectAnswerChange: (newAnswer: string) => void;
}> = ({
  question,
  isEditing,
  validationErrors,
  handleOptionSelect,
  handleImageChange,
  handleImageRemove,
  handleOptionChange,
  handleQuestionTextChangeForLayout,
  handleDescriptionChange,
  handleCorrectAnswerChange,
}) => {
  const index = 0; // Since it's standalone, pass index as needed

  switch (question.questionType) {
    case QuestionType.MCQ_IMG_TEXT:
      return (
        <MCQImgTextLayout
          editable={isEditing}
          key={question.id}
          questionIndex={index}
          questionText={question.questionText}
          questionDescription={question.questionDescription ?? ""}
          options={question.options}
          selectedOption={
            question.correctAnswer
              ? question.options.indexOf(question.correctAnswer)
              : null
          }
          onOptionSelect={handleOptionSelect}
          image={question.image}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
          onOptionChange={handleOptionChange}
          onQuestionTextChange={handleQuestionTextChangeForLayout}
          onDescriptionChange={handleDescriptionChange}
          onCorrectAnswerChange={handleCorrectAnswerChange}
        />
      );

    case QuestionType.MCQ_IMG_IMG:
      return (
        <MCQImgImgLayout
          editable={isEditing}
          key={question.id}
          questionIndex={index}
          questionDescription={question.questionDescription ?? ""}
          selectedOption={
            question.correctAnswer
              ? question.options.indexOf(question.correctAnswer)
              : null
          }
          onOptionSelect={handleOptionSelect}
          image={question.image}
          imageOptions={question.imageOptions}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
          onOptionChange={handleOptionChange}
          onDescriptionChange={handleDescriptionChange}
          onCorrectAnswerChange={handleCorrectAnswerChange}
          validationErrors={validationErrors}
        />
      );

    case QuestionType.MCQ_TEXT_IMG:
      return (
        <MCQTextImgLayout
          editable={isEditing}
          key={question.id}
          questionIndex={index}
          questionText={question.questionText}
          description={question.questionDescription ?? ""}
          selectedOption={
            question.correctAnswer
              ? question.options.indexOf(question.correctAnswer)
              : null
          }
          onOptionSelect={handleOptionSelect}
          imageOptions={question.imageOptions}
          onOptionChange={handleOptionChange}
          onQuestionTextChange={handleQuestionTextChangeForLayout}
          onDescriptionChange={handleDescriptionChange}
          onCorrectAnswerChange={handleCorrectAnswerChange}
          validationErrors={validationErrors}
        />
      );

    default:
      return (
        <GeneralQuestionLayout
          editable={isEditing}
          questionType={question.questionType}
          key={question.id}
          questionIndex={index}
          questionText={question.questionText}
          questionDescription={question.questionDescription ?? ""}
          options={question.options}
          selectedOption={
            question.correctAnswer
              ? question.options.indexOf(question.correctAnswer)
              : null
          }
          correctAnswer={question.correctAnswer}
          onOptionSelect={handleOptionSelect}
          onOptionChange={handleOptionChange}
          onCorrectAnswerChange={handleCorrectAnswerChange}
          onQuestionTextChange={handleQuestionTextChangeForLayout}
          onDescriptionChange={handleDescriptionChange}
          className=""
          validationErrors={validationErrors}
        />
      );
  }
};
