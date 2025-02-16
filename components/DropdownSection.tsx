// /components/Header/DropdownSection.tsx
import React from 'react';
import Image from 'next/image';
import { Skeleton } from '@mui/material';
import Dropdown from '@/components/Dropdown/Dropdown';
import { DropdownItem } from '@/utils/types';

interface DropdownSectionProps {
  isAnyLoading: boolean;
  skeletonPlaceholders: string[];
  standards: DropdownItem[];
  subjects: DropdownItem[];
  chapters: DropdownItem[];
  exercises: DropdownItem[];
  selection: {
    standard?: string | null;
    subject?: string | null;
    chapter?: string | null;
    exercise?: string | null;
  };
  handleSelect: (val: string | number, type: string) => void;
  handleAddOption: (newOptionName: string, type: string) => void;
  errorMessages: string[];
}

const DropdownSection: React.FC<DropdownSectionProps> = ({
  isAnyLoading,
  skeletonPlaceholders,
  standards,
  subjects,
  chapters,
  exercises,
  selection,
  handleSelect,
  handleAddOption,
  errorMessages,
}) => {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg shadow bg-[#6378fd] border border-black w-full md:w-1/2">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full text-center gap-8">
        <Image src="/test-paper.png" alt="test-paper" width={70} height={70} />
        <h1 className="text-7xl rozha-one-regular text-white">चाचणी तयार करा</h1>
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap justify-between w-full mr-3 ml-3 gap-2">
        {isAnyLoading ? (
          <div className="grid grid-cols-2 gap-4 w-full">
            {skeletonPlaceholders.map((skeletonKey) => (
              <Skeleton
                key={skeletonKey}
                sx={{ bgcolor: "#a6b1ff" }}
                variant="rectangular"
                width="100%"
                height={45}
                className="rounded-[20px]"
                animation="wave"
              />
            ))}
          </div>
        ) : (
          <>
            <Dropdown
              isDynamic
              id="standard-dropdown"
              items={standards}
              label="इयत्ता:"
              selected={selection.standard ?? undefined}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(val) => handleSelect(val, "standard")}
              className="sm:w-[48%]"
              disabled={false}
              allowAddOption={true}
              allowAddOptionText="Add Standard"
              onAddOption={(newOptionName) => handleAddOption(newOptionName, "standard")}
            />
            <Dropdown
              isDynamic
              id="subject-dropdown"
              items={subjects}
              label="विषय:"
              selected={selection.subject ?? undefined}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(val) => handleSelect(val, "subject")}
              className="sm:w-[48%]"
              disabled={!selection.standard}
              allowAddOption={true}
              allowAddOptionText="Add Subject"
              onAddOption={(newOptionName) => handleAddOption(newOptionName, "subject")}
            />
            <Dropdown
              isDynamic
              id="chapter-dropdown"
              items={chapters}
              label="धडा:"
              selected={selection.chapter ?? undefined}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(val) => handleSelect(val, "chapter")}
              className="sm:w-[48%]"
              disabled={!selection.subject}
              allowAddOption={true}
              allowAddOptionText="Add Chapter"
              onAddOption={(newOptionName) => handleAddOption(newOptionName, "chapter")}
            />
            <Dropdown
              isDynamic
              id="exercise-dropdown"
              items={exercises}
              label="स्वाध्याय:"
              selected={selection.exercise ?? undefined}
              buttonBgColor="bg-[#fc708a]"
              buttonBorderColor="border-white"
              buttonBorderWidth="border-[2px]"
              onSelect={(val) => handleSelect(val, "exercise")}
              className="sm:w-[48%]"
              disabled={!selection.chapter}
              allowAddOption={true}
              allowAddOptionText="Add Exercise"
              onAddOption={(newOptionName) => handleAddOption(newOptionName, "exercise")}
            />
          </>
        )}

        {/* Total Duration Input */}
        <div className="flex flex-col md:flex-row justify-start items-center mt-2 laila-regular text-lg">
          <div className="inline-flex items-center text-white bg-[#FC708A] px-3 py-1 rounded-[15px] border-2 border-white">
            <label htmlFor="total-duration" className="mr-2">
              Total Duration:
            </label>
            <input
              id="total-duration"
              className="rounded-[10px] py-1 text-black w-16 text-center"
              type="number"
              placeholder="0"
              min="0"
            />
          </div>
          <div>
            <span className="px-3 py-2 text-white">(in minutes)</span>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errorMessages.length > 0 && (
        <div className="mt-2">
          {errorMessages.map((msg, idx) => (
            <div key={`${msg}-${idx}`} className="text-red-500 text-sm">
              {msg}
            </div>
          ))}
        </div>
      )}

      {/* Empty Data Messages */}
      {!isAnyLoading && selection.standard && subjects.length === 0 && (
        <div className="mt-2 text-yellow-500 text-sm">
          No subjects available for the selected standard.
        </div>
      )}
      {!isAnyLoading && selection.subject && chapters.length === 0 && (
        <div className="mt-2 text-yellow-500 text-sm">
          No chapters available for the selected subject.
        </div>
      )}
      {!isAnyLoading && selection.chapter && exercises.length === 0 && (
        <div className="mt-2 text-yellow-500 text-sm">
          No exercises available for the selected chapter.
        </div>
      )}
    </div>
  );
};

export default DropdownSection;
