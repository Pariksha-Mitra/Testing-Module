"use client";
import React, {
  FC,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import clsx from "clsx";
import AddOptionModal from "./AddOptionModal";
import { DropdownProps } from "@/utils/types";
import "@/styles/scrollbar.css";

const Dropdown: FC<DropdownProps> = ({
  items,
  label = "क्र.",
  onSelect,
  defaultValue,
  className = "",
  id,
  buttonBgColor = "bg-[#6378fd]",
  buttonBorderWidth = "border-[1.5px]",
  buttonBorderColor = "border-black",
  containerClass = "",
  selected: controlledSelected,
  onChange,
  allowAddOption = false,
  allowAddOptionText = "Add new option",
  onAddOption,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Local selected state for uncontrolled usage
  const [selected, setSelected] = useState<string | number | null>(
    controlledSelected ?? defaultValue ?? null
  );

  // Keep track of which index is currently highlighted for arrow key navigation
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // Local options, including any newly added
  const [options, setOptions] = useState<(string | number)[]>(items);

  // States for displaying the modal
  const [showModal, setShowModal] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Keep selected in sync with controlled props or defaultValue changes
  useEffect(() => {
    if (controlledSelected !== undefined) {
      setSelected(controlledSelected);
    } else {
      setSelected(defaultValue ?? null);
    }
  }, [defaultValue, controlledSelected]);

  // Precompute the final list of items we will render
  const finalOptions = useMemo(() => {
    const safeText =
      typeof allowAddOptionText === "string" || typeof allowAddOptionText === "number"
        ? allowAddOptionText
        : JSON.stringify(allowAddOptionText);

    return allowAddOption ? [safeText, ...options] : options;
  }, [allowAddOption, allowAddOptionText, options]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close the dropdown if user clicks outside
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    },
    [listRef, buttonRef]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      setHighlightedIndex(-1);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  // Handle when a user clicks an option
  const handleOptionClick = useCallback(
    (option: string | number, index: number) => {
      // If the first item is "Add new option" text, open the modal
      if (allowAddOption && index === 0) {
        setIsOpen(false);
        setShowModal(true);
        return;
      }

      if (controlledSelected !== undefined) {
        // Controlled mode
        onSelect?.(option);
        onChange?.(option);
      } else {
        // Uncontrolled mode
        setSelected(option);
        onSelect?.(option);
        onChange?.(option);
      }
      setIsOpen(false);
      buttonRef.current?.focus();
    },
    [allowAddOption, onSelect, onChange, controlledSelected]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev < finalOptions.length - 1 ? prev + 1 : 0
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : finalOptions.length - 1
        );
      } else if (event.key === "Enter" || event.key === " ") {
        // If we have a highlighted option, select it
        if (highlightedIndex >= 0 && highlightedIndex < finalOptions.length) {
          handleOptionClick(finalOptions[highlightedIndex], highlightedIndex);
        }
      } else if (event.key === "Tab") {
        // Close the dropdown if user tabs away
        setIsOpen(false);
      }
    },
    [highlightedIndex, finalOptions, handleOptionClick]
  );

  // When a new option is confirmed from the modal
  const handleModalConfirm = useCallback(
    (newValue: string) => {
      if (!options.includes(newValue)) {
        setOptions((prev) => [...prev, newValue]);
        onAddOption?.(newValue); // notify the parent if needed
      }
      setShowModal(false);
    },
    [options, onAddOption]
  );

  // Rendered options
  const renderedOptions = useMemo(() => {
    return finalOptions.map((option, index) => {
      const isSelected = selected === option;
      const isHighlighted = highlightedIndex === index;
      const isAddOptionText = allowAddOption && index === 0;

      return (
        <li
          key={`${option}-${index}`}
          role="option"
          aria-selected={isSelected}
          onClick={() => handleOptionClick(option, index)}
          onMouseEnter={() => setHighlightedIndex(index)}
          className={clsx(
            "cursor-pointer",
            isSelected ? "bg-blue-100" : isHighlighted ? "bg-blue-50" : "bg-white",
            "hover:bg-blue-50",
            index !== finalOptions.length - 1 && "border-b border-gray-200",
            "px-4 py-2",
            isAddOptionText && "text-[#0019fb] "
          )}
        >
          {option}
        </li>
      );
    });
  }, [finalOptions, selected, highlightedIndex, handleOptionClick, allowAddOption]);

  return (
    <div className={clsx("laila-regular relative w-full", className, containerClass)}>
      {/* Dropdown button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={id ? `${id}-listbox` : "dropdown-listbox"}
        className={clsx(
          "mt-2 flex items-center",
          buttonBgColor,
          "text-white px-3 py-2 rounded-[20px] shadow-2xl gap-2",
          buttonBorderWidth,
          buttonBorderColor,
          "w-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500",
          "h-[50px] text-left"
        )}
      >
        <span className="mr-2 flex-grow">{label}</span>
        <div className="w-[80%] h-8 bg-white rounded-lg flex items-center justify-center text-black mr-2 overflow-hidden whitespace-nowrap text-ellipsis">
          {selected !== null ? selected : "-"}
        </div>

        <svg className={clsx(
          "w-4 h-4 transform transition-transform duration-200",
          isOpen ? "rotate-0" : "rotate-180"
        )} xmlns="http://www.w3.org/2000/svg" version="1.0" width="1280.000000pt" height="1153.000000pt" viewBox="0 0 1280.000000 1153.000000" preserveAspectRatio="xMidYMid meet">


          <g transform="translate(0.000000,1153.000000) scale(0.100000,-0.100000)" fill="#ffffff" stroke="none">
            <path d="M6300 11519 c-423 -46 -838 -228 -1114 -490 -118 -111 -201 -217 -289 -364 -216 -364 -4708 -8206 -4742 -8280 -208 -444 -205 -916 9 -1361 226 -470 672 -835 1179 -965 225 -57 -205 -53 5032 -56 3271 -3 4831 0 4898 7 494 52 915 308 1198 729 156 231 256 484 306 776 21 124 24 452 5 570 -28 172 -78 338 -160 535 -202 484 -448 929 -992 1795 -507 806 -375 581 -2120 3630 -821 1436 -1520 2655 -1553 2710 -86 146 -145 221 -260 331 -231 222 -515 359 -873 420 -109 18 -409 26 -524 13z" />
          </g>
        </svg>




      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          id={id ? `${id}-listbox` : "dropdown-listbox"}
          className="absolute thin-scrollbar left-0 mt-1 w-full bg-white text-black text-center rounded-[20px] shadow-lg z-10 max-h-52 overflow-y-auto"
          onKeyDown={handleKeyDown}
        >
          {renderedOptions}
        </ul>
      )}

      {/* Separated Modal Component */}
      <AddOptionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleModalConfirm}
        title="नवीन तयार करा"
        placeholder="enter name here"
      />
    </div>
  );
};

Dropdown.displayName = "Dropdown";

export default React.memo(Dropdown);
