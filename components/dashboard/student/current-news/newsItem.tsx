import React from "react";
import { NewsItemProps } from "@/utils/types";

const NewsItem: React.FC<NewsItemProps> = React.memo(({
  isNew,
  title,
  onClick,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick) {
      if (e.key === "Enter") {
        onClick();
      } else if (e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={title}
      className={`relative flex p-2 shrink-0 mt-[10px] max-w-full bg-white rounded-lg shadow-md h-9 w-full cursor-pointer ${
        onClick ? "hover:bg-[#ffda33] focus:outline-none focus:ring-2 focus:ring-blue-400" : ""
      }`}
    >
      {isNew && (
        <img
          src="/new.png"
          alt="New"
          className="absolute top-[-8px] left-[-9px] w-7 h-7"
        />
      )}
      <div className="ml-4 flex items-center text-gray-800">{title}</div>
    </div>
  );
});

NewsItem.displayName = "NewsItem";

export { NewsItem };
