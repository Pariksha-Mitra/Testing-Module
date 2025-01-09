"use client";

import React, { ChangeEvent, useCallback } from "react";

interface ImageUploadProps {
  image: string | null;
  onImageChange: (image: string) => void;
  onRemove: () => void;
  editable: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  image,
  onImageChange,
  onRemove,
  editable,
  className,
}) => {
  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!editable) return;
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onImageChange(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageChange, editable]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (!editable) return;
      const clipboardItems = e.clipboardData?.items;
      if (clipboardItems) {
        for (const item of clipboardItems) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                onImageChange(reader.result as string);
              };
              reader.readAsDataURL(file);
              break;
            }
          }
        }
      }
    },
    [onImageChange, editable]
  );

  return (
    <div
      className={`relative  ${className}`}
      onPaste={handlePaste}
      aria-disabled={!editable}
    >
      {image ? (
        <div className="relative object-contain">
          <img src={image} alt="Question" className="w-full h-full object-contain" />
          {editable && (
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm rounded"
              disabled={!editable}
              aria-disabled={!editable}
            >
              Remove
            </button>
          )}
        </div>
      ) : editable ? (
        <div className="flex flex-col items-center justify-center h-full w-full">
          {/* HIDE the input and style the label as our button */}
          <label
            htmlFor="file-upload"
            className="bg-[#6378fd] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#546aff]"
          >
            Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={!editable}
            className="hidden"
            aria-disabled={!editable}
          />
          <p className="text-gray-500 mt-2">Upload an image or paste one</p>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No image uploaded.
        </div>
      )}
    </div>
  );
};

export default React.memo(ImageUpload);
