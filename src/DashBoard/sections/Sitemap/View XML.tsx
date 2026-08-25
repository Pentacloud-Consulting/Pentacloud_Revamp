import React from 'react';
import { X, Code } from 'lucide-react';

interface ViewXMLProps {
  isOpen: boolean;
  onClose: () => void;
  xmlContent: string;
}

export function ViewXML({ isOpen, onClose, xmlContent }: ViewXMLProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 text-gray-800">
            <Code size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold">Raw sitemap.xml</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-[#0D1B2A]">
          <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
            <code>{xmlContent || 'No XML data available.'}</code>
          </pre>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
