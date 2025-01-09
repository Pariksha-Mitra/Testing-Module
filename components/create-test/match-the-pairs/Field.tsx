import React from "react";
import { FieldItem } from "@/components/create-test/match-the-pairs/FieldItem";
import { MatchThePairs_FieldProps } from "@/utils/types";

interface FieldProps extends MatchThePairs_FieldProps {
  editable: boolean; // Added editable prop
}

const Field: React.FC<FieldProps> = ({
  title,
  isRightSide,
  values,
  onValueChange,
  onConnect,
  activeItem,
  editable, // Destructure editable
}) => {
  const items = ["a", "b", "c", "d"];

  return (
    <div
      className={`flex flex-col px-6 py-4 mx-auto w-full text-xl text-center text-black bg-white rounded-3xl border border-black border-solid shadow-lg max-md:px-5 max-md:mt-10 max-md:max-w-full ${
        !editable ? "opacity-50 pointer-events-none" : ""
      }`}
      aria-disabled={!editable} // Accessibility attribute
    >
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
          role="button"
          tabIndex={editable ? 0 : -1} // Remove from tab order if not editable
          aria-disabled={!editable} // Accessibility attribute
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              if (editable) onConnect(item);
            }
          }}
        >
          <FieldItem
            id={`${title}-${item}`}
            label={item.toUpperCase()}
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
