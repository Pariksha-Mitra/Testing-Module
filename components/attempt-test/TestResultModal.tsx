"use client";

import React from "react";
import Star from "@/public/test-modal-icons/star.svg";
import DashedLine from "@/public/test-modal-icons/dashed-line.svg";

interface TestResultModalProps {
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: string; // raw seconds passed as a string
  totalMarks: number;
  onCheckAnswers: () => void;
  onFinish: () => void;
}

// Helper function to format seconds into "X मिनिटे Y सेकंद"
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes} : ${seconds} मिनिटे`;
};

/**
 * Reusable component to display a result item.
 */
interface InfoItemProps {
  label: string;
  value: string | number;
  valueClassName?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  valueClassName,
}) => (
  <div className="flex items-center justify-center bg-white rounded-[15px] px-6 py-2 shadow-inner relative">
    <span className="absolute left-5">{label}</span>
    <span className={valueClassName+" ml-[100px]"}>{value}</span>
  </div>
);

/**
 * Reusable button component for the modal.
 * Supports two variants: "primary" and "secondary"
 */
interface ModalButtonProps {
  onClick: () => void;
  text: string;
  variant: "primary" | "secondary";
}

const ModalButton: React.FC<ModalButtonProps> = ({
  onClick,
  text,
  variant,
}) => {
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
 * Main TestResultModal component.
 * Uses the reusable InfoItem and ModalButton components.
 */
const TestResultModal: React.FC<TestResultModalProps> = ({
  correctAnswers,
  wrongAnswers,
  timeSpent,
  totalMarks,
  onCheckAnswers,
  onFinish,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-white bg-opacity-5 rounded-xl overflow-hidden shadow-lg border border-black">
      <div className="bg-[#9747FF] text-white py-4 text-center">
        <h1 className="text-4xl font-bold laila-bold">TEST RESULT</h1>
      </div>

      <div className="px-6 py-2">
        {/* Displaying the test result items */}
        <div className="space-y-2 mb-6 laila-semibold w-3/4 justify-center items-center mx-auto text-lg">
          <InfoItem
            label="योग्य उत्तरे :"
            value={correctAnswers}
            valueClassName="text-[#00B42C]"
          />
          <InfoItem
            label="चुकीची उत्तरे :"
            value={wrongAnswers}
            valueClassName="text-[#FF0000]"
          />
          <InfoItem
            label="घेतलेला वेळ :"
            value={formatTime(Number(timeSpent))}
            valueClassName="text-[#FFAB00]"
          />
          <InfoItem
            label="एकूण गुण :"
            value={totalMarks}
            valueClassName="text-[#0059FF]"
          />
        </div>

        {/* Congratulatory message and icons */}
        <div className="text-center mb-6 laila-semibold">
          <div className="text-[#FF637F] text-4xl">शुभेच्छा!</div>

          <div className="my-4 ml-[-40px] w-full">
            <DashedLine />
          </div>

          <div className="text-[#A533FD] text-2xl mb-2">
            चाचणी पूर्ण केल्याबद्दल तुम्हाला एक तारा मिळाला आहे !
          </div>

          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="flex items-center justify-center">
                <Star />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 arya-bold w-3/4 justify-center items-center mx-auto">
          <ModalButton
            onClick={onCheckAnswers}
            text="उत्तरे तपासा"
            variant="primary"
          />
          <ModalButton
            onClick={onFinish}
            text="समाप्त करा"
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
};

export default TestResultModal;
