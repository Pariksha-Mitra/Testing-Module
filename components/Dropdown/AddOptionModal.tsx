import React, { FC, useCallback, useState } from "react";
import { AddOptionModalProps } from "@/utils/types";
import clsx from "clsx";

const AddOptionModal: FC<AddOptionModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = "नवीन तयार करा",
  placeholder = "enter name here",
  className = "",
}) => {
  const [value, setValue] = useState<string>("");

  // Handler for confirm button
  const handleConfirm = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed !== "") {
      onConfirm(trimmed);
      setValue(""); 
    }
  }, [value, onConfirm]);

  // Handler for cancel button
  const handleCancel = useCallback(() => {
    setValue("");
    onClose();
  }, [onClose]);

  // If not visible, don't render the modal at all
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#ffffff99] z-50">
      <div
        className={clsx(
          "bg-white p-6 rounded-[20px]  shadow-md w-[500px] border border-black",
          className
        )}
      >
        <h3 className="text-2xl  text-black mb-4 text-center rozha-one-regular">
          {title}
        </h3>
        <input
          style={{ boxShadow: "inset 0 2px 8px rgba(95, 95, 95, 0.25)" }}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="border text-black shadow-[0_4px_4px_rgba(0,0,0,0.25)] border-black w-full px-3 py-2 rounded-[15px] mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-center gap-2">
          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="rounded-full flex items-center justify-center w-11 h-11 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
          >
            <svg
              className="w-10 h-10"
              xmlns="http://www.w3.org/2000/svg"
              width="106"
              height="106"
              viewBox="0 0 106 106"
            >
              <circle cx="53" cy="53" r="53" fill="#4CAF50" />
              <path
                d="M30 55 L45 70 L80 35"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="rounded-full flex items-center justify-center w-11 h-11 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
          >
            <svg
              className="w-10 h-10"
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="106.000000pt"
              height="106.000000pt"
              viewBox="0 0 106.000000 106.000000"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,106.000000) scale(0.100000,-0.100000)"
                fill="#ff5023"
                stroke="none"
              >
                <path
                  d="M455 1050 c-109 -17 -238 -83 -306 -156 -168 -181 -189 -459 -52
                  -660 49 -71 80 -100 154 -147 176 -111 403 -107 575 10 71 49 100 80 147 154
                  111 176 107 403 -10 575 -49 71 -80 100 -154 147 -101 64 -243 95 -354 77z
                  m247 -69 c119 -46 223 -148 275 -272 25 -57 27 -76 27 -179 0 -96 -4 -125 -23
                  -172 -48 -123 -159 -233 -280 -279 -70 -26 -197 -35 -273 -20 -263 55 -431
                  332 -363 596 42 161 174 294 336 340 77 21 226 14 301 -14z"
                />
                <path
                  d="M272 784 c-50 -53 -57 -38 73 -166 l90 -89 -102 -101 c-57 -55 -103
                  -103 -103 -106 0 -3 21 -25 46 -49 53 -51 38 -58 165 72 l89 90 104 -104 104
                  -103 47 46 c55 54 61 38 -70 167 l-90 89 104 104 103 104 -46 47 c-54 55 -38
                  61 -168 -70 l-89 -90 -101 103 c-55 56 -104 102 -107 102 -3 0 -25 -21 -49
                  -46z"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOptionModal;
