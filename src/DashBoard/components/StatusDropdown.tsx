'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';

interface StatusOption {
  value: string;
  label: string;
}

interface StatusDropdownProps {
  value: string;
  options: StatusOption[];
  onChange: (val: string) => void;
  colorConfig: Record<string, string>;
}

export function StatusDropdown({ value, options, onChange, colorConfig }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const defaultColor = 'bg-white text-gray-700 border-gray-300';
  const buttonColor = colorConfig[value] || defaultColor;
  const selectedLabel = options.find(o => o.value === value)?.label || value;

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
      });
    }
    setIsOpen(prev => !prev);
  };

  // Close on scroll or resize
  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        className={`flex items-center gap-2 text-sm font-medium border rounded-full px-3 py-1 cursor-pointer outline-none transition-colors focus:ring-2 focus:ring-offset-1 ${buttonColor}`}
      >
        <span>{selectedLabel}</span>
        <ChevronDown size={14} className="opacity-70" />
      </button>

      {isOpen && typeof window !== 'undefined' && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown menu — rendered at root, positioned via fixed coords */}
          <div
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            className="fixed z-[9999] w-36 rounded-xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden py-1"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  value === option.value
                    ? 'bg-blue-50/50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
