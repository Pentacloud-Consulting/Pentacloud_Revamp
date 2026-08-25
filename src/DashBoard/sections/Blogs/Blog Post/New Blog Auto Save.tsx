import { useEffect, useRef } from 'react';
import { saveBlogDetails } from '../Blog Fetch/Blog fetch details';

export function useAutoSaveBlog(blog: any, id?: string) {
  const blogRef = useRef(blog);
  
  useEffect(() => {
    blogRef.current = blog;
  }, [blog]);

  useEffect(() => {
    // Ensure sidebar is collapsed when editor is open
    localStorage.setItem('sidebar_collapsed', 'true');
    window.dispatchEvent(new Event('sidebarToggle'));
    
    // Auto-save & un-collapse when leaving the editor
    return () => {
      localStorage.setItem('sidebar_collapsed', 'false');
      window.dispatchEvent(new Event('sidebarToggle'));

      const latestBlog = blogRef.current;
      const hasContent = latestBlog.title.trim() !== '' || (latestBlog.content && latestBlog.content.replace(/<[^>]+>/g, '').trim() !== '');
      
      if (hasContent) {
        // Fire and forget save to backend / local storage fallback
        saveBlogDetails(latestBlog, id, 'draft').catch(() => {
          // Errors are handled gracefully inside saveBlogDetails
        });
      }
    };
  }, [id]);
}
