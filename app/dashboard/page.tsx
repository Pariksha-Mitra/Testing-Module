"use client";

import React from "react";
import "@/styles/scrollbar.css";
import { NewsItemProps } from "@/utils/types";
import Section from "@/components/dashboard/common/Section";
import NewsContent from "@/components/dashboard/student/sections/NewsContent";
import AnalysisContent from "@/components/dashboard/student/sections/AnalysisContent";
import GamesContent from "@/components/dashboard/student/sections/GamesContent";
import TestsContent from "@/components/dashboard/student/sections/TestsContent";
import { useSession } from "next-auth/react";
import { Skeleton } from "@mui/material";

const Page: React.FC = () => {
  const { status } = useSession();

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

  const renderContent = () => {
    switch (status) {
      case "authenticated":
        return (
          <>
            {/* News Section */}
            <Section title="सध्याच्या गोष्टी" backgroundColor="bg-[#7CD9FE]">
              <NewsContent news={news} />
            </Section>

            {/* Analysis Section */}
            <Section
              title="विश्लेषण"
              backgroundColor="bg-[#FC708A]"
              rounded="rounded-2xl"
            >
              <AnalysisContent data={data} total={total} />
            </Section>

            {/* Games Section */}
            <Section
              title="गेम्स"
              backgroundColor="bg-[#CBD32E]"
              className="relative min-h-[250px]"
            >
              <GamesContent />
            </Section>

            {/* Tests Section */}
            <Section
              title="चाचण्या"
              backgroundColor="bg-[#F7D827]"
              className="container mx-auto px-4"
            >
              <TestsContent />
            </Section>
          </>
        );

      default:
        return (
          <>
            {/* Placeholder Sections for Unknown Role */}
            <Section title="" backgroundColor="bg-[#7CD9FE]">
              <Skeleton
                className="rounded-[20px]"
                variant="rectangular"
                width="100%"
                height={400}
              />
            </Section>
            <Section title="" backgroundColor="bg-[#FC708A]">
              <Skeleton
                className="rounded-[20px]"
                variant="rectangular"
                width="100%"
                height={400}
              />
            </Section>
            <Section title="" backgroundColor="bg-[#CBD32E]">
              <Skeleton
                className="rounded-[20px]"
                variant="rectangular"
                width="100%"
                height={400}
              />
            </Section>
            <Section title="" backgroundColor="bg-[#F7D827]">
              <Skeleton
                className="rounded-[20px]"
                variant="rectangular"
                width="100%"
                height={400}
              />
            </Section>
          </>
        );
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 mt-5 w-full md:h-[80%]">
      {renderContent()}
    </div>
  );
};

export default Page;
