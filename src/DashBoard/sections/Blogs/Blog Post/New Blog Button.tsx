'use client';

import Link from 'next/link';
import { Plus, RefreshCw } from 'lucide-react';

export function NewBlogButton({ onRefresh, isRefreshing }: { onRefresh?: () => void; isRefreshing?: boolean }) {
  const handleNewBlogClick = () => {
    localStorage.setItem('sidebar_collapsed', 'true');
    window.dispatchEvent(new Event('sidebarToggle'));
  };

  return (
    <div className="flex items-center gap-3">
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      )}
      <Link
        href="/dashboard/blogs/new"
        onClick={handleNewBlogClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
      >
        <Plus size={18} />
        <span>New Blog</span>
      </Link>
    </div>
  );
}
