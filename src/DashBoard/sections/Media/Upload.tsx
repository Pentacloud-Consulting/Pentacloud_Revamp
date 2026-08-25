'use client';

import { Link, CheckCircle2, Circle } from 'lucide-react';

interface UploadProps {
  media: any[];
  onUpdateAltText: (id: string, text: string) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  isSidebarOpen?: boolean;
  onItemClick?: (id: string) => void;
  onCopy?: (text: string) => void;
}

export function Upload({ media, onUpdateAltText, selectedIds, onToggleSelect, isSidebarOpen, onItemClick, onCopy }: UploadProps) {
  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-xl border-dashed">
        <p className="text-gray-500 font-medium">No media files found.</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or upload new images.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ${isSidebarOpen ? 'xl:grid-cols-5' : 'xl:grid-cols-8'} gap-3 transition-all duration-300`}>
      {media.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        
        return (
          <div 
            key={item.id} 
            className={`bg-white rounded border ${isSelected ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-gray-200 shadow-sm hover:shadow hover:border-blue-300'} transition-all duration-200 overflow-hidden group flex flex-col cursor-default`}
          >
            
            {/* Top Section: Image */}
            <div 
              className="aspect-square relative overflow-hidden bg-gray-100 border-b border-gray-200 cursor-pointer"
              onClick={() => onItemClick && onItemClick(item.id)}
            >
              <img src={item.url} alt={item.alt_text} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              
              {/* Badges */}
              <div className="absolute top-1.5 left-1.5 flex gap-1 z-10">
                {!item.alt_text && (
                  <span className="bg-amber-400 text-amber-900 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase">No Alt</span>
                )}
                <span className="bg-black/70 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase">Public</span>
              </div>
            </div>

            {/* Middle Section: Info and Actions */}
            <div className="flex items-start justify-between p-2 gap-1 bg-white border-b border-gray-100">
              {/* Left: Name, Path, Dash */}
              <div className="flex flex-col min-w-0 flex-1 leading-tight">
                <span className="text-xs font-semibold text-gray-900 truncate" title={item.filename}>{item.filename}</span>
                <span className="text-[9px] text-gray-500 truncate mt-0.5" title={`/uploads/${item.filename}`}>/uploads/{item.filename}</span>
                <span className="text-[9px] text-gray-400 mt-1">—</span>
              </div>

              {/* Right: Buttons */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => onCopy && onCopy(item.url)}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Copy URL"
                >
                  <Link size={12} />
                </button>
                <button 
                  onClick={() => onToggleSelect(item.id)} 
                  className={`p-1 rounded transition-colors ${isSelected ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                  title={isSelected ? "Deselect" : "Select Image"}
                >
                  {isSelected ? <CheckCircle2 size={14} className="fill-blue-100" /> : <Circle size={14} />}
                </button>
              </div>
            </div>

            {/* Bottom Section: Alt Text Input */}
            <div className="p-3 bg-gray-50">
              <input
                type="text"
                defaultValue={item.alt_text}
                onBlur={e => onUpdateAltText(item.id, e.target.value)}
                placeholder="Add alt text for SEO..."
                className={`w-full text-xs px-3 py-2 border rounded-md outline-none transition-all ${
                  !item.alt_text 
                    ? 'border-amber-200 bg-amber-50 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 placeholder-amber-400/70 text-amber-900' 
                    : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
            </div>

          </div>
        );
      })}
    </div>
  );
}
