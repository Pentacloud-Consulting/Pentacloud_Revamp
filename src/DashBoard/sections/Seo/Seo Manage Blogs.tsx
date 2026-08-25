'use client';

import React, { useMemo } from 'react';
import { calculateSeoScore } from '../../lib/seo-score';
import { SeoScoreBadge } from '../../components/SeoScoreBadge';
import { DataTable } from '../../components/DataTable';
import { Edit, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface SeoManageBlogsProps {
  isRefreshing?: boolean;
  blogs: any[];
}

export function SeoManageBlogs({ isRefreshing = false, blogs = [] }: SeoManageBlogsProps) {
  // 1. Fetching all blogs and filtering ONLY those that have issues or need attention
  const blogsWithScore = useMemo(() => {
    return blogs.map(blog => {
      const seoScore = calculateSeoScore(blog);
      
      // Detect issues here so we can filter by them
      const issues = [];
      if (!blog.meta_title) issues.push('No meta title');
      if (!blog.meta_description) issues.push('No meta desc');
      if (blog.meta_description && blog.meta_description.length < 50) issues.push('Meta desc too short');
      if (!blog.cover_image_url) issues.push('No cover image');
      if (!blog.content || blog.content.length < 50) issues.push('Content too short');
      
      return { ...blog, seoScore, issues };
    })
    // Only keep blogs that actually have missing info, poor score, or are still drafts
    .filter(blog => blog.issues.length > 0 || blog.seoScore < 100 || blog.status === 'draft')
    .sort((a, b) => a.seoScore - b.seoScore); // Sort lowest score first
  }, [blogs]); // ← depends on blogs prop so it updates when data arrives


  const columns = [
    {
      header: 'Page / Blog',
      cell: (item: any) => (
        <div>
          <div className="font-medium text-gray-900 line-clamp-1">{item.title}</div>
          <div className="text-xs text-gray-500">/{item.slug}</div>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (item: any) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
          item.status === 'published' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {item.status || 'draft'}
        </span>
      )
    },
    {
      header: 'Score',
      cell: (item: any) => <SeoScoreBadge score={item.seoScore} />
    },
    {
      header: 'Issues',
      cell: (item: any) => {
        if (item.issues.length === 0) return <span className="text-gray-500 text-sm italic">Needs optimization</span>;
        
        return (
          <div className="flex flex-col gap-1 text-xs text-red-500">
            {item.issues.slice(0, 2).map((issue: string, i: number) => (
              <span key={i} className="flex items-center gap-1"><AlertTriangle size={10} /> {issue}</span>
            ))}
            {item.issues.length > 2 && <span>+ {item.issues.length - 2} more</span>}
          </div>
        );
      }
    },
    {
      header: 'Action',
      cell: (item: any) => (
        <Link href={`/dashboard/blogs/${item.id}/edit`} className="text-blue-600 hover:underline text-sm flex items-center gap-1">
          <Edit size={14} /> Fix
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">Content SEO Overview</h3>
        <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
          {blogsWithScore.length} blogs need attention
        </span>
      </div>
      
      {isRefreshing ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Scanning SEO Data...</h3>
        </div>
      ) : blogsWithScore.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">All Clear!</h3>
          <p className="text-gray-500">No blogs currently have SEO issues. Great job!</p>
        </div>
      ) : (
        <DataTable data={blogsWithScore} columns={columns} keyExtractor={(b: any) => b.id} />
      )}
    </div>
  );
}
