import React, { MutableRefObject, useRef, useState } from 'react';
import { Bold, Italic, Heading2, Heading3, Heading4, Quote, List as ListIcon, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { uploadMediaFile } from './Blog fetch details';

interface LinkData {
  url: string;
  newTab: boolean;
  noFollow: boolean;
}

interface BlogContentButtonsProps {
  editor: Editor;
  applyHeadingToSelection: (level: 2 | 3 | 4) => void;
  savedSelectionRef: MutableRefObject<{ from: number; to: number } | null>;
  setLinkInitialData: (data: LinkData) => void;
  setIsLinkPopupOpen: (isOpen: boolean) => void;
}

export const BlogContentButtons: React.FC<BlogContentButtonsProps> = ({
  editor,
  applyHeadingToSelection,
  savedSelectionRef,
  setLinkInitialData,
  setIsLinkPopupOpen,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Upload to real Supabase backend
      const url = await uploadMediaFile(file);
      
      // Insert image into editor
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex gap-2 mb-2 p-2 border border-gray-200 rounded-t-md bg-gray-50 flex-wrap">
      {/* Hidden File Input for Image Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {[
        { label: 'Bold', icon: <Bold size={14} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
        { label: 'Italic', icon: <Italic size={14} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
        { label: 'H2', icon: <Heading2 size={14} />, action: () => applyHeadingToSelection(2), active: editor.isActive('heading', { level: 2 }) },
        { label: 'H3', icon: <Heading3 size={14} />, action: () => applyHeadingToSelection(3), active: editor.isActive('heading', { level: 3 }) },
        { label: 'H4', icon: <Heading4 size={14} />, action: () => applyHeadingToSelection(4), active: editor.isActive('heading', { level: 4 }) },
        { label: 'Quote', icon: <Quote size={14} />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
        { label: 'List', icon: <ListIcon size={14} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
        { label: 'Link', icon: <LinkIcon size={14} />, action: () => {
            const { from, to } = editor.state.selection;
            savedSelectionRef.current = { from, to };
            
            const attrs = editor.getAttributes('link');
            const previousUrl = attrs.href || '';
            const previousTarget = attrs.target === '_blank';
            const previousNoFollow = attrs.rel?.includes('nofollow') || false;
            
            setLinkInitialData({ url: previousUrl, newTab: previousTarget, noFollow: previousNoFollow });
            setIsLinkPopupOpen(true);
          }, active: editor.isActive('link') },
      ].map(({ label, icon, action, active }) => (
        <button key={label} title={label} type="button" onClick={action} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-bold transition-colors ${active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}>
          {icon}
          <span>{label}</span>
        </button>
      ))}

      {/* Image Upload Button */}
      <button 
        title="Upload Image" 
        type="button" 
        onClick={() => fileInputRef.current?.click()} 
        disabled={isUploading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
        <span>{isUploading ? 'Uploading...' : 'Image'}</span>
      </button>
    </div>
  );
};
