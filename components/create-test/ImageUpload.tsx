"use client"
import React, { ChangeEvent, useCallback, useState } from 'react';

interface ImageUploadProps {
  image: string | null;
  onImageChange: (image: string) => void;
  onRemove: () => void;
  editable: boolean;
  className?: string;
  // Add validation props
  maxSizeInMB?: number;
  acceptedFileTypes?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  image,
  onImageChange,
  onRemove,
  editable,
  className,
  maxSizeInMB = 5, // Default 5MB
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif"],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!editable) return;
      setIsLoading(true); // Start loading
      const file = e.target.files?.[0];

      try {
        if (file) {
          // Size validation
          if (file.size > maxSizeInMB * 1024 * 1024) {
            throw new Error(`File size must be less than ${maxSizeInMB}MB`);
          }

          // Type validation
          if (!acceptedFileTypes.includes(file.type)) {
            throw new Error("File type not supported");
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            onImageChange(reader.result as string);
            setIsLoading(false); // Stop loading on success
          };
          reader.onerror = () => {
            setError("Error reading file");
            setIsLoading(false); // Stop loading on error
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
        console.error("Error handling file:", error);
        setIsLoading(false); // Stop loading on validation error
      }
    },
    [editable, maxSizeInMB, acceptedFileTypes, onImageChange]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (!editable) return;
      setIsLoading(true); // Start loading
      const clipboardItems = e.clipboardData?.items;
      if (clipboardItems) {
        for (const item of clipboardItems) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                onImageChange(reader.result as string);
                setIsLoading(false); // Stop loading on success
              };
              reader.onerror = () => {
                setError("Error reading pasted file");
                setIsLoading(false); // Stop loading on error
              };
              reader.readAsDataURL(file);
              break;
            }
          }
        }
      }
      setIsLoading(false); // Stop loading if no image found in clipboard
    },
    [onImageChange, editable]
  );

  return (
    <div
      className={`relative  ${className}`}
      onPaste={handlePaste}
      aria-disabled={!editable}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <span>Loading...</span>
        </div>
      )}
      {image ? (
        <div className="relative object-contain">
          <img
            src={image}
            alt="Question"
            className="w-full h-full object-contain"
          />
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
            onChange={handleFileChange}
            accept={acceptedFileTypes.join(",")}
            disabled={!editable}
            aria-label="Upload image"
            className="hidden"
            aria-disabled={!editable}
          />
          <p className="text-gray-500 mt-2">Upload an image or paste one</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      ) : (
        <div className="flex items-c</label>enter justify-center h-full text-gray-500">
          No image uploaded.
        </div>
      )}
    </div>
  );
};

export default React.memo(ImageUpload);
