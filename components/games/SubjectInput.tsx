import * as React from 'react';
import { SubjectInputProps } from './types';

export const SubjectInput: React.FC<SubjectInputProps> = ({ label, width, iconSrc }) => {
  return (
    <div className="flex">
      <div className="flex gap-1.5 px-3.5 py-1.5 bg-rose-400 rounded-3xl border border-white border-solid shadow-sm">
        <label className="my-auto" htmlFor={`${label}-input`}>{label}:</label>
        <div className="flex shrink-0 h-9 bg-white rounded-xl" style={{ width }} />
      </div>
      <img
        loading="lazy"
        src={iconSrc}
        alt=""
        className="object-contain shrink-0 self-start mt-2.5 w-10 aspect-[1.43]"
      />
    </div>
  );
};
