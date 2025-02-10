import React from "react";
import RightArrow from "@/public/test-modal-icons/right-arrow.svg";

interface SubmitConfirmationModalProps {
  attemptedCount: number;
  visitedButNotAttempted: number;
  notAttempted: number;
  onCancel: () => void;
  onSubmit: () => void;
}

/** 
 * Reusable ModalHeader component.
 * Renders a header with a back button and a title.
 */
interface ModalHeaderProps {
  title: string;
  onBack: () => void;
  backIcon: React.ReactNode;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onBack, backIcon }) => (
  <div className="flex flex-row bg-[#9747FF] text-white py-2 text-center">
    <button onClick={onBack} className="relative top-1 left-3">
      {backIcon}
    </button>
    <h1 className="text-3xl font-bold laila-bold justify-center items-center p-4">
      {title}
    </h1>
  </div>
);

/**
 * Reusable StatusRow component.
 * Displays a label and a count with a customizable background color.
 */
interface StatusRowProps {
  label: string;
  count: number;
  bgColor: string;
}

const StatusRow: React.FC<StatusRowProps> = ({ label, count, bgColor }) => (
  <div className="flex items-center justify-between bg-white rounded-[15px] px-6 py-2 shadow-inner">
    <span>{label}</span>
    <button className={`rounded-[10px] px-3 py-1 text-white ${bgColor}`}>
      {count}
    </button>
  </div>
);

/**
 * Reusable ModalButton component.
 * Supports two variants ("primary" and "secondary") to control its appearance.
 */
interface ModalButtonProps {
  onClick: () => void;
  text: string;
  variant: "primary" | "secondary";
}

const ModalButton: React.FC<ModalButtonProps> = ({ onClick, text, variant }) => {
  const baseClasses =
    "w-full text-xl text-white py-1 rounded-lg transition-colors border-2 border-white";
  const variantClasses =
    variant === "primary"
      ? "bg-blue-500 hover:bg-blue-600"
      : "bg-green-500 hover:bg-green-600";
  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {text}
    </button>
  );
};

/**
 * Main SubmitConfirmationModal component.
 * Uses ModalHeader, StatusRow, and ModalButton to build a consistent and reusable UI.
 */
const SubmitConfirmationModal: React.FC<SubmitConfirmationModalProps> = ({
  attemptedCount,
  visitedButNotAttempted,
  notAttempted,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-lg border border-black">
        {/* Header */}
        <ModalHeader
          title="Submit Test Confirmation"
          onBack={onCancel}
          backIcon={<RightArrow />}
        />

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3 mb-6 laila-semibold w-3/4 mx-auto text-lg">
            <StatusRow
              label="सोडवलेले :"
              count={attemptedCount}
              bgColor="bg-[#11CE6E]"
            />
            <StatusRow
              label="पाहिलेले पण न सोडवलेले  :"
              count={visitedButNotAttempted}
              bgColor="bg-[#F3AA01]"
            />
            <StatusRow
              label="न सोडवलेले :"
              count={notAttempted}
              bgColor="bg-[#d32f2f]"
            />
          </div>

          <div className="space-y-3 arya-bold w-3/4 mx-auto cursor-pointer">
            <ModalButton onClick={onSubmit} text="सबमिट करा" variant="secondary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmationModal;
