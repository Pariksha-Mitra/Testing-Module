
import React from "react";

interface NavigationButtonProps {
  isLastQuestion: boolean;
  onClick: () => void;
}
const NavigationButton: React.FC<NavigationButtonProps> = React.memo(
  ({ isLastQuestion, onClick }) => (
    <div className="flex justify-center mt-7 cursor-pointer">
      <button
        className="rozha-one-regular px-8 py-2 sm:px-28 sm:py-2 bg-[#05C665] rounded-[10px] border-[1.5px] border-white shadow-sm text-white text-xl sm:text-2xl font-bold"
        onClick={onClick}
      >
        {isLastQuestion ? "सबमिट करा" : "पुढील"}
      </button>
    </div>
  )
);
NavigationButton.displayName = "NavigationButton";

export default NavigationButton;