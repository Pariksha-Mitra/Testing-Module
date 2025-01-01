"use client";
import React, {
  FC,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

interface CustomDropdownProps {
  items: (string | number)[];
  label?: string;
  onSelect?: (value: string | number) => void;
  defaultValue?: string | number;
  className?: string;
  width?: string | number;
  id?: string;
}

const Dropdown: FC<CustomDropdownProps> = ({
  items,
  label = "क्र.",
  onSelect,
  defaultValue,
  className = "",
  width = "100%",
  id,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | number | null>(
    defaultValue ?? null
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Update selected value when defaultValue changes
  useEffect(() => {
    setSelected(defaultValue ?? null);
  }, [defaultValue]);

  // Toggle dropdown open/close
  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Handle option selection
  const handleOptionClick = useCallback(
    (option: string | number) => {
      setSelected(option);
      setIsOpen(false);
      onSelect?.(option);
      // Return focus to the button after selection
      buttonRef.current?.focus();
    },
    [onSelect]
  );

  // Handle clicks outside the dropdown to close it
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      listRef.current &&
      !listRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  // Add event listener for clicks outside when dropdown is open
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  }, []);

  // Render dropdown options
  const renderedOptions = useMemo(() => {
    return items.map((option, index) => (
      <li
        key={`${option}-${index}`}
        role="option"
        aria-selected={selected === option}
        onClick={() => handleOptionClick(option)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOptionClick(option);
          }
        }}
        tabIndex={0}
        className={`cursor-pointer ${selected === option ? "bg-blue-100" : "bg-white"
          } hover:bg-blue-50 ${index !== items.length - 1 ? "border-b border-gray-200" : ""
          } px-4 py-2`}
      >
        {option}
      </li>
    ));
  }, [items, selected, handleOptionClick]);

  return (
    <div className={`relative ${className}`} style={{ width: width }}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={id ? `${id}-listbox` : "dropdown-listbox"}
        className="mt-2 flex items-center bg-[#6378fd] text-white px-3 py-2 rounded-[16px] shadow border border-gray-300 w-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 h-[50px] text-left"
      >
        <span className="mr-2 flex-grow">{label}</span>
        <div className="w-[80%] h-8 bg-white rounded-lg flex items-center justify-center text-black mr-2 overflow-hidden whitespace-nowrap text-ellipsis">
          {selected !== null ? selected : "-"}
        </div>
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
            }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 12a.997.997 0 0 1-.707-.293l-5-5a1 
               1 0 0 1 1.414-1.414L10 9.586l4.293-4.293a1 
               1 0 1 1 1.414 1.414l-5 5A.997.997 0 0 1 10 12z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          id={id ? `${id}-listbox` : "dropdown-listbox"}
          className="absolute left-0 mt-1 w-full bg-white text-black rounded-md shadow-lg z-10 max-h-52 overflow-y-auto"
          onKeyDown={handleKeyDown}
        >
          {renderedOptions}
        </ul>
      )}
    </div>
  );
};

Dropdown.displayName = "Dropdown";

export default Dropdown;
