"use client";
import DonutChart from "@/components/dashboard/student/DonutChart";
import Image from "next/image";
import { NewsItemProps, ROLE } from "@/utils/types";
import { NewsList } from "@/components/dashboard/student/current-news/newsList";
import "@/styles/scrollbar.css";

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
    { id: "1", isNew: true, title: "Title 1" },
    { id: "2", isNew: true, title: "Title 2" },
    { id: "3", isNew: false, title: "Title 3" },
    { id: "4", isNew: false, title: "Title 4" },
    { id: "5", isNew: false, title: "Title 5" },
    { id: "6", isNew: false, title: "Title 6" },
    { id: "7", isNew: false, title: "Title 7" },
    { id: "8", isNew: false, title: "Title 8" },
    { id: "9", isNew: false, title: "Title 9" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-6 mt-4 w-full h-full">
      {role === ROLE.Student ? (
        <>
          {/* News Section */}
          <div className="bg-[#7CD9FE] rounded-[20px] shadow-lg border border-black p-6 flex flex-col ">
            <h2 className="text-4xl text-center text-black font-bold mb-4 arya-bold">
              सध्याच्या गोष्टी
            </h2>
            <NewsList items={news} />
          </div>

          {/* Analysis Section */}
          <div className="bg-[#FC708A] rounded-2xl shadow-lg border border-black p-6 flex flex-col">
            <h2 className="text-4xl text-center text-black font-bold mb-4 arya-bold">
              विश्लेषण
            </h2>
            <div className="flex-grow bg-white border border-black rounded-2xl p-4 flex items-center justify-center overflow-hidden">
              <DonutChart segments={data} total={total} centerValue={75} />
            </div>
          </div>

          {/* Games Section */}
          <div className="relative bg-[#CBD32E] flex min-h-[300px] flex-col items-center justify-center rounded-[20px] shadow-lg border border-black p-6 h-full">
            {/* Top-Right Image */}
            <Image
              src="/top-right.png"
              alt="Top Right"
              width={160}
              height={160}
              className="absolute top-0 right-0 w-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 max-w-full h-auto overflow-hidden"
            />

            {/* Bottom-Left Image */}
            <Image
              src="/bottom-left.png"
              alt="Bottom Left"
              width={160}
              height={160}
              className="absolute bottom-0 left-0 w-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 max-w-full h-auto overflow-hidden"
            />

            <h2 className="text-4xl absolute top-6 z-10 text-center text-black font-bold  arya-bold">
              गेम्स
            </h2>

            <p className="z-10 text-4xl text-center text-white mt-5 arya-bold ">
              गेम खेळून तुमचे
              <p className="z-10 text-4xl text-center text-white mt-1 arya-bold ">
                ज्ञान सुधारा
              </p>
            </p>

            <button className="z-10 arya-bold absolute bottom-3 md:w-[50%] px-16 py-2 rounded-[16px] bg-white text-[#727809] text-lg md:text-2xl font-bold border border-[#727809] shadow-lg hover:bg-[#727809] hover:text-white hover:border-white transition">
              आता खेळा!
            </button>
          </div>

          {/* Tests Section */}
          <div className="bg-[#F7D827] flex flex-col rounded-[20px] shadow-lg border border-black p-6 ">
            <h2 className="text-4xl text-center text-black font-bold mb-4 arya-bold">
              चाचण्या
            </h2>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Practice Test */}
              <div className="bg-white bg-opacity-90 rounded-[20px] flex flex-col items-center p-4 flex-1 ">
                <h3 className="text-3xl md:text-4xl text-center text-black  rozha-one-regular">
                  सराव चाचणी
                </h3>
                <Image
                  src="/paper.svg"
                  alt="Paper"
                  width={80}
                  height={80}
                  className="my-1"
                />
                <p className="text-lg md:text-xl text-center text-black px-3 flex-grow arya-regular">
                  तुमच्या पाठ्यपुस्तकातील धड्यांमधील प्रश्नांचा सराव करा
                </p>
                <button className="mt-2 arya-bold px-10 w-[95%] py-2 rounded-[12px] bg-white text-[#E5B800] text-xl font-bold border border-[#E5B800] shadow-lg hover:bg-[#E5B800] hover:text-white hover:border-white transition">
                  सोडवा
                </button>
              </div>

              {/* Class Test */}
              <div className="bg-white bg-opacity-90 rounded-[20px] flex flex-col items-center p-4 flex-1 min-h-0 ">
                <h3 className="text-3xl md:text-4xl text-center text-black  rozha-one-regular">
                  वर्ग चाचणी
                </h3>
                <Image
                  src="/test-paper.png"
                  alt="Test Paper"
                  width={80}
                  height={80}
                  className="my-1"
                />
                <p className="text-lg md:text-xl text-center text-black px-3 flex-grow arya-regular">
                  तुमच्या शिक्षकांनी तयार केलेली वर्ग चाचणी सोडवा
                </p>
                <button className="mt-2 w-[95%] arya-bold px-10 py-2 rounded-[12px] bg-white text-[#E5B800] text-xl font-bold border border-[#E5B800] shadow-lg hover:bg-[#E5B800] hover:text-white hover:border-white transition">
                  सोडवा
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Placeholder Sections for Non-Student Roles */}
          <div className="bg-white rounded-[20px] shadow-lg border border-black p-6"></div>
          <div className="bg-white rounded-[20px] shadow-lg border border-black p-6"></div>
          <div className="bg-white rounded-[20px] shadow-lg border border-black p-6"></div>
          <div className="bg-white rounded-[20px] shadow-lg border border-black p-6"></div>
        </>
      )}
    </div>
  );
};

export default Page;
