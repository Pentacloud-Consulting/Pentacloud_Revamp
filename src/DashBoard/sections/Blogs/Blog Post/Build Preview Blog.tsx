'use client';

import React, { useState } from 'react';
import { ChevronLeft, Monitor, Smartphone, Tablet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogConvertedHTML } from '../Blog Fetch/Blog Convert to HTML';

interface BuildPreviewBlogProps {
  blog: any;
  onBack: () => void;
}

export function BuildPreviewBlog({ blog, onBack }: BuildPreviewBlogProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getContainerClasses = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[375px] mx-auto min-h-screen bg-white shadow-2xl ring-1 ring-gray-900/5 my-8 rounded-[2rem] overflow-hidden';
      case 'tablet':
        return 'max-w-[768px] mx-auto min-h-screen bg-white shadow-2xl ring-1 ring-gray-900/5 my-8 rounded-[2rem] overflow-hidden';
      case 'desktop':
      default:
        return 'w-full min-h-screen bg-white';
    }
  };

  const getTitleClasses = () => {
    if (device === 'mobile') return 'text-3xl font-black text-gray-900 leading-[1.1] tracking-tight mb-6';
    if (device === 'tablet') return 'text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-6';
    return 'text-6xl font-black text-gray-900 leading-[1.1] tracking-tight mb-6';
  };

  const getProseClasses = () => {
    if (device === 'mobile') return 'max-w-3xl mx-auto px-6 blog-rich-content text-base';
    if (device === 'tablet') return 'max-w-3xl mx-auto px-6 blog-rich-content text-lg';
    return 'max-w-3xl mx-auto px-6 blog-rich-content text-xl';
  };

  const getNavClasses = () => {
    if (device === 'mobile') return 'hidden';
    return 'flex gap-4 text-sm font-semibold text-gray-500';
  };

  const getImageClasses = () => {
    if (device === 'mobile') return 'aspect-[3/2] w-full rounded-xl overflow-hidden bg-gray-100 shadow-md ring-1 ring-gray-900/5 relative';
    return 'aspect-[21/9] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-lg ring-1 ring-gray-900/5 relative';
  };

  const getLogoClasses = () => {
    if (device === 'mobile') return 'h-8 object-contain';
    if (device === 'tablet') return 'h-10 object-contain';
    return 'h-12 object-contain';
  };

  const formattedDate = blog.publish_date 
    ? new Date(blog.publish_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Not Published';

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col overflow-hidden">
      {/* Top Controls Bar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={16} />
            BACK TO EDITOR
          </button>
        </div>

        {/* Device Toggles */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-md transition-colors ${device === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
            title="Desktop View"
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-md transition-colors ${device === 'tablet' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
            title="Tablet View"
          >
            <Tablet size={16} />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-md transition-colors ${device === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
            title="Mobile View"
          >
            <Smartphone size={16} />
          </button>
        </div>

        <div className="w-[120px]">
          {/* Spacer to balance the top bar */}
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-y-auto bg-gray-100/50 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={device}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={getContainerClasses()}
          >
            {/* --- Blog Content Preview --- */}
            <main className="w-full h-full relative z-0">
              <BlogConvertedHTML blog={blog} />
            </main>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
