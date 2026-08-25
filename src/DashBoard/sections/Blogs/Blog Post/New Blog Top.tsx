'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Send, Eye } from 'lucide-react';

interface NewBlogTopProps {
  id?: string;
  isResuming?: boolean;
  saved: boolean;
  saving: boolean;
  handleSave: (status: string) => void;
  onPreview?: () => void;
}

export function NewBlogTop({ id, isResuming, saved, saving, handleSave, onPreview }: NewBlogTopProps) {
  return (
    <div className="flex flex-wrap items-center justify-between bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
      
      {/* Left Side: Back & Title */}
      <div className="flex items-center gap-4 pl-2">
        <Link 
          href="/dashboard/blogs" 
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="w-px h-6 bg-gray-200"></div>
        <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">
          {id ? 'Edit Blog' : isResuming ? 'Continue Draft' : 'Create New Blog'}
        </h2>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center gap-3">
        {saved && (
          <span className="text-green-600 text-xs font-bold px-2 flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            SAVED
          </span>
        )}
        
        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-md transition-colors"
        >
          <Eye size={14} /> PREVIEW
        </button>
        
        <button
          onClick={() => handleSave('draft')}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-md transition-colors disabled:opacity-50"
        >
          <Save size={14} /> SAVE DRAFT
        </button>
        
        <button
          onClick={() => handleSave('published')}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors disabled:opacity-50"
        >
          <Send size={14} /> {saving ? 'PUBLISHING...' : 'PUBLISH'}
        </button>
      </div>
      
    </div>
  );
}
