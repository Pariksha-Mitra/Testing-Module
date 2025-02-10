"use client";
import React, { useEffect, useRef, useCallback } from "react";
import QuestionIcon from "@/public/test-modal-icons/QuestionIcon.svg";
import TimeIcon from "@/public/test-modal-icons/TimeIcon.svg";
import PointsIcon from "@/public/test-modal-icons/PointsIcon.svg";
import RightArrow from "@/public/test-modal-icons/right-arrow.svg";

export interface RowData {
  id: string;
  title: string;
  duration: number;
}

interface PracticeTestModalProps {
  row: RowData;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ModalHeader Component
 * Renders a header with a back button (using RightArrow) and a title.
 */
interface ModalHeaderProps {
  title: string;
  onBack: () => void;
}
const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onBack }) => (
  <div className="flex flex-row bg-[#9747FF] text-white items-center py-3 px-4 text-wrap">
    <button onClick={onBack}>
      <RightArrow />
    </button>
    <h1 className="text-4xl font-bold laila-bold text-center flex-1">
      {title}
    </h1>
  </div>
);

/**
 * InfoItem Component
 * Displays an icon and its accompanying text.
 */
interface InfoItemProps {
  icon: React.ReactNode;
  text: string;
  className?: string;
}
const InfoItem: React.FC<InfoItemProps> = ({ icon, text, className }) => (
  <div
    className={`flex flex-row items-center text-xl drop-shadow-md text-white font-medium text-center py-2 rounded-[10px] ${className}`}
  >
    <div className="mr-2">{icon}</div>
    <div>{text}</div>
  </div>
);

/**
 * PracticeTestModal Component
 * Displays details about the practice test along with important instructions and a confirm button.
 */
const PracticeTestModal: React.FC<PracticeTestModalProps> = ({
  row,
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus the modal container when it mounts.
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  // Listen for Escape key press to cancel/close the modal.
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    },
    [onCancel]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px] transition"
      style={{
        background:
          "linear-gradient(to bottom, #FBFFB7 0%, #FFFFFF 56%, #65D4FF 100%)",
      }}
    >
      {/* MODAL CONTAINER */}
      <div
        ref={modalRef}
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="relative w-[350px] md:w-[550px] bg-transparent rounded-[20px] shadow-lg overflow-hidden border border-black"
      >
        {/* Modal Header with RightArrow back button */}
        <ModalHeader title={row.title} onBack={onCancel} />

        <div
          id="modal-description"
          className="p-4 px-9 flex flex-col items-center laila-bold bg-white bg-opacity-5"
        >
          <div className="w-full bg-[#FFDA62] rounded-[15px] mb-6 p-2 text-shadow border border-black shadow-lg">
            <InfoItem
              icon={<QuestionIcon />}
              text={`${row.duration / 2} बहुपर्यायी प्रश्न`}
              className="mb-3"
            />
            <InfoItem
              icon={<TimeIcon />}
              text={`चाचणी सोडवण्यासाठी ${row.duration} मिनिटे`}
              className="mb-3"
            />
            <InfoItem
              icon={<PointsIcon />}
              text="चाचणी पूर्ण केल्यांनतर तारा मिळेल"
            />
          </div>

          <div className="text-red-600 font-bold text-3xl mb-5">
            महत्वाच्या सूचना
          </div>

          <ul className="list-disc list-outside pl-6 text-lg text-gray-800 mb-7 leading-5 laila-semibold">
            <li>प्रत्येक बरोबर उत्तरासाठी ५ गुण दिले जातील.</li>
            <li className="mt-3">
              प्रत्येक प्रश्नाला योग्य वेळ घ्या, घाई करू नका.
            </li>
            <li className="mt-3">
              दिलेली वेळ संपल्यानंतर सोडवलेल्या प्रश्नांची उत्तरे जतन केली
              जातील.
            </li>
          </ul>

          <div
            className="text-[#FB6782] text-4xl mb-8 bg-white rounded-full shadow-lg border laila-semibold inline-block px-5 py-4"
            style={{
              borderRadius: "70%/70%",
              transform: "rotate(0deg)",
            }}
          >
            शुभेच्छा!
          </div>

          <button
            onClick={onConfirm}
            className="bg-[#05C665] w-[60%] border-white text-white text-3xl px-9 py-1 rounded border-2 arya-bold"
          >
            सोडवा
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeTestModal;
