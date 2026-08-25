import { supabase } from '../../lib/supabaseClient';

export interface PublicBlog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tag: string;
  tagColor: string;
  date: string;
  author: string;
  readTime: string;
  gradient: string;
  accent: string;
  featured: boolean;
  image: string;
}

// Category → color map for visual variety
const CATEGORY_STYLES: Record<string, { tagColor: string; accent: string; gradient: string }> = {
  'Salesforce Consulting': { tagColor: '#0070d2', accent: '#0070d2', gradient: 'from-[#EEF3FF] to-[#D4EEFF]' },
  'Zoho Service':          { tagColor: '#e8432d', accent: '#e8432d', gradient: 'from-[#FFF3F0] to-[#FFE4E0]' },
  'Cloud Solution':        { tagColor: '#1A7FD4', accent: '#1A7FD4', gradient: 'from-[#E8F4FD] to-[#C8E6FA]' },
  'Web Development':       { tagColor: '#7c3aed', accent: '#7c3aed', gradient: 'from-[#F3F0FF] to-[#E0D4FF]' },
  'App Development':       { tagColor: '#059669', accent: '#059669', gradient: 'from-[#ECFDF5] to-[#D1FAE5]' },
  'Digital Marketing':     { tagColor: '#d97706', accent: '#d97706', gradient: 'from-[#FFFBEB] to-[#FEF3C7]' },
  'Data Migration':        { tagColor: '#0891b2', accent: '#0891b2', gradient: 'from-[#ECFEFF] to-[#CFFAFE]' },
  'Consulting And Training': { tagColor: '#4f46e5', accent: '#4f46e5', gradient: 'from-[#EEF2FF] to-[#E0E7FF]' },
};

const DEFAULT_STYLE = { tagColor: '#1A7FD4', accent: '#1A7FD4', gradient: 'from-[#EEF3FF] to-[#D4EEFF]' };

function normalizeRow(row: any, index: number): PublicBlog {
  const style = CATEGORY_STYLES[row.category] || DEFAULT_STYLE;
  const dateStr = row.publish_date || row.published_at || row.created_at;
  let date = 'Recently';
  if (dateStr) {
    const d = new Date(
      // handle dd-mm-yyyy
      /^\d{2}-\d{2}-\d{4}$/.test(dateStr)
        ? dateStr.split('-').reverse().join('-')
        : dateStr
    );
    if (!isNaN(d.getTime())) {
      date = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  }

  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    category: row.category || 'Blog',
    tag: (row.category || 'Blog').toUpperCase(),
    tagColor: style.tagColor,
    date,
    author: row.author || 'Pentacloud Team',
    readTime: row.read_time || '5 min read',
    gradient: style.gradient,
    accent: style.accent,
    featured: index === 0,
    image: row.cover_image_url || row.thumbnail_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
  };
}

export async function fetchPublishedBlogs(): Promise<PublicBlog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('id, slug, title, excerpt, category, author, read_time, cover_image_url, thumbnail_url, publish_date, published_at, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Failed to fetch blogs from Supabase:', error?.message);
    return [];
  }

  return data.map((row, i) => normalizeRow(row, i));
}
