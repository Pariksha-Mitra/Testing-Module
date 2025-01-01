import React from "react";
import { FieldItem } from "@/components/create-test/match-the-pairs/FieldItem";
import { MatchThePairs_FieldProps } from "@/utils/types";

const Field: React.FC<MatchThePairs_FieldProps> = ({
  title,
  isRightSide,
  values,
  onValueChange,
  onConnect,
  activeItem,
}) => {
  const items = ["a", "b", "c", "d"];

  return (
    <div className="flex flex-col px-6 py-4 mx-auto w-full text-xl text-center text-black bg-white rounded-3xl border border-black border-solid shadow-lg max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="self-center" role="heading" aria-level={2}>
        {title}
      </div>
      {items.map((item) => (
        <div
          key={item}
          onClick={() => onConnect(item)}
          className={`cursor-pointer ${
            activeItem === item ? "bg-gray-200" : ""
          }`}
        >
          <FieldItem
            id={`${title}-${item}`}
            label={item}
            isRight={isRightSide}
            value={values[item]}
            onChange={(value) => onValueChange(item, value)}
            isActive={activeItem === item}
            onSelect={() => onConnect(item)}
          />
        </div>
      ))}
    </div>
  );
};

export default Field;
