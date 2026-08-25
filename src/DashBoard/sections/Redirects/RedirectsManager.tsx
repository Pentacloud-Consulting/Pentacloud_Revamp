'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { NewRedirection } from './New Redirection';
import { EditRedirection } from './Edit Redirection';
import { Trash2, Edit } from 'lucide-react';

export function RedirectsManager() {
  // Always start empty to match SSR — hydrate from cache/Supabase after mount
  const [redirects, setRedirects] = useState<any[]>([]);
  const [editingRedirect, setEditingRedirect] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Load cache first for instant paint, then fetch fresh
    try {
      const cached = localStorage.getItem('MOCK_REDIRECTS_CACHE');
      if (cached) setRedirects(JSON.parse(cached));
    } catch { /* ignore */ }
    fetchRedirects(true);
  }, []);

  const fetchRedirects = async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const { data, error } = await supabase.from('redirects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      setRedirects(data || []);
      localStorage.setItem('MOCK_REDIRECTS_CACHE', JSON.stringify(data || []));
    } catch (err) {
      console.warn("Supabase fetch failed. Showing cached data.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async () => {
    if (confirmDelete) {
      const oldState = [...redirects];
      const newState = redirects.filter(r => r.id !== confirmDelete);
      setRedirects(newState);
      setConfirmDelete(null);

      try {
        const { error } = await supabase.from('redirects').delete().eq('id', confirmDelete);
        if (error) throw error;
        localStorage.setItem('MOCK_REDIRECTS_CACHE', JSON.stringify(newState));
      } catch (err) {
        console.warn("Failed to delete from Supabase. Reverting UI.");
        setRedirects(oldState);
      }
    }
  };

  const handleAdd = async (newRedirect: { old_url: string; new_url: string; type: number }) => {
    const tempId = Date.now().toString();
    const payload = { ...newRedirect, id: tempId, created_at: new Date().toISOString() };
    const oldState = [...redirects];
    const newState = [payload, ...redirects];
    setRedirects(newState);

    try {
      const { data, error } = await supabase.from('redirects').insert([newRedirect]).select();
      if (error) throw error;
      
      if (data && data.length > 0) {
        const finalState = [data[0], ...oldState];
        setRedirects(finalState);
        localStorage.setItem('MOCK_REDIRECTS_CACHE', JSON.stringify(finalState));
      }
    } catch (err) {
      console.warn("Failed to insert to Supabase. Reverting UI.");
      setRedirects(oldState);
    }
  };

  const handleEditSave = async (updatedRedirect: { id: string; old_url: string; new_url: string; type: number }) => {
    const oldState = [...redirects];
    const newState = redirects.map(r => r.id === updatedRedirect.id ? { ...r, ...updatedRedirect } : r);
    setRedirects(newState);
    setEditingRedirect(null);

    try {
      const { error } = await supabase.from('redirects').update({
        old_url: updatedRedirect.old_url,
        new_url: updatedRedirect.new_url,
        type: updatedRedirect.type
      }).eq('id', updatedRedirect.id);
      
      if (error) throw error;
      localStorage.setItem('MOCK_REDIRECTS_CACHE', JSON.stringify(newState));
    } catch (err) {
      console.warn("Failed to update Supabase. Reverting UI.");
      setRedirects(oldState);
    }
  };

  return (
    <div className="space-y-6">
      <NewRedirection onAdd={handleAdd} />
      
      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr] items-center px-6 py-4 border-b border-gray-100 bg-gray-50/30">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Old URL</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">New URL</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</div>
        </div>
        
        <div className="divide-y divide-gray-50 relative min-h-[100px]">
          {isSyncing && redirects.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : null}
          
          {redirects.length === 0 && !isSyncing ? (
            <div className="p-8 text-center text-gray-500 text-sm">No redirects found. Add one above.</div>
          ) : (
            redirects.map((item) => (
              <div key={item.id} className="grid grid-cols-[2fr_2fr_1fr_1fr] items-center px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="text-sm font-medium text-slate-800">{item.old_url}</div>
                <div className="text-sm text-slate-600">{item.new_url}</div>
                <div>
                  <span className={`px-2.5 py-1 bg-gray-100 border border-gray-200/60 rounded text-slate-600 font-medium text-xs shadow-sm ${item.type === 301 ? 'bg-green-50 text-green-700 border-green-200' : ''}`}>
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button onClick={() => setEditingRedirect(item)} className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => setConfirmDelete(item.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <EditRedirection 
        isOpen={!!editingRedirect} 
        onClose={() => setEditingRedirect(null)} 
        redirect={editingRedirect}
        onSave={handleEditSave}
      />

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Redirect?</h3>
              <p className="text-gray-500 text-sm">Are you sure you want to delete this redirection rule? This action cannot be undone and might cause 404 errors for visitors.</p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md transition-colors">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
