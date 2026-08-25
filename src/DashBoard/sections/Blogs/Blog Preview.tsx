'use client';

import { useState, useEffect } from 'react';
import { fetchBlogDetails } from './Blog Fetch/Blog fetch details';

import { BlogConvertedHTML } from './Blog Fetch/Blog Convert to HTML';

export function BlogPreview({ id }: { id: string }) {
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogDetails(id).then(data => {
      setBlog(data.id ? data : null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Blog Not Found</h1>
          <p className="text-gray-500 mt-2">The blog you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-white">
      <BlogConvertedHTML blog={blog} />
    </div>
  );
}
