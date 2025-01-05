import * as React from "react";
import { ActionButtonProps } from "@/utils/types";

export const ActionButton: React.FC<ActionButtonProps> = ({ label, bgColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-10 py-4 ${bgColor} rounded-3xl border-[1.5px] border-black border-solid shadow-lg text-white`}
      tabIndex={0}
      role="button"
      aria-label={label}
    >
      {label}
    </button>
  );
}

