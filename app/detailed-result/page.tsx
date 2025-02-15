"use client";
import React, { useEffect, useState, useCallback } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useAttemptTestStore } from "@/store/useAttemptTestStore";
import { NavButton } from "@/components/create-test/NavButton";
import Mcq from "@/components/create-test/MCQ";

export default function Page() {
  const {
    questions,
    attemptedAnswers,
    currentQuestionIndex,
    setCurrentQuestionIndex,
  } = useAttemptTestStore();

  const [isLoading, setIsLoading] = useState(true);

  // Reset the question index to 0 on mount.
  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [setCurrentQuestionIndex]);

  // Update loading state once questions are loaded.
  useEffect(() => {
    if (questions.length > 0) {
      setIsLoading(false);
    }
  }, [questions]);

  const canGoNext = currentQuestionIndex < questions.length - 1;
  const canGoPrevious = currentQuestionIndex > 0;

  const navigateToPrevious = useCallback(() => {
    if (canGoPrevious) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [canGoPrevious, currentQuestionIndex, setCurrentQuestionIndex]);

  const navigateToNext = useCallback(() => {
    if (canGoNext) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [canGoNext, currentQuestionIndex, setCurrentQuestionIndex]);

  // While loading, display MUI Skeleton placeholders.
  if (isLoading) {
    return (
      <div className="p-6 border border-black mx-auto">
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={80}
          style={{ margin: "16px 0" }}
        />
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from(new Array(4)).map((_, idx) => (
            <Skeleton key={idx} variant="rectangular" width="100%" height={50} />
          ))}
        </div>
        <Skeleton
          variant="text"
          width="80%"
          height={30}
          style={{ marginTop: "16px" }}
        />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="p-4 max-w-xl mx-auto text-center">
        <p>No questions found. Please try again.</p>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];
  const userAnswer = attemptedAnswers[question.id];
  const isCorrect = userAnswer === question.correctAnswer;
  const isNotAttempted = userAnswer === null;

  return (
    <div className="p-6 border border-black mx-auto rounded-lg h-full">
      <div className="pb-4 relative laila-semibold">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl laila-semibold">
            प्रश्न : {currentQuestionIndex + 1} / {questions.length}
          </h2>
          {isNotAttempted && (
            <span className="text-red-600 font-bold">अनुत्तरीत</span>
          )}
          {isCorrect && <span className="text-green-500 font-bold">+5</span>}
          {!isCorrect && !isNotAttempted && (
            <span className="text-red-600 font-bold">-5</span>
          )}
        </div>

        {/* Question Text */}
        <p className="text-2xl mb-4">{question.questionText}</p>

        {/* Options rendered via the MCQ component in result mode */}
        <Mcq
          editable={false}
          isSolving={false}
          isResult={true}
          options={question.options}
          // In result mode, we use the student's answer (if any) for styling.
          selectedAnswer={userAnswer}
          // The following handlers are not used in result mode.
          onSelectedAnswerChange={() => {}}
          selectedOption={null}
          onOptionSelect={() => {}}
          onOptionChange={() => {}}
          correctAnswer={question.correctAnswer}
        />

        {/* Explanation */}
        <div className="relative my-5 w-full">
          <p>
            <span>Explanation:</span>
          </p>
          <div className="mt-5 h-32 p-4 border border-black max-w-full">
            <p className="break-words">{question.questionDescription}</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <fieldset className="flex flex-wrap gap-10 self-center mt-10 max-w-full w-[506px] mx-auto items-center justify-center border-none">
          <legend className="sr-only">Navigation buttons</legend>
          <NavButton
            imageSrc="/nav-left.png"
            tooltipText="मागील"
            onClick={navigateToPrevious}
            disabled={!canGoPrevious}
          />
          <NavButton
            imageSrc="/nav-right.png"
            tooltipText="पुढील"
            onClick={navigateToNext}
            disabled={!canGoNext}
          />
        </fieldset>
      </div>
    </div>
  );
}
