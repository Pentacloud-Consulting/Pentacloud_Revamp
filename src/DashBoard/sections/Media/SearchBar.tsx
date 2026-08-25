'use client';

import { Search, Upload, Trash2, Loader2 } from 'lucide-react';
import { FormSelect } from '../../components/FormSelect';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  imageType: string;
  onImageTypeChange: (val: string) => void;
  onUploadClick: (file: File) => void;
  isUploading?: boolean;
  assetsCount: number;
  missingAltCount: number;
  selectedCount?: number;
  onBulkDeleteClick?: () => void;
  showUploadButton?: boolean;
}

export function SearchBar({
  searchQuery, onSearchChange,
  category, onCategoryChange,
  imageType, onImageTypeChange,
  onUploadClick, isUploading, assetsCount, missingAltCount,
  selectedCount = 0, onBulkDeleteClick, showUploadButton = true
}: SearchBarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-wrap gap-3 items-center justify-between shadow-sm">
      <div className="flex flex-1 flex-wrap gap-3 items-center min-w-[300px]">
        <div className="relative flex-1 min-w-[150px] max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, alt, tags..." 
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-white" 
          />
        </div>
        <div className="w-48 hidden md:block">
          <FormSelect 
            value={category} 
            options={[
              {value: 'all', label: 'All types'}, 
              {value: 'salesforce', label: 'Salesforce Consulting'},
              {value: 'zoho', label: 'Zoho Service'},
              {value: 'cloud', label: 'Cloud Solution'},
              {value: 'web_development', label: 'Web Development'},
              {value: 'app_development', label: 'App Development'},
              {value: 'digital_marketing', label: 'Digital Marketing'},
              {value: 'data_migration', label: 'Data Migration'},
              {value: 'consulting', label: 'Consulting And Training'}
            ]} 
            onChange={onCategoryChange} 
          />
        </div>
        <div className="w-36 hidden md:block">
          <FormSelect 
            value={imageType} 
            options={[
              {value: 'all', label: 'Image type'}, 
              {value: 'webp', label: 'WebP'}, 
              {value: 'jpeg', label: 'JPEG'}, 
              {value: 'png', label: 'PNG'},
              {value: 'svg', label: 'SVG'}
            ]} 
            onChange={onImageTypeChange} 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
        {selectedCount > 0 && (
          <button
            onClick={onBulkDeleteClick}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide border border-red-200 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition-colors shadow-sm cursor-pointer"
          >
            <Trash2 size={14} /> Delete ({selectedCount})
          </button>
        )}
        {showUploadButton && (
          <>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="upload-image-input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onUploadClick(file);
                }
                e.target.value = '';
              }}
            />
            <button 
              onClick={() => document.getElementById('upload-image-input')?.click()} 
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide border border-gray-300 bg-white rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-28 justify-center"
            >
              {isUploading ? <Loader2 size={14} className="animate-spin shrink-0" /> : <Upload size={14} className="shrink-0" />}
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </>
        )}
        <div className="text-sm font-medium text-gray-700 hidden sm:block">
          Assets <span className="font-bold text-lg text-gray-900">{assetsCount}</span> 
          {missingAltCount > 0 && <span className="text-xs text-amber-600 font-normal ml-1">· {missingAltCount} missing alt</span>}
        </div>
      </div>
    </div>
  );
}
