import { MetadataRoute } from 'next';
import { createClientServer } from '../DashBoard/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pentacloud.me'; // Replace with actual domain

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/services/salesforce',
    '/services/cloud',
    '/services/web',
    '/services/app',
    '/services/consulting',
    '/services/data-migration',
    '/services/digital-marketing',
    '/services/zoho',
    '/contact',
    '/careers',
    '/career',
    '/blogs',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic blog routes - with fallback in case of DB connection issues
  let blogs: any[] = [
    { slug: 'salesforce-partner-dubai', updated_at: new Date().toISOString() } // Fallback blog
  ];
  
  try {
    const supabase = await createClientServer();
    const { data, error } = await supabase
      .from('blogs')
      .select('slug, updated_at')
      .eq('status', 'published');
      
    if (!error && data && data.length > 0) {
      blogs = data;
    } else {
      console.warn('⚠️ Supabase fetch failed in sitemap, using fallback blogs.');
    }
  } catch (err) {
    console.warn('⚠️ Supabase connection failed in sitemap:', err);
  }

  const blogRoutes = blogs.map((blog: any) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
