'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { BlogTop } from './Blog Top';
import { BlogDelete } from '../../../Details/PopUp Messages/Blog Delete';
import { DataTable } from '../../components/DataTable';
import { SeoScoreBadge } from '../../components/SeoScoreBadge';
import { calculateSeoScore } from '../../lib/seo-score';
import { Edit, Trash2, Eye, MoreVertical, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ActionMenu({ blog, isSelected, onSelect, onDelete }: { blog: any, isSelected: boolean, onSelect: (id: string) => void, onDelete: (id: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors focus:outline-none"
      >
        <MoreVertical size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 z-50 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden py-1"
          >
            <Link 
              href={`/blogs/${blog.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors w-full text-left"
            >
              <Eye size={14} /> Preview
            </Link>
            <Link 
              href={`/dashboard/blogs/${blog.id}/edit`} 
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors w-full text-left whitespace-nowrap"
            >
              <Edit size={14} /> {blog.status === 'draft' ? 'Continue Draft' : 'Edit'}
            </Link>
            <button 
              onClick={() => { onSelect(blog.id); setIsOpen(false); }} 
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors w-full text-left"
            >
              <CheckSquare size={14} /> {isSelected ? 'Deselect' : 'Select'}
            </button>
            <button 
              onClick={() => { onDelete(blog.id); setIsOpen(false); }} 
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left font-medium"
            >
              <Trash2 size={14} /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function BlogsList() {
  // Always start empty to match SSR — hydrate from cache/Supabase after mount
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [authorFilter, setAuthorFilter] = useState('All authors');
  const [seoFilter, setSeoFilter] = useState('SEO score');

  // Dynamic Options
  const predefinedCategories = [
    'Salesforce Consulting',
    'Zoho Service',
    'Cloud Solution',
    'Web Development',
    'App Development',
    'Digital Marketing',
    'Data Migration',
    'Consulting And Training'
  ];
  const categories = Array.from(new Set([
    ...predefinedCategories,
    ...blogs.map(b => b.category).filter(Boolean)
  ]));
  const authors = Array.from(new Set(blogs.map(b => b.author).filter(Boolean)));

  const handleRefresh = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const { data, error } = await supabase.from('blogs').select('*').order('updated_at', { ascending: false });
      if (error) throw error;
      
      const finalData = data || [];
      setBlogs(finalData);
      localStorage.setItem('MOCK_BLOGS_CACHE_LIST', JSON.stringify(finalData));
    } catch (err) {
      console.warn("Failed to fetch blogs from Supabase, showing cached data.", err);
      if (!silent) {
        const cached = localStorage.getItem('MOCK_BLOGS_CACHE_LIST');
        if (cached) setBlogs(JSON.parse(cached));
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load cache first for instant paint, then fetch fresh from Supabase
    try {
      const cached = localStorage.getItem('MOCK_BLOGS_CACHE_LIST');
      if (cached) setBlogs(JSON.parse(cached));
    } catch { /* ignore */ }
    handleRefresh(true);
  }, []);


  const openDeleteModal = (ids: string[]) => {
    setDeleteTargetIds(ids);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const newState = blogs.filter(b => !deleteTargetIds.includes(b.id));
    setBlogs(newState);
    setSelectedIds(prev => prev.filter(id => !deleteTargetIds.includes(id)));

    if (deleteTargetIds.includes('new_local_draft')) {
      localStorage.removeItem('pentacloud_blog_draft_new');
    }

    const supabaseIds = deleteTargetIds.filter(id => id !== 'new_local_draft');
    setDeleteTargetIds([]);

    if (supabaseIds.length > 0) {
      try {
        const { error } = await supabase.from('blogs').delete().in('id', supabaseIds);
        if (error) throw error;
        localStorage.setItem('MOCK_BLOGS_CACHE_LIST', JSON.stringify(newState));
      } catch (err) {
        console.warn("Failed to delete from Supabase, but UI was updated locally.");
        localStorage.setItem('MOCK_BLOGS_CACHE_LIST', JSON.stringify(newState));
      }
    } else {
      localStorage.setItem('MOCK_BLOGS_CACHE_LIST', JSON.stringify(newState));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredBlogs = blogs.filter(blog => {
    // Search Query (matches title, slug, or author)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!blog.title.toLowerCase().includes(q) && 
          !blog.slug.toLowerCase().includes(q) && 
          !blog.author?.toLowerCase().includes(q)) {
        return false;
      }
    }
    
    // Status
    if (statusFilter !== 'All statuses') {
      if (blog.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    }
    
    // Category
    if (categoryFilter !== 'All categories') {
      if (blog.category !== categoryFilter) return false;
    }
    
    // Author
    if (authorFilter !== 'All authors') {
      if (blog.author !== authorFilter) return false;
    }
    
    // SEO Score
    if (seoFilter !== 'SEO score') {
      const score = calculateSeoScore(blog);
      if (seoFilter === 'Good (80-100)' && score < 80) return false;
      if (seoFilter === 'OK (50-79)' && (score < 50 || score >= 80)) return false;
      if (seoFilter === 'Poor (0-49)' && score >= 50) return false;
    }
    
    return true;
  });

  const isAllSelected = filteredBlogs.length > 0 && selectedIds.length === filteredBlogs.length;

  const toggleSelectAll = (isAllSelected: boolean) => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBlogs.map(b => b.id));
    }
  };

  const columns = [
    {
      header: (
        <input 
          type="checkbox" 
          checked={isAllSelected}
          onChange={() => toggleSelectAll(isAllSelected)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      ),
      cell: (blog: any) => (
        <input 
          type="checkbox" 
          checked={selectedIds.includes(blog.id)}
          onChange={() => toggleSelect(blog.id)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      )
    },
    {
      header: 'Title',
      cell: (blog: any) => (
        <div>
          <div className="font-medium text-gray-900">{blog.title}</div>
          <div className="text-xs text-gray-500">/{blog.slug}</div>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (blog: any) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
          blog.status === 'published' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {blog.status}
        </span>
      )
    },
    {
      header: 'SEO Score',
      cell: (blog: any) => <SeoScoreBadge score={calculateSeoScore(blog)} />
    },
    { 
      header: 'Category', 
      cell: (blog: any) => <span className="whitespace-nowrap block text-gray-700 font-medium">{blog.category}</span> 
    },
    { 
      header: 'Author', 
      cell: (blog: any) => <span className="whitespace-nowrap block text-gray-700 font-medium">{blog.author}</span> 
    },
    {
      header: 'Actions',
      cell: (blog: any) => (
        <ActionMenu 
          blog={blog} 
          isSelected={selectedIds.includes(blog.id)} 
          onSelect={toggleSelect} 
          onDelete={() => openDeleteModal([blog.id])} 
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      <BlogTop 
        postCount={filteredBlogs.length} 
        onRefresh={handleRefresh} 
        isLoading={isLoading} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        authorFilter={authorFilter}
        setAuthorFilter={setAuthorFilter}
        seoFilter={seoFilter}
        setSeoFilter={setSeoFilter}
        categories={categories}
        authors={authors}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedCount={selectedIds.length}
        onDeleteSelected={() => openDeleteModal(selectedIds)}
      />
      
      <div className="relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {viewMode === 'list' ? (
            <DataTable data={filteredBlogs} columns={columns} keyExtractor={(b) => b.id} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBlogs.map(blog => (
                <div key={blog.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  {/* Card Image */}
                  <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                    <div className="absolute top-3 left-3 z-10">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(blog.id)}
                        onChange={() => toggleSelect(blog.id)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shadow-sm bg-white/90 backdrop-blur"
                      />
                    </div>
                    {(blog.thumbnail_url || blog.cover_image_url) ? (
                      <img src={blog.thumbnail_url || blog.cover_image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                        blog.status === 'published' ? 'bg-blue-600/90 text-white' : 'bg-gray-800/90 text-white'
                      }`}>
                        {blog.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">{blog.category || 'Uncategorized'}</span>
                      <SeoScoreBadge score={calculateSeoScore(blog)} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                      {blog.excerpt || 'No excerpt available...'}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                          {blog.author ? blog.author[0] : 'U'}
                        </div>
                        <span className="text-xs font-medium text-gray-600">{blog.author || 'Unknown'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Link href={`/blogs/${blog.slug}`} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Preview">
                          <Eye size={14} />
                        </Link>
                        <Link href={`/dashboard/blogs/${blog.id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                          <Edit size={14} />
                        </Link>
                        <button onClick={() => openDeleteModal([blog.id])} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredBlogs.length === 0 && (
                <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500 font-medium">No blogs found matching your filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <BlogDelete 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete} 
        count={deleteTargetIds.length} 
      />
    </div>
  );
}
