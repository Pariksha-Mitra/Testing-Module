import * as React from 'react';

interface ActionButtonProps {
  label: string;
  bgColor: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = React.memo(
  ({
    label,
    bgColor,
    onClick,
    className = "", // Add optional className prop
    disabled = false, // Add disabled state
  }) => {
    return (
      <button
        onClick={onClick}
        className={`
        cursor-pointer px-10 py-4 
        ${bgColor} 
        rounded-3xl border-[1.5px] border-black border-solid 
        shadow-lg text-white
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        disabled={disabled}
      >
        {label}
      </button>
    );
  }
);

ActionButton.displayName = "ActionButton";
