import React, { useState } from 'react';
import { X, Search, ChevronDown, Check } from 'lucide-react';

interface AddKeywordProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (keywords: string[], location: string) => void;
}

export function AddKeywordModal({ isOpen, onClose, onAdd }: AddKeywordProps) {
  const [inputText, setInputText] = useState('');
  const [location, setLocation] = useState('Dubai, UAE');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const locations = [
    'Dubai, UAE',
    'Qatar',
    'UAE (All Emirates)',
    'India',
    'Global / Worldwide'
  ];

  if (!isOpen) return null;

  const handleAdd = () => {
    // split by comma or newline and filter empty strings
    const keywords = inputText
      .split(/[\n,]+/)
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    if (keywords.length > 0) {
      onAdd(keywords, location);
      setInputText('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col overflow-visible transform transition-transform animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-blue-600" />
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Add Keywords</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 bg-white">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Enter Keywords</label>
            <p className="text-xs text-gray-500 mb-3">Paste multiple keywords separated by commas or new lines.</p>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-36 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm text-gray-900 resize-none"
              placeholder="salesforce crm transform sales&#10;zoho vs microsoft 365&#10;cloud migration strategies"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Location</label>
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full p-3 border rounded-md text-sm font-medium flex justify-between items-center transition-all bg-gray-50 ${
                  isDropdownOpen 
                    ? 'border-blue-500 ring-2 ring-blue-500/30 text-blue-700' 
                    : 'border-gray-300 text-gray-800 hover:border-gray-400'
                }`}
              >
                {location}
                <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-blue-500' : 'text-gray-500'}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
                  {locations.map((loc) => (
                    <div 
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                        location === loc 
                          ? 'bg-blue-50 text-blue-700 font-bold' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {loc}
                      {location === loc && <Check size={16} className="text-blue-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded text-xs font-bold hover:bg-gray-100 uppercase tracking-wider transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleAdd}
            disabled={inputText.trim().length === 0}
            className="px-5 py-2.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            Add to Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
