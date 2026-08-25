'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { DataTable } from '../../components/DataTable';
import { StatusDropdown } from '../../components/StatusDropdown';
import { Download, Mail, RefreshCw, Eye, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CareersList() {
  // Always start empty to match SSR — hydrate from cache/Supabase after mount
  const [applications, setApplications] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewingResume, setViewingResume] = useState<any | null>(null);

  useEffect(() => {
    // Load cache first for instant paint, then fetch fresh from Supabase
    try {
      const stored = localStorage.getItem('MOCK_CAREER_APPLICATIONS');
      if (stored) {
        const parsed = JSON.parse(stored);
        setApplications(parsed);
      }
    } catch { /* ignore */ }
    handleRefresh(true);
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    const updated = applications.map(a => a.id === id ? { ...a, status } : a);
    setApplications(updated);

    try {
      const { error } = await supabase.from('career_applications').update({ status }).eq('id', id);
      if (error) throw error;
      localStorage.setItem('MOCK_CAREER_APPLICATIONS', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update status in Supabase', e);
      localStorage.setItem('MOCK_CAREER_APPLICATIONS', JSON.stringify(updated));
    }
  };

  const handleRefresh = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('career_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Supabase is the single source of truth. Even if it returns 0 rows, we show 0 rows.
      setApplications(data || []);
      localStorage.setItem('MOCK_CAREER_APPLICATIONS', JSON.stringify(data || []));

    } catch(e) {
      // Cache already shown — fail silently on background refresh
      console.warn("Supabase fetch failed (DNS issue). Showing cached data.");
      if (!silent) {
        const stored = localStorage.getItem("MOCK_CAREER_APPLICATIONS");
        if (stored) {
          const parsed = JSON.parse(stored);
          setApplications(parsed);
        }
      }
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>, item: any) => {
    e.preventDefault();
    const fileName = `Resume_${item.name.replace(/\s+/g, '_')}.pdf`;

    if (item.resume_url === '#' || item.resume_url.includes('pentacloud.me/resumes')) {
      // It's a fake URL from our mock or fallback - create a dummy PDF to download
      const blob = new Blob([`Dummy resume content for ${item.name}`], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return;
    }

    try {
      const response = await fetch(item.resume_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(item.resume_url, '_blank');
    }
  };

  const columns = [
    {
      header: 'Applicant',
      cell: (item: any) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1"><Mail size={12} /> {item.email}</div>
          {item.phone && <div className="text-xs text-gray-400">{item.phone}</div>}
        </div>
      )
    },
    { header: 'Position', accessorKey: 'position' as any },
    {
      header: 'Status',
      cell: (item: any) => {
        const options = [
          { value: 'new', label: 'New' },
          { value: 'reviewed', label: 'Reviewed' },
          { value: 'hired', label: 'Hired' },
          { value: 'rejected', label: 'Rejected' }
        ];
        const colorConfig = {
          new: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 focus:ring-blue-500',
          reviewed: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 focus:ring-amber-500',
          hired: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 focus:ring-green-500',
          rejected: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 focus:ring-red-500'
        };

        return (
          <StatusDropdown 
            value={item.status}
            options={options}
            onChange={(val) => handleUpdateStatus(item.id, val)}
            colorConfig={colorConfig}
          />
        );
      }
    },
    {
      header: 'Resume',
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <button 
            title="View Resume" 
            onClick={() => setViewingResume(item)} 
            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            <Eye size={16} />
          </button>
          <button 
            title="Download Resume" 
            onClick={(e) => handleDownload(e, item)} 
            className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download size={16} />
          </button>
        </div>
      )
    },
    {
      header: 'Date',
      cell: (item: any) => <span className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Career Applications</h2>
        <button 
          onClick={() => handleRefresh()}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
      
      {isRefreshing ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-100 bg-gray-50/50">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
             ))}
          </div>
          <div className="divide-y divide-gray-100">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-4 items-center">
                   <div className="space-y-2">
                     <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                     <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                   </div>
                   <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                   <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                   <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                   <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
             ))}
          </div>
        </div>
      ) : (
        <DataTable data={applications} columns={columns} keyExtractor={a => a.id} />
      )}

      {/* Resume Viewer Modal */}
      <AnimatePresence>
        {viewingResume && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Resume Preview</h3>
                    <p className="text-xs text-gray-500">{viewingResume.name} - {viewingResume.position}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingResume(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Viewer Body (Splash Animation & Content) */}
              <div className="flex-1 overflow-auto bg-gray-100 p-6 flex flex-col items-center justify-center min-h-[500px] relative">
                
                {/* Simulated PDF View for Mock/Fake URLs */}
                {viewingResume.resume_url.includes('pentacloud.me/resumes') || viewingResume.resume_url === '#' ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-2xl bg-white aspect-[1/1.4] shadow-lg rounded-sm p-12 flex flex-col items-center justify-center text-center border border-gray-200"
                  >
                    <FileText size={64} className="text-gray-300 mb-6" />
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">{viewingResume.name}</h4>
                    <p className="text-blue-600 font-medium mb-6">{viewingResume.position}</p>
                    
                    <div className="space-y-4 w-full opacity-60">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mt-8"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>

                    <div className="mt-auto pt-8">
                      <p className="text-sm text-gray-400">
                        *This is a preview mode. Real files will display here once Supabase Storage is connected.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <iframe 
                    src={viewingResume.resume_url} 
                    className="w-full h-full bg-white shadow-lg rounded-sm"
                    title={`Resume for ${viewingResume.name}`}
                  />
                )}
              </div>
              
              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
                <button 
                  onClick={() => setViewingResume(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button 
                  onClick={(e) => handleDownload(e as any, viewingResume)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <Download size={16} /> Download PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
