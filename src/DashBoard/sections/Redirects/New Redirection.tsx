'use client';

import { useState } from 'react';
import { FormSelect } from '../../components/FormSelect';
import { Plus } from 'lucide-react';

interface NewRedirectionProps {
  onAdd: (redirect: { old_url: string; new_url: string; type: number }) => void;
}

export function NewRedirection({ onAdd }: NewRedirectionProps) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ old_url: '', new_url: '', type: 301 });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm({ old_url: '', new_url: '', type: 301 });
    setAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-slate-800">Redirects Manager</h2>
        <button
          onClick={() => setAdding(!adding)}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={16} className={adding ? "rotate-45 transition-transform" : "transition-transform"} />
          <span>{adding ? 'Cancel' : 'New Redirect'}</span>
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-wrap gap-5 items-end animate-in slide-in-from-top-4 fade-in duration-300 relative z-10">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Old URL Path</label>
            <input required type="text" placeholder="/old-page" value={form.old_url} onChange={e => setForm({ ...form, old_url: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors text-sm" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">New URL Path</label>
            <input required type="text" placeholder="/new-page" value={form.new_url} onChange={e => setForm({ ...form, new_url: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors text-sm" />
          </div>
          <div className="w-36">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Type</label>
            <FormSelect
              value={form.type}
              onChange={val => setForm({ ...form, type: Number(val) })}
              options={[
                { value: 301, label: '301 Permanent' },
                { value: 302, label: '302 Temporary' }
              ]}
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium h-[42px] text-sm shadow-sm transition-colors">
            Save
          </button>
        </form>
      )}
    </div>
  );
}
