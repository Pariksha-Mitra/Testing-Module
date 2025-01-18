"use client";
import React, { ChangeEvent, useCallback, useState, DragEvent } from "react";
import Image from "next/image";

interface ImageUploadProps {
  uniqueKey: string; // New prop for unique identification
  image: string | null;
  onImageChange: (image: string) => void;
  onRemove: () => void;
  editable: boolean;
  className?: string;
  maxSizeInMB?: number;
  acceptedFileTypes?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  uniqueKey,
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
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileRead = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(`File read successfully for ${uniqueKey}:`, reader.result);
      onImageChange(reader.result as string);
      setIsLoading(false);
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
      console.error(`Error reading file for ${uniqueKey}`);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, [uniqueKey, onImageChange]);

  const handleFileValidation = useCallback(
    (file: File) => {
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setError(`File size must be less than ${maxSizeInMB}MB.`);
        setIsLoading(false);
        return;
      }

      if (!acceptedFileTypes.includes(file.type)) {
        setError(
          "Unsupported file type. Please upload a JPEG, PNG, or GIF image."
        );
        setIsLoading(false);
        return;
      }

      setError(null);
      handleFileRead(file);
    },
    [maxSizeInMB, acceptedFileTypes, handleFileRead]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!editable) return;
      const file = e.target.files?.[0];
      if (file) {
        console.log(`Uploading file for ${uniqueKey}:`, file.name);
        setIsLoading(true);
        handleFileValidation(file);
      }
    },
    [editable, uniqueKey, handleFileValidation]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);
      if (!editable) return;
      const file = e.dataTransfer.files?.[0];
      if (file) {
        console.log(`Dropped file for ${uniqueKey}:`, file.name);
        setIsLoading(true);
        handleFileValidation(file);
      }
    },
    [editable, uniqueKey, handleFileValidation]
  );

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  let content;
  if (image) {
    content = (
      <div className="relative object-contain">
        <Image
          src={image}
          alt="Uploaded"
          layout="responsive"
          width={500}
          height={500}
          onError={() => setError("Failed to load image.")}
        />
        {editable && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm rounded z-10 shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Remove
          </button>
        )}
      </div>
    );
  } else if (editable) {
    content = (
      <div className="flex flex-col items-center justify-center h-full w-full border-2 border-dashed border-gray-300 p-4">
        <label
          htmlFor={`file-upload-${uniqueKey}`}
          className="bg-[#6378fd] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#546aff]"
        >
          Choose File
        </label>
        <input
          id={`file-upload-${uniqueKey}`}
          type="file"
          onChange={handleFileChange}
          accept={acceptedFileTypes.join(",")}
          className="hidden"
        />
        <p className="text-gray-500 mt-2">
          Drag and drop an image or click to upload
        </p>
        {error && (
          <p className="text-red-500 mt-2" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  } else {
    content = (
      <div className="flex items-center justify-center h-full text-gray-500">
        No image uploaded.
      </div>
    );
  }

  return (
    <section
      className={`relative p-2 ${className} ${isDragActive ? "border-4 border-blue-300" : ""
        }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      aria-label="Image upload area"

    >
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-white/50"
          aria-live="polite"
        >
          <span>Loading...</span>
        </div>
      )}
      {content}
    </section>
  );
};

export default ImageUpload;
