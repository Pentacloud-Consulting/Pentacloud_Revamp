'use client';

import { useState, useEffect, useCallback } from 'react';
import { DataTable } from '../../components/DataTable';
import { StatusDropdown } from '../../components/StatusDropdown';
import { supabase } from '../../../lib/supabaseClient';
import { Mail, RefreshCw, Loader2 } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service_requested?: string | null;
  message?: string | null;
  source_page?: string | null;
  status: string;
  created_at: string;
}

export function LeadsList() {
  // Always start empty to match SSR — hydrate from cache/API after mount
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Supabase is the single source of truth. Even if it returns 0 rows, we show 0 rows.
      setLeads(data || []);
      localStorage.setItem('MOCK_LEADS', JSON.stringify(data || []));

    } catch (err: unknown) {
      console.warn("Supabase fetch failed. Showing cached data.");
      const stored = localStorage.getItem('MOCK_LEADS');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLeads(parsed);
        } catch { /* ignore */ }
      }
      if (!silent) setError(err instanceof Error ? err.message : 'Could not refresh from server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load cache first for instant paint, then fetch fresh from Supabase
    try {
      const stored = localStorage.getItem('MOCK_LEADS');
      if (stored) {
        const parsed = JSON.parse(stored);
        setLeads(parsed);
      }
    } catch { /* ignore */ }
    fetchLeads(true);
  }, [fetchLeads]);


  const handleUpdateStatus = async (id: string, status: string) => {
    // Optimistic update
    const updatedLeads = leads.map(l => l.id === id ? { ...l, status } : l);
    setLeads(updatedLeads);
    
    try {
      // Update real database
      const { error } = await supabase.from('leads').update({ status }).eq('id', id);
      if (error) throw error;
      
      // Keep cache in sync
      localStorage.setItem('MOCK_LEADS', JSON.stringify(updatedLeads));
    } catch (e) {
      console.error('Failed to update status in Supabase', e);
      // Since DNS might be down, we just save to local cache for now
      localStorage.setItem('MOCK_LEADS', JSON.stringify(updatedLeads));
    }
  };

  const columns = [
    {
      header: 'Contact',
      cell: (item: Lead) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1"><Mail size={12} /> {item.email}</div>
          {item.phone && <div className="text-xs text-gray-400">{item.phone}</div>}
        </div>
      )
    },
    { header: 'Source', accessorKey: 'source_page' as keyof Lead },
    {
      header: 'Company',
      cell: (item: Lead) => {
        let company = item.company;
        if (!company && item.message) {
          const match = item.message.match(/Company:\s*([^\n]+)/);
          company = match ? match[1] : '—';
        }
        return <span className="text-gray-700">{company || '—'}</span>;
      }
    },
    {
      header: 'Service Requested',
      cell: (item: Lead) => {
        let service = item.service_requested;
        if (!service && item.message) {
          const match = item.message.match(/Service:\s*([^\n]+)/);
          service = match ? match[1] : '—';
        }
        return <span className="font-medium text-gray-700">{service || '—'}</span>;
      }
    },
    {
      header: 'Status',
      cell: (item: Lead) => {
        const options = [
          { value: 'new', label: 'New' },
          { value: 'contacted', label: 'Contacted' },
          { value: 'closed', label: 'Closed' }
        ];
        const colorConfig: Record<string, string> = {
          new: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 focus:ring-blue-500',
          contacted: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 focus:ring-amber-500',
          closed: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 focus:ring-green-500'
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
      header: 'Date',
      cell: (item: Lead) => (
        <span className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
          {!isLoading && !error && (
            <p className="text-sm text-gray-500 mt-0.5">{leads.length} lead{leads.length !== 1 ? 's' : ''} total</p>
          )}
        </div>
        <button
          onClick={() => fetchLeads()}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 size={32} className="animate-spin mr-3" />
          <span className="text-lg font-medium">Loading leads...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => fetchLeads()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Mail size={40} className="mb-3 opacity-40" />
          <p className="text-lg font-medium">No leads yet</p>
          <p className="text-sm mt-1">Leads submitted from the contact form will appear here.</p>
        </div>
      ) : (
        <DataTable data={leads} columns={columns} keyExtractor={l => l.id} />
      )}
    </div>
  );
}
