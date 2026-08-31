import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createClientServer } from '../../../DashBoard/lib/supabase';
import { ViewBlog } from '../../../Web-Page/Blogs/View Blog';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// ─── Location → ISO geo helpers ────────────────────────────────────────────────
const LOCATION_GEO: Record<string, { region: string; placename: string; ogLocale: string }> = {
  dubai:  { region: 'AE-DU', placename: 'Dubai, United Arab Emirates', ogLocale: 'en_AE' },
  qatar:  { region: 'QA',    placename: 'Qatar',                        ogLocale: 'en_QA' },
  uae:    { region: 'AE',    placename: 'United Arab Emirates',          ogLocale: 'en_AE' },
  india:  { region: 'IN',    placename: 'India',                         ogLocale: 'en_IN' },
  global: { region: 'US',    placename: 'Global',                        ogLocale: 'en_US' },
};

function getGeo(location?: string) {
  if (!location) return null;
  return LOCATION_GEO[location.toLowerCase()] ?? {
    region: 'AE',
    placename: location,
    ogLocale: 'en_AE',
  };
}

// ─── JSON-LD Article Schema ─────────────────────────────────────────────────────
function buildArticleSchema(blog: any) {
  const geo = getGeo(blog.location);
  const url = blog.canonical_url || `https://pentacloud.me/blogs/${blog.slug}`;

  // Extract all images from content
  const contentImages: string[] = [];
  if (blog.content) {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    while ((match = imgRegex.exec(blog.content)) !== null) {
      if (match[1] && !contentImages.includes(match[1])) {
        contentImages.push(match[1]);
      }
    }
  }
  
  const heroImage = blog.og_image || blog.cover_image_url;
  const allImages = heroImage ? Array.from(new Set([heroImage, ...contentImages])) : contentImages;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.meta_title || blog.title,
    description: blog.meta_description || blog.excerpt || '',
    image: allImages.length > 0 ? allImages : '',
    url,
    datePublished: blog.publish_date || undefined,
    dateModified: blog.last_modified_date || blog.publish_date || undefined,
    author: {
      '@type': 'Person',
      name: blog.author || 'Pentacloud Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pentacloud Consulting',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pentacloud.me/Logo/logo.webp',
      },
    },
    ...(geo && geo.placename !== 'Global'
      ? {
          areaServed: {
            '@type': 'Place',
            name: geo.placename,
            ...(geo.region !== 'US' && {
              address: {
                '@type': 'PostalAddress',
                addressCountry: geo.region.split('-')[0],
                ...(geo.region.includes('-') && { addressRegion: geo.region }),
              },
            }),
          },
        }
      : {}),
  };
}

// ─── Metadata ───────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const supabase = await createClientServer();
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!blog) {
    return { title: 'Not Found' };
  }

  const url = blog.canonical_url || `https://pentacloud.me/blogs/${blog.slug}`;
  const geo = getGeo(blog.location);
  
  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.excerpt,
    keywords: blog.tags ? blog.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    robots: {
      index: blog.allow_search_engines !== false,
      follow: blog.follow_links !== false,
    },
    alternates: {
      canonical: url,
    },
    // ── Geo meta tags (geo.placename, geo.region) ──
    ...(geo
      ? {
          other: {
            'geo.placename': geo.placename,
            'geo.region': geo.region,
            'geo.position': '',  // omit lat/lng — use placename only
            'ICBM': '',
          },
        }
      : {}),
    openGraph: {
      title: blog.og_title || blog.meta_title || blog.title,
      description: blog.og_description || blog.meta_description || blog.excerpt,
      url,
      type: 'article',
      locale: geo?.ogLocale ?? 'en_US',
      publishedTime: blog.publish_date || undefined,
      modifiedTime: blog.last_modified_date || undefined,
      images: [
        {
          url: blog.og_image || blog.cover_image_url || '',
          width: 1200,
          height: 630,
          alt: blog.og_title || blog.meta_title || blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.og_title || blog.meta_title || blog.title,
      description: blog.og_description || blog.meta_description || blog.excerpt,
      images: [blog.og_image || blog.cover_image_url || ''],
    },
  };
}

// ─── Page ───────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  const supabase = await createClientServer();
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!blog) {
    notFound();
  }

  const articleSchema = buildArticleSchema(blog);

  return (
    <>
      {/* JSON-LD Structured Data — Article with areaServed for local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ViewBlog blog={blog} />
    </>
  );
}
