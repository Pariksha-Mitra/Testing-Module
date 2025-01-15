import React from "react";
import { NewsItem } from "@/components/dashboard/student/current-news/newsItem";
import { NewsItemProps } from "@/utils/types";
import "@/styles/scrollbar.css";

export interface NewsListProps {
  items: NewsItemProps[];
  onItemClick?: (id: string) => void;
}

export const NewsList: React.FC<NewsListProps> = ({ items, onItemClick }) => {
  const handleItemClick = React.useCallback((id: string) => {
    if (onItemClick) {
      onItemClick(id);
    }
  }, [onItemClick]);

  return (
    <div className="flex flex-col items-start w-full pl-5 pr-5 overflow-y-auto max-h-[80%] no-scrollbar ">
      {items.map((item) => (
        <NewsItem
          key={item.id}
          id={item.id}
          isNew={item.isNew}
          title={item.title}
          onClick={() => handleItemClick(item.id)}
        />
      ))}
    </div>
  );
};
