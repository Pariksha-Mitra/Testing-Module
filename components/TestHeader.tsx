"use client";
import React, { useState } from "react";
import Dropdown from "@/components/Dropdown";
import Image from "next/image";

export default function TestHeader() {
  const [selection, setSelection] = useState({
    class: "१",
    subject: "विषय १",
    lesson: "धडा १",
    homework: "स्वाध्याय १",
  });

  const handleChange =
    (field: keyof typeof selection) =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelection({ ...selection, [field]: event.target.value });
    };

  const classOptions = [
    { value: "१", label: "१" },
    { value: "२", label: "२" },
    { value: "३", label: "३" },
  ];

  const subjectOptions = [
    { value: "विषय १", label: "विषय १" },
    { value: "विषय २", label: "विषय २" },
    { value: "विषय ३", label: "विषय ३" },
  ];

  const lessonOptions = [
    { value: "धडा १", label: "धडा १" },
    { value: "धडा २", label: "धडा २" },
    { value: "धडा ३", label: "धडा ३" },
  ];

  const homeworkOptions = [
    { value: "स्वाध्याय १", label: "स्वाध्याय १" },
    { value: "स्वाध्याय २", label: "स्वाध्याय २" },
  ];

  return (
    <div className="text-white rounded-lg">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex flex-col items-center p-4 rounded-lg shadow bg-[#6378fd] w-full md:w-1/2">
          {/* Header Section */}
          <div className="flex items-center justify-center w-full text-center gap-8">
            <Image src="/test-paper.png" alt="test-paper" width={70} height={70}/>
            <h1 className="text-3xl rozha-one-bold">चाचणी तयार करा</h1>
          </div>

          {/* Left Section (Input Fields) */}
          <div className="flex flex-wrap justify-between w-full mt-4 gap-2">
            <Dropdown
              id="class-dropdown"
              label="इयत्ता:"
              title="Select Class"
              options={classOptions}
              value={selection.class}
              onChange={handleChange("class")}
            />

            <Dropdown
              id="subject-dropdown"
              label="विषय:"
              title="Select Subject"
              options={subjectOptions}
              value={selection.subject}
              onChange={handleChange("subject")}
            />

            <Dropdown
              id="lesson-dropdown"
              label="धडा:"
              title="Select Lesson"
              options={lessonOptions}
              value={selection.lesson}
              onChange={handleChange("lesson")}
            />

            <Dropdown
              id="homework-dropdown"
              label="स्वाध्याय:"
              title="Select Homework"
              options={homeworkOptions}
              value={selection.homework}
              onChange={handleChange("homework")}
            />
          </div>
        </div>

        <div className="flex flex-col p-4 rounded-lg shadow bg-[#6378fd] w-full md:w-1/2">
          <div className="grid grid-cols-7 gap-4 p-4">
            {/* First row */}
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-green-400 w-10 h-10 text-white rounded-full font-bold">
                1
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-[#a6b1ff] w-10 h-10 text-white rounded-full font-bold">
                +
              </div>
            </div>
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
