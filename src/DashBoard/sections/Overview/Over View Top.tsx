'use client';

import { useState, useEffect } from 'react';
import { FileText, Users, Image as ImageIcon, Briefcase } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { MOCK_BLOGS, MOCK_LEADS, MOCK_CAREER_APPLICATIONS, MOCK_MEDIA } from '../../lib/mock-data';

export default function OverViewTop() {
  // Always start at 0 to match SSR — hydrate from Supabase/cache after mount
  const [blogCount, setBlogCount] = useState<number>(0);
  const [leadsCount, setLeadsCount] = useState<number>(0);
  const [mediaCount, setMediaCount] = useState<number>(0);
  const [careersCount, setCareersCount] = useState<number>(0);

  useEffect(() => {
    async function fetchCounts() {
      // 1. Published Blogs
      try {
        const { count, error } = await supabase
          .from('blogs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');
        if (!error && count !== null && count > 0) {
           setBlogCount(count);
        } else {
           throw new Error('Empty');
        }
      } catch (e) {
        const stored = localStorage.getItem('MOCK_BLOGS');
        const parsed = stored ? JSON.parse(stored) : MOCK_BLOGS;
        setBlogCount(parsed.filter((b: any) => b.status === 'published').length);
      }

      // 2. New Leads (Last 30 days)
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { count, error } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString());
        if (!error && count !== null && count > 0) {
          setLeadsCount(count);
        } else {
          throw new Error('Empty');
        }
      } catch (e) {
        const stored = localStorage.getItem('MOCK_LEADS');
        const parsed = stored ? JSON.parse(stored) : MOCK_LEADS;
        setLeadsCount(parsed.length);
      }

      // 3. Media Items
      try {
        const { data, error } = await supabase.storage.from('media').list();
        if (!error && data && data.length > 0) {
          setMediaCount(data.length);
        } else {
           throw new Error('Empty');
        }
      } catch (e) {
        const stored = localStorage.getItem('MOCK_MEDIA');
        const parsed = stored ? JSON.parse(stored) : MOCK_MEDIA;
        setMediaCount(parsed.length);
      }

      // 4. Career Apps
      try {
        const { count, error } = await supabase
          .from('career_applications')
          .select('*', { count: 'exact', head: true });
        if (!error && count !== null && count > 0) {
           setCareersCount(count);
        } else {
           throw new Error('Empty');
        }
      } catch (e) {
        const stored = localStorage.getItem('MOCK_CAREER_APPLICATIONS');
        const parsed = stored ? JSON.parse(stored) : MOCK_CAREER_APPLICATIONS;
        setCareersCount(parsed.length);
      }
    }

    fetchCounts();
  }, []);

  const stats = [
    { label: 'Published Blogs', value: blogCount, icon: FileText, color: 'blue' },
    { label: 'New Leads (30d)', value: leadsCount, icon: Users, color: 'blue' },
    { label: 'Media Items', value: mediaCount, icon: ImageIcon, color: 'blue' },
    { label: 'Career Apps', value: careersCount, icon: Briefcase, color: 'blue' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorMap[color]}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900" suppressHydrationWarning>{value}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
