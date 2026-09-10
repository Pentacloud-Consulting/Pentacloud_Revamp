import React, { MutableRefObject, useState } from 'react';
import { Bold, Italic, Heading2, Heading3, Heading4, Quote, List as ListIcon, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { MediaLibrary } from '../../Media/MediaLibrary';

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
  focusKeyword?: string;
}

export const BlogContentButtons: React.FC<BlogContentButtonsProps> = ({
  editor,
  applyHeadingToSelection,
  savedSelectionRef,
  setLinkInitialData,
  setIsLinkPopupOpen,
}) => {
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  const handleMediaSelect = (url: string) => {
    setIsMediaLibraryOpen(false);

    const altText = prompt(
      'Enter a descriptive Alt Text for this image.\n\n' +
      '💡 Pro Tip: Use a secondary keyword related to this section instead of repeating the main focus keyword to maximize Image Search ranking.'
    );
    const finalAlt = altText?.trim() || '';

    // Load image to get natural dimensions (prevents CLS)
    const img = new window.Image();
    img.onload = () => {
      editor.chain().focus().setImage({
        src: url,
        alt: finalAlt,
        title: finalAlt,
        width: img.width,
        height: img.height,
      }).run();
    };
    img.src = url;
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex gap-2 mb-2 p-2 border border-gray-200 rounded-t-md bg-gray-50 flex-wrap sticky top-0 z-[40] shadow-sm">
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

        {/* Media Library Image Button */}
        <button
          title="Insert image from Media Library"
          type="button"
          onClick={() => setIsMediaLibraryOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <ImageIcon size={14} />
          <span>Image</span>
        </button>
      </div>

      {/* Media Library Modal */}
      {isMediaLibraryOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Media Library</h2>
                <p className="text-sm text-gray-500 mt-0.5">Click an image to insert it into the editor</p>
              </div>
              <button
                onClick={() => setIsMediaLibraryOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Media Library Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <MediaLibrary onSelect={handleMediaSelect} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

