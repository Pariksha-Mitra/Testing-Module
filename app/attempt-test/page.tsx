"use client";

import React, { useEffect, useState } from "react";
import Mcq from "@/components/create-test/MCQ";
import { useAttemptTestStore } from "@/store/useAttemptTestStore";
import { Skeleton } from "@mui/material";
import TestResultModal from "@/components/attempt-test/TestResultModal";
import SubmitConfirmationModal from "@/components/attempt-test/SubmitConfirmationModal";
import useTimer from "@/utils/hooks/useTimer";
import useFullscreenAndAntiCheatProtection from "@/utils/hooks/useAntiCheatProtection";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { Question } from "@/utils/types";


/** TimerDisplay: shows an icon and the remaining time */
interface TimerDisplayProps {
  minutes: number;
  seconds: number;
}
const TimerDisplay: React.FC<TimerDisplayProps> = ({ minutes, seconds }) => (
  <div className="flex items-center space-x-2">
    <svg
      width="30"
      height="30"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="2" />
      <path
        d="M18 10v8l4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
    <span className="text-2xl laila-semibold">
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  </div>
);

/** StatsDisplay: renders three status indicators (decorative colored circles) */
const StatsDisplay: React.FC = () => (
  <div className="flex items-center space-x-4 laila-semibold">
    <div className="flex items-center space-x-2">
      <span>सोडवलेले:</span>
      <button className="bg-[#11CE6E] rounded-full w-5 h-5" />
    </div>
    <div className="flex items-center space-x-2">
      <span>न सोडवलेले:</span>
      <button className="bg-[#F3AA01] rounded-full w-5 h-5" />
    </div>
    <div className="flex items-center space-x-2">
      <span>न पाहिलेले:</span>
      <button className="bg-[#959595] rounded-full w-5 h-5" />
    </div>
  </div>
);

/** TestHeader: combines TimerDisplay and StatsDisplay */
interface TestHeaderProps {
  minutes: number;
  seconds: number;
}
const TestHeader: React.FC<TestHeaderProps> = ({ minutes, seconds }) => (
  <>
    {/* Mobile layout: timer on top, stats below */}
    <div className="flex flex-col items-center md:hidden w-full mt-1 mb-1">
      <TimerDisplay minutes={minutes} seconds={seconds} />
      <StatsDisplay  />
    </div>
    {/* Desktop layout: three columns */}
    <div className="hidden md:flex items-center justify-between w-full mt-1 mb-1">
      <div className="md:w-1/3" />
      <div className="md:w-1/3 flex justify-center items-center">
        <TimerDisplay minutes={minutes} seconds={seconds} />
      </div>
      <div className="md:w-1/3 flex justify-end items-center">
        <StatsDisplay />
      </div>
    </div>
  </>
);


/** ProgressBar: shows a progress indicator based on the progress percentage */
interface ProgressBarProps {
  progress: number;
}
const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className="w-full mx-auto my-4 shadow-inner bg-white rounded-[20px] h-6 overflow-hidden border border-black">
    <div
      className="bg-green-500 h-full transition-all rounded-[20px] duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

/** QuestionCard: renders the question content, its metadata and the MCQ options */
interface QuestionCardProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | number | null;
  attemptQuestion: (questionId: string, optionText: string) => void;
}
const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  attemptQuestion,
}) => (
  <div className="w-full mt-2 bg-white rounded-[20px] border border-black shadow-lg px-6 py-4 sm:px-9 sm:py-6 laila-semibold">
    <div className="flex justify-between items-center mb-4">
      <div className="text-[#fc4063] text-lg">
        प्रश्न: {currentQuestionIndex + 1}/{totalQuestions}
      </div>
      {selectedAnswer !== null && (
        <div className="text-[#009e4e] font-medium">Attempted</div>
      )}
    </div>
    <h2 className="text-2xl font-bold mb-6">{question.questionText}</h2>
    <Mcq
      isSolving
      editable={false}
      options={question.options}
      selectedOption={null}
      onOptionSelect={(index) =>
        attemptQuestion(question.id, question.options[index])
      }
      onOptionChange={() => {}}
      selectedAnswer={selectedAnswer}
      onSelectedAnswerChange={(optionText) =>
        attemptQuestion(question.id, optionText)
      }
    />
  </div>
);

/** NavigationButton: a reusable button for navigation */
interface NavigationButtonProps {
  isLastQuestion: boolean;
  onClick: () => void;
}
const NavigationButton: React.FC<NavigationButtonProps> = ({
  isLastQuestion,
  onClick,
}) => (
  <div className="flex justify-center mt-7 cursor-pointer">
    <button
      className="rozha-one-regular px-8 py-2 sm:px-28 sm:py-2 bg-[#05C665] rounded-[10px] border-[1.5px] border-white shadow-sm text-white text-xl sm:text-2xl font-bold"
      onClick={onClick}
    >
      {isLastQuestion ? "सबमिट करा" : "पुढील"}
    </button>
  </div>
);

/* ===================== */
/* Main Page Component */
/* ===================== */

export default function Page() {
  const { showToast } = useToast();
  const {
    questions,
    currentQuestionIndex,
    attemptedAnswers,
    markQuestionVisited,
    visitedQuestions,
    attemptQuestion,
    setCurrentQuestionIndex,
    exerciseDuration,
    timeElapsed,
    incrementTime,
    isSubmitted,
    submitTest,
    cheatCount,
    maxCheatAttempts,
    incrementCheatCount,
  } = useAttemptTestStore();

  const router = useRouter();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentQuestion = questions[currentQuestionIndex];

  // Set loading false once questions are populated
  useEffect(() => {
    if (questions.length > 0) {
      setLoading(false);
    }
  }, [questions]);

  // Use custom timer hook
  useTimer({
    exerciseDuration,
    timeElapsed,
    isSubmitted,
    incrementTime,
    submitTest,
  });

  // Use the anti‑cheat hook
  useFullscreenAndAntiCheatProtection({
    isSubmitted,
    incrementCheatCount,
    submitTest,
    showToast,
  });

  // Mark current question as visited
  useEffect(() => {
    if (currentQuestion) {
      markQuestionVisited(currentQuestion.id);
    }
  }, [currentQuestion, markQuestionVisited]);

  // Auto-submit if cheat count exceeds allowed value
  useEffect(() => {
    if (!isSubmitted && cheatCount >= maxCheatAttempts) {
      showToast(
        "Maximum cheat attempts reached. The test will be submitted automatically.",
        "warning"
      );
      submitTest();
    }
  }, [cheatCount, maxCheatAttempts, submitTest, isSubmitted, showToast]);

  // Calculate test results
  const calculateResults = () => {
    const { correct, wrong } = questions.reduce(
      (acc, question) => {
        const attempted = attemptedAnswers[question.id];
        if (attempted === question.correctAnswer) {
          acc.correct++;
        } else {
          acc.wrong++;
        }
        return acc;
      },
      { correct: 0, wrong: 0 }
    );
    return {
      correctAnswers: correct,
      wrongAnswers: wrong,
      totalMarks: correct * 5,
      timeSpent: timeElapsed.toString(),
    };
  };

  // If the test has been submitted, show the result modal
  if (isSubmitted) {
    const results = calculateResults();
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background:
            "linear-gradient(to bottom, #FBFFB7 0%, #FFFFFF 56%, #65D4FF 100%)",
        }}
      >
        <TestResultModal
          {...results}
          onCheckAnswers={() => {}}
          onFinish={() => {
            router.push("/");
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-3 py-2 max-w-6xl mx-auto">
        <div className="mb-3">
          <Skeleton variant="text" width="50%" height={40} />
          <Skeleton variant="text" width="30%" height={40} />
        </div>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <div className="mt-4 flex justify-center">
          <Skeleton variant="rounded" width={120} height={40} />
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <p className="text-center mt-8">
        No questions loaded. Please try again.
      </p>
    );
  }

  const attemptedCount = Object.values(attemptedAnswers).filter(
    (answer) => answer !== null
  ).length;
  const visitedButNotAttempted = visitedQuestions.length - attemptedCount;
  const notAttempted = questions.length - attemptedCount;
  const progressPercentage = (attemptedCount / questions.length) * 100;
  const safeProgress = Math.min(Math.max(progressPercentage, 0), 100);

  const timeRemaining = Math.max(exerciseDuration - timeElapsed, 0);
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const selectedAnswer = attemptedAnswers[currentQuestion?.id];

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  return (
    <div className="px-3" style={{ userSelect: "none" }}>
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header with Timer and Stats */}
        <TestHeader minutes={minutes} seconds={seconds} />

        {/* Progress Bar */}
        <ProgressBar progress={safeProgress} />

        {/* Question Content */}
        <QuestionCard
          question={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          attemptQuestion={attemptQuestion}
        />

        {/* Navigation Button */}
        <NavigationButton isLastQuestion={isLastQuestion} onClick={handleNext} />
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <SubmitConfirmationModal
          attemptedCount={attemptedCount}
          visitedButNotAttempted={visitedButNotAttempted}
          notAttempted={notAttempted}
          onCancel={() => setShowSubmitModal(false)}
          onSubmit={() => {
            showToast("Test submitted successfully", "success");
            submitTest();
            setShowSubmitModal(false);
          }}
        />
      )}
    </div>
  );
}
