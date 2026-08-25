'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, XCircle, AlertCircle, ChevronRight,
  Image as ImageIcon, FileText, Tag, Link, Search,
  Share2, Calendar, User, Hash, Layers
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CheckItem {
  label: string;
  done: boolean;
  warn?: boolean;   // done but could be better
  hint: string;
}

interface Section {
  title: string;
  icon: React.ReactNode;
  items: CheckItem[];
}

// ─── Helper: build review data from blog state ────────────────────────────────
function buildSections(blog: any): Section[] {
  const title = (blog.title || '').trim();
  const slug = (blog.slug || '').trim();
  const category = (blog.category || '').trim();
  const author = (blog.author || '').trim();
  const excerpt = (blog.excerpt || '').trim();
  const cover = (blog.cover_image_url || '').trim();
  const thumbnail = (blog.thumbnail_url || '').trim();
  const tags = (blog.tags || '').trim();
  const tagList = tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
  const content = (blog.content || '').replace(/<[^>]+>/g, ' ').trim();
  const wordCount = content ? content.split(/\s+/).filter(Boolean).length : 0;
  const metaTitle = (blog.meta_title || '').trim();
  const metaDesc = (blog.meta_description || '').trim();
  const focusKw = (blog.focus_keyword || '').trim();
  const canonical = (blog.canonical_url || '').trim();
  const ogTitle = (blog.og_title || '').trim();
  const ogDesc = (blog.og_description || '').trim();
  const ogImage = (blog.og_image || cover).trim();
  const publishDate = (blog.publish_date || '').trim();
  const status = (blog.status || '').trim();

  const kw = focusKw.toLowerCase();
  const kwCount = kw ? (content.toLowerCase().split(kw).length - 1) : 0;
  const kwWordCount = kw ? kw.split(/\s+/).filter(Boolean).length : 0;
  const density = wordCount > 0 ? ((kwCount * kwWordCount) / wordCount) * 100 : 0;
  const kwInTitle = !!kw && metaTitle.toLowerCase().includes(kw);
  const kwInDesc = !!kw && metaDesc.toLowerCase().includes(kw);
  const kwInUrl = !!kw && slug.toLowerCase().includes(kw.replace(/\s+/g, '-'));
  const kwInContentBegin = !!kw && content.toLowerCase().slice(0, 500).includes(kw);

  const rawContent = blog.content || '';
  const lowerRawContent = rawContent.toLowerCase();
  
  const hasSubheadingKw = !!kw && (
    /<h[2-6][^>]*>.*?<\/h[2-6]>/gi.test(lowerRawContent) && 
    lowerRawContent.match(/<h[2-6][^>]*>.*?<\/h[2-6]>/gi)?.some((h: string) => h.includes(kw))
  );

  const hasAltKw = !!kw && (
    ((blog.cover_image_alt || '').toLowerCase().includes(kw)) ||
    (/<img[^>]+alt=["'][^"']*["'][^>]*>/gi.test(lowerRawContent) &&
     lowerRawContent.match(/<img[^>]+alt=["']([^"']+)["'][^>]*>/gi)?.some((img: string) => img.includes(kw)))
  );

  const hasExternalLink = /<a[^>]+href=["']http(s)?:\/\/(?!pentacloud\.me)[^"']+["'][^>]*>/gi.test(lowerRawContent);
  const hasInternalLink = /<a[^>]+href=["'](\/|https:\/\/pentacloud\.me)[^"']*["'][^>]*>/gi.test(lowerRawContent);

  return [
    {
      title: 'Core Details',
      icon: <FileText size={15} />,
      items: [
        { label: 'Blog Title', done: !!title, hint: title ? `"${title.slice(0, 40)}${title.length > 40 ? '…' : ''}"` : 'Add a compelling blog title' },
        { label: 'URL Slug', done: !!slug, hint: slug ? `/${slug}` : 'Generate or type a URL slug' },
        { label: 'Category', done: !!category, hint: category || 'Select a category from the dropdown' },
        { label: 'Author', done: !!author, hint: author || 'Add an author name' },
        { label: 'Excerpt / Summary', done: !!excerpt, warn: !!excerpt && excerpt.length < 50, hint: excerpt ? `${excerpt.length} chars` : 'Write a short summary of the post' },
      ],
    },
    {
      title: 'SEO',
      icon: <Search size={15} />,
      items: [
        { label: 'Meta Title', done: !!metaTitle, warn: !!metaTitle && (metaTitle.length < 50 || metaTitle.length > 60), hint: metaTitle ? `${metaTitle.length}/60 chars` : 'Add a meta title (50–60 chars ideal)' },
        { label: 'Meta Description', done: !!metaDesc, warn: !!metaDesc && (metaDesc.length < 120 || metaDesc.length > 160), hint: metaDesc ? `${metaDesc.length}/160 chars` : 'Add a meta description (120–160 chars)' },
        { label: 'Focus Keyword', done: !!focusKw, hint: focusKw || 'Add your primary keyword' },
        { label: 'Canonical URL', done: !!canonical, hint: canonical || 'Auto-generated from slug if empty' },
      ],
    },
    {
      title: 'Focus Keyword Analysis',
      icon: <Hash size={15} />,
      items: [
        { label: 'Keyword in SEO title', done: kwInTitle, hint: kwInTitle ? 'Found in title' : 'Add Focus Keyword to the SEO title' },
        { label: 'Keyword in Meta Description', done: kwInDesc, hint: kwInDesc ? 'Found in description' : 'Add Focus Keyword to your SEO Meta Description' },
        { label: 'Keyword in URL', done: kwInUrl, hint: kwInUrl ? 'Found in URL slug' : 'Use Focus Keyword in the URL' },
        { label: 'Keyword at beginning of content', done: kwInContentBegin, hint: kwInContentBegin ? 'Found early in content' : 'Use Focus Keyword at the beginning of your content' },
        { label: 'Keyword in content', done: density >= 10, warn: density > 0 && density < 10, hint: kw ? `Keyword Density is ${density.toFixed(1)}%. Aim for >10% Keyword Density.` : 'Keyword Density is 0%. Aim for >10% Keyword Density.' },
      ],
    },
    {
      title: 'Images',
      icon: <ImageIcon size={15} />,
      items: [
        { label: 'Featured / Cover Image', done: !!cover, hint: cover ? 'Image set ✓' : 'Upload or select a hero image' },
        { label: 'Blog Thumbnail', done: !!thumbnail, hint: thumbnail ? 'Thumbnail set ✓' : 'Optional — defaults to cover if empty' },
      ],
    },
    {
      title: 'Additional',
      icon: <CheckCircle2 size={15} />,
      items: [
        { label: 'Use Focus Keyword in subheading(s)', done: !!hasSubheadingKw, hint: hasSubheadingKw ? 'Found in subheadings' : 'Add Focus Keyword to H2, H3, or H4 tags' },
        { label: 'Add an image with your Focus Keyword as alt text', done: !!hasAltKw, hint: hasAltKw ? 'Found in image alt text' : 'Add Focus Keyword as alt text to an image' },
        { label: 'Link out to external resources', done: hasExternalLink, hint: hasExternalLink ? 'External links found' : 'Add a link to an external website' },
        { label: 'Add internal links in your content', done: hasInternalLink, hint: hasInternalLink ? 'Internal links found' : 'Add a link to another page on your site (pentacloud.me)' },
        { label: 'Set a Focus Keyword for this content', done: !!focusKw, hint: focusKw ? 'Focus keyword is set' : 'Define a focus keyword' },
      ],
    },
    {
      title: 'Tags',
      icon: <Tag size={15} />,
      items: [
        { label: 'Tags added', done: tagList.length > 0, warn: tagList.length > 0 && tagList.length < 3, hint: tagList.length > 0 ? tagList.join(', ') : 'Add at least 3 relevant tags' },
        { label: 'Minimum 3 tags', done: tagList.length >= 3, hint: `${tagList.length} / 3 minimum` },
      ],
    },
    {
      title: 'Content',
      icon: <Layers size={15} />,
      items: [
        { label: 'Content written', done: wordCount > 0, hint: wordCount > 0 ? `${wordCount} words written` : 'Start writing in the Content tab' },
        { label: 'Word count (2000–2500)', done: wordCount >= 2000 && wordCount <= 2500, warn: wordCount > 0 && (wordCount < 2000 || wordCount > 2500), hint: wordCount > 0 ? `${wordCount} words — target 2000–2500` : 'Content needed' },
        { label: 'Publish status set', done: status === 'published' || status === 'draft', warn: status === 'draft', hint: status ? `Status: ${status}` : 'Set to Draft or Published' },
        { label: 'Publish date set', done: !!publishDate, hint: publishDate || 'Pick a publish date' },
      ],
    },
    {
      title: 'CTA & Contact',
      icon: <CheckCircle2 size={15} />,
      items: [
        { label: 'Mid-Content CTA Heading', done: !!blog.cta_heading, hint: blog.cta_heading || 'Add a compelling mid-content CTA heading' },
        { label: 'Mid-Content CTA Link', done: !!blog.cta_button_link, hint: blog.cta_button_link || 'Add the link destination for your CTA' },
        { label: 'Sidebar Contact Box', done: !!blog.sidebar_heading && !!blog.sidebar_email, hint: blog.sidebar_heading ? 'Sidebar contact info configured' : 'Ensure sidebar has heading and email' },
      ],
    },
    {
      title: 'Open Graph (Social)',
      icon: <Share2 size={15} />,
      items: [
        { label: 'OG Title', done: !!ogTitle || !!metaTitle, warn: !ogTitle && !!metaTitle, hint: ogTitle ? ogTitle.slice(0, 40) : metaTitle ? 'Inheriting from Meta Title' : 'Add OG title' },
        { label: 'OG Description', done: !!ogDesc || !!metaDesc, warn: !ogDesc && !!metaDesc, hint: ogDesc ? `${ogDesc.length} chars` : metaDesc ? 'Inheriting from Meta Description' : 'Add OG description' },
        { label: 'OG Image', done: !!ogImage, warn: !blog.og_image && !!cover, hint: blog.og_image ? 'Custom OG image set' : cover ? 'Using cover image as fallback' : 'Add an OG image for social sharing' },
      ],
    },
  ];
}

// ─── Completion score ─────────────────────────────────────────────────────────
function computeScore(sections: Section[]): { done: number; total: number; percent: number } {
  let done = 0, total = 0;
  sections.forEach(s => s.items.forEach(i => { total++; if (i.done) done++; }));
  return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

// ─── Status icon ──────────────────────────────────────────────────────────────
function StatusIcon({ done, warn }: { done: boolean; warn?: boolean }) {
  if (done && !warn) return <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />;
  if (done && warn) return <AlertCircle size={15} className="text-amber-500 shrink-0" />;
  return <XCircle size={15} className="text-red-400 shrink-0" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function BlogFetchView({ blog }: { blog: any }) {
  const sections = buildSections(blog);
  const score = computeScore(sections);

  const scoreColor =
    score.percent >= 80 ? 'text-emerald-600' :
    score.percent >= 50 ? 'text-amber-600' :
    'text-red-500';

  const barColor =
    score.percent >= 80 ? 'bg-emerald-500' :
    score.percent >= 50 ? 'bg-amber-400' :
    'bg-red-400';

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Blog SEO Review</h2>
          <span className={`text-xl font-black ${scoreColor}`}>{score.percent}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${score.percent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          {score.done} of {score.total} fields completed
        </p>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> Done</span>
          <span className="flex items-center gap-1"><AlertCircle size={12} className="text-amber-500" /> Needs improvement</span>
          <span className="flex items-center gap-1"><XCircle size={12} className="text-red-400" /> Missing</span>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {sections.map((section) => {
          const sectionDone = section.items.filter(i => i.done && !i.warn).length;
          const sectionTotal = section.items.length;
          const allDone = sectionDone === sectionTotal;

          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Section header */}
              <div className={`flex items-center justify-between px-4 py-2.5 ${allDone ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{section.icon}</span>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{section.title}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  allDone ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {sectionDone}/{sectionTotal}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50/60 transition-colors">
                    <StatusIcon done={item.done} warn={item.warn} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${item.done ? 'text-gray-700' : 'text-gray-500'}`}>
                        {item.label}
                      </p>
                      <p className="text-[11px] leading-snug text-gray-400 mt-0.5">{item.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom summary banner */}
      <div className={`mx-4 mb-4 px-4 py-3 rounded-lg text-xs font-semibold ${
        score.percent === 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
        score.percent >= 80 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
        score.percent >= 50 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
        'bg-red-50 text-red-600 border border-red-200'
      }`}>
        {score.percent === 100 && '🎉 Your blog is 100% complete and ready to publish!'}
        {score.percent >= 80 && score.percent < 100 && '✅ Almost there! Fill in the remaining fields before publishing.'}
        {score.percent >= 50 && score.percent < 80 && '⚠️ Good progress — complete SEO & Open Graph fields for best results.'}
        {score.percent < 50 && '🔴 Several required fields are missing. Complete them before publishing.'}
      </div>
    </div>
  );
}
