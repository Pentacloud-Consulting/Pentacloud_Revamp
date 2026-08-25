import { useEffect, useRef, useCallback } from 'react';

const LOCAL_DRAFT_ID_KEY = 'pentacloud_blog_draft_supabase_id_new';

/**
 * A highly accurate persistent save hook that:
 * - Auto-saves draft to Supabase every 10 seconds (status: 'draft').
 * - Persists the returned Supabase UUID so subsequent saves are UPDATEs not INSERTs.
 * - Falls back gracefully if Supabase is unreachable.
 * - Clears state cleanly on publish to prevent data collisions.
 */
export function usePersistentBlogSave(
  blog: any,
  setBlog: (b: any) => void,
  id?: string,
  isFresh?: boolean
) {
  const blogRef = useRef(blog);
  const isInitialLoad = useRef(true);
  const isCleared = useRef(false);
  // Holds the Supabase UUID once this new draft is saved for the first time
  const draftSupabaseIdRef = useRef<string | null>(
    id || (typeof window !== 'undefined' ? localStorage.getItem(LOCAL_DRAFT_ID_KEY) : null)
  );

  // Always keep the ref updated with the absolute latest state
  useEffect(() => {
    blogRef.current = blog;
  }, [blog]);

  // 1. RESTORE DRAFT ON MOUNT (for "Continue Draft" flow)
  useEffect(() => {
    if (!isInitialLoad.current) return;
    isInitialLoad.current = false;

    // If user clicked "+ ADD BLOG", wipe any stale draft state
    if (isFresh && !id) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_DRAFT_ID_KEY);
      }
      draftSupabaseIdRef.current = null;
      return;
    }

    // If editing an existing published blog, nothing to restore from local
    if (id) return;

    // Resuming: check if we have a Supabase UUID for an in-progress new draft
    const savedId = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_DRAFT_ID_KEY) : null;
    if (savedId) {
      draftSupabaseIdRef.current = savedId;
      // Fetch the draft from Supabase and restore it
      fetch(`/api/blogs/get?id=${savedId}`)
        .then(r => r.json())
        .then(json => {
          if (json.success && json.data) {
            setBlog((prev: any) => ({ ...prev, ...json.data }));
          }
        })
        .catch(() => { /* silent */ });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. AUTO-SAVE TO SUPABASE ON INTERVAL & UNMOUNT
  const persistToSupabase = useCallback(async () => {
    if (isCleared.current) return;
    if (id) return; // Editing existing blog — manual save only

    const current = blogRef.current;
    if (!current || !(current.title?.trim() || current.content?.trim())) return;

    const payload = {
      ...current,
      status: 'draft',
      updated_at: new Date().toISOString(),
    };
    delete payload._last_saved;

    try {
      const response = await fetch('/api/blogs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogData: payload,
          id: draftSupabaseIdRef.current || null,
          status: 'draft',
        }),
      });
      const json = await response.json();
      if (json.success && json.data?.id) {
        // Store the UUID so the next save is an UPDATE
        draftSupabaseIdRef.current = json.data.id;
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_DRAFT_ID_KEY, json.data.id);
        }
        // Update blog state with the real ID
        setBlog((prev: any) => ({ ...prev, id: json.data.id }));
      }
    } catch {
      /* Silent — Supabase unreachable; next interval will retry */
    }
  }, [id, setBlog]);

  useEffect(() => {
    if (id) return; // Only auto-save for new drafts

    // Save every 10 seconds
    const intervalId = setInterval(persistToSupabase, 10000);

    // Also save on tab close
    const handleBeforeUnload = () => { persistToSupabase(); };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [id, persistToSupabase]);

  // 3. CLEAR DRAFT (called after Publish)
  const clearDraft = useCallback(() => {
    isCleared.current = true;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_DRAFT_ID_KEY);
    }
    draftSupabaseIdRef.current = null;
  }, []);

  return { clearDraft };
}
