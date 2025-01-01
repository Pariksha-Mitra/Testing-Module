import React from "react";
import { MatchThePairs_FieldItemProps } from "@/utils/types";

const FieldItemComponent: React.FC<MatchThePairs_FieldItemProps> = ({
  label,
  isRight,
  value,
  onChange,
  id,
  isActive,
  onSelect,
}) => {
  return (
    <div className="flex gap-6 mt-2.5 first:mt-5 whitespace-nowrap">
      {isRight && (
        <div
          className={`flex shrink-0 my-auto w-4 h-4 rounded-full shadow-sm bg-zinc-300 cursor-pointer ${
            isActive ? "bg-blue-500" : ""
          }`}
          role="radio"
          tabIndex={0}
          aria-checked={isActive}
          aria-label={`Select ${label}`}
          onClick={onSelect}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSelect();
            }
          }}
        />
      )}
      <div className="flex flex-auto gap-5 py-1 pr-9 pl-3.5 bg-white rounded-3xl border border-black border-solid max-md:pr-5">
        <div className="grow my-auto">{label}</div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex p-2 shrink-0 max-w-full h-9 bg-white rounded-3xl shadow-sm w-[80%] px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Input for ${label}`}
          id={id}
        />
      </div>
      {!isRight && (
        <div
          className={`flex shrink-0 my-auto w-4 h-4 rounded-full shadow-sm bg-zinc-300 cursor-pointer ${
            isActive ? "bg-blue-500" : ""
          }`}
          role="radio"
          tabIndex={0}
          aria-checked={isActive}
          aria-label={`Select ${label}`}
          onClick={onSelect}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSelect();
            }
          }}
        />
      )}
    </div>
  );
};

FieldItemComponent.displayName = "FieldItem";

export const FieldItem = React.memo(FieldItemComponent);
