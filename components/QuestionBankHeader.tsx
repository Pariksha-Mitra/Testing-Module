"use client";

import Dropdown from "@/components/Dropdown/Dropdown";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import { useSelectionStore } from "@/store/selectionStore";


export default function QuestionBankHeader() {

  const { selection, setSelection } = useSelectionStore();
  

  const handleSelect = useCallback(
    (value: string | number, dropdownId: keyof typeof selection) => {
      const stringValue = typeof value === "number" ? value.toString() : value;
      console.log(`Dropdown ID: ${dropdownId}, Selected value: ${stringValue}`);

      setSelection((prevSelection) => ({
        ...prevSelection,
        [dropdownId]: stringValue,
      }));
    },
    [setSelection]
  );

  // Example data (replace with your own or fetch dynamically)
  const classOptions = useMemo(() => ["५", "६", "७", "८", "९", "१०"], []);
  const subjectOptions = useMemo(() => ["विषय १", "विषय २", "विषय ३"], []);
  const lessonOptions = ["धडा १", "धडा २", "धडा ३"];
  const homeworkOptions = ["स्वाध्याय १", "स्वाध्याय २"];

  return (
    <div
      className="
        bg-[#6378fd] 
        text-white 
        flex flex-col 
        items-center 
        p-4 
        rounded-lg 
        shadow
      "
    >
      {/* Title Section */}
      <div
        className="
          flex flex-wrap 
          items-center 
          justify-center 
          w-full 
          text-center 
          gap-4 
          sm:gap-2
        "
      >
        <Image
          src="/question.svg"
          alt="test-paper"
          width={80}
          height={80}
          className="max-sm:mb-2"
        />
        <p className="font-rozhaOne text-4xl sm:text-6xl md:text-8xl">
          प्रश्न संच
        </p>
        <Image
          src="/paper.svg"
          alt="test-paper"
          width={60}
          height={60}
          className="max-sm:mt-2"
        />
      </div>

      {/* Dropdowns Section */}
      <div
        className="
          flex flex-col 
          sm:flex-row 
          justify-between 
          w-full 
          mt-4 
          gap-2 
          laila-regular
        "
      >
        <Dropdown
          id="standard-dropdown"
          items={classOptions}
          label="इयत्ता:"
          defaultValue={selection.class}
          buttonBgColor="bg-[#fc708a]"
          buttonBorderColor="border-white"
          buttonBorderWidth="border-[2px]"
          onSelect={(value) => handleSelect(value, "class")}
          className="w-full sm:w-[20%]"
        />
        <Dropdown
          id="subject-dropdown"
          label="विषय:"
          items={subjectOptions}
          defaultValue={selection.subject}
          buttonBgColor="bg-[#fc708a]"
          buttonBorderColor="border-white"
          buttonBorderWidth="border-[2px]"
          onSelect={(value) => handleSelect(value, "subject")}
          className="w-full sm:w-[20%]"
        />
        <Dropdown
          id="chapter-dropdown"
          label="धडा:"
          items={lessonOptions}
          defaultValue={selection.lesson}
          buttonBgColor="bg-[#fc708a]"
          buttonBorderColor="border-white"
          buttonBorderWidth="border-[2px]"
          onSelect={(value) => handleSelect(value, "lesson")}
          className="w-full sm:w-[20%]"
          allowAddOption
          allowAddOptionText="add lesson"
        />
        <Dropdown
          id="homework-dropdown"
          label="स्वाध्याय:"
          items={homeworkOptions}
          defaultValue={selection.homework}
          buttonBgColor="bg-[#fc708a]"
          buttonBorderColor="border-white"
          buttonBorderWidth="border-[2px]"
          onSelect={(value) => handleSelect(value, "homework")}
          className="w-full sm:w-[20%]"
          allowAddOption
          allowAddOptionText="add homework"
        />
      </div>
    </div>
  );
}
