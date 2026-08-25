'use client';

import React, { useState } from 'react';
import { Plus, Download, RefreshCw, Trash2, SlidersHorizontal, Monitor } from 'lucide-react';
import Link from 'next/link';
import { exportKeywordsToCSV } from './Export To CSV';
import { AddKeywordModal } from './Add Keyword';
import { AddedKeywordPopup } from '../../../Details/PopUp Messages/Added Keyword popup';
import { DeleteBlogTrc } from '../../../Details/PopUp Messages/Delete Blog Trc';

export function RankTrackingStatus({ keywords = [], onAddKeywords, onDeleteKeywords }: { keywords?: any[], onAddKeywords?: (kws: string[], location: string) => void, onDeleteKeywords?: (ids: string[]) => void }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [popupData, setPopupData] = useState<{ isOpen: boolean, count: number, location: string }>({ isOpen: false, count: 0, location: '' });
  
  // Selection & Deletion State
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredKeywords = React.useMemo(() => {
    if (activeFilter === 'top10') return keywords.filter(kw => kw.pos <= 10);
    if (activeFilter === 'improved') return keywords.filter(kw => kw.up);
    if (activeFilter === 'declined') return keywords.filter(kw => kw.down);
    return keywords;
  }, [keywords, activeFilter]);

  const handleUpdateSeoDifficulty = () => {
    setIsUpdating(true);
    // Simulate API fetch delay to search engine
    setTimeout(() => {
      setIsUpdating(false);
    }, 2500);
  };

  const handleExport = () => {
    exportKeywordsToCSV(keywords, `seo_rankings_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="mt-6 pb-32">
      {/* Header & Actions */}
      <div className="flex justify-between items-end mb-2">
        <h3 className="text-sm font-bold text-gray-900 uppercase">Tracked Keywords <span className="text-gray-500 font-normal">[{keywords.length}/150]</span></h3>
      </div>
      
      <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
        <div className="flex flex-wrap gap-1.5">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 font-bold text-[10px] rounded uppercase"
          >
            <Plus size={10} /> Add Keywords
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-1 px-2.5 py-1 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 font-bold text-[10px] rounded uppercase"
          >
            Export to CSV <span className="text-[8px]">▼</span>
          </button>
          <button 
            onClick={handleUpdateSeoDifficulty}
            disabled={isUpdating}
            className={`flex items-center gap-1 px-2.5 py-1 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 font-bold text-[10px] rounded uppercase transition-all ${isUpdating ? 'opacity-70 cursor-wait' : ''}`}
          >
            <RefreshCw size={10} className={isUpdating ? "animate-spin" : ""} /> 
            {isUpdating ? "Fetching Google Data..." : "Update SEO Difficulty"} <span className="font-normal">▼</span>
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => selectedKeywords.length > 0 && setIsDeleteModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1 border font-bold text-[10px] rounded uppercase transition-colors ${
                selectedKeywords.length > 0 
                  ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100 shadow-sm cursor-pointer' 
                  : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
              }`}
            >
              <Trash2 size={11} /> 
              {selectedKeywords.length > 0 ? `Delete (${selectedKeywords.length})` : 'Delete'}
            </button>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-1 px-2.5 py-1 border font-bold text-[10px] rounded uppercase transition-colors ${
                activeFilter !== 'all' 
                  ? 'border-blue-300 text-blue-700 bg-blue-50 shadow-sm' 
                  : 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal size={10} /> 
              Filters {activeFilter !== 'all' && ' (1)'}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="py-1">
                  <button 
                    onClick={() => { setActiveFilter('all'); setIsFilterOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-xs ${activeFilter === 'all' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50 font-medium'}`}
                  >
                    All Keywords
                  </button>
                  <button 
                    onClick={() => { setActiveFilter('top10'); setIsFilterOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-xs ${activeFilter === 'top10' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50 font-medium'}`}
                  >
                    Top 10 Rankings
                  </button>
                  <button 
                    onClick={() => { setActiveFilter('improved'); setIsFilterOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-xs ${activeFilter === 'improved' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50 font-medium'}`}
                  >
                    Ranked Up (Improved)
                  </button>
                  <button 
                    onClick={() => { setActiveFilter('declined'); setIsFilterOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-xs ${activeFilter === 'declined' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50 font-medium'}`}
                  >
                    Ranked Down (Declined)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-[11px] whitespace-nowrap">
          <thead className="bg-gray-100 border-b border-gray-200 text-[10px] font-bold text-gray-700 uppercase">
            <tr>
              <th className="px-2 py-1.5 w-6">
                <input 
                  type="checkbox" 
                  className="w-3 h-3 rounded border-gray-300 bg-white accent-blue-600 cursor-pointer" 
                  checked={keywords.length > 0 && selectedKeywords.length === keywords.length}
                  onChange={() => {
                    if (selectedKeywords.length === keywords.length) setSelectedKeywords([]);
                    else setSelectedKeywords(keywords.map((k: any) => k.id));
                  }}
                />
              </th>
              <th className="px-2 py-1.5">Position <span className="text-gray-400 text-[8px] bg-gray-200 rounded-full w-2.5 h-2.5 inline-flex items-center justify-center">?</span> <span className="text-[8px] ml-0.5">↕</span></th>
              <th className="px-2 py-1.5">Keyword <span className="text-gray-400 text-[8px] bg-gray-200 rounded-full w-2.5 h-2.5 inline-flex items-center justify-center">?</span> <span className="text-[8px] ml-0.5">↕</span></th>
              <th className="px-2 py-1.5">Change <span className="text-gray-400 text-[8px] bg-gray-200 rounded-full w-2.5 h-2.5 inline-flex items-center justify-center">?</span> <span className="text-[8px] ml-0.5">↕</span></th>
              <th className="px-2 py-1.5">Vol <span className="text-gray-400 text-[8px] bg-gray-200 rounded-full w-2.5 h-2.5 inline-flex items-center justify-center">?</span> <span className="text-[8px] ml-0.5">↕</span></th>
              <th className="px-2 py-1.5">SEO Difficulty <span className="text-gray-400 text-[8px] bg-gray-200 rounded-full w-2.5 h-2.5 inline-flex items-center justify-center">?</span> <span className="text-[8px] ml-0.5">↕</span></th>
              <th className="px-2 py-1.5">URL <span className="text-gray-400 text-[8px] bg-gray-200 rounded-full w-2.5 h-2.5 inline-flex items-center justify-center">?</span></th>
              <th className="px-2 py-1.5 w-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredKeywords.length > 0 ? filteredKeywords.map((kw: any) => (
              <tr key={kw.id} className={`transition-colors ${selectedKeywords.includes(kw.id) ? 'bg-blue-50/40' : 'hover:bg-gray-50 bg-white'}`}>
                <td className="px-2 py-2">
                  <input 
                    type="checkbox" 
                    className="w-3 h-3 rounded border-gray-300 bg-white accent-blue-600 cursor-pointer" 
                    checked={selectedKeywords.includes(kw.id)}
                    onChange={() => {
                      setSelectedKeywords(prev => 
                        prev.includes(kw.id) ? prev.filter(id => id !== kw.id) : [...prev, kw.id]
                      );
                    }}
                  />
                </td>
                <td className="px-2 py-2 text-gray-900">{kw.pos}</td>
                <td className="px-2 py-2">
                  <div className="text-blue-600 hover:underline cursor-pointer truncate max-w-[200px] xl:max-w-[250px]">{kw.keyword}</div>
                  <div className="text-[9px] text-gray-500 mt-0.5">English / India</div>
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-1.5">
                    <div className="text-gray-400">
                      {kw.oldPos} <span className="mx-0.5">→</span> <span className="font-bold text-gray-900">{kw.pos}</span>
                      {kw.up && <span className="text-emerald-500 font-bold ml-1">▲ +{parseFloat(Number(kw.change).toFixed(1))}</span>}
                      {kw.down && <span className="text-red-500 font-bold ml-1">▼ {parseFloat(Number(kw.change).toFixed(1))}</span>}
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2 text-gray-900">{kw.vol}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-900">{kw.diff}</span>
                    <span className="text-[9px] text-gray-400">({kw.diffTime})</span>
                    <RefreshCw size={9} className="text-blue-600 cursor-pointer hover:rotate-180 transition-transform" />
                  </div>
                </td>
                <td className="px-2 py-2">
                  <div className="truncate max-w-[150px] xl:max-w-[200px]">
                    <Link 
                      href={kw.url.replace('https://pentacloud.me', '')} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {kw.url}
                    </Link>
                  </div>
                </td>
                <td className="px-2 py-2">
                  <Monitor size={10} className="text-gray-400" />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-500 text-sm font-medium">
                  No keywords match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddKeywordModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newKeywords, location) => {
          // Trigger the custom toast popup instead of the browser alert
          setPopupData({ isOpen: true, count: newKeywords.length, location });
          if (onAddKeywords) onAddKeywords(newKeywords, location);
        }}
      />
      
      <AddedKeywordPopup 
        isOpen={popupData.isOpen}
        count={popupData.count}
        location={popupData.location}
        onClose={() => setPopupData(prev => ({ ...prev, isOpen: false }))}
      />

      <DeleteBlogTrc 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        count={selectedKeywords.length}
        onConfirm={() => {
          if (onDeleteKeywords) onDeleteKeywords(selectedKeywords);
          setSelectedKeywords([]);
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
}
