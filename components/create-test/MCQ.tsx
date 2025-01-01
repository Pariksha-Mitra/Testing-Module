"use client";
import React, { useState } from "react";

const MCQComponent = () => {
  const [options, setOptions] = useState<string[]>([
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
  ]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  // const addOption = () => {
  //   setOptions([...options, `Option ${options.length + 1}`]);
  // };

  // const removeOption = (index: number) => {
  //   setOptions(options.filter((_, i) => i !== index));
  //   if (selectedOption === index) {
  //     setSelectedOption(null);
  //   } else if (selectedOption !== null && selectedOption > index) {
  //     setSelectedOption(selectedOption - 1);
  //   }
  // };

  return (
    <div className="space-y-4">
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-3 ">
        <button
         
          className={`flex flex-wrap gap-5 justify-between items-center px-6 py-2.5 max-w-full text-center bg-white rounded-3xl border border-black border-solid shadow-lg w-full max-md:pl-5 max-md:mr-2.5 ${
            selectedOption === index
              ? "bg-green-100 "
              : "bg-white border-black"
          }`}
        >
          {index + 1}.
          <span className="flex-1">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full p-2 border rounded-lg border-gray-300"
            />
          </span>
          <span
           onClick={() => handleOptionSelect(index)}
            className={`h-6 w-6 rounded-full shadow-sm border-2 ${
              selectedOption === index
                ? "bg-green-300 border-green-500"
                : "border-gray-300 bg-zinc-300"
            }`}
          ></span>
        </button>
      </div>
      
      ))}
      {/* <button
        onClick={addOption}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Option
      </button> */}
    </div>
  );
};

export default MCQComponent;