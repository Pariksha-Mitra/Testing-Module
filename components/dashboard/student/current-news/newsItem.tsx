import React from "react";
import Image from "next/image";
import { NewsItemProps } from "@/utils/types";

const NewsItem: React.FC<NewsItemProps> = React.memo(({
  isNew,
  title,
  onClick,
}) => {
  const content = (
    <>
      {isNew && (
        <Image
          src="/new.png"
          alt="New"
          width={28} 
          height={28} 
          className="absolute top-[-8px] left-[-9px]"
        />
      )}
      <div className="ml-4 flex items-center text-gray-800">{title}</div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={title}
        className="relative flex p-2 shrink-0 mt-[9px] max-w-full bg-white rounded-lg shadow-md h-9 w-full cursor-pointer hover:bg-[#ffda33] focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {content}
      </button>
    );
  }

  return (
    <div
      aria-label={title}
      className="relative flex p-2 shrink-0 mt-[10px] max-w-full bg-white rounded-lg shadow-md h-9 w-full"
    >
      {content}
    </div>
  );
});

NewsItem.displayName = "NewsItem";

export { NewsItem };
