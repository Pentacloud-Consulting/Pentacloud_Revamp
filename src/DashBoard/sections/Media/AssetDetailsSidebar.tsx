import { X, Copy, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface AssetDetailsSidebarProps {
  item: any;
  onClose: () => void;
  onUpdateMetadata: (id: string, field: string, value: string) => void;
  onCopy?: (text: string) => void;
}

export function AssetDetailsSidebar({ item, onClose, onUpdateMetadata, onCopy }: AssetDetailsSidebarProps) {
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('General Assets');
  const folderRef = useRef<HTMLDivElement>(null);

  const FOLDERS = [
    { value: 'general', label: 'General Assets' },
    { value: 'salesforce', label: 'Salesforce Consulting' },
    { value: 'zoho', label: 'Zoho Service' },
    { value: 'cloud', label: 'Cloud Solution' },
    { value: 'web_development', label: 'Web Development' },
    { value: 'app_development', label: 'App Development' },
    { value: 'digital_marketing', label: 'Digital Marketing' },
    { value: 'data_migration', label: 'Data Migration' },
    { value: 'consulting', label: 'Consulting And Training' }
  ];

  const [localData, setLocalData] = useState({
    alt_text: item?.alt_text || '',
    caption: item?.caption || '',
    tags: item?.tags || '',
    folder: item?.folder || 'general',
  });

  useEffect(() => {
    if (item) {
      setLocalData({
        alt_text: item.alt_text || '',
        caption: item.caption || '',
        tags: item.tags || '',
        folder: item.folder || 'general',
      });
    }
  }, [item]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (folderRef.current && !folderRef.current.contains(event.target as Node)) {
        setIsFolderOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!item) return null;

  const hasChanges = 
    localData.alt_text !== (item.alt_text || '') ||
    localData.caption !== (item.caption || '') ||
    localData.tags !== (item.tags || '') ||
    localData.folder !== (item.folder || 'general');

  const handleSave = () => {
    if (localData.alt_text !== (item.alt_text || '')) onUpdateMetadata(item.id, 'alt_text', localData.alt_text);
    if (localData.caption !== (item.caption || '')) onUpdateMetadata(item.id, 'caption', localData.caption);
    if (localData.tags !== (item.tags || '')) onUpdateMetadata(item.id, 'tags', localData.tags);
    if (localData.folder !== (item.folder || 'general')) onUpdateMetadata(item.id, 'folder', localData.folder);
  };

  const handleDiscard = () => {
    setLocalData({
      alt_text: item.alt_text || '',
      caption: item.caption || '',
      tags: item.tags || '',
      folder: item.folder || 'general',
    });
  };

  const ext = item.filename?.split('.').pop()?.toLowerCase();
  const type = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
  const path = `/uploads/${item.filename}`;

  return (
    <div className="w-[300px] shrink-0 bg-white text-gray-900 flex flex-col h-fit max-h-full border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
      <div className="p-3 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-[15px] font-bold tracking-tight text-gray-800">Asset details</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded">
          <X size={16} />
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto space-y-5 custom-scrollbar">
        {/* Preview */}
        <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative min-h-[160px]">
          <img src={item.url} alt={item.alt_text || item.filename} className="w-full object-cover" />
        </div>

        {/* Path Info */}
        <div className="space-y-3">
          <p className="text-gray-500 font-mono text-[11px] truncate">{path}</p>
          <button 
            onClick={() => onCopy && onCopy(path)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-bold text-xs uppercase tracking-wide transition-colors text-gray-700 shadow-sm"
          >
            <Copy size={14} /> Copy path for CMS fields
          </button>
          <p className="text-gray-500 text-[11px] leading-relaxed">
            Paste this path into blog featured image, villa thumbnail, or any image URL field.
          </p>
        </div>

        {/* Forms */}
        <div className="space-y-5 pt-4 border-t border-gray-100">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Alt Text</label>
            <input 
              type="text" 
              value={localData.alt_text}
              onChange={(e) => setLocalData(prev => ({ ...prev, alt_text: e.target.value }))}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            />
            {!localData.alt_text && <p className="text-amber-600 font-medium text-[11px] mt-1">Missing alt — SEO warning</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Caption</label>
            <input 
              type="text" 
              value={localData.caption}
              onChange={(e) => setLocalData(prev => ({ ...prev, caption: e.target.value }))}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Tags</label>
            <input 
              type="text" 
              value={localData.tags}
              onChange={(e) => setLocalData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
          <div className="space-y-1.5" ref={folderRef}>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Folder</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFolderOpen(!isFolderOpen)}
                className={`w-full flex items-center justify-between bg-white border ${
                  isFolderOpen ? 'border-blue-500 ring-1 ring-blue-500 rounded-t-md rounded-b-none' : 'border-gray-300 rounded-lg'
                } px-3 py-2 text-sm text-gray-900 focus:outline-none transition-all shadow-sm`}
              >
                <span>{FOLDERS.find(f => f.value === localData.folder)?.label || 'General Assets'}</span>
                <ChevronDown size={14} className="text-gray-500" />
              </button>
              
              {isFolderOpen && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 border-t-0 shadow-lg z-50 py-0 max-h-60 overflow-y-auto">
                  {FOLDERS.map(folder => (
                    <div
                      key={folder.value}
                      onClick={() => {
                        setLocalData(prev => ({ ...prev, folder: folder.value }));
                        setIsFolderOpen(false);
                      }}
                      className={`px-3 py-2 text-[15px] cursor-pointer transition-colors ${
                        localData.folder === folder.value ? 'bg-gray-500 text-white' : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {folder.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-4 pt-6 border-t border-gray-100 pb-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Usage</label>
            <p className="text-gray-500 text-sm font-medium">Not referenced in CMS yet.</p>
          </div>
          
          <div className="flex flex-col gap-2.5 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Type</span>
              <span className="text-gray-800 text-sm font-medium">{type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Size</span>
              <span className="text-gray-800 text-sm font-medium">2.4 MB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Dimensions</span>
              <span className="text-gray-800 text-sm font-medium">1536×1024</span>
            </div>
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="p-4 border-t border-gray-100 bg-white flex gap-3 sticky bottom-0 animate-in slide-in-from-bottom-2 fade-in duration-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button
            onClick={handleDiscard}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Don't Save
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
