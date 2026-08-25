'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchBlogDetails, saveBlogDetails, defaultBlogState } from '../Blog Fetch/Blog fetch details';
import { calculateSeoScore } from '../../../lib/seo-score';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { NewBlogTop } from './New Blog Top';
import { NewBlogForm } from './New Blog';
import { BlogFetchView } from '../Blog Fetch/Blog fetch View';
import { usePersistentBlogSave } from './Save Blog Post Details';
import { BuildPreviewBlog } from './Build Preview Blog';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelRight, PanelRightClose } from 'lucide-react';

interface BlogEditorProps {
  id?: string;
}

export function BlogEditor({ id }: BlogEditorProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [blog, setBlog] = useState(defaultBlogState);
  const [showSeoPanel, setShowSeoPanel] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const isFresh = searchParams.get('fresh') === 'true';
  const isResuming = !id && !isFresh;

  // Handle accurate persistent saving (drafts, forceful exits)
  const { clearDraft } = usePersistentBlogSave(blog, setBlog, id, isFresh);

  // Collapse sidebar when editor is open
  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', 'true');
    window.dispatchEvent(new Event('sidebarToggle'));
    return () => {
      localStorage.setItem('sidebar_collapsed', 'false');
      window.dispatchEvent(new Event('sidebarToggle'));
    };
  }, []);

  // If resuming a draft that has already been auto-saved to Supabase, redirect to edit route
  useEffect(() => {
    if (isResuming) {
      const savedId = localStorage.getItem('pentacloud_blog_draft_supabase_id_new');
      if (savedId) {
        router.replace(`/dashboard/blogs/${savedId}/edit`);
      }
    }
  }, [isResuming, router]);

  const MAX_WORDS = 2500;

  const getWordCount = (html: string) => {
    const plain = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, '').replace(/\s+/g, ' ').trim();
    return plain.length > 0 ? plain.split(' ').filter((w: string) => w.length > 0).length : 0;
  };

  const editor = useEditor({
    extensions: [
      StarterKit, 
      Image, 
      Link.configure({ 
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        }
      })
    ],
    content: blog.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const words = getWordCount(html);
      if (words > MAX_WORDS) {
        // Revert to the last saved content to prevent exceeding limit
        editor.commands.setContent(blog.content || '', { emitUpdate: false });
        return;
      }
      setBlog(prev => ({ ...prev, content: html }));
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[300px] border border-gray-200 rounded-b-md bg-white',
      },
    },
  });

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchBlogDetails(id).then(data => {
        // We only set the blog if a more recent persistent draft wasn't already loaded by usePersistentBlogSave
        setBlog(prev => {
          // If persistent draft is loaded and has content, keep it. Otherwise, use fetched data.
          if (prev.title && (prev as any)._last_saved) {
             if (editor && prev.content) editor.commands.setContent(prev.content);
             return prev;
          }
          if (editor && data.content) editor.commands.setContent(data.content);
          return data;
        });
        setIsLoading(false);
      });
    }
  }, [id, editor]);

  const handleSave = async (status = blog.status) => {
    setSaving(true);
    const updatedBlog = await saveBlogDetails(blog, id, status);
    setBlog(updatedBlog);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // If publishing successfully, clear the local draft so it doesn't override future edits
    if (status === 'published') {
      clearDraft();
      router.push('/dashboard/blogs');
    }
  };

  const handleGenerateSlug = (): boolean | 'invalid' => {
    const kw = blog.focus_keyword?.trim();

    // 1. Focus keyword is empty → show "fill it" popup
    if (!kw) return false;

    // 2. Focus keyword not in tracked list → show "not found" popup
    try {
      const stored = JSON.parse(localStorage.getItem('pentacloud_tracked_keywords') || '[]') as string[];
      if (stored.length > 0 && !stored.includes(kw.toLowerCase())) {
        return 'invalid'; // keyword typed but not tracked
      }
    } catch {}

    // 3. All good — generate the slug
    setBlog((prev: any) => {
      const newSlug = kw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      return { ...prev, slug: newSlug, canonical_url: `https://pentacloud.me/blogs/${newSlug}` };
    });
    return true;
  };

  const seoScore = calculateSeoScore(blog);

  if (showPreview) {
    return <BuildPreviewBlog blog={blog} onBack={() => setShowPreview(false)} />;
  }

  return (
    <div className={`mx-auto transition-all duration-500 ease-in-out space-y-4 ${showSeoPanel ? 'max-w-[1400px]' : 'max-w-5xl'}`}>
      {/* Top bar row: NewBlogTop + Blog SEO button side by side */}
      <div className="flex items-center gap-3">
        <div className="flex-1 [&>div]:mb-0">
          <NewBlogTop
            id={id}
            isResuming={isResuming}
            saved={saved}
            saving={saving}
            handleSave={handleSave}
            onPreview={() => setShowPreview(true)}
          />
        </div>

        {/* Blog SEO toggle button */}
        <button
          onClick={() => setShowSeoPanel(v => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold tracking-wide transition-all shadow-sm whitespace-nowrap ${
            showSeoPanel
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {showSeoPanel ? <PanelRightClose size={16} /> : <PanelRight size={16} />}
          Blog SEO
        </button>
      </div>

      {/* Split layout */}
      <div className="flex gap-4 items-start">
        {/* Left: Blog form */}
        <div className={`min-w-0 transition-all duration-300 ${showSeoPanel ? 'w-[calc(100%-24rem)]' : 'w-full'}`}>
          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <NewBlogForm
              blog={blog}
              setBlog={setBlog}
              editor={editor}
              seoScore={seoScore}
              handleGenerateSlug={handleGenerateSlug}
              isResuming={isResuming}
            />
          )}
        </div>

        {/* Right: SEO Review Panel */}
        <AnimatePresence>
          {showSeoPanel && (
            <motion.div
              key="seo-panel"
              initial={{ opacity: 0, x: 40, width: 0 }}
              animate={{ opacity: 1, x: 0, width: '22rem' }}
              exit={{ opacity: 0, x: 40, width: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="shrink-0 sticky top-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden"
              style={{ height: 'calc(100vh - 6rem)', width: '22rem' }}
            >
              <BlogFetchView blog={blog} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
