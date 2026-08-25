'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FormSelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  value: string | number;
  options: FormSelectOption[];
  onChange: (val: any) => void;
  className?: string;
}

export function FormSelect({ value, options, onChange, className = '' }: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className={`relative inline-block text-left w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer outline-none transition-colors focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-400"
      >
        <span className="truncate pr-2">{selectedLabel}</span>
        <ChevronDown size={14} className="text-gray-400 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute left-0 mt-1 w-full rounded-lg bg-white shadow-lg border border-gray-100 z-50 overflow-hidden py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                  value === option.value 
                    ? 'bg-blue-50/50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
