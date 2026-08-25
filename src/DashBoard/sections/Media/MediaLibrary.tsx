'use client';

import { useState, useMemo, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { RefreshCw, Loader2 } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { Upload } from './Upload';
import { PublishSiteImages } from './Publish Site Images';
import { WantToDelete } from '../../../Details/PopUp Messages/Want to delete';
import { AssetDetailsSidebar } from './AssetDetailsSidebar';
import { CopiedPathPopup } from '../../../Details/PopUp Messages/Copyed Path images';
import { convertToWebP } from '../../components/image Converts WEBP';

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  alt_text: string;
  uploaded_at: string;
  caption?: string;
  tags?: string;
  folder?: string;
}

export interface MediaLibraryProps {
  onSelect?: (url: string) => void;
}

export function MediaLibrary({ onSelect }: MediaLibraryProps = {}) {
  // Always start empty to match SSR — then hydrate from cache/API after mount
  const [uploadMedia, setUploadMedia] = useState<MediaItem[]>([]);
  const [publicMedia, setPublicMedia] = useState<MediaItem[]>([]);
  // True until first data attempt completes — prevents empty-state flash on load
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [activeTab, setActiveTab] = useState<'uploads' | 'public'>('uploads');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<string | null>(null);

  useEffect(() => {
    let hasCache = false;
    // Load from localStorage cache first for instant paint
    try {
      const cached = localStorage.getItem('MOCK_MEDIA_CACHE');
      if (cached) {
        const allItems = JSON.parse(cached);
        if (allItems && allItems.length > 0) {
          hasCache = true;
          const now = new Date().getTime();
          const ONE_DAY = 24 * 60 * 60 * 1000;
          const recent = allItems.filter((f: any) => (now - new Date(f.uploaded_at).getTime()) < ONE_DAY)
            .sort((a: any, b: any) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
          const older = allItems.filter((f: any) => (now - new Date(f.uploaded_at).getTime()) >= ONE_DAY)
            .sort((a: any, b: any) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
          setUploadMedia(recent);
          setPublicMedia(older);
          setIsInitialLoad(false); // Cache found, stop showing initial loader
        }
      }
    } catch { /* ignore */ }
    
    // Then fetch fresh from API
    handleRefresh(true).finally(() => {
      if (!hasCache) setIsInitialLoad(false);
    });
  }, []);


  const selectedDetailsItem = useMemo(() => {
    if (!selectedDetailsId) return null;
    const item = activeTab === 'uploads' 
      ? uploadMedia.find(m => m.id === selectedDetailsId)
      : publicMedia.find(m => m.id === selectedDetailsId);
    return item || null;
  }, [selectedDetailsId, uploadMedia, publicMedia, activeTab]);

  const handleItemClick = (id: string) => {
    if (onSelect) {
      const item = activeTab === 'uploads' 
        ? uploadMedia.find(m => m.id === id) 
        : publicMedia.find(m => m.id === id);
      if (item) onSelect(item.url);
      return;
    }
    setSelectedDetailsId(id);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (activeTab === 'uploads') {
      setUploadMedia(prev => prev.filter(m => !selectedIds.includes(m.id)));
    } else {
      setPublicMedia(prev => prev.filter(m => !selectedIds.includes(m.id)));
    }
    setSelectedIds([]);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this image?')) return;
    if (activeTab === 'uploads') {
      setUploadMedia(prev => prev.filter(m => m.id !== id));
    } else {
      setPublicMedia(prev => prev.filter(m => m.id !== id));
    }
  };

  const updateMetadata = (id: string, field: string, value: string) => {
    if (activeTab === 'uploads') {
      setUploadMedia(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
    } else {
      setPublicMedia(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
    }
  };

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [imageType, setImageType] = useState('all');

  const handleRefresh = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const response = await fetch('/api/media/list');
      const json = await response.json();
      
      if (!json.success) throw new Error(json.error || 'Failed to list media');

      const allItems: MediaItem[] = json.data;
      localStorage.setItem('MOCK_MEDIA_CACHE', JSON.stringify(allItems));

      const now = new Date().getTime();
      const ONE_DAY = 24 * 60 * 60 * 1000;

      // Shift to public site after 1 day
      const recent = allItems.filter(f => (now - new Date(f.uploaded_at).getTime()) < ONE_DAY);
      const older = allItems.filter(f => (now - new Date(f.uploaded_at).getTime()) >= ONE_DAY);

      // Sort by newest first
      recent.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
      older.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());

      setUploadMedia(recent);
      setPublicMedia(older);
    } catch (err: any) {
      // Cache already displayed — silent failure is fine
      console.warn("Failed to load media (DNS issue), showing cached data.", err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const webpFile = await convertToWebP(file);
      
      const formData = new FormData();
      formData.append('file', webpFile);

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });

      const json = await response.json();
      if (!json.success) throw new Error(json.error || 'Upload failed');

      await handleRefresh();
    } catch (err: any) {
      console.error(`Upload failed: ${err.message}`);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const filteredMedia = useMemo(() => {
    const sourceMedia = activeTab === 'uploads' ? uploadMedia : publicMedia;

    return sourceMedia.filter(item => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!item.filename.toLowerCase().includes(query) && !item.alt_text.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      // Image type
      if (imageType !== 'all') {
        const ext = item.filename.split('.').pop()?.toLowerCase();
        if (imageType === 'jpeg' && ext !== 'jpg' && ext !== 'jpeg') return false;
        if (imageType !== 'jpeg' && ext !== imageType) return false;
      }

      // Category
      if (category !== 'all') {
        if (item.folder) {
          if (item.folder !== category) return false;
        } else {
          // Fallback logic for legacy/mock data without a saved folder
          if (!item.filename.toLowerCase().includes(category)) return false;
        }
      }

      return true;
    });
  }, [uploadMedia, publicMedia, activeTab, searchQuery, category, imageType]);

  const missingAltCount = filteredMedia.filter(m => !m.alt_text).length;

  const handleTabChange = (tab: 'uploads' | 'public') => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setSelectedDetailsId(null);
      handleRefresh();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-0 overflow-hidden space-y-6">
      
      {/* Top Tabs & Actions */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <button 
            onClick={() => handleTabChange('uploads')}
            className={`px-4 py-2 font-bold text-xs uppercase tracking-wide rounded-lg transition-all ${
              activeTab === 'uploads' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                : 'bg-white text-slate-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Uploads <span className={activeTab === 'uploads' ? 'bg-blue-100 text-blue-700 rounded-full px-2 py-0.5' : 'bg-slate-100 text-slate-700 rounded-full px-2 py-0.5'}>{uploadMedia.length}</span>
          </button>
          <button 
            onClick={() => handleTabChange('public')}
            className={`px-4 py-2 font-bold text-xs uppercase tracking-wide rounded-lg transition-all shadow-sm ${
              activeTab === 'public' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'bg-white text-slate-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Public Site <span className={activeTab === 'public' ? 'bg-blue-100 text-blue-700 rounded-full px-2 py-0.5' : 'bg-slate-100 text-slate-700 rounded-full px-2 py-0.5'}>{publicMedia.length}</span>
          </button>
          
          <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block"></div>
          
          <button onClick={() => handleRefresh()} disabled={isRefreshing} className="text-gray-500 bg-white hover:bg-gray-50 p-2 rounded-lg transition-colors border border-gray-200 shadow-sm disabled:opacity-50" title="Refresh">
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        imageType={imageType}
        onImageTypeChange={setImageType}
        onUploadClick={handleUpload}
        isUploading={isUploading}
        assetsCount={filteredMedia.length}
        missingAltCount={missingAltCount}
        selectedCount={selectedIds.length}
        onBulkDeleteClick={() => setIsDeletePopupOpen(true)}
        showUploadButton={activeTab === 'uploads'}
      />

      {/* Main Grid & Sidebar Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* Main Grid View */}
        <div className="flex-1 overflow-y-auto pb-6 transition-all duration-500 ease-in-out">
          {isInitialLoad ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 size={32} className="animate-spin text-blue-600" />
              <p className="text-gray-500 font-medium">Loading media...</p>
            </div>
          ) : isRefreshing ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 size={32} className="animate-spin text-blue-600" />
              <p className="text-gray-500 font-medium">Refreshing media library...</p>
            </div>
          ) : activeTab === 'uploads' ? (
            <Upload 
              media={filteredMedia} 
              onUpdateAltText={(id, val) => updateMetadata(id, 'alt_text', val)}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              isSidebarOpen={!!selectedDetailsItem}
              onItemClick={handleItemClick}
              onCopy={handleCopy}
            />
          ) : (
            <PublishSiteImages 
              media={filteredMedia}
              onUpdateAltText={(id, val) => updateMetadata(id, 'alt_text', val)}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              isSidebarOpen={!!selectedDetailsItem}
              onItemClick={handleItemClick}
              onCopy={handleCopy}
            />
          )}
        </div>

        {/* Details Sidebar */}
        <div 
          className={`transition-all duration-500 ease-in-out shrink-0 overflow-hidden h-full ${
            selectedDetailsItem ? 'w-[300px] ml-6 opacity-100' : 'w-0 ml-0 opacity-0'
          }`}
        >
          <div className="w-[300px] h-full">
            {selectedDetailsItem && (
              <AssetDetailsSidebar 
                item={selectedDetailsItem}
                onClose={() => setSelectedDetailsId(null)}
                onUpdateMetadata={updateMetadata}
                onCopy={handleCopy}
              />
            )}
          </div>
        </div>

      </div> {/* End Main Grid & Sidebar Layout */}

      <WantToDelete 
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={handleBulkDelete}
        count={selectedIds.length}
      />

      <CopiedPathPopup 
        isOpen={showCopyToast}
        onClose={() => setShowCopyToast(false)}
        message="URL copied!"
      />
    </div>
  );
}
