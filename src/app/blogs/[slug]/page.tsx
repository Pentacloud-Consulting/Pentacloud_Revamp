import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createClientServer } from '../../../DashBoard/lib/supabase';
import { ViewBlog } from '../../../Web-Page/Blogs/View Blog';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

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
  
  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.excerpt,
    keywords: blog.tags ? blog.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    robots: {
      index: blog.allow_search_engines !== false, // defaults to true
      follow: blog.follow_links !== false, // defaults to true
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: blog.og_title || blog.meta_title || blog.title,
      description: blog.og_description || blog.meta_description || blog.excerpt,
      url: url,
      type: 'article',
      publishedTime: blog.publish_date || undefined,
      modifiedTime: blog.last_modified_date || undefined,
      images: [
        {
          url: blog.og_image || blog.cover_image_url || '',
          width: 1200,
          height: 630,
          alt: blog.og_title || blog.meta_title || blog.title,
        }
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

  return <ViewBlog blog={blog} />;
}
