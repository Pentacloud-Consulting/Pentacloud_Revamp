'use client';

import { useState, useEffect } from 'react';
import OverViewTop from './Over View Top';
import { Mail, Briefcase, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { MOCK_LEADS, MOCK_CAREER_APPLICATIONS } from '../../lib/mock-data';
import Link from 'next/link';

export function Overview() {
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentApps, setRecentApps] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch Leads (Top 3)
      try {
        const { data: leads, error: leadsErr } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (!leadsErr && leads && leads.length > 0) {
          setRecentLeads(leads);
        } else {
          throw new Error('Empty or error');
        }
      } catch (e) {
        const storedLeads = localStorage.getItem('MOCK_LEADS');
        const parsed = storedLeads ? JSON.parse(storedLeads) : MOCK_LEADS;
        const sorted = parsed.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setRecentLeads(sorted.slice(0, 3));
      }

      // Fetch Apps (Top 3)
      try {
        const { data: apps, error: appsErr } = await supabase
          .from('career_applications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (!appsErr && apps && apps.length > 0) {
          setRecentApps(apps);
        } else {
          throw new Error('Empty or error');
        }
      } catch (e) {
        const storedApps = localStorage.getItem('MOCK_CAREER_APPLICATIONS');
        const parsed = storedApps ? JSON.parse(storedApps) : MOCK_CAREER_APPLICATIONS;
        const sorted = parsed.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setRecentApps(sorted.slice(0, 3));
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <OverViewTop />

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              Recent Enquiries
            </h3>
          </div>
          <div className="divide-y divide-gray-100 flex-1">
            {recentLeads.length > 0 ? recentLeads.map((lead, i) => (
              <div key={i} className="p-4 hover:bg-gray-50/50 transition-colors flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{lead.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{lead.email}</p>
                  <p className="text-xs font-medium text-blue-600 mt-1">{lead.service_requested || 'General Enquiry'}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    lead.status === 'new' ? 'bg-blue-50 text-blue-700' :
                    lead.status === 'contacted' ? 'bg-amber-50 text-amber-700' :
                    'bg-green-50 text-green-700'
                  }`}>
                    {lead.status}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-2">{new Date(lead.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-400 text-sm">No recent enquiries found.</div>
            )}
          </div>
          <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
            <Link href="/dashboard/leads" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 group transition-colors">
              View rest of the enquiries <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Recent Career Apps */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-500" />
              Recent Applications
            </h3>
          </div>
          <div className="divide-y divide-gray-100 flex-1">
            {recentApps.length > 0 ? recentApps.map((app, i) => (
              <div key={i} className="p-4 hover:bg-gray-50/50 transition-colors flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{app.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{app.email}</p>
                  <p className="text-xs font-medium text-purple-600 mt-1">{app.position}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    app.status === 'new' ? 'bg-blue-50 text-blue-700' :
                    app.status === 'reviewed' ? 'bg-amber-50 text-amber-700' :
                    app.status === 'interviewing' ? 'bg-purple-50 text-purple-700' :
                    app.status === 'rejected' ? 'bg-red-50 text-red-700' :
                    'bg-green-50 text-green-700'
                  }`}>
                    {app.status}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-2">{app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-400 text-sm">No recent applications found.</div>
            )}
          </div>
          <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
            <Link href="/dashboard/careers" className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 group transition-colors">
              View rest of the applications <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
