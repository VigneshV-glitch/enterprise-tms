import React from 'react';

export interface ToggleOption {
  label: string;
  value: string;
}

interface ToggleGroupProps {
  options: (string | ToggleOption)[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  value,
  onChange,
  className = "",
  size = "sm"
}) => {
  return (
    <div className={`flex flex-wrap items-center bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-[8px] gap-1 ${className}`}>
      {options.map((opt) => {
        const optionLabel = typeof opt === 'string' ? opt : opt.label;
        const optionValue = typeof opt === 'string' ? opt : opt.value;
        const isSelected = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={`px-3 ${size === 'sm' ? 'py-1 text-[11px] leading-[13px]' : 'py-1.5 text-xs'} font-semibold rounded-[5px] transition-all cursor-pointer ${
              isSelected
                ? "bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {optionLabel}
          </button>
        );
      })}
    </div>
  );
};
