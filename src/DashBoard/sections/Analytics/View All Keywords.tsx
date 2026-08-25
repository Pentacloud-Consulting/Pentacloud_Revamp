import React from 'react';
import { Search, Tag } from 'lucide-react';

export function ViewAllKeywords({ keywords = [] }: { keywords: any[] }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Search className="text-blue-500" size={20} />
          All Tracked Keywords
        </h3>
        <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
          {keywords.length} Keywords
        </span>
      </div>
      <div className="p-0 overflow-y-auto h-[500px]">
        {keywords.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
            <Tag className="text-gray-300 mb-3" size={32} />
            <p className="font-medium">No keywords tracked</p>
            <p className="text-sm mt-1">Add keywords to start tracking rankings.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {keywords.map((kw, idx) => (
              <div 
                key={`${kw.keyword}-${idx}`} 
                className={`p-4 flex items-center justify-between transition-colors ${
                  kw.isNew ? 'bg-blue-50/50 hover:bg-blue-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div>
                  <p className={`text-sm font-medium ${kw.isNew ? 'text-blue-700' : 'text-gray-900'} capitalize`}>
                    {kw.keyword}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                    {kw.location || 'English / India'}
                  </p>
                </div>
                <div className="text-right">
                  {kw.isNew ? (
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full animate-pulse">
                      Newly Added
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Pos: {kw.pos}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
