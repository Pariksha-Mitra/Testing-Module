import React from "react";

 interface TimerDisplayProps {
  minutes: number;
  seconds: number;
}
const TimerDisplay: React.FC<TimerDisplayProps> = React.memo(
  ({ minutes, seconds }) => (
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
  )
);

TimerDisplay.displayName = "TimerDisplay";
export default TimerDisplay;
