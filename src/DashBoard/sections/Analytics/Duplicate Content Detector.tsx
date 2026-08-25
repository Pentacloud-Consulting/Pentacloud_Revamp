import React from 'react';
import { AlertTriangle, CheckCircle, Trash2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { SeoScoreBadge } from '../../components/SeoScoreBadge';

interface DuplicateContentDetectorProps {
  duplicates: any[][];
  onDeleteRequest: (id: string, title: string) => void;
}

export function DuplicateContentDetector({ duplicates, onDeleteRequest }: DuplicateContentDetectorProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="text-amber-500" size={20} />
          Duplicate Content Detector
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Groups of blogs with identical or near-identical titles or metadata. These compete with each other.
        </p>
      </div>
      <div className="p-0 overflow-y-auto h-[500px]">
        {duplicates.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
            <CheckCircle className="text-emerald-500 mb-3" size={32} />
            <p className="font-medium">No duplicate content detected!</p>
            <p className="text-sm mt-1">Your blog architecture is clean.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {duplicates.map((group, gIdx) => (
              <div key={gIdx} className="p-5 bg-amber-50/30">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 bg-amber-100 inline-block px-2 py-1 rounded">
                  Duplicate Group {gIdx + 1}
                </div>
                <div className="space-y-3">
                  {group.map((blog, idx) => (
                    <div key={blog.id} className={`relative p-4 rounded-lg border ${idx === 0 ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-200'} group/card`}>
                      
                      {/* Delete Button (Only for duplicates, not the primary one) */}
                      {idx > 0 && (
                        <button 
                          onClick={() => onDeleteRequest(blog.id, blog.title)}
                          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover/card:opacity-100 focus:opacity-100"
                          title="Delete Duplicate"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      <div className="flex justify-between items-start gap-4 pr-8">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {idx === 0 ? (
                              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">Primary Recommended</span>
                            ) : (
                              <span className="text-[10px] font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full whitespace-nowrap">Consider Redirecting</span>
                            )}
                          </div>
                          <Link href={`/dashboard/blogs/${blog.id}/edit`} className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1">{blog.title}</Link>
                          <div className="text-xs text-gray-500 mt-1">/{blog.slug}</div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-2">
                          <SeoScoreBadge score={blog.seoScore} />
                          <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                            <Calendar size={10} className="inline mr-1 -mt-0.5" />
                            {new Date(blog.published_at || blog.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
