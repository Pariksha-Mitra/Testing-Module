// /components/Header/QuestionControls.tsx
import React from 'react';
import { Pencil, Check, Trash2 } from 'lucide-react';

interface QuestionControlsProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  onDelete: () => void;
  onCreateTest: () => void;
}

const QuestionControls: React.FC<QuestionControlsProps> = ({
  isEditing,
  onToggleEdit,
  onDelete,
  onCreateTest,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-2 gap-2">
      {/* Marks Input */}
      <div className="flex flex-row justify-center items-center laila-regular text-lg">
        <div className="inline-flex items-center text-white bg-[#FC708A] px-3 py-2 rounded-[15px] border border-black">
          <label htmlFor="marks-input" className="mr-2">
            Marks:
          </label>
          <input
            id="marks-input"
            className="rounded-[10px] py-1 text-black w-16 text-center"
            type="number"
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-4">
        <button
          className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors"
          title={isEditing ? "Save Question" : "Edit Question"}
          onClick={onToggleEdit}
          aria-label={isEditing ? "Save Question" : "Edit Question"}
        >
          {isEditing ? (
            <Check size={24} color="white" />
          ) : (
            <Pencil size={24} color="white" />
          )}
        </button>
        <button
          className="bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors"
          title="Delete Question"
          onClick={onDelete}
          aria-label="Delete Question"
        >
          <Trash2 size={24} color="white" />
        </button>
      </div>

      <button
        className="bg-[#D4FFC0] text-[#015613] border border-[#ACACAC] px-4 py-2 rounded-lg transition-colors font-semibold text-lg cursor-pointer"
        onClick={onCreateTest}
        aria-label="Create Test"
      >
        Create Test
      </button>
    </div>
  );
};

export default QuestionControls;
