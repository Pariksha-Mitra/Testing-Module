import React from 'react';
import { FieldItem } from '@/components/create-test/match-the-pairs/FieldItem';
import { MatchPairsFieldProperties } from '@/utils/types';

interface FieldProps extends MatchPairsFieldProperties {
  editable: boolean;
  className?: string; // Add optional className prop
}

const Field: React.FC<FieldProps> = ({
  title,
  isRightSide,
  values,
  onValueChange,
  onConnect,
  activeItem,
  editable,
  className = '', // Default value
}) => {
  const items = ["a", "b", "c", "d"];

  return (
    <section
      className={`
        flex flex-col px-6 py-4 mx-auto w-full 
        text-xl text-center text-black bg-white 
        rounded-3xl border border-black border-solid shadow-lg 
        max-md:px-5 max-md:mt-10 max-md:max-w-full
        ${!editable ? "opacity-50 pointer-events-none" : ""}
        ${className}
      `}
      aria-label={`${title} field`}
    >
      <h2 className="self-center">{title}</h2>
      {items.map((item) => (
        <button
          key={item}
          onClick={() => editable && onConnect(item)}
          className={`cursor-pointer w-full border-none bg-transparent ${
            activeItem === item ? "bg-gray-200" : ""
          }`}
          disabled={!editable}
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
        </button>
      ))}
    </section>
  );
};

export default Field;
