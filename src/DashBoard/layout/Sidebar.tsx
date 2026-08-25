'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Map, 
  BarChart3, 
  Users, 
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navSections = [
  {
    title: null,
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Operations',
    items: [
      { href: '/dashboard/leads', label: 'Leads & Enquiries', icon: Users },
      { href: '/dashboard/careers', label: 'Careers', icon: Briefcase },
    ]
  },
  {
    title: 'SEO',
    items: [
      { href: '/dashboard/seo', label: 'SEO Manager', icon: Search },
      { href: '/dashboard/redirects', label: 'Redirects', icon: LinkIcon },
      { href: '/dashboard/media', label: 'Media Library', icon: ImageIcon },
      { href: '/dashboard/blogs', label: 'Blogs', icon: FileText },
      { href: '/dashboard/sitemap', label: 'Sitemap', icon: Map },
      { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setUserRole(localStorage.getItem('user_role'));
    
    const stored = localStorage.getItem('sidebar_collapsed');
    if (stored === 'true') {
      setIsCollapsed(true);
    }

    const handleSidebarToggle = () => {
      const storedVal = localStorage.getItem('sidebar_collapsed');
      setIsCollapsed(storedVal === 'true');
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  const toggleSidebar = () => {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    localStorage.setItem('sidebar_collapsed', newVal.toString());
    window.dispatchEvent(new Event('sidebarToggle'));
  };

  const sidebarWidth = isCollapsed ? 'w-[72px]' : 'w-64';

  return (
    <aside className={`${sidebarWidth} transition-all duration-300 ease-in-out bg-white text-gray-600 border-r border-gray-200 h-screen sticky top-0 flex-col hidden md:flex shadow-sm z-20 relative`}>
      
      {/* Header / Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 overflow-hidden relative px-2">
        <img 
          src="/Logo/Penta Logo.png" 
          alt="Pentacloud Icon" 
          className={`absolute h-10 w-10 object-contain transition-all duration-300 ${isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}
        />
        <img 
          src="/Logo/Pentacloud logo.png" 
          alt="Pentacloud Logo" 
          className={`h-12 w-auto object-contain transition-all duration-300 ${isCollapsed ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="space-y-6">
          {(() => {
            const isEditingBlog = pathname.includes('/dashboard/blogs/new') || pathname.match(/\/dashboard\/blogs\/.*\/edit/);
            
            let visibleNavSections = navSections;
            if (userRole === 'seo') {
              visibleNavSections = navSections.filter(s => s.title === 'SEO');
            }

            if (isEditingBlog) {
              visibleNavSections = [{
                title: null,
                items: visibleNavSections.flatMap(s => s.items).filter(item => item.label === 'Blogs')
              }];
            }

            return visibleNavSections.map((section, idx) => (
              <div key={idx} className="px-3">
              {section.title && (
                <h3 className={`px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0 mb-0' : 'max-h-[30px] opacity-100 mb-2'}`}>
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/dashboard');
                  return (
                    <li key={item.href} className="relative group">
                      <Link 
                        href={item.href}
                        className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <item.icon size={20} className="shrink-0" />
                        
                        <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${
                          isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                        }`}>
                          {item.label}
                        </span>
                      </Link>

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && isClient && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none shadow-sm">
                          {item.label}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))})()}
        </div>
      </nav>

      {/* Footer / Toggle Button */}
      <div className={`p-4 border-t border-gray-200 text-xs text-gray-500 flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0 hidden' : 'max-w-[150px] opacity-100'}`}>
          {userRole === 'seo' ? 'SEO Portal v1.0' : 'Admin v1.0'}
        </span>
        
        {isClient && (
          <button 
            onClick={toggleSidebar} 
            className="bg-white border border-gray-200 rounded-full p-1.5 text-gray-500 hover:text-blue-600 shadow-sm transition-transform shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>
    </aside>
  );
}

