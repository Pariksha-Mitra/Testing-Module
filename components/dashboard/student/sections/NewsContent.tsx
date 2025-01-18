"use client";

import React from "react";
import { NewsItemProps } from "@/utils/types";
import { NewsList } from "@/components/dashboard/student/sections/current-news/newsList";

interface NewsContentProps {
  news: NewsItemProps[];
}

const NewsContent: React.FC<NewsContentProps> = ({ news }) => {
  return <NewsList items={news} />;
};

export default NewsContent;
