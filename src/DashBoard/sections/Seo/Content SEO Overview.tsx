'use client';

import Link from 'next/link';
import { SeoScoreBadge } from '../../components/SeoScoreBadge';
import { DataTable } from '../../components/DataTable';
import { Edit, AlertTriangle } from 'lucide-react';

interface ContentSeoOverviewProps {
  blogsWithScore: any[];
}

export function ContentSeoOverview({ blogsWithScore }: ContentSeoOverviewProps) {
  const columns = [
    {
      header: 'Page / Blog',
      cell: (item: any) => (
        <div>
          <div className="font-medium text-gray-900">{item.title}</div>
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
        const issues = [];
        if (!item.meta_title) issues.push('No meta title');
        if (!item.meta_description) issues.push('No meta desc');
        if (item.meta_description && item.meta_description.length < 50) issues.push('Meta desc too short');
        if (!item.cover_image_url) issues.push('No cover image');
        if (!item.content || item.content.length < 50) issues.push('Content too short');
        
        if (issues.length === 0 && item.seoScore >= 80) return <span className="text-green-600 text-sm font-medium">Perfect!</span>;
        if (issues.length === 0) return <span className="text-gray-500 text-sm italic">Needs optimization</span>;
        return (
          <div className="flex flex-col gap-1 text-xs text-red-500">
            {issues.slice(0, 2).map((issue, i) => (
              <span key={i} className="flex items-center gap-1"><AlertTriangle size={10} /> {issue}</span>
            ))}
            {issues.length > 2 && <span>+ {issues.length - 2} more</span>}
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
      <h3 className="text-xl font-bold text-gray-800">Content SEO Overview</h3>
      <DataTable data={blogsWithScore} columns={columns} keyExtractor={b => b.id} />
    </div>
  );
}
