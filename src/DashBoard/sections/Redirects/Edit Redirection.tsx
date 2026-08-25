'use client';

import { useState, useEffect } from 'react';
import { FormSelect } from '../../components/FormSelect';

interface EditRedirectionProps {
  isOpen: boolean;
  onClose: () => void;
  redirect: { id: string; old_url: string; new_url: string; type: number } | null;
  onSave: (updatedRedirect: { id: string; old_url: string; new_url: string; type: number }) => void;
}

export function EditRedirection({ isOpen, onClose, redirect, onSave }: EditRedirectionProps) {
  const [form, setForm] = useState({ old_url: '', new_url: '', type: 301 });

  useEffect(() => {
    if (redirect) {
      setForm({
        old_url: redirect.old_url,
        new_url: redirect.new_url,
        type: redirect.type
      });
    }
  }, [redirect]);

  if (!isOpen || !redirect) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: redirect.id, ...form });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">Edit Redirect</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-medium leading-none">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSave} className="p-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Old URL Path</label>
              <input required type="text" value={form.old_url} onChange={e => setForm({ ...form, old_url: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">New URL Path</label>
              <input required type="text" value={form.new_url} onChange={e => setForm({ ...form, new_url: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors" />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <FormSelect
                value={form.type}
                onChange={val => setForm({ ...form, type: Number(val) })}
                options={[
                  { value: 301, label: '301 Perm' },
                  { value: 302, label: '302 Temp' }
                ]}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md font-medium transition-colors">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors shadow-sm">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
