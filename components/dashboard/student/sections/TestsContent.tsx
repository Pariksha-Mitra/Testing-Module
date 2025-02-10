"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "@/styles/scrollbar.css";

interface TestItem {
  type: "practice" | "class";
  title: string;
  imageSrc: string;
  description: string;
  onclick?: string; 
  buttonText: string;
}

const testItems: TestItem[] = [
  {
    type: "practice",
    title: "सराव चाचणी",
    imageSrc: "/paper.svg",
    description: "तुमच्या पाठ्यपुस्तकातील धड्यांमधील प्रश्नांचा सराव करा",
    onclick: "/practice-test",
    buttonText: "सोडवा",
  },
  {
    type: "class",
    title: "वर्ग चाचणी",
    imageSrc: "/test-paper.png",
    description: "तुमच्या शिक्षकांनी तयार केलेली वर्ग चाचणी सोडवा",
    onclick: "/class-test",
    buttonText: "सोडवा",
  },
];

const TestsContent: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative flex  flex-col md:flex-row flex-wrap gap-6 w-full overflow-y-auto thin-scrollbar">
      {testItems.map((item) => (
        <div
          key={item.type}
          className="bg-white bg-opacity-90 rounded-[20px] flex flex-col items-center p-2 pb-3 flex-1"
        >
          <h3 className="text-3xl md:text-4xl text-center text-black rozha-one-regular">
            {item.title}
          </h3>
          <Image
            src={item.imageSrc}
            alt={item.title}
            width={50}
            height={50}
            priority
            className="my-1"
          />
          <p className="text-lg md:text-xl text-center text-black px-3 flex-grow arya-regular">
            {item.description}
          </p>
          <button
            onClick={() => item.onclick && router.push(item.onclick)}
            className="w-[95%] mt-1 arya-bold px-10 py-2 rounded-[12px] bg-white text-[#E5B800] text-xl font-bold border border-[#E5B800] shadow-lg hover:bg-[#E5B800] hover:text-white hover:border-white transition"
          >
            {item.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TestsContent;
