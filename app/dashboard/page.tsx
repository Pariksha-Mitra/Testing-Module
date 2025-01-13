"use client";
import "@/styles/scrollbar.css";
import DonutChart from "@/components/dashboard/student/DonutChart";
import Image from "next/image";
import { NewsItemProps, ROLE } from "@/utils/types";
import { NewsList } from "@/components/dashboard/student/current-news/newsList";

const Page = () => {
  const role = ROLE.Student;

  const data = [
    { color: "#FF6384", value: 20, label: "parameter 1" },
    { color: "#FFCD56", value: 15, label: "parameter 2" },
    { color: "#36A2EB", value: 25, label: "parameter 3" },
    { color: "#4BC0C0", value: 30, label: "parameter 4" },
    { color: "#9966FF", value: 10, label: "parameter 5" },
  ];
  const total = data.reduce((sum, seg) => sum + seg.value, 0);

  const news: NewsItemProps[] = [
    { id: "1", isNew: true, title: "Title" },
    { id: "2", isNew: true, title: "Title" },
    { id: "3", isNew: false, title: "Title" },
    { id: "4", isNew: false, title: "Title" },
    { id: "5", isNew: false, title: "Title" },
    { id: "6", isNew: false, title: "Title" },
    { id: "7", isNew: false, title: "Title" },
    { id: "8", isNew: false, title: "Title" },
    { id: "9", isNew: false, title: "Title" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 mt-4 w-full h-[79%]">
      {role === ROLE.Student ? (
        <>
          <div className="bg-[#7CD9FE] rounded-[20px] shadow-lg border border-black  ">
            <div className="mt-2 self-center text-4xl text-center text-black arya-bold">
              सध्याच्या गोष्टी
            </div>
            <NewsList items={news} />
          </div>

          <div className="bg-[#FC708A] rounded-2xl shadow-lg border border-black w-full max-w-[800px] mx-auto  ">
            {/* Pink header */}
            <div className="mt-2 text-4xl pb-2  text-center text-black arya-bold ">
              विश्लेषण
            </div>

            {/* White body */}
            <div className="bg-white border border-black rounded-2xl mx-4 mb-4 h-[77%] just">
              <div className="flex items-center justify-center ">
                <DonutChart segments={data} total={total} centerValue={75} />
              </div>
            </div>
          </div>

          <div className="relative bg-[#CBD32E] flex flex-col items-center rounded-[20px] shadow-lg border border-black ">
            {/* Top-Right Image */}
            <img
              src="/top-right.png"
              alt="Top Right"
              className="absolute top-[-4px] right-[-8px] w-40 h-40 z-0"
            />

            {/* Bottom-Left Image */}
            <img
              src="/bottom-left.png"
              alt="Bottom Left"
              className="absolute bottom-[-13px] left-[-8px] w-40 h-40 z-0"
            />

            {/* Heading */}
            <div className="mt-3 text-4xl pb-2 text-center text-black arya-bold">
              गेम्स
            </div>

            {/* Subheading */}
            <div className="mt-6 text-4xl pb-2 justify-center font-bold text-center text-white arya-bold w-[240px] text-wrap">
              गेम खेळून तुमचे ज्ञान सुधारा
            </div>

            {/* Button */}
            <button
              className="absolute bottom-2 cursor-pointer px-10 py-2 w-[95%] rounded-[16px] bg-white text-[#727809] text-2xl arya-bold
           border-[1.5px] border-[#727809] border-solid shadow-lg hover:bg-[#727809] hover:text-white hover:border-white "
              tabIndex={0}
              role="button"
            >
              आता खेळा!
            </button>
          </div>

          <div className="relative bg-[#F7D827] flex flex-col items-center rounded-[20px] shadow-lg border border-black ">
            <div className="mt-2 text-4xl pb-2 text-center text-black arya-bold">
              चाचण्या
            </div>

            <div className="flex flex-row align-middle gap-6 h-full w-full justify-center">
              {/* सराव चाचणी */}
              <div className="bg-white bg-opacity-90 shrink-0 w-[45%] h-[97%] rounded-[20px] text-center flex flex-col items-center">
                <div className="text-3xl text-center text-black rozha-one-regular mt-2">
                  सराव चाचणी
                </div>
                <Image
                  src="/paper.svg"
                  alt="paper"
                  width={80}
                  height={80}
                  className="my-1"
                />
                <div className="text-xl text-center text-black arya-regular px-5">
                  तुमच्या पाठ्यपुस्तकातील धड्यांमधील प्रश्नांचा सराव करा
                </div>
                <button
                  className="absolute bottom-4 cursor-pointer px-10 w-[43%] rounded-[12px] bg-white text-[#E5B800] text-xl arya-bold border-[1.5px] border-[#E5B800] border-solid shadow-lg  hover:bg-[#E5B800] hover:text-white hover:border-white"
                  tabIndex={0}
                  role="button"
                >
                  सोडवा
                </button>
              </div>

              {/* वर्ग चाचणी */}
              <div className="bg-white bg-opacity-90 shrink-0 w-[45%] h-[97%] rounded-[20px] text-center flex flex-col items-center">
                <div className="text-3xl text-center text-black rozha-one-regular mt-2">
                  वर्ग चाचणी
                </div>
                <Image
                  src="/test-paper.png"
                  alt="test-paper"
                  width={80}
                  height={80}
                  className="my-1"
                />
                <div className="text-xl text-center text-black arya-regular px-5">
                  तुमच्या शिक्षकांनी तयार केलेली वर्ग चाचणी सोडवा
                </div>
                <button
                  className="absolute bottom-4 cursor-pointer px-10 w-[43%] rounded-[12px] bg-white text-[#E5B800] text-xl arya-bold border-[1.5px] border-[#E5B800] border-solid shadow-lg  hover:bg-[#E5B800] hover:text-white hover:border-white"
                  tabIndex={0}
                  role="button"
                >
                  सोडवा
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-[#FFFFFF] rounded-[20px] shadow-lg border border-black  "></div>
          <div className="bg-[#FFFFFF] rounded-[20px] shadow-lg border border-black  "></div>
          <div className="bg-[#FFFFFF] rounded-[20px] shadow-lg border border-black  "></div>
          <div className="bg-[#FFFFFF] rounded-[20px] shadow-lg border border-black  "></div>
        </>
      )}
    </div>
  );
};

export default Page;
