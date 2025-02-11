"use client";
import React, { useEffect, useRef, useCallback } from "react";

import RightArrow from "@/public/test-modal-icons/right-arrow.svg";
import Image from "next/image";
import { Rating } from "@mui/material";

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
  <div className="flex flex-row bg-[#9747FF] text-white items-center py-3 px-4 text-wrap w-full relative justify-center">
    <button onClick={onBack} className="absolute left-0">
      <RightArrow />
    </button>
    <h1 className="text-4xl font-bold laila-bold">{title}</h1>
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
        className="relative w-[350px] md:w-[450px] bg-transparent rounded-[20px] shadow-lg overflow-hidden border border-black"
      >
        {/* Modal Header with RightArrow back button */}
        <ModalHeader title={"Feedback"} onBack={onCancel} />

        <div
          id="modal-description"
          className="p-4 px-9 flex flex-col items-center laila-bold bg-white bg-opacity-5"
        >
          <div className="font-semibold text-3xl mb-5 text-center">
            तुम्ही या सराव चाचणीला किती तारे देणार ?
          </div>

          <Image src={"/stars.png"} alt="Stars" height={200} width={200} />
          {/* Rating Component */}

          <div className="flex flex-col items-center">
            <Rating name="feedback-rating" size="large" />

            {/* Refresh Button */}
            <button onClick={() => {}} className="my-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="size-6"
                color="black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={onConfirm}
            className="bg-[#05C665] w-[60%] border-white text-white text-3xl px-9 py-1 rounded border-2 arya-bold mt-8"
          >
            समाप्त करा
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeTestModal;
