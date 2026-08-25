'use client';

import { LogOut, Menu, ExternalLink } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export function Topbar() {
  const router = useRouter();

  const handleLogout = async () => {
    // Real Supabase signout
    await supabase.auth.signOut();
    localStorage.removeItem('user_role');
    router.push('/dashboard/login');
    router.refresh();
  };

  const pathname = usePathname();

  const getPageInfo = () => {
    if (pathname.includes('/seo')) return { tag: 'OPTIMIZATION', title: 'SEO Manager', desc: 'Centralized SEO scoring and metadata analysis.' };
    if (pathname.includes('/redirects')) return { tag: 'SYSTEM', title: 'Redirects', desc: 'Manage 301/302 routing and URL forwarding.' };
    if (pathname.includes('/media')) return { tag: 'SEO', title: 'Media Library', desc: 'Centralized images — uploads, public site assets, SEO metadata.' };
    if (pathname.includes('/blogs')) return { tag: 'CONTENT', title: 'Blog Articles', desc: 'Manage publications, drafts, and categories.' };
    if (pathname.includes('/sitemap')) return { tag: 'SEO', title: 'Sitemap Viewer', desc: 'Monitor the live output of your auto-generated XML routes.' };
    if (pathname.includes('/analytics')) return { tag: 'METRICS', title: 'Analytics', desc: 'Site performance, visitor tracking, and usage statistics.' };
    if (pathname.includes('/leads')) return { tag: 'CRM', title: 'Lead Management', desc: 'Track customer inquiries and prospects.' };
    if (pathname.includes('/careers')) return { tag: 'HR', title: 'Job Applications', desc: 'Review candidates and recruiting pipelines.' };
    return { tag: 'SYSTEM', title: 'Dashboard Overview', desc: 'High-level metrics and system status.' };
  };

  const info = getPageInfo();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-50">
      <div className="flex items-start gap-3">
        <button className="md:hidden p-1 mt-1 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md">
          <Menu size={20} />
        </button>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">{info.tag}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{info.title}</h1>
          <p className="text-sm text-gray-500">{info.desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto ml-8 sm:ml-0">
        <a 
          href="/" 
          target="_blank" 
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wide uppercase border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ExternalLink size={14} /> Website
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wide uppercase border border-gray-300 rounded-md text-gray-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </header>
  );
}
