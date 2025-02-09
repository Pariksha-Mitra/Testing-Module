import { useEffect } from "react";

interface UseTimerProps {
  exerciseDuration: number;
  timeElapsed: number;
  isSubmitted: boolean;
  incrementTime: (delta: number) => void;
  submitTest: () => void;
}

const useTimer = ({
  exerciseDuration,
  timeElapsed,
  isSubmitted,
  incrementTime,
  submitTest,
}: UseTimerProps) => {
  useEffect(() => {
    if (!exerciseDuration || isSubmitted) return;
    const intervalId = setInterval(() => {
      incrementTime(1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [exerciseDuration, isSubmitted, incrementTime]);

  useEffect(() => {
    if (exerciseDuration > 0 && timeElapsed >= exerciseDuration && !isSubmitted) {
      submitTest();
    }
  }, [timeElapsed, exerciseDuration, isSubmitted, submitTest]);
};

export default useTimer;
