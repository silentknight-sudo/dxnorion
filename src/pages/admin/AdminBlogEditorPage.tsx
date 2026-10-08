import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit3, Trash2, Eye, ExternalLink, X, Bold, Italic,
  List, ListOrdered, Quote, Code, Link as LinkIcon, Image as ImageIcon,
  Undo, Redo, Sparkles, Check, Loader2, Minus, FileText, UploadCloud,
  CheckCircle2, RefreshCw
} from 'lucide-react';
import { Post, Category } from '../../types/index.ts';
import { adminFetch, safeJson } from '../../utils/adminAuth.ts';
import { firestoreService } from '../../lib/firestoreService.ts';

interface AdminBlogEditorPageProps {
  onNavigatePublic: (path: string) => void;
}

export const AdminBlogEditorPage: React.FC<AdminBlogEditorPageProps> = ({ onNavigatePublic }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Main Modal State for Create/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Content Textarea Ref & History for Undo/Redo
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Dedicated Insert Image Dialog State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [imageAltText, setImageAltText] = useState<string>('');
  const [imageAsCover, setImageAsCover] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [coverUploading, setCoverUploading] = useState(false);

  // Real-time Firestore sync & load
  useEffect(() => {
    firestoreService.getPosts().then(cloudPosts => {
      if (cloudPosts && cloudPosts.length > 0) {
        setPosts(cloudPosts);
      }
    }).catch(console.warn);

    const unsubscribe = firestoreService.subscribeToPosts((livePosts) => {
      if (livePosts && livePosts.length > 0) {
        setPosts(livePosts);
      }
    });

    fetchPosts();
    fetchCategories();

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/posts?admin=true');
      const { ok, data } = await safeJson(res);
      if (ok && Array.isArray(data) && data.length > 0) {
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await adminFetch('/api/categories');
      const { ok, data } = await safeJson(res);
      if (ok && Array.isArray(data)) {
        setCategories(data);
      }
    } catch (e) {}
  };

  // Open modal for new post
  const handleOpenNewModal = () => {
    const newDraft: Partial<Post> = {
      title: '',
      slug: '',
      excerpt: '',
      contentHtml: '',
      coverImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop',
      coverImageAlt: 'DXN Orion Residences Sector 22D',
      status: 'PUBLISHED',
      categoryId: categories[0]?.id || 'cat-1',
      categoryName: categories[0]?.name || 'Location Guides',
      tags: ['Yamuna Expressway', 'Sector 22D'],
      readingTime: 5,
      metaTitle: '',
      metaDescription: '',
      focusKeyword: '',
      noindex: false,
      faqJson: []
    };
    setEditingPost(newDraft);
    setHistory(['']);
    setHistoryIndex(0);
    setIsPreviewMode(false);
    setSaveStatus(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing post
  const handleOpenEditModal = (post: Post) => {
    setEditingPost({ ...post });
    setHistory([post.contentHtml || '']);
    setHistoryIndex(0);
    setIsPreviewMode(false);
    setSaveStatus(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setIsPreviewMode(false);
    setIsImageModalOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!editingPost) return;
    const currentSlug = editingPost.slug || '';
    const oldTitle = editingPost.title || '';
    const shouldUpdateSlug = !currentSlug || currentSlug === generateSlug(oldTitle);
    
    setEditingPost({
      ...editingPost,
      title: newTitle,
      metaTitle: editingPost.metaTitle || newTitle,
      slug: shouldUpdateSlug ? generateSlug(newTitle) : currentSlug
    });
  };

  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleContentChange = (newContent: string) => {
    if (!editingPost) return;
    setEditingPost({ ...editingPost, contentHtml: newContent });
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Toolbar Actions (Inserting HTML / markdown tags)
  const applyFormatting = (before: string, after: string = '', defaultText: string = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea || !editingPost) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = editingPost.contentHtml || '';
    const selectedText = currentText.substring(start, end) || defaultText;

    const replacement = `${before}${selectedText}${after}`;
    const updatedContent = currentText.substring(0, start) + replacement + currentText.substring(end);

    handleContentChange(updatedContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 10);
  };

  // Open Image Modal
  const openImageModal = () => {
    setImagePreviewUrl('');
    setImageAltText('');
    setImageAsCover(false);
    setImageError(null);
    setImageTab('upload');
    setIsImageModalOpen(true);
  };

  // Upload an image file through backend API with fallback
  const uploadImageFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result as string;
          if (!base64Data) {
            throw new Error('Failed to read image file.');
          }

          // Try uploading to server
          try {
            const res = await adminFetch('/api/admin/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                image: base64Data,
                filename: file.name
              })
            });
            const { ok, data } = await safeJson(res);
            if (ok && data?.url) {
              resolve(data.url);
              return;
            }
          } catch (err) {
            console.warn('Server upload notice, using persistent base64:', err);
          }

          // Fallback to base64 data URL so it never fails
          resolve(base64Data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('File reader error'));
      reader.readAsDataURL(file);
    });
  };

  // Handle image file selection in the Insert Image Dialog
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);
    setImageUploadLoading(true);

    try {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .trim();
      setImageAltText(cleanName);

      const url = await uploadImageFile(file);
      setImagePreviewUrl(url);
    } catch (err: any) {
      setImageError(err.message || 'Error processing image.');
    } finally {
      setImageUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Cover Image upload
  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPost) return;

    setCoverUploading(true);
    try {
      const url = await uploadImageFile(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
      setEditingPost({
        ...editingPost,
        coverImageUrl: url,
        coverImageAlt: cleanName
      });
    } catch (err) {
      console.error('Cover upload error:', err);
    } finally {
      setCoverUploading(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    }
  };

  // Insert image into article from the dialog
  const handleInsertImageIntoContent = () => {
    if (!imagePreviewUrl.trim()) {
      setImageError('Please select or enter an image URL.');
      return;
    }

    const alt = imageAltText.trim() || 'Blog Illustration';
    const figureHtml = `\n<figure class="my-6">\n  <img src="${imagePreviewUrl.trim()}" alt="${alt}" class="w-full rounded-2xl object-cover max-h-96 shadow-md" />\n  <figcaption class="text-xs text-center text-slate-500 mt-2 italic">${alt}</figcaption>\n</figure>\n`;

    applyFormatting(figureHtml, '', '');

    if (imageAsCover && editingPost) {
      setEditingPost({
        ...editingPost,
        coverImageUrl: imagePreviewUrl.trim(),
        coverImageAlt: alt
      });
    }

    setIsImageModalOpen(false);
    setImagePreviewUrl('');
    setImageAltText('');
  };

  const handleToolbarAction = (type: string) => {
    switch (type) {
      case 'bold':
        applyFormatting('<strong>', '</strong>', 'bold text');
        break;
      case 'italic':
        applyFormatting('<em>', '</em>', 'italic text');
        break;
      case 'h1':
        applyFormatting('<h1>', '</h1>', 'Heading 1');
        break;
      case 'h2':
        applyFormatting('<h2>', '</h2>', 'Heading 2');
        break;
      case 'h3':
        applyFormatting('<h3>', '</h3>', 'Heading 3');
        break;
      case 'ul':
        applyFormatting('<ul>\n  <li>', '</li>\n  <li>List item 2</li>\n</ul>', 'List item 1');
        break;
      case 'ol':
        applyFormatting('<ol>\n  <li>', '</li>\n  <li>Step 2</li>\n</ol>', 'Step 1');
        break;
      case 'quote':
        applyFormatting('<blockquote>', '</blockquote>', 'Notable insight or quote...');
        break;
      case 'code':
        applyFormatting('<pre><code>', '</code></pre>', '// Code snippet here');
        break;
      case 'link': {
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          applyFormatting(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>', 'Link Text');
        }
        break;
      }
      case 'hr':
        applyFormatting('\n<hr class="my-6 border-slate-200" />\n', '', '');
        break;
      case 'image':
        openImageModal();
        break;
      case 'clear':
        if (textareaRef.current) {
          const start = textareaRef.current.selectionStart;
          const end = textareaRef.current.selectionEnd;
          const currentText = editingPost?.contentHtml || '';
          const selected = currentText.substring(start, end);
          const cleaned = selected.replace(/<[^>]*>/g, '');
          const updated = currentText.substring(0, start) + cleaned + currentText.substring(end);
          handleContentChange(updated);
        }
        break;
      case 'undo':
        if (historyIndex > 0) {
          const prev = history[historyIndex - 1];
          setHistoryIndex(historyIndex - 1);
          setEditingPost(prevPost => prevPost ? { ...prevPost, contentHtml: prev } : null);
        }
        break;
      case 'redo':
        if (historyIndex < history.length - 1) {
          const next = history[historyIndex + 1];
          setHistoryIndex(historyIndex + 1);
          setEditingPost(prevPost => prevPost ? { ...prevPost, contentHtml: next } : null);
        }
        break;
      default:
        break;
    }
  };

  // Word count calculator
  const calculateWords = (html: string = '') => {
    const textOnly = html.replace(/<[^>]+>/g, ' ').trim();
    if (!textOnly) return 0;
    return textOnly.split(/\s+/).filter(Boolean).length;
  };

  const currentWords = calculateWords(editingPost?.contentHtml || '');

  // Save Post to Firebase & Server API
  const handleSavePost = async () => {
    if (!editingPost || !editingPost.title?.trim()) {
      alert('Please enter a Blog Title.');
      return;
    }

    setSaving(true);
    setSaveStatus('Saving article...');

    try {
      const isNew = !editingPost.id;
      const postId = editingPost.id || ('post-' + Math.random().toString(36).substring(2, 9));
      const now = new Date().toISOString();
      const slug = editingPost.slug?.trim() || generateSlug(editingPost.title);

      const postToSave: Post = {
        id: postId,
        title: editingPost.title.trim(),
        slug,
        excerpt: editingPost.excerpt || '',
        contentHtml: editingPost.contentHtml || '',
        coverImageUrl: editingPost.coverImageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop',
        coverImageAlt: editingPost.coverImageAlt || editingPost.title,
        status: editingPost.status || 'PUBLISHED',
        publishedAt: editingPost.status === 'PUBLISHED' ? (editingPost.publishedAt || now) : null,
        scheduledAt: null,
        categoryId: editingPost.categoryId || 'cat-1',
        categoryName: editingPost.categoryName || 'Location Guides',
        authorId: editingPost.authorId || 'admin-1',
        authorName: editingPost.authorName || 'DXN Orion Editorial Desk',
        tags: editingPost.focusKeyword ? editingPost.focusKeyword.split(',').map(s => s.trim()) : (editingPost.tags || ['Yamuna Expressway']),
        readingTime: Math.max(1, Math.ceil(currentWords / 200)),
        views: editingPost.views || 0,
        metaTitle: editingPost.metaTitle || editingPost.title,
        metaDescription: editingPost.metaDescription || editingPost.excerpt || '',
        focusKeyword: editingPost.focusKeyword || '',
        faqJson: editingPost.faqJson || [],
        noindex: editingPost.noindex || false,
        createdAt: editingPost.createdAt || now,
        updatedAt: now
      };

      // 1. Direct Firebase Firestore save
      await firestoreService.savePost(postToSave);

      // 2. Server sync with safeJson
      try {
        const url = isNew ? '/api/posts' : `/api/posts/${postId}`;
        const method = isNew ? 'POST' : 'PUT';
        const res = await adminFetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postToSave)
        });
        await safeJson(res);
      } catch (apiErr) {
        console.warn('API sync background notice:', apiErr);
      }

      setSaveStatus('Saved successfully!');
      fetchPosts();
      setTimeout(() => {
        handleCloseModal();
      }, 600);
    } catch (err: any) {
      alert(err.message || 'Error saving post');
      setSaveStatus('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      await firestoreService.deletePost(id);
      try {
        const res = await adminFetch(`/api/posts/${id}`, { method: 'DELETE' });
        await safeJson(res);
      } catch {}
      fetchPosts();
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching background of screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#F7F4EE]">
            Blog Management
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Create, edit, and publish search-optimized property guides.
          </p>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="py-2.5 px-4 rounded-xl gold-gradient-bg text-[#0B1426] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#C9A86A]/20 cursor-pointer active:scale-95 transition"
        >
          <Plus className="w-4 h-4 text-[#0B1426]" />
          <span>Create New Blog Post</span>
        </button>
      </div>

      {/* Posts List Cards matching background in screenshot */}
      <div className="space-y-3">
        {loading && posts.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#94A3B8]">Loading articles...</div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-2xl border border-white/10 p-8 space-y-3">
            <FileText className="w-10 h-10 text-[#C9A86A]/60 mx-auto" />
            <p className="text-sm text-[#F7F4EE] font-medium">No blog posts published yet.</p>
            <p className="text-xs text-[#94A3B8]">Click "Create New Blog Post" to add your first article.</p>
          </div>
        ) : (
          posts.map((post) => {
            const words = calculateWords(post.contentHtml);
            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {post.coverImageUrl && (
                    <img
                      src={post.coverImageUrl}
                      alt={post.coverImageAlt || post.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 hidden sm:block"
                    />
                  )}
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      /{post.slug}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-6 self-start md:self-center">
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{words}</span>
                    <span className="text-slate-400"> / 5000 words</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(post)}
                      className="py-1.5 px-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition shadow-2xs"
                    >
                      Edit
                    </button>
                    {post.slug && (
                      <button
                        onClick={() => onNavigatePublic(`/blog/${post.slug}`)}
                        className="py-1.5 px-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition shadow-2xs"
                      >
                        View
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-500 text-xs cursor-pointer transition"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MAIN MODAL DIALOG - EXACT MATCH TO USER'S SCREENSHOT */}
      {isModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 text-slate-800">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                {editingPost.id ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable Form */}
            <div className="p-6 overflow-y-auto space-y-3.5">
              
              {/* Blog Title */}
              <div>
                <input
                  type="text"
                  placeholder="Blog Title"
                  value={editingPost.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A86A]/60 focus:border-transparent transition"
                />
              </div>

              {/* Blog Slug */}
              <div>
                <input
                  type="text"
                  placeholder="Blog Slug (e.g., my-awesome-blog)"
                  value={editingPost.slug || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A86A]/60 focus:border-transparent transition font-mono text-xs"
                />
              </div>

              {/* Excerpt */}
              <div>
                <input
                  type="text"
                  placeholder="Excerpt (short description)"
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A86A]/60 focus:border-transparent transition"
                />
              </div>

              {/* SEO Title */}
              <div>
                <input
                  type="text"
                  placeholder="SEO Title"
                  value={editingPost.metaTitle || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, metaTitle: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A86A]/60 focus:border-transparent transition"
                />
              </div>

              {/* SEO Description */}
              <div>
                <input
                  type="text"
                  placeholder="SEO Description"
                  value={editingPost.metaDescription || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, metaDescription: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A86A]/60 focus:border-transparent transition"
                />
              </div>

              {/* SEO Keywords */}
              <div>
                <input
                  type="text"
                  placeholder="SEO Keywords"
                  value={editingPost.focusKeyword || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, focusKeyword: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A86A]/60 focus:border-transparent transition"
                />
              </div>

              {/* Cover / Featured Image Header Box */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/60 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  {editingPost.coverImageUrl ? (
                    <img
                      src={editingPost.coverImageUrl}
                      alt="Cover"
                      className="w-12 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-10 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-700">Cover Image</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[260px]">
                      {editingPost.coverImageUrl || 'Default property render'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    disabled={coverUploading}
                    className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center gap-1.5 cursor-pointer transition disabled:opacity-60"
                  >
                    {coverUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5 text-[#C9A86A]" />
                        <span>Change Cover</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Rich Text Editor Container matching the screenshot */}
              <div className="border border-slate-200 rounded-2xl p-3.5 bg-white space-y-3 shadow-2xs">
                
                {/* Toolbar Header Row matching Screenshot 1 & 2 */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  
                  {/* Left Toolbar Icons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* B */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('bold')}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-800 text-xs font-bold cursor-pointer transition active:scale-95"
                      title="Bold"
                    >
                      B
                    </button>

                    {/* I */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('italic')}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-800 text-xs italic font-serif cursor-pointer transition active:scale-95"
                      title="Italic"
                    >
                      I
                    </button>

                    {/* H1 */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('h1')}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-800 text-[11px] font-bold cursor-pointer transition active:scale-95"
                      title="Heading 1"
                    >
                      H₁
                    </button>

                    {/* H2 */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('h2')}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-800 text-[11px] font-bold cursor-pointer transition active:scale-95"
                      title="Heading 2"
                    >
                      H₂
                    </button>

                    {/* H3 */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('h3')}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-800 text-[11px] font-bold cursor-pointer transition active:scale-95"
                      title="Heading 3"
                    >
                      H₃
                    </button>

                    {/* Bullet List */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('ul')}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer transition active:scale-95"
                      title="Bullet list"
                    >
                      <List className="w-4 h-4" />
                    </button>

                    {/* Numbered List */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('ol')}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer transition active:scale-95"
                      title="Numbered list"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>

                    {/* Quote */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('quote')}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer transition active:scale-95"
                      title="Quote"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>

                    {/* Code */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('code')}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer transition active:scale-95"
                      title="Code Block"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>

                    {/* Link */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('link')}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer transition active:scale-95"
                      title="Add Link"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>

                    {/* Divider / HR */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('hr')}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer transition active:scale-95"
                      title="Horizontal Line"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    {/* Image Button with instant working modal */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('image')}
                      className="w-8 h-8 rounded-lg border border-[#C9A86A]/40 bg-[#C9A86A]/10 hover:bg-[#C9A86A]/20 flex items-center justify-center text-[#967439] cursor-pointer transition active:scale-95"
                      title="Upload or Insert Image"
                    >
                      <ImageIcon className="w-4 h-4 text-[#967439]" />
                    </button>

                    {/* Clear Format Tx */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('clear')}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 text-xs font-serif cursor-pointer transition active:scale-95"
                      title="Clear Formatting"
                    >
                      T<span className="text-[10px] text-slate-400">x</span>
                    </button>

                    {/* Undo */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('undo')}
                      disabled={historyIndex <= 0}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center text-slate-700 cursor-pointer transition active:scale-95"
                      title="Undo"
                    >
                      <Undo className="w-3.5 h-3.5" />
                    </button>

                    {/* Redo */}
                    <button
                      type="button"
                      onClick={() => handleToolbarAction('redo')}
                      disabled={historyIndex >= history.length - 1}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center text-slate-700 cursor-pointer transition active:scale-95"
                      title="Redo"
                    >
                      <Redo className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Right Side Controls: Preview Article + Word Counter Badge */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className="text-amber-600 hover:text-amber-700 font-semibold text-xs cursor-pointer transition flex items-center gap-1 select-none"
                    >
                      {isPreviewMode ? 'Edit article' : 'Preview article'}
                    </button>

                    <div className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {currentWords} words
                    </div>
                  </div>
                </div>

                <div className="border-b border-slate-100" />

                {/* Content Writing / Preview Area */}
                {isPreviewMode ? (
                  <div className="w-full min-h-[300px] max-h-[420px] overflow-y-auto p-4 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 text-sm leading-relaxed prose prose-sm max-w-none">
                    {editingPost.contentHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: editingPost.contentHtml }} />
                    ) : (
                      <p className="text-slate-400 italic">No content to preview yet. Switch back to edit and start typing.</p>
                    )}
                  </div>
                ) : (
                  <textarea
                    ref={textareaRef}
                    rows={12}
                    placeholder="Write your article content here... (HTML or text formatted)"
                    value={editingPost.contentHtml || ''}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A86A]/60 focus:border-transparent font-sans leading-relaxed resize-y min-h-[280px]"
                  />
                )}
              </div>

              {/* Status Notice if saving */}
              {saveStatus && (
                <div className="text-xs text-center text-slate-600 py-1 font-medium">
                  {saveStatus}
                </div>
              )}
            </div>

            {/* Modal Footer matching Screenshot 1 & 2 */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-start bg-white">
              <button
                type="button"
                onClick={handleSavePost}
                disabled={saving}
                className="bg-[#DFBF82] hover:bg-[#C9A86A] text-[#0B1426] font-semibold text-sm px-7 py-2.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-60 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0B1426]" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save article</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DEDICATED IMAGE UPLOAD / INSERT MODAL (WORKING DIRECTLY IN IFRAMES) */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 text-slate-800 p-5 space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#C9A86A]" />
                <h3 className="font-serif font-bold text-base text-slate-900">Insert Image</h3>
              </div>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs: Upload File vs Web URL */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  imageTab === 'upload' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upload from Device
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  imageTab === 'url' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paste Image URL
              </button>
            </div>

            {/* Error banner */}
            {imageError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                {imageError}
              </div>
            )}

            {/* Tab 1: Upload from Computer */}
            {imageTab === 'upload' && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-[#C9A86A] rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-[#C9A86A]/5"
                >
                  {imageUploadLoading ? (
                    <div className="space-y-2 py-4">
                      <Loader2 className="w-8 h-8 text-[#C9A86A] animate-spin mx-auto" />
                      <p className="text-xs text-slate-600 font-medium">Processing image...</p>
                    </div>
                  ) : imagePreviewUrl ? (
                    <div className="space-y-2">
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className="max-h-36 mx-auto rounded-xl object-contain border border-slate-200 shadow-xs"
                      />
                      <p className="text-[11px] text-[#C9A86A] font-semibold">Click to choose a different image</p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#C9A86A]">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        Click to select an image from your computer
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Supports PNG, JPG, WebP, SVG, GIF (up to 8MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: URL Input */}
            {imageTab === 'url' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Image Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imagePreviewUrl}
                    onChange={(e) => setImagePreviewUrl(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A86A]/60"
                  />
                </div>

                {imagePreviewUrl && (
                  <div className="p-2 border border-slate-200 rounded-xl bg-slate-50">
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="max-h-32 mx-auto rounded-lg object-contain"
                      onError={() => setImageError('Could not load image from this URL.')}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Alt Text / Caption Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Image Caption / Alt Text (for SEO)
              </label>
              <input
                type="text"
                placeholder="e.g. Master Bedroom with Golf View"
                value={imageAltText}
                onChange={(e) => setImageAltText(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A86A]/60"
              />
            </div>

            {/* Optional: Checkbox to also set as Cover Image */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
              <input
                type="checkbox"
                checked={imageAsCover}
                onChange={(e) => setImageAsCover(e.target.checked)}
                className="rounded text-[#C9A86A] focus:ring-[#C9A86A]"
              />
              <span>Also use this image as the main article cover photo</span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="py-2 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertImageIntoContent}
                disabled={!imagePreviewUrl.trim() || imageUploadLoading}
                className="py-2 px-5 rounded-xl bg-[#DFBF82] hover:bg-[#C9A86A] text-[#0B1426] text-xs font-semibold shadow-2xs cursor-pointer transition disabled:opacity-50"
              >
                Insert Image into Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
