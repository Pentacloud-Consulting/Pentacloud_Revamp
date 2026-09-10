import { NextResponse } from 'next/server';
import { createClientServer } from '../../DashBoard/lib/supabase';

export async function GET() {
  const supabase = await createClientServer();
  const baseUrl = 'https://pentacloud.me';

  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('slug, title, cover_image_url, cover_image_alt, content')
    .eq('status', 'published');

  if (error || !blogs) {
    return new NextResponse('Error fetching blogs for sitemap', { status: 500 });
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  blogs.forEach((blog) => {
    const url = `${baseUrl}/blogs/${blog.slug}`;
    const images: { loc: string; caption: string }[] = [];

    // 1. Add Hero Image
    if (blog.cover_image_url) {
      images.push({
        loc: blog.cover_image_url,
        caption: blog.cover_image_alt || blog.title,
      });
    }

    // 2. Extract in-content images
    if (blog.content) {
      const imgRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^">]*)"/g;
      let match;
      while ((match = imgRegex.exec(blog.content)) !== null) {
        if (match[1]) {
          images.push({
            loc: match[1],
            caption: match[2] || blog.title,
          });
        }
      }
      
      // Fallback if alt is not defined but src is
      const fallbackRegex = /<img[^>]+src="([^">]+)"/g;
      let matchFallback;
      while ((matchFallback = fallbackRegex.exec(blog.content)) !== null) {
        if (matchFallback[1] && !images.some(img => img.loc === matchFallback[1])) {
          images.push({
            loc: matchFallback[1],
            caption: blog.title, // fallback caption
          });
        }
      }
    }

    if (images.length > 0) {
      xml += `  <url>\n    <loc>${url}</loc>\n`;
      // Deduplicate images by URL
      const uniqueImages = Array.from(new Map(images.map(item => [item.loc, item])).values());
      uniqueImages.forEach((img) => {
        // XML encode strings
        const cleanLoc = img.loc.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        const cleanCaption = img.caption.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        
        // Use full URL if relative
        const fullLoc = cleanLoc.startsWith('http') ? cleanLoc : `${baseUrl}${cleanLoc}`;

        xml += `    <image:image>\n`;
        xml += `      <image:loc>${fullLoc}</image:loc>\n`;
        if (cleanCaption) {
          xml += `      <image:caption>${cleanCaption}</image:caption>\n`;
        }
        xml += `    </image:image>\n`;
      });
      xml += `  </url>\n`;
    }
  });

  xml += `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
