'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { calculateSeoScore } from '../../lib/seo-score';
import { SeoManageBlogs } from './Seo Manage Blogs';

import Link from 'next/link';
import { FileText, RefreshCw } from 'lucide-react';

export function SeoManager() {
  // Always start empty to match SSR — hydrate from cache/Supabase after mount
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBlogs = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const { data, error } = await supabase.from('blogs').select('*');
      if (error) throw error;
      if (data) {
        setBlogs(data);
        localStorage.setItem('SEO_BLOGS_CACHE', JSON.stringify(data));
      }
    } catch (err) {
      console.warn("Failed to fetch blogs from Supabase, showing cached data.", err);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Load cache first for instant paint, then fetch fresh
    try {
      const cached = localStorage.getItem('SEO_BLOGS_CACHE');
      if (cached) setBlogs(JSON.parse(cached));
    } catch { /* ignore */ }
    fetchBlogs(true);
  }, []);


  const blogsWithScore = blogs
    .map(b => ({ ...b, seoScore: calculateSeoScore(b) }))
    .sort((a, b) => a.seoScore - b.seoScore);

  const avgScore = blogsWithScore.length > 0 
    ? Math.round(blogsWithScore.reduce((a, b) => a + b.seoScore, 0) / blogsWithScore.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">SEO Manager</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchBlogs(false)}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-md shadow-sm transition-colors ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-blue-600' : 'text-gray-500'} />
            {isRefreshing ? 'REFRESHING...' : 'REFRESH'}
          </button>
          <Link 
            href="/dashboard/blogs"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors"
          >
            <FileText size={14} /> MANAGE BLOGS
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Average SEO Score</div>
          <div className="text-2xl font-bold mt-1">{avgScore}/100</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Pages Need Improvement (&lt; 80)</div>
          <div className="text-2xl font-bold mt-1 text-red-600">
            {blogsWithScore.filter(b => b.seoScore < 80).length}
          </div>
        </div>
      </div>

      <SeoManageBlogs isRefreshing={isRefreshing} blogs={blogs} />
    </div>
  );
}
