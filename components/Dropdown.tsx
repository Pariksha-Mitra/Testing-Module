import React from 'react';
import { DropdownProps } from '@/utils/types';

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  title = 'dropdown',
  value,
  onChange,
  id,
  containerClass = '',
  selectClass = '',
  disabled = false,
}) => {
  return (
    <div
      className={`flex bg-[#fc708a] rounded-2xl py-1 px-4 items-center gap-2 border-2 border-white w-full sm:w-[48%] ${containerClass}`}
    >
      <label htmlFor={id} className="text-xl font-light">
        {label}
      </label>
      <select
        id={id}
        title={title}
        className={`px-4 py-1 shadow-md rounded-xl text-black appearance-none w-[80%] ${selectClass}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
