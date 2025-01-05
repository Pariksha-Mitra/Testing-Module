"use client";
import React, { useCallback, useMemo, useState } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import Image from "next/image";

export default function TestHeader() {
  // Initialize selection state
  const [selection, setSelection] = useState({
    class: "५",
    subject: "विषय १",
    lesson: "धडा १",
    homework: "स्वाध्याय १",
  });

  /**
   * Handler for dropdown selection changes.
   * @param value - The selected value from the dropdown.
   * @param dropdownKey - The key corresponding to the dropdown (e.g., 'class', 'subject').
   */
  const handleSelect = useCallback(
    (value: string | number, dropdownKey: string) => {
      console.log(`Dropdown Key: ${dropdownKey}, Selected value: ${value}`);

      // Update the selection state based on the dropdownKey
      setSelection((prevSelection) => ({
        ...prevSelection,
        [dropdownKey]: value,
      }));
    },
    []
  );

  // Define dropdown options using useMemo for performance optimization
  const classOptions = useMemo(() => ["५", "६", "७", "८", "९", "१०"], []);
  const subjectOptions = useMemo(() => ["विषय १", "विषय २", "विषय ३"], []);
  const lessonOptions = useMemo(() => ["धडा १", "धडा २", "धडा ३"], []);
  const homeworkOptions = useMemo(() => ["स्वाध्याय १", "स्वाध्याय २"], []);

  return (
    <div className="text-white rounded-lg">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Left Section: Dropdowns and Header */}
        <div className="flex flex-col items-center p-4 rounded-lg shadow bg-[#6378fd] w-full md:w-1/2">
          {/* Header Section */}
          <div className="flex items-center justify-center w-full text-center gap-8">
            <Image
              src="/test-paper.png"
              alt="test-paper"
              width={70}
              height={70}
            />
            <h1 className="text-6xl rozha-one-regular">चाचणी तयार करा</h1>
          </div>

          {/* Dropdowns Section */}
          <div className="flex flex-wrap justify-between w-full mr-3 ml-3 gap-2">
            {/* Class Dropdown */}
            <Dropdown
              id="class-dropdown"
              items={classOptions}
              label="इयत्ता:"
              selected={selection.class}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(value) => handleSelect(value, "class")}
              className="sm:w-[48%]"
              
            />

            {/* Subject Dropdown */}
            <Dropdown
              id="subject-dropdown"
              label="विषय:"
              items={subjectOptions}
              selected={selection.subject}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(value) => handleSelect(value, "subject")}
              className="sm:w-[48%]"
            />

            {/* Lesson Dropdown */}
            <Dropdown
              id="lesson-dropdown"
              label="धडा:"
              items={lessonOptions}
              selected={selection.lesson}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(value) => handleSelect(value, "lesson")}
              className="sm:w-[48%]"
              allowAddOption
              allowAddOptionText="add lesson"
            />

            {/* Homework Dropdown */}
            <Dropdown
              id="homework-dropdown"
              label="स्वाध्याय:"
              items={homeworkOptions}
              selected={selection.homework}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(value) => handleSelect(value, "homework")}
              className="sm:w-[48%]"
              allowAddOption
              allowAddOptionText="add homework"
            />
          </div>
        </div>

        {/* Right Section: Visual Representation */}
        <div className="flex flex-col p-4 rounded-lg shadow bg-[#6378fd] w-full md:w-1/2">
          <div className="grid grid-cols-7 gap-4 p-4">
            {/* First Item */}
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-green-400 w-10 h-10 text-white rounded-full font-bold laila-regular">
                1
              </div>
            </div>

            {/* Plus Icon */}
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-[#a6b1ff] w-10 h-10 text-white rounded-full font-bold">
                +
              </div>
            </div>

            {/* Additional Items */}
            {[...Array(19)].map((_, index: number) => (
              <div
                key={index + 2}
                className="flex items-center justify-center bg-[#a6b1ff] w-10 h-10 text-white rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
