export function calculateSeoScore(blog: any): number {
  if (!blog) return 0;

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

  // Replicate the exact boolean checks from the Review Panel
  const checks = [
    !!title, !!slug, !!category, !!author, !!excerpt,
    !!metaTitle, !!metaDesc, !!focusKw, !!canonical,
    kwInTitle, kwInDesc, kwInUrl, kwInContentBegin, density >= 10,
    !!cover, !!thumbnail,
    !!hasSubheadingKw, !!hasAltKw, hasExternalLink, hasInternalLink, !!focusKw,
    tagList.length > 0, tagList.length >= 3,
    wordCount > 0, (wordCount >= 2000 && wordCount <= 2500),
    (status === 'published' || status === 'draft'), !!publishDate,
    !!blog.cta_heading, !!blog.cta_button_link, (!!blog.sidebar_heading && !!blog.sidebar_email),
    (!!ogTitle || !!metaTitle), (!!ogDesc || !!metaDesc), !!ogImage
  ];

  const doneCount = checks.filter(Boolean).length;
  const totalCount = checks.length;

  return totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
}
