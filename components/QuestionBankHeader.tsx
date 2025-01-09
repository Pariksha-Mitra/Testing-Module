import React, { useContext, useCallback } from "react";
import Image from "next/image";
import Dropdown from "@/components/Dropdown/Dropdown";
import { SelectionContext } from "@/context/SelectionContext";

export default function QuestionBankHeader() {
  const context = useContext(SelectionContext);
  
  if (!context) {
    throw new Error("QuestionBankHeader must be used within a SelectionProvider");
  }
  
  const { selection, setSelection } = context;

  const handleSelect = useCallback(
    (value: string | number, dropdownId: keyof typeof selection) => {
      const stringValue = typeof value === "number" ? value.toString() : value;
      console.log(`Dropdown ID: ${dropdownId}, Selected value: ${stringValue}`);

      // Update the selection state based on the dropdownId
      setSelection((prevSelection) => ({
        ...prevSelection,
        [dropdownId]: stringValue,
      }));
    },
    [setSelection]
  );

  // Example: You can adjust these arrays to your real data
  const classOptions = ["५", "६", "७", "८", "९", "१०"];
  const subjectOptions = ["विषय १", "विषय २", "विषय ३"];
  const lessonOptions = ["धडा १", "धडा २", "धडा ३"];
  const homeworkOptions = ["स्वाध्याय १", "स्वाध्याय २"];

  return (
    <div className="bg-[#6378fd] text-white flex flex-col items-center p-4 rounded-lg shadow">
      <div className="flex items-center justify-center w-full text-center gap-8">
        <Image src="/question.svg" alt="test-paper" width={100} height={100} />
        <p className="text-8xl font-rozhaOne">प्रश्न संच</p>
        <Image src="/paper.svg" alt="test-paper" width={80} height={80} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between w-full mt-4 gap-2 laila-regular">
        <Dropdown
          id="class-dropdown"
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
          id="lesson-dropdown"
          label="धडा:"
          items={lessonOptions}
          defaultValue={selection.lesson}
          buttonBgColor="bg-[#fc708a]"
          buttonBorderColor="border-white"
          buttonBorderWidth="border-[2px]"
          onSelect={(value) => handleSelect(value, "lesson")}
          className="w-full sm:w-[20%]"
          allowAddOption
          allowAddOptionText={"add lesson"}
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
          allowAddOptionText={"add homework"}
        />
      </div>
    </div>
  );
}
