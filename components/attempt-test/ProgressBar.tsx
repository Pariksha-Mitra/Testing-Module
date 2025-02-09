import React from "react";

interface ProgressBarProps {
  progress: number;
}
const ProgressBar: React.FC<ProgressBarProps> = React.memo(({ progress }) => (
  <div className="w-full mx-auto my-4 shadow-inner bg-white rounded-[20px] h-6 overflow-hidden border border-black">
    <div
      className="bg-green-500 h-full transition-all rounded-[20px] duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
));
ProgressBar.displayName = "ProgressBar";

export default ProgressBar;