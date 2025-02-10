"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  startTransition,
} from "react";
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
import TimerDisplay from "@/components/attempt-test/TimerDisplay";
import StatsDisplay from "@/components/attempt-test/StatsDisplay";
import ProgressBar from "@/components/attempt-test/ProgressBar";
import NavigationButton from "@/components/attempt-test/NavButton";

/** TestHeader: combines TimerDisplay and StatsDisplay */
interface TestHeaderProps {
  minutes: number;
  seconds: number;
}
const TestHeader: React.FC<TestHeaderProps> = React.memo(
  ({ minutes, seconds }) => (
    <>
      {/* Mobile layout: timer on top, stats below */}
      <div className="flex flex-col items-center md:hidden w-full mt-1 mb-1">
        <TimerDisplay minutes={minutes} seconds={seconds} />
        <StatsDisplay />
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
  )
);
TestHeader.displayName = "TestHeader";

/** QuestionCard: renders the question content, its metadata and the MCQ options */
interface QuestionCardProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | number | null;
  attemptQuestion: (questionId: string, optionText: string) => void;
}
const QuestionCard: React.FC<QuestionCardProps> = React.memo(
  ({
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
  )
);
QuestionCard.displayName = "QuestionCard";

const Page: React.FC = () => {
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

  // Prefetch the home route for faster navigation after test submission.
  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  const currentQuestion = questions[currentQuestionIndex];

  // Set loading false once questions are populated.
  useEffect(() => {
    if (questions.length > 0) {
      setLoading(false);
    }
  }, [questions]);

  // Use custom timer hook.
  useTimer({
    exerciseDuration,
    timeElapsed,
    isSubmitted,
    incrementTime,
    submitTest,
  });

  // Use the anti‑cheat hook.
  useFullscreenAndAntiCheatProtection({
    isSubmitted,
    incrementCheatCount,
    submitTest,
    showToast,
  });

  // Mark current question as visited.
  useEffect(() => {
    if (currentQuestion) {
      markQuestionVisited(currentQuestion.id);
    }
  }, [currentQuestion, markQuestionVisited]);

  // Auto-submit if cheat count exceeds allowed value.
  useEffect(() => {
    if (!isSubmitted && cheatCount >= maxCheatAttempts) {
      showToast(
        "Maximum cheat attempts reached. The test will be submitted automatically.",
        "warning"
      );
      submitTest();
    }
  }, [cheatCount, maxCheatAttempts, submitTest, isSubmitted, showToast]);

  // Memoize calculated values.
  const attemptedCount = useMemo(
    () =>
      Object.values(attemptedAnswers).filter((answer) => answer !== null)
        .length,
    [attemptedAnswers]
  );
  const visitedButNotAttempted = useMemo(
    () => visitedQuestions.length - attemptedCount,
    [visitedQuestions, attemptedCount]
  );
  const notAttempted = useMemo(
    () => questions.length - attemptedCount,
    [questions.length, attemptedCount]
  );
  const progressPercentage = useMemo(
    () => (attemptedCount / questions.length) * 100,
    [attemptedCount, questions.length]
  );
  const safeProgress = useMemo(
    () => Math.min(Math.max(progressPercentage, 0), 100),
    [progressPercentage]
  );

  const timeRemaining = Math.max(exerciseDuration - timeElapsed, 0);
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const selectedAnswer = currentQuestion
    ? attemptedAnswers[currentQuestion.id]
    : null;

  // Memoize the navigation handler.
  const handleNext = useCallback(() => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowSubmitModal(true);
    }
  }, [isLastQuestion, currentQuestionIndex, setCurrentQuestionIndex]);

  // Memoize test results calculation.
  const results = useMemo(() => {
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
  }, [questions, attemptedAnswers, timeElapsed]);

  // If the test has been submitted, show the result modal.
  if (isSubmitted) {
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
            startTransition(() => {
              router.push("/");
            });
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
      <p className="text-center mt-8">No questions loaded. Please try again.</p>
    );
  }

  return (
    <div className="px-3" style={{ userSelect: "none" }}>
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header with Timer and Stats */}
        <TestHeader minutes={minutes} seconds={seconds} />

        {/* Progress Bar */}
        <ProgressBar progress={safeProgress} />

        {/* Question Content */}
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            attemptQuestion={attemptQuestion}
          />
        )}

        {/* Navigation Button */}
        <NavigationButton
          isLastQuestion={isLastQuestion}
          onClick={handleNext}
        />
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
};
Page.displayName = "Page";

export default Page;
