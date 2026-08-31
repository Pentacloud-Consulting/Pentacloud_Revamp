import { useState, useRef, useEffect } from 'react';
import { SeoScoreBadge } from '../../../components/SeoScoreBadge';
import { EditorContent } from '@tiptap/react';
import { Image as ImageIcon, Link as LinkIcon, Upload, ChevronUp, ChevronDown, Trash2, Plus, X, Check, Bold, Italic, Heading2, Heading3, Heading4, Quote, List as ListIcon, Tag } from 'lucide-react';
import { MediaLibrary } from '../../Media/MediaLibrary';
import { uploadMediaFile } from '../Blog Fetch/Blog fetch details';
import { BlogContentButtons } from '../Blog Fetch/Blog Content Buttons';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomDatePicker } from '../../../components/CustomDatePicker';
import { PasteLinkPopup } from '../../../../Details/PopUp Messages/Paste Link';
import { convertToWebP } from '../../../components/image Converts WEBP';
import { SlugGenerateMessage } from '../../../../Details/PopUp Messages/Slug generate message';
import { FocusKeyNotFound } from '../../../../Details/PopUp Messages/Focus key found notfound';

export function NewBlogForm({ blog, setBlog, editor, seoScore, handleGenerateSlug, isResuming }: any) {
  const [activeTab, setActiveTab] = useState('DETAILS');
  const [contentType, setContentType] = useState<'manual' | 'html'>('manual');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [locationCustom, setLocationCustom] = useState(false);
  const [isSlugMessageOpen, setIsSlugMessageOpen] = useState(false);
  const [isFocusKeyNotFoundOpen, setIsFocusKeyNotFoundOpen] = useState(false);
  const [invalidKeyword, setInvalidKeyword] = useState('');
  
  const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(false);
  const [linkInitialData, setLinkInitialData] = useState({ url: '', newTab: true, noFollow: false });
  const savedSelectionRef = useRef<{ from: number; to: number } | null>(null);
  
  // Validation state
  const [detailsErrors, setDetailsErrors] = useState({ title: false, slug: false, category: false, location: false });

  // Auto-fill CTA fields for old drafts
  useEffect(() => {
    if (blog && (!blog.cta_heading || !blog.sidebar_email)) {
      setBlog((prev: any) => ({
        ...prev,
        cta_heading: prev.cta_heading || 'Ready to Transform Your Business?',
        cta_description: prev.cta_description || 'Join the 10+ clients we digitally transformed in 2026 — and let Pentacloud build something extraordinary for you too.',
        cta_button_text: prev.cta_button_text || 'Start Your Journey →',
        cta_button_link: prev.cta_button_link || '/contact',
        sidebar_heading: prev.sidebar_heading || 'Talk to an Expert',
        sidebar_subheading: prev.sidebar_subheading || 'Pentacloud Consulting Pvt Ltd',
        sidebar_address: prev.sidebar_address || 'Jagan Arcade, 4th Floor, 1st Main Road, Anandnagar, RT Nagar, Bengaluru, KA 560032',
        sidebar_phone: prev.sidebar_phone || '+971 545 132 807',
        sidebar_email: prev.sidebar_email || 'contactus@pentacloudconsulting.com',
        sidebar_button_text: prev.sidebar_button_text || 'Visit Website Matrix',
        sidebar_button_link: prev.sidebar_button_link || 'https://pentacloud.me'
      }));
    }
  }, [blog, setBlog]);

  // Validation refs
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLButtonElement>(null);
  const locationRef = useRef<HTMLButtonElement>(null);

  const handleNextFromDetails = () => {
    const errors = {
      title: !(blog.title || '').trim(),
      slug: !(blog.slug || '').trim(),
      category: !(blog.category || '').trim(),
      location: !(blog.location || '').trim(),
    };
    setDetailsErrors(errors);
    
    if (errors.title) {
      titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      titleRef.current?.focus();
    } else if (errors.slug) {
      slugRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      slugRef.current?.focus();
    } else if (errors.category) {
      categoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (errors.location) {
      locationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setActiveTab('CONTENT');
    }
  };

  // Tags state
  const [tagInput, setTagInput] = useState('');
  const [savedTags, setSavedTags] = useState<string[]>([]);

  // Load previously used tags from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pentacloud_saved_tags');
      if (stored) setSavedTags(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);
  
  const currentTags = blog.tags ? blog.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

  const persistTag = (tag: string) => {
    setSavedTags(prev => {
      const updated = Array.from(new Set([tag, ...prev])).slice(0, 20); // keep latest 20
      localStorage.setItem('pentacloud_saved_tags', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !currentTags.includes(newTag)) {
        setBlog({ ...blog, tags: [...currentTags, newTag].join(', ') });
        persistTag(newTag);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setBlog({ ...blog, tags: currentTags.filter((t: string) => t !== tagToRemove).join(', ') });
  };

  const handleAddSavedTag = (tag: string) => {
    if (!currentTags.includes(tag)) {
      setBlog({ ...blog, tags: [...currentTags, tag].join(', ') });
    }
  };

  // Media Picker state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'cover_image_url' | 'thumbnail_url' | 'og_image' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Smart heading: applies ONLY to selected text by splitting the block
  const applyHeadingToSelection = (level: 1|2|3|4|5|6) => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const empty = from === to;

    if (empty) {
      // No selection - toggle heading on entire current block (standard behaviour)
      editor.chain().focus().toggleHeading({ level }).run();
      return;
    }

    const { state } = editor;
    const { doc, schema } = state;
    const $from = doc.resolve(from);
    const $to   = doc.resolve(to);

    // If multi-block selection or already a heading node, use standard toggle
    if ($from.parent !== $to.parent || $from.depth !== $to.depth) {
      editor.chain().focus().toggleHeading({ level }).run();
      return;
    }

    const blockStart = $from.start($from.depth); // first content pos in the block
    const blockEnd   = $to.end($to.depth);        // last content pos in the block
    const parentStart = $from.before($from.depth); // position of the block node itself
    const parentEnd   = $to.after($to.depth);

    // Full block selected → normal toggle
    if (from <= blockStart && to >= blockEnd) {
      editor.chain().focus().toggleHeading({ level }).run();
      return;
    }

    // Partial selection within a single block – split into before / heading / after
    const beforeContent  = doc.slice(blockStart, from).content;
    const selectedContent = doc.slice(from, to).content;
    const afterContent   = doc.slice(to, blockEnd).content;

    const paraType    = schema.nodes.paragraph;
    const headingType = schema.nodes.heading;

    const replacementNodes: any[] = [];
    if (beforeContent.size > 0)  replacementNodes.push(paraType.create({}, beforeContent));
    replacementNodes.push(headingType.create({ level }, selectedContent));
    if (afterContent.size > 0)   replacementNodes.push(paraType.create({}, afterContent));

    const tr = state.tr.replaceWith(parentStart, parentEnd, replacementNodes);
    editor.view.dispatch(tr);
  };

  const predefinedCategories = [
    'Salesforce Consulting',
    'Zoho Service',
    'Cloud Solution',
    'Web Development',
    'App Development',
    'Digital Marketing',
    'Data Migration',
    'Consulting And Training'
  ];

  // Location options — preset + custom entry
  const predefinedLocations = [
    { label: 'Dubai, UAE', value: 'Dubai' },
    { label: 'Qatar', value: 'Qatar' },
    { label: 'UAE (All Emirates)', value: 'UAE' },
    { label: 'India', value: 'India' },
    { label: 'Global / Worldwide', value: 'Global' },
    { label: '✏️  Custom…', value: '__custom__' },
  ];

  const handleLibraryClick = (target: 'cover_image_url' | 'thumbnail_url' | 'og_image') => {
    setMediaTarget(target);
    setIsMediaPickerOpen(true);
  };

  const handleMediaSelect = (url: string) => {
    if (mediaTarget) {
      setBlog({ ...blog, [mediaTarget]: url });
    }
    setIsMediaPickerOpen(false);
    setMediaTarget(null);
  };

  const handleUploadClick = (target: 'cover_image_url' | 'thumbnail_url' | 'og_image') => {
    setMediaTarget(target);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && mediaTarget) {
      try {
        // Convert to WebP before anything else
        const webpFile = await convertToWebP(file);
        
        // Create local preview immediately
        const localUrl = URL.createObjectURL(webpFile);
        setBlog({ ...blog, [mediaTarget]: localUrl });
        
        // Upload to media library behind the scenes
        const suffix = mediaTarget === 'cover_image_url' ? 'hero' : (mediaTarget === 'thumbnail_url' ? 'thumbnail' : 'og');
        const serverUrl = await uploadMediaFile(webpFile, blog.focus_keyword, suffix);
        
        // Update with server URL once uploaded
        setBlog((prev: any) => ({ ...prev, [mediaTarget]: serverUrl }));
      } catch (err) {
        console.error('Failed to convert/upload image:', err);
        alert('Failed to process image. Please try another.');
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setMediaTarget(null);
  };

  const tabs = ['DETAILS', 'SEO', 'CONTENT', 'CTA', 'FAQ'];

  const handleContentTypeSwitch = (type: 'manual' | 'html') => {
    if (type === 'manual' && contentType === 'html') {
      editor?.commands.setContent(blog.content || '');
    }
    setContentType(type);
  };

  const renderDetails = () => (
    <div className="space-y-8 max-w-4xl">
      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Blog title *</label>
        <input
          ref={titleRef}
          type="text"
          value={blog.title || ''}
          onChange={e => {
            setBlog({ ...blog, title: e.target.value });
            if (detailsErrors.title) setDetailsErrors({ ...detailsErrors, title: false });
          }}
          className={`w-full px-4 py-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow ${detailsErrors.title ? 'border-red-500' : 'border-gray-300'}`}
        />
        {detailsErrors.title && <p className="text-red-500 text-xs mt-1">Blog title is required.</p>}
      </div>

      {/* Slug & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
             <div className="flex justify-between items-center mb-2">
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Slug *</label>
             <button 
               type="button" 
               onClick={() => {
                 const result = handleGenerateSlug();
                 if (result === false) {
                   // No focus keyword at all → remind to fill it
                   setIsSlugMessageOpen(true);
                 } else if (result === 'invalid') {
                   // Keyword typed but not in tracked list → show warning + go to SEO tab
                   setInvalidKeyword(blog.focus_keyword || '');
                   setIsFocusKeyNotFoundOpen(true);
                   setActiveTab('SEO');
                 }
                 // true = slug generated successfully, nothing to do
               }} 
               className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline"
             >
               Generate
             </button>
           </div>
           <input
             ref={slugRef}
             type="text"
             value={blog.slug || ''}
             onChange={e => {
               const newSlug = e.target.value;
               setBlog({ ...blog, slug: newSlug, canonical_url: `https://pentacloud.me/blogs/${newSlug}` });
               if (detailsErrors.slug) setDetailsErrors({ ...detailsErrors, slug: false });
             }}
             className={`w-full px-4 py-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow ${detailsErrors.slug ? 'border-red-500' : 'border-gray-300'}`}
           />
           {detailsErrors.slug && <p className="text-red-500 text-xs mt-1">Slug is required.</p>}
        </div>
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
           <div className="relative z-30">
             <button
               ref={categoryRef}
               type="button"
               onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
               className={`w-full flex items-center justify-between px-4 py-3 border rounded-md bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-left ${detailsErrors.category ? 'border-red-500' : 'border-gray-300'}`}
             >
               <span className={blog.category ? 'text-gray-900' : 'text-gray-400'}>
                 {blog.category || 'Select a category'}
               </span>
               <ChevronDown size={16} className={`text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
             </button>
             {detailsErrors.category && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">Category is required.</p>}
             
             <AnimatePresence>
               {isCategoryDropdownOpen && (
                 <motion.div
                   initial={{ opacity: 0, y: -5 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -5 }}
                   transition={{ duration: 0.15 }}
                   className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden py-1 z-50 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
                 >
                   {predefinedCategories.map(cat => (
                     <button
                       key={cat}
                       type="button"
                       onClick={() => {
                         setBlog({ ...blog, category: cat });
                         if (detailsErrors.category) setDetailsErrors({ ...detailsErrors, category: false });
                         setIsCategoryDropdownOpen(false);
                       }}
                       className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                         blog.category === cat 
                           ? 'bg-blue-50 text-blue-700 font-bold' 
                           : 'text-gray-700 hover:bg-gray-50'
                       }`}
                     >
                       {cat}
                     </button>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
      </div>

      {/* Location — required for local SEO geo targeting */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location *</label>
        <p className="text-xs text-gray-400 mb-2">
          Required for local SEO. Sets <code className="bg-gray-100 px-1 rounded text-blue-600 font-mono">geo.placename</code>,
          {' '}<code className="bg-gray-100 px-1 rounded text-blue-600 font-mono">og:locale</code>, and Article schema <code className="bg-gray-100 px-1 rounded text-blue-600 font-mono">areaServed</code>.
        </p>
        <div className="relative z-20">
          {!locationCustom ? (
            <>
              <button
                ref={locationRef}
                type="button"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 border rounded-md bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-left ${detailsErrors.location ? 'border-red-500' : 'border-gray-300'}`}
              >
                <span className={blog.location ? 'text-gray-900' : 'text-gray-400'}>
                  {blog.location || 'Select a location'}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {detailsErrors.location && <p className="text-red-500 text-xs mt-1">Location is required before publishing.</p>}

              <AnimatePresence>
                {isLocationDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden py-1 z-50"
                  >
                    {predefinedLocations.map(loc => (
                      <button
                        key={loc.value}
                        type="button"
                        onClick={() => {
                          if (loc.value === '__custom__') {
                            setLocationCustom(true);
                            setBlog({ ...blog, location: '' });
                          } else {
                            setBlog({ ...blog, location: loc.value });
                            if (detailsErrors.location) setDetailsErrors({ ...detailsErrors, location: false });
                          }
                          setIsLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          blog.location === loc.value
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {loc.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={blog.location || ''}
                onChange={e => {
                  setBlog({ ...blog, location: e.target.value });
                  if (detailsErrors.location) setDetailsErrors({ ...detailsErrors, location: false });
                }}
                placeholder="e.g. Abu Dhabi, Riyadh, London…"
                className={`flex-1 px-4 py-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${detailsErrors.location ? 'border-red-500' : 'border-gray-300'}`}
              />
              <button
                type="button"
                onClick={() => { setLocationCustom(false); setBlog({ ...blog, location: '' }); }}
                className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-600 rounded-md text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Excerpt / Short Description</label>
        <textarea
          value={blog.excerpt || ''}
          onChange={e => setBlog({ ...blog, excerpt: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Author & Read Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Author</label>
           <input
             type="text"
             value={blog.author || ''}
             onChange={e => setBlog({ ...blog, author: e.target.value })}
             className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
           />
        </div>
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Read Time</label>
           <input
             type="text"
             value={blog.read_time || ''}
             onChange={e => setBlog({ ...blog, read_time: e.target.value })}
             placeholder="e.g. 5 min read"
             className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
           />
        </div>
      </div>

      {/* Featured Image — used as hero on the individual blog post page */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Featured Image (Blog Post Hero)</label>
        <p className="text-xs text-gray-400 mb-3">🖼️ This image appears as the <strong>full-width hero</strong> at the top of the individual blog post page only.</p>
        <div className="flex flex-col md:flex-row gap-4 items-stretch p-4 border border-gray-200 rounded-lg bg-gray-50/50">
          <div className="w-48 h-32 bg-white border border-gray-300 rounded-md flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
            {blog.cover_image_url ? (
               <img src={blog.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
            ) : (
               <ImageIcon className="text-gray-300" size={40} />
            )}
          </div>
          <div className="flex-1 flex flex-col gap-3 justify-center">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={blog.cover_image_url || ''} 
                  onChange={e => setBlog({ ...blog, cover_image_url: e.target.value })}
                  placeholder="/image.webp"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button type="button" onClick={() => handleLibraryClick('cover_image_url')} className="px-5 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 font-bold hover:bg-gray-50 shadow-sm transition-colors">
                LIBRARY
              </button>
            </div>
            <div>
              <button type="button" onClick={() => handleUploadClick('cover_image_url')} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 font-bold hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors w-max">
                <Upload size={16} />
                UPLOAD &rarr; JPG, PNG, WEBP
              </button>
            </div>
            <div className="mt-1">
              <input 
                type="text" 
                value={blog.cover_image_alt || ''} 
                onChange={e => setBlog({ ...blog, cover_image_alt: e.target.value })}
                placeholder="Alt Text (Add Focus Keyword here...)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Recommended for cards, hero, and Open Graph fallbacks.</p>
          </div>
        </div>
      </div>

      {/* Blog Thumbnail — used as card image on the blogs listing page */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Blog Thumbnail (Listing Card)</label>
        <p className="text-xs text-gray-400 mb-3">🃏 This image appears on the <strong>Blogs listing page cards</strong>. If left empty, the Featured Image above is used as fallback.</p>
        <div className="flex flex-col md:flex-row gap-4 items-stretch p-4 border border-gray-200 rounded-lg bg-gray-50/50">
          <div className="w-48 h-32 bg-white border border-gray-300 rounded-md flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
            {blog.thumbnail_url ? (
               <img src={blog.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
            ) : (
               <ImageIcon className="text-gray-300" size={40} />
            )}
          </div>
          <div className="flex-1 flex flex-col gap-3 justify-center">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={blog.thumbnail_url || ''} 
                  onChange={e => setBlog({ ...blog, thumbnail_url: e.target.value })}
                  placeholder="/image.webp"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button type="button" onClick={() => handleLibraryClick('thumbnail_url')} className="px-5 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 font-bold hover:bg-gray-50 shadow-sm transition-colors">
                LIBRARY
              </button>
            </div>
            <div>
              <button type="button" onClick={() => handleUploadClick('thumbnail_url')} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 font-bold hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors w-max">
                <Upload size={16} />
                UPLOAD &rarr; JPG, PNG, WEBP
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Used on blog index cards when set; otherwise the featured image is used.</p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">SEO Keywords / Tags</label>
         <p className="text-xs text-gray-400 mb-2">These tags become <code className="bg-gray-100 px-1 rounded text-blue-600 font-mono">&lt;meta name="keywords"&gt;</code> on the published page — helping Google match your blog to relevant searches (e.g. tag "Cloud" helps rank for "cloud services").</p>
         <div className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow min-h-[50px]">
           {currentTags.map((tag: string, index: number) => (
             <span key={index} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium border border-blue-200">
               <Tag size={12} /> {tag}
               <button type="button" onClick={() => handleRemoveTag(tag)} className="text-blue-300 hover:text-red-500 transition-colors focus:outline-none">
                 <X size={14} />
               </button>
             </span>
           ))}
           <input
             type="text"
             value={tagInput}
             onChange={e => setTagInput(e.target.value)}
             onKeyDown={handleAddTag}
             placeholder={currentTags.length === 0 ? "e.g. Cloud, Salesforce, CRM... (press Enter)" : "Add another keyword..."}
             className="flex-1 min-w-[140px] bg-transparent focus:outline-none text-sm text-gray-900 placeholder:text-gray-400"
           />
         </div>

         {/* Previously used tags suggestions */}
         {savedTags.filter(t => !currentTags.includes(t)).length > 0 && (
           <div className="mt-2">
             <p className="text-xs text-gray-400 mb-1.5">Previously used — click to add:</p>
             <div className="flex flex-wrap gap-1.5">
               {savedTags.filter(t => !currentTags.includes(t)).slice(0, 10).map((tag, i) => (
                 <button
                   key={i}
                   type="button"
                   onClick={() => handleAddSavedTag(tag)}
                   className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                 >
                   <Plus size={10} /> {tag}
                 </button>
               ))}
             </div>
           </div>
         )}
      </div>

      {/* Featured Checkbox */}
      <div 
         className="flex items-center gap-3 cursor-pointer select-none"
         onClick={() => setBlog({ ...blog, is_featured: !(blog.is_featured || false) })}
      >
         <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
           blog.is_featured 
             ? 'bg-blue-600 border-blue-600 text-white' 
             : 'bg-white border-gray-300 text-transparent hover:border-blue-400 border-2'
         }`}>
           <Check size={14} strokeWidth={4} />
         </div>
         <span className="text-sm text-gray-700">Featured on blog index</span>
      </div>

      {/* Status & Publish Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
           <div className="relative z-20">
             <button
               type="button"
               onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
               className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
             >
               <span className="text-gray-900 capitalize">
                 {isResuming && (!blog.status || blog.status === 'draft') ? 'Unsaved Draft' : (blog.status || 'draft')}
               </span>
               <ChevronDown size={16} className={`text-gray-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
             </button>
             
             <AnimatePresence>
               {isStatusDropdownOpen && (
                 <motion.div
                   initial={{ opacity: 0, y: -5 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -5 }}
                   transition={{ duration: 0.15 }}
                   className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden py-1 z-50 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
                 >
                   {['draft', 'published'].map(status => (
                     <button
                       key={status}
                       type="button"
                       onClick={() => {
                         setBlog({ ...blog, status: status });
                         setIsStatusDropdownOpen(false);
                       }}
                       className={`w-full text-left px-4 py-2.5 text-sm transition-colors capitalize ${
                         (blog.status || 'draft') === status 
                           ? 'bg-blue-50 text-blue-700 font-bold' 
                           : 'text-gray-700 hover:bg-gray-50'
                       }`}
                     >
                       {status}
                     </button>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Publish Date</label>
           <CustomDatePicker
             value={blog.publish_date || ''}
             onChange={val => setBlog({ ...blog, publish_date: val })}
             placeholder="dd-mm-yyyy"
           />
        </div>
      </div>



      {/* Last Modified Date */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Modified Date</label>
        <CustomDatePicker
          value={blog.last_modified_date || ''}
          onChange={val => setBlog({ ...blog, last_modified_date: val })}
          placeholder="dd-mm-yyyy"
        />
        <p className="text-xs text-gray-500 mt-2">Auto-updated on save if left empty.</p>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center gap-4 pt-8 mt-8 border-t border-gray-200">
        <button 
          onClick={() => setActiveTab('SEO')}
          className="px-8 py-3 bg-blue-600 text-white rounded-md text-sm font-bold tracking-wider hover:bg-blue-700 transition-colors shadow-sm"
        >
          NEXT &rarr;
        </button>
        <button 
          className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-bold tracking-wider hover:bg-gray-50 transition-colors shadow-sm"
        >
          CANCEL
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    // Strip all HTML tags accurately, then collapse whitespace, then count words
    const rawHtml = blog.content || '';
    const plainText = rawHtml
      .replace(/<[^>]+>/g, ' ')          // replace tags with space
      .replace(/&nbsp;/g, ' ')           // decode &nbsp;
      .replace(/&[a-z]+;/g, '')          // strip other html entities
      .replace(/\s+/g, ' ')             // collapse whitespace
      .trim();
    const wordCount = plainText.length > 0 ? plainText.split(' ').filter((w: string) => w.length > 0).length : 0;
    
    return (
      <div className="space-y-4 max-w-5xl">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="text-lg font-bold text-gray-800">Blog Content Editor</h3>
          
          <div className="text-sm font-medium">
            <span className={wordCount > 2500 ? 'text-red-600 font-bold' : (wordCount >= 2000 ? 'text-green-600' : 'text-gray-500')}>
              Words: {wordCount}
            </span>
            <span className="text-gray-400"> / 2000 - 2500</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 relative z-20">
          <span className="text-sm font-bold text-gray-700">Content Type:</span>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-[200px] px-4 py-2 border-2 border-blue-500 rounded-lg bg-white text-sm font-medium text-gray-800 shadow-sm transition-all focus:outline-none"
            >
              {contentType === 'manual' ? 'Manual (Rich Text)' : 'HTML'}
              <ChevronDown size={16} className={`text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-[200px] bg-white border border-gray-300 rounded-md shadow-xl py-1 overflow-hidden z-50">
                <button
                  onClick={() => {
                    handleContentTypeSwitch('manual');
                    setIsDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${contentType === 'manual' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Manual (Rich Text)
                </button>
                <button
                  onClick={() => {
                    handleContentTypeSwitch('html');
                    setIsDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${contentType === 'html' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  HTML
                </button>
              </div>
            )}
          </div>
        </div>

        {contentType === 'manual' ? (
          <>
            {editor && (
              <BlogContentButtons
                editor={editor}
                applyHeadingToSelection={applyHeadingToSelection}
                savedSelectionRef={savedSelectionRef}
                setLinkInitialData={setLinkInitialData}
                setIsLinkPopupOpen={setIsLinkPopupOpen}
                focusKeyword={blog.focus_keyword}
              />
            )}
            <div className="-mt-3">
              <EditorContent editor={editor} />
            </div>
          </>
        ) : (
          <textarea
            value={blog.content || ''}
            onChange={(e) => setBlog({ ...blog, content: e.target.value })}
            rows={15}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-900 text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            placeholder="<p>Paste or write your raw HTML here...</p>"
          />
        )}
        
        <div className="flex items-center gap-4 pt-8 mt-8 border-t border-gray-200">
          <button 
            onClick={() => setActiveTab('CTA')}
            className="px-8 py-3 bg-blue-600 text-white rounded-md text-sm font-bold tracking-wider hover:bg-blue-700 transition-colors shadow-sm"
          >
            NEXT &rarr;
          </button>
          <button 
            onClick={() => setActiveTab('SEO')} 
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-bold tracking-wider hover:bg-gray-50 transition-colors shadow-sm"
          >
            BACK
          </button>
        </div>
      </div>
    );
  };

  const renderSEO = () => (
    <div className="space-y-10 max-w-5xl">
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Title</label>
          <input type="text" value={blog.meta_title || ''} onChange={e => setBlog({ ...blog, meta_title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <p className="text-xs text-gray-500 mt-2">{(blog.meta_title || '').length} / 60 recommended (max 120)</p>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Description</label>
          <textarea value={blog.meta_description || ''} onChange={e => setBlog({ ...blog, meta_description: e.target.value })} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <p className="text-xs text-gray-500 mt-2">{(blog.meta_description || '').length} / 160 recommended (max 320)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Focus Keyword</label>
            <input
              type="text"
              value={blog.focus_keyword || ''}
              onChange={e => setBlog({ ...blog, focus_keyword: e.target.value })}
              onBlur={() => {
                const kw = (blog.focus_keyword || '').trim().toLowerCase();
                if (!kw) return;
                try {
                  const stored = JSON.parse(localStorage.getItem('pentacloud_tracked_keywords') || '[]') as string[];
                  if (!stored.includes(kw)) {
                    setInvalidKeyword(blog.focus_keyword || '');
                    setIsFocusKeyNotFoundOpen(true);
                  }
                } catch {}
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. salesforce consulting dubai"
            />
            <p className="text-[11px] text-gray-400 mt-1">Must match a keyword from your Rank Tracker.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Canonical URL</label>
            <input type="text" value={blog.canonical_url || (blog.slug ? `https://pentacloud.me/blogs/${blog.slug}` : '')} onChange={e => setBlog({ ...blog, canonical_url: e.target.value })} placeholder="https://pentacloud.me/blogs/..." className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Open Graph</h3>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">OG Title</label>
          <input type="text" value={blog.og_title || ''} onChange={e => setBlog({ ...blog, og_title: e.target.value })} placeholder="Defaults to meta title" className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">OG Description</label>
          <textarea value={blog.og_description || ''} onChange={e => setBlog({ ...blog, og_description: e.target.value })} rows={3} placeholder="Defaults to meta description" className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">OG Image</label>
          <div className="flex flex-col md:flex-row gap-4 items-stretch p-4 border border-gray-200 rounded-lg bg-gray-50/50">
            <div className="w-48 h-32 bg-white border border-gray-300 rounded-md flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              {blog.og_image || blog.cover_image_url ? (
                <img src={blog.og_image || blog.cover_image_url} alt="OG" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-gray-300" size={40} />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-3 justify-center">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={blog.og_image || blog.cover_image_url || ''} 
                    onChange={e => setBlog({ ...blog, og_image: e.target.value })}
                    placeholder="/image.webp"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button type="button" onClick={() => handleLibraryClick('og_image')} className="px-5 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 font-bold hover:bg-gray-50 shadow-sm transition-colors">
                  LIBRARY
                </button>
              </div>
              <div>
                <button type="button" onClick={() => handleUploadClick('og_image')} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 font-bold hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors w-max">
                  <Upload size={16} />
                  UPLOAD &rarr; JPG, PNG, WEBP
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Defaults to featured image when empty.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Search Engine Controls</h3>
        <div className="flex items-center gap-8">
          <div 
             className="flex items-center gap-3 cursor-pointer select-none"
             onClick={() => setBlog({ ...blog, allow_search_engines: !(blog.allow_search_engines !== false) })}
          >
             <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
               blog.allow_search_engines !== false 
                 ? 'bg-blue-600 border-blue-600 text-white' 
                 : 'bg-white border-gray-300 text-transparent hover:border-blue-400'
             }`}>
               <Check size={14} strokeWidth={4} />
             </div>
             <span className="text-sm text-gray-700">Index (allow search engines)</span>
          </div>
          <div 
             className="flex items-center gap-3 cursor-pointer select-none"
             onClick={() => setBlog({ ...blog, follow_links: !(blog.follow_links !== false) })}
          >
             <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
               blog.follow_links !== false 
                 ? 'bg-blue-600 border-blue-600 text-white' 
                 : 'bg-white border-gray-300 text-transparent hover:border-blue-400'
             }`}>
               <Check size={14} strokeWidth={4} />
             </div>
             <span className="text-sm text-gray-700">Follow links</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
        {/* Google Search Preview */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Google Search Preview</h4>
          <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 truncate">{blog.canonical_url || `https://pentacloud.me/blogs/${blog.slug || 'slug'}`}</p>
            <h3 className="text-xl text-blue-600 hover:underline cursor-pointer truncate mt-1">
              {blog.meta_title || blog.title || 'Add a meta title...'}
            </h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {blog.meta_description || blog.excerpt || 'Add a meta description to control how this post appears in search results.'}
            </p>
          </div>
        </div>

        {/* Social Preview */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Social Preview</h4>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="h-48 bg-gray-100 flex items-center justify-center border-b border-gray-200 relative">
              {blog.og_image || blog.cover_image_url ? (
                <img src={blog.og_image || blog.cover_image_url} alt="OG Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm text-gray-400">OG image</span>
              )}
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">PENTACLOUD.ME</p>
              <h4 className="font-bold text-gray-900 truncate">
                {blog.og_title || blog.meta_title || blog.title || 'Add an OG title...'}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {blog.og_description || blog.meta_description || blog.excerpt || 'Add a meta description to control how this post appears in search results.'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Featured image is recommended for blog cards and social sharing.</p>
      
      <div className="flex items-center gap-4 pt-8 mt-8 border-t border-gray-200">
        <button 
          onClick={() => setActiveTab('CONTENT')}
          className="px-8 py-3 bg-blue-600 text-white rounded-md text-sm font-bold tracking-wider hover:bg-blue-700 transition-colors shadow-sm"
        >
          NEXT &rarr;
        </button>
        <button 
          onClick={() => setActiveTab('DETAILS')} 
          className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-bold tracking-wider hover:bg-gray-50 transition-colors shadow-sm"
        >
          BACK
        </button>
      </div>
    </div>
  );

  const renderCTA = () => (
    <div className="space-y-10 max-w-5xl">
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Mid-Content CTA</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CTA Heading</label>
            <input type="text" value={blog.cta_heading || ''} onChange={e => setBlog({ ...blog, cta_heading: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Button Text</label>
            <input type="text" value={blog.cta_button_text || ''} onChange={e => setBlog({ ...blog, cta_button_text: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CTA Description</label>
          <textarea value={blog.cta_description || ''} onChange={e => setBlog({ ...blog, cta_description: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Button Link</label>
          <input type="text" value={blog.cta_button_link || ''} onChange={e => setBlog({ ...blog, cta_button_link: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Sidebar Contact Box</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sidebar Heading</label>
            <input type="text" value={blog.sidebar_heading || ''} onChange={e => setBlog({ ...blog, sidebar_heading: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sidebar Subheading</label>
            <input type="text" value={blog.sidebar_subheading || ''} onChange={e => setBlog({ ...blog, sidebar_subheading: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Address</label>
          <input type="text" value={blog.sidebar_address || ''} onChange={e => setBlog({ ...blog, sidebar_address: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
            <input type="text" value={blog.sidebar_phone || ''} onChange={e => setBlog({ ...blog, sidebar_phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
            <input type="text" value={blog.sidebar_email || ''} onChange={e => setBlog({ ...blog, sidebar_email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Button Text</label>
            <input type="text" value={blog.sidebar_button_text || ''} onChange={e => setBlog({ ...blog, sidebar_button_text: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Button Link</label>
            <input type="text" value={blog.sidebar_button_link || ''} onChange={e => setBlog({ ...blog, sidebar_button_link: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 pt-8 mt-8 border-t border-gray-200">
        <button 
          onClick={() => setActiveTab('FAQ')}
          className="px-8 py-3 bg-blue-600 text-white rounded-md text-sm font-bold tracking-wider hover:bg-blue-700 transition-colors shadow-sm"
        >
          NEXT &rarr;
        </button>
        <button 
          onClick={() => setActiveTab('CONTENT')} 
          className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-bold tracking-wider hover:bg-gray-50 transition-colors shadow-sm"
        >
          BACK
        </button>
      </div>
    </div>
  );

  const renderFAQ = () => {
    const faqs = blog.faqs || [];

    const addFaq = () => {
      setBlog({ ...blog, faqs: [...faqs, { question: '', answer: '' }] });
    };

    const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
      const newFaqs = [...faqs];
      newFaqs[index][field] = value;
      setBlog({ ...blog, faqs: newFaqs });
    };

    const removeFaq = (index: number) => {
      const newFaqs = [...faqs];
      newFaqs.splice(index, 1);
      setBlog({ ...blog, faqs: newFaqs });
    };

    const moveFaq = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index > 0) {
        const newFaqs = [...faqs];
        [newFaqs[index - 1], newFaqs[index]] = [newFaqs[index], newFaqs[index - 1]];
        setBlog({ ...blog, faqs: newFaqs });
      } else if (direction === 'down' && index < faqs.length - 1) {
        const newFaqs = [...faqs];
        [newFaqs[index], newFaqs[index + 1]] = [newFaqs[index + 1], newFaqs[index]];
        setBlog({ ...blog, faqs: newFaqs });
      }
    };

    return (
      <div className="space-y-6 max-w-4xl">
        <p className="text-sm text-gray-600 mb-6">Enable FAQ schema in the previous step to emit FAQ structured data.</p>
        
        <div className="space-y-6">
          {faqs.map((faq: any, index: number) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h4 className="text-sm font-bold text-gray-700">FAQ {index + 1}</h4>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveFaq(index, 'up')} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-50" disabled={index === 0}>
                    <ChevronUp size={16} />
                  </button>
                  <button onClick={() => moveFaq(index, 'down')} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-50" disabled={index === faqs.length - 1}>
                    <ChevronDown size={16} />
                  </button>
                  <button onClick={() => removeFaq(index)} className="p-1 text-red-400 hover:text-red-600 ml-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={e => updateFaq(index, 'question', e.target.value)}
                    placeholder="Question"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <textarea
                    value={faq.answer}
                    onChange={e => updateFaq(index, 'answer', e.target.value)}
                    placeholder="Answer"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addFaq}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 font-bold text-sm tracking-wider hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> ADD FAQ
        </button>

        <div className="flex items-center gap-4 pt-8 mt-8 border-t border-gray-200">
          <button 
            onClick={() => setActiveTab('CTA')} 
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-bold tracking-wider hover:bg-gray-50 transition-colors shadow-sm"
          >
            BACK
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-12">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      
      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white shrink-0">
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">Select Media</h2>
              <button onClick={() => setIsMediaPickerOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full border border-gray-200 shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-hidden p-6 bg-slate-50">
              <MediaLibrary onSelect={handleMediaSelect} />
            </div>
          </div>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50/80 px-4 pt-4 gap-2 rounded-t-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3.5 text-sm font-bold tracking-wider rounded-t-lg transition-all border-b-2 ${
              activeTab === tab 
                ? 'bg-white text-blue-600 border-x border-t border-gray-200 border-b-transparent shadow-[0_2px_0_white]' 
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 border-transparent'
            }`}
            style={{ marginBottom: activeTab === tab ? '-2px' : '0' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'DETAILS' && renderDetails()}
        {activeTab === 'SEO' && renderSEO()}
        {activeTab === 'CONTENT' && renderContent()}
        {activeTab === 'CTA' && renderCTA()}
        {activeTab === 'FAQ' && renderFAQ()}
      </div>
      {/* PasteLink Popup - rendered at root level to avoid z-index clipping */}
      <PasteLinkPopup
        isOpen={isLinkPopupOpen}
        onClose={() => setIsLinkPopupOpen(false)}
        initialUrl={linkInitialData.url}
        initialNewTab={linkInitialData.newTab}
        initialNoFollow={linkInitialData.noFollow}
        onSave={(url, newTab, noFollow) => {
          if (!editor) return;
          // Restore the saved selection, then apply link
          if (savedSelectionRef.current) {
            const { from, to } = savedSelectionRef.current;
            editor.chain().focus().setTextSelection({ from, to }).run();
          }
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
          } else {
            const target = newTab ? '_blank' : null;
            let rel = 'noopener noreferrer';
            if (noFollow) rel += ' nofollow';
            editor.chain().focus().extendMarkRange('link').setLink({ href: url, target, rel }).run();
          }
          savedSelectionRef.current = null;
        }}
      />
      <SlugGenerateMessage 
        isOpen={isSlugMessageOpen} 
        onClose={() => setIsSlugMessageOpen(false)} 
      />
      <FocusKeyNotFound
        isOpen={isFocusKeyNotFoundOpen}
        keyword={invalidKeyword}
        onClose={() => setIsFocusKeyNotFoundOpen(false)}
      />
    </div>
  );
}
