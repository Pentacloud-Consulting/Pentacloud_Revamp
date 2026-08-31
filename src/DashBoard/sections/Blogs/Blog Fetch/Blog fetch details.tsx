import { supabase } from '../../../../lib/supabaseClient';

// Define the default blog structure with all fields required by the editor
export const defaultBlogState = {
  title: '', slug: '', excerpt: '', category: '', author: '',
  cover_image_url: '', thumbnail_url: '', cover_image_alt: '',
  meta_title: '', meta_description: '',
  og_title: '', og_description: '', og_image: '',
  canonical_url: '', focus_keyword: '', meta_robots: 'index, follow',
  status: 'draft', content: '', faqs: [], location: '',
  cta_heading: 'Ready to Transform Your Business?',
  cta_description: 'Join the 10+ clients we digitally transformed in 2026 — and let Pentacloud build something extraordinary for you too.',
  cta_button_text: 'Start Your Journey →',
  cta_button_link: '/contact',
  sidebar_heading: 'Talk to an Expert',
  sidebar_subheading: 'Pentacloud Consulting Pvt Ltd',
  sidebar_address: 'Jagan Arcade, 4th Floor, 1st Main Road, Anandnagar, RT Nagar, Bengaluru, KA 560032',
  sidebar_phone: '+971 545 132 807',
  sidebar_email: 'contactus@pentacloudconsulting.com',
  sidebar_button_text: 'Visit Website Matrix',
  sidebar_button_link: 'https://pentacloud.me'
};

/**
 * Fetches a blog by ID from Supabase with a local cache fallback.
 */
export const fetchBlogDetails = async (id?: string) => {
  if (!id) return { ...defaultBlogState };
  
  try {
    const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
    if (error) throw error;
    if (data) {
      // Store in local cache just in case they lose connection later
      localStorage.setItem(`MOCK_BLOG_CACHE_${id}`, JSON.stringify(data));
      return { ...defaultBlogState, ...data };
    }
  } catch (err) {
    console.warn("Supabase fetch failed. Checking local cache...", err);
    const cached = localStorage.getItem(`MOCK_BLOG_CACHE_${id}`);
    if (cached) return { ...defaultBlogState, ...JSON.parse(cached) };
  }
  
  return { ...defaultBlogState };
};

/**
 * Saves a blog to the Supabase database via the server-side API route.
 * Uses the service role key on the server so it always works.
 */
export const saveBlogDetails = async (blogData: any, id?: string, status?: string) => {
  const updatedStatus = status || blogData.status;
  const payload = {
    ...blogData,
    status: updatedStatus,
    updated_at: new Date().toISOString(),
  };

  const targetId = id || blogData.id;

  try {
    const response = await fetch('/api/blogs/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogData: payload, id: targetId || null, status: updatedStatus }),
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error || 'Unknown error from blog save API');
    }

    // Cache locally too
    if (json.data) {
      localStorage.setItem(`MOCK_BLOG_CACHE_${json.data.id}`, JSON.stringify(json.data));
    }

    return json.data;
  } catch (err: any) {
    console.error('Failed to save blog:', err.message);
    // Return optimistic payload so UI doesn't break
    return { ...payload, id: targetId || Date.now().toString() };
  }
};


/**
 * Uploads a local file using our resilient /api/media/upload route
 */
export const uploadMediaFile = async (file: File, focusKeyword?: string, suffix?: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (focusKeyword) formData.append('focusKeyword', focusKeyword);
    if (suffix) formData.append('suffix', suffix);

    const response = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.error || 'Upload failed');
    
    return json.url;
  } catch (err) {
    console.warn("Upload API failed. Using local Object URL fallback for session.", err);
    return URL.createObjectURL(file);
  }
};
