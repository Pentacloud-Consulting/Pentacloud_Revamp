'use client';

import React from 'react';
import { 
  List, 
  Grid, 
  Plus, 
  Upload, 
  RefreshCw, 
  Search,
  SlidersHorizontal,
  Star,
  Trash2,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

// Custom Animated Dropdown Component
function AnimatedSelect({ value, onChange, options, defaultLabel }: { value: string, onChange: (v: string) => void, options: string[], defaultLabel: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      
      {/* Ghost element: uses CSS grid to overlap all options in one cell. 
          This forces the parent to adopt the width of the widest option and the height of a single option. */}
      <div className="invisible grid pointer-events-none">
        {[defaultLabel, ...options].map(opt => (
          <div key={opt} className="col-start-1 row-start-1 flex items-center gap-3 px-3 py-2 font-medium text-xs border border-transparent">
            <span>{opt}</span>
            <ChevronDown size={14} />
          </div>
        ))}
      </div>

      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute inset-0 flex items-center justify-between w-full px-3 py-2 bg-gray-50 border rounded-md text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isOpen ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-gray-200 hover:bg-gray-100'
        }`}
      >
        <span className={`${value !== defaultLabel ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
          {value}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 top-full mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden py-1 max-h-[350px] overflow-y-auto"
          >
            <button
              onClick={() => { onChange(defaultLabel); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                value === defaultLabel 
                  ? 'bg-blue-50 text-blue-700 font-bold' 
                  : 'text-gray-700 hover:bg-gray-50 font-medium'
              }`}
            >
              {defaultLabel}
            </button>
            <div className="h-px bg-gray-100 mx-2 my-1"></div>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => { onChange(option); setIsOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                  value === option 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface BlogTopProps {
  postCount: number;
  onRefresh: () => void;
  isLoading?: boolean;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  categoryFilter: string;
  setCategoryFilter: (s: string) => void;
  authorFilter: string;
  setAuthorFilter: (s: string) => void;
  seoFilter: string;
  setSeoFilter: (s: string) => void;
  categories: string[];
  authors: string[];
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export function BlogTop({ 
  postCount, 
  onRefresh, 
  isLoading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  authorFilter,
  setAuthorFilter,
  seoFilter,
  setSeoFilter,
  categories,
  authors,
  viewMode,
  setViewMode,
  selectedCount,
  onDeleteSelected
}: BlogTopProps) {
  return (
    <div className="flex flex-col gap-3 w-full mb-6">
      
      {/* Row 1: Actions & Toggles */}
      <div className="flex flex-wrap items-center justify-between bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
        
        {/* Left Side: View Toggles & Count */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 p-1 rounded-md border border-gray-200">
            <button 
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List size={14} /> LIST
            </button>
            <button 
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid size={14} /> GRID
            </button>
          </div>
          <div className="text-sm font-medium text-gray-500 border-l border-gray-300 pl-4">
            <span className="font-bold text-gray-800">{postCount}</span> posts
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2">
          <Link 
            href="/dashboard/seo"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors"
          >
            <Star size={14} /> SEO DASHBOARD
          </Link>
          <Link 
            href="/dashboard/blogs/new?fresh=true"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors"
          >
            <Plus size={14} /> ADD BLOG
          </Link>

          <button 
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className={`flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm transition-all ${
              isLoading 
                ? 'opacity-70 cursor-wait' 
                : 'hover:bg-gray-50 hover:border-gray-300 cursor-pointer active:scale-95'
            }`}
          >
            <RefreshCw size={14} className={`text-gray-500 ${isLoading ? "animate-spin" : "group-hover:text-blue-600"}`} />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>
      </div>

      {/* Row 2: Filters & Search */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, slug, author..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2">
          <AnimatedSelect
            value={statusFilter}
            onChange={setStatusFilter}
            defaultLabel="All statuses"
            options={['Published', 'Draft']}
          />
          
          <AnimatedSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            defaultLabel="All categories"
            options={categories}
          />
          
          <AnimatedSelect
            value={authorFilter}
            onChange={setAuthorFilter}
            defaultLabel="All authors"
            options={authors}
          />

          <AnimatedSelect
            value={seoFilter}
            onChange={setSeoFilter}
            defaultLabel="SEO score"
            options={['Good (80-100)', 'OK (50-79)', 'Poor (0-49)']}
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold border rounded-md shadow-sm transition-colors ${
              selectedCount > 0 
                ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200' 
                : 'bg-white text-gray-400 border-gray-200 cursor-not-allowed opacity-70'
            }`}
          >
            <Trash2 size={14} /> Trash {selectedCount > 0 && `(${selectedCount})`}
          </button>
        </div>

      </div>
    </div>
  );
}
