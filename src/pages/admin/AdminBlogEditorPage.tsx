import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Edit3, Trash2, Eye, ExternalLink, Check, AlertCircle,
  Save, Sparkles, Smartphone, Monitor, Globe, HelpCircle, Tag as TagIcon,
  Heading2, Heading3, Bold, Italic, List, Quote, MessageSquare, Image, Youtube
} from 'lucide-react';
import { Post, Category } from '../../types/index.ts';
import { adminFetch } from '../../utils/adminAuth.ts';

interface AdminBlogEditorPageProps {
  onNavigatePublic: (path: string) => void;
}

export const AdminBlogEditorPage: React.FC<AdminBlogEditorPageProps> = ({ onNavigatePublic }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Mode state
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('All changes saved');

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/posts?admin=true');
      if (res.ok) {
        const data = await res.json();
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
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {}
  };

  const handleCreateNew = () => {
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      contentHtml: '<h2>Overview</h2><p>Write your detailed analysis regarding Sector 22D or Yamuna Expressway real estate here...</p>',
      coverImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5pTukeE2hQkmXut-7c8iJ0yI61f-uCHv8VYP7ZWazC1nbxF-o6pZvc6bFD3qPLWuYYhW71XwY4fTfHHwN1OAV-ys3BryEpwm_4AYB9zjJIhanugWiuBmzXz-WNtiCeUe6JUKF21nViuaD5Uwoz001Z1sooeyVwR4Dj4g2gtzSFZZ49Rn8E8ypv6H5ci2hAfbohZCltgRHA0jBdnC5NS4fCMwyvXMc1bhWpY6IKdHJeF8ZetQ9hb3d',
      coverImageAlt: 'Luxury residences Sector 22D Yamuna Expressway',
      status: 'DRAFT',
      categoryId: categories[0]?.id || 'cat-1',
      categoryName: categories[0]?.name || 'Location Guides',
      tags: ['Yamuna Expressway', 'Sector 22D'],
      readingTime: 5,
      metaTitle: '',
      metaDescription: '',
      focusKeyword: '',
      noindex: false,
      faqJson: [
        { question: 'What makes Sector 22D prime for property investment?', answer: 'Sector 22D is located just 15 minutes from Jewar Airport and 8 minutes from Film City with low-density golf layouts.' }
      ]
    });
  };

  const handleSavePost = async () => {
    if (!editingPost || !editingPost.title || !editingPost.slug) {
      alert('Please provide at least a title and URL slug.');
      return;
    }

    setSaveStatus('Saving changes...');

    try {
      const isNew = !editingPost.id;
      const url = isNew ? '/api/posts' : `/api/posts/${editingPost.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPost)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save post.');
      }

      const saved = await res.json();
      setSaveStatus('Saved at ' + new Date().toLocaleTimeString());
      fetchPosts();
      setEditingPost(saved);
    } catch (err: any) {
      alert(err.message);
      setSaveStatus('Error saving');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      const res = await adminFetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPosts();
        if (editingPost?.id === id) setEditingPost(null);
      }
    } catch (e) {}
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Block Insertion Helpers
  const insertSnippet = (snippet: string) => {
    if (!editingPost) return;
    setEditingPost({
      ...editingPost,
      contentHtml: (editingPost.contentHtml || '') + '\n' + snippet
    });
  };

  // Live SEO Calculations
  const titleLen = editingPost?.metaTitle?.length || 0;
  const descLen = editingPost?.metaDescription?.length || 0;
  const keyword = (editingPost?.focusKeyword || '').toLowerCase();
  const content = editingPost?.contentHtml || '';

  const hasKeywordInTitle = keyword ? (editingPost?.title || '').toLowerCase().includes(keyword) : false;
  const hasKeywordInMeta = keyword ? (editingPost?.metaDescription || '').toLowerCase().includes(keyword) : false;
  const hasKeywordInSlug = keyword ? (editingPost?.slug || '').toLowerCase().includes(keyword.replace(/\s+/g, '-')) : false;
  const hasH2 = content.includes('<h2>');
  const wordCount = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const hasGoodLength = wordCount >= 300;

  return (
    <div className="space-y-6">
      {/* View 1: Blog Post List */}
      {!editingPost ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#F7F4EE]">
                Blog Management &amp; Content Studio
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Publish high-ranking SEO guides for Yamuna Expressway, Jewar Airport, and Sector 22D searches.
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="py-2 px-4 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#C9A86A]/20 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#0B1426]" />
              <span>Create New Article</span>
            </button>
          </div>

          <div className="grid gap-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="glass-panel p-4 rounded-2xl border border-[#C9A86A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C9A86A]/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={post.coverImageUrl}
                    alt={post.coverImageAlt}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        post.status === 'PUBLISHED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {post.status}
                      </span>
                      <span className="text-[10px] text-[#C9A86A]">{post.categoryName}</span>
                      <span className="text-[10px] text-[#94A3B8]">• {post.views} views</span>
                    </div>
                    <h3 className="font-serif font-bold text-sm text-[#F7F4EE]">
                      {post.title}
                    </h3>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      /blog/{post.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {post.status === 'PUBLISHED' && (
                    <button
                      onClick={() => onNavigatePublic(`/blog/${post.slug}`)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-[#F7F4EE] border border-white/10"
                      title="View Public URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setEditingPost(post)}
                    className="py-1.5 px-3 rounded-xl bg-[#C9A86A]/20 border border-[#C9A86A]/40 text-[#DFBF82] hover:bg-[#C9A86A]/30 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/40 border border-red-500/30"
                    title="Delete Article"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* View 2: Full-Featured Blog & SEO Editor */
        <div className="space-y-6">
          {/* Editor Header Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-[#C9A86A]/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditingPost(null)}
                className="text-xs text-[#94A3B8] hover:text-[#F7F4EE]"
              >
                &larr; All Posts
              </button>
              <span className="text-[#94A3B8]">|</span>
              <span className="text-xs text-[#C9A86A] font-semibold">{saveStatus}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLivePreview(!showLivePreview)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 border ${
                  showLivePreview
                    ? 'bg-[#C9A86A] text-[#0B1426] border-[#C9A86A]'
                    : 'bg-white/5 text-[#F7F4EE] border-white/20'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showLivePreview ? 'Close Preview' : 'Side Preview'}</span>
              </button>

              <button
                onClick={handleSavePost}
                className="py-1.5 px-4 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#C9A86A]/20 cursor-pointer active:scale-95"
              >
                <Save className="w-3.5 h-3.5 text-[#0B1426]" />
                <span>Save Post</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Left 2 Cols: Editor */}
            <div className={`space-y-4 ${showLivePreview ? 'lg:col-span-2' : 'lg:col-span-2'}`}>
              <div className="glass-panel p-5 rounded-3xl border border-[#C9A86A]/30 space-y-4">
                {/* Title */}
                <div>
                  <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-1 font-semibold">
                    Article Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter engaging, keyword-focused article title..."
                    value={editingPost.title || ''}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setEditingPost({
                        ...editingPost,
                        title: newTitle,
                        slug: editingPost.id ? editingPost.slug : generateSlug(newTitle)
                      });
                    }}
                    className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-2 text-sm sm:text-base font-serif font-bold text-[#F7F4EE] focus:border-[#C9A86A] focus:outline-none"
                  />
                </div>

                {/* Slug & Category Row */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-1 font-semibold">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={editingPost.slug || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, slug: generateSlug(e.target.value) })}
                      className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#C9A86A] focus:border-[#C9A86A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-1 font-semibold">
                      Category
                    </label>
                    <select
                      value={editingPost.categoryId || 'cat-1'}
                      onChange={(e) => {
                        const cat = categories.find(c => c.id === e.target.value);
                        setEditingPost({
                          ...editingPost,
                          categoryId: e.target.value,
                          categoryName: cat?.name || 'Location Guides'
                        });
                      }}
                      className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE] focus:border-[#C9A86A] focus:outline-none"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-1 font-semibold">
                    Excerpt / Synopsis
                  </label>
                  <textarea
                    rows={2}
                    value={editingPost.excerpt || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    placeholder="Brief 2-line summary for SERP and blog cards..."
                    className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#C9A86A] focus:outline-none resize-none"
                  />
                </div>

                {/* Cover Image URL & Alt Text */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-1 font-semibold">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      value={editingPost.coverImageUrl || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, coverImageUrl: e.target.value })}
                      className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-1 font-semibold">
                      Cover Image Alt Text (SEO)
                    </label>
                    <input
                      type="text"
                      value={editingPost.coverImageAlt || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, coverImageAlt: e.target.value })}
                      className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
                    />
                  </div>
                </div>

                {/* Status & Publication */}
                <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-1 font-semibold">
                      Publication Status
                    </label>
                    <select
                      value={editingPost.status || 'DRAFT'}
                      onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as any })}
                      className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
                    >
                      <option value="DRAFT">DRAFT (Review Mode)</option>
                      <option value="PUBLISHED">PUBLISHED (Live on Site)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-1 font-semibold">
                      Est. Reading Time (Mins)
                    </label>
                    <input
                      type="number"
                      value={editingPost.readingTime || 5}
                      onChange={(e) => setEditingPost({ ...editingPost, readingTime: parseInt(e.target.value, 10) || 5 })}
                      className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
                    />
                  </div>
                </div>

                {/* Block Editor Snippet Toolbar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
                      Rich Content Blocks
                    </span>
                    <span className="text-[10px] text-[#C9A86A]">Click to insert block at end</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-[#0B1426] border border-white/10">
                    <button
                      type="button"
                      onClick={() => insertSnippet('<h2>Key Infrastructure Milestone</h2>\n<p>Enter detailed paragraph here...</p>')}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-[#F7F4EE] flex items-center gap-1"
                    >
                      <Heading2 className="w-3.5 h-3.5 text-[#C9A86A]" /> H2 Heading
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('<h3>Sub-Section Analysis</h3>\n<p>Contextual details...</p>')}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-[#F7F4EE] flex items-center gap-1"
                    >
                      <Heading3 className="w-3.5 h-3.5 text-[#C9A86A]" /> H3 Heading
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('<div class="glass-panel p-4 rounded-xl border border-[#C9A86A]/40 my-4 text-[#F7F4EE]">\n  <strong>Expert Takeaway:</strong> Yamuna Expressway property values are positioned for 20%+ annual growth.\n</div>')}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-[#F7F4EE] flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#C9A86A]" /> Callout Box
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('<div class="blog-cta-box glass-panel p-6 rounded-2xl border border-[#C9A86A] text-center my-6">\n  <h3 class="font-serif text-lg font-bold text-[#F7F4EE] mb-2">Explore DXN Orion Sector 22D</h3>\n  <a href="/#enquire" class="gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase px-6 py-2.5 rounded-xl inline-block">Download Pre-Launch Price Matrix</a>\n</div>')}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-[#F7F4EE] flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" /> CTA Block
                    </button>
                  </div>

                  {/* HTML / Content Area */}
                  <textarea
                    rows={14}
                    value={editingPost.contentHtml || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, contentHtml: e.target.value })}
                    className="w-full bg-[#0B1426] border border-[#C9A86A]/30 rounded-xl p-3 text-xs text-[#F7F4EE] font-mono leading-relaxed mt-2 focus:border-[#C9A86A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Side-by-side live preview if enabled */}
              {showLivePreview && (
                <div className="glass-panel p-5 rounded-3xl border border-[#C9A86A] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-serif font-bold text-[#F7F4EE]">
                      Live Rendered Article Preview
                    </span>
                    <div className="flex rounded-lg border border-white/10 overflow-hidden">
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        className={`p-1 ${previewDevice === 'desktop' ? 'bg-[#C9A86A] text-[#0B1426]' : 'text-[#94A3B8]'}`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        className={`p-1 ${previewDevice === 'mobile' ? 'bg-[#C9A86A] text-[#0B1426]' : 'text-[#94A3B8]'}`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className={`mx-auto bg-[#0B1426] rounded-2xl p-4 border border-white/10 ${previewDevice === 'mobile' ? 'max-w-xs' : 'w-full'}`}>
                    <h1 className="text-xl font-serif font-bold text-[#F7F4EE] mb-2">
                      {editingPost.title || 'Untitled Post'}
                    </h1>
                    <div
                      dangerouslySetInnerHTML={{ __html: editingPost.contentHtml || '' }}
                      className="text-xs text-[#94A3B8] space-y-2 [&>h2]:text-sm [&>h2]:font-bold [&>h2]:text-[#C9A86A] [&>h3]:text-xs [&>h3]:text-[#F7F4EE]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: SEO Panel & Live Score Checklist */}
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-3xl border border-[#C9A86A]/40 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <Globe className="w-4 h-4 text-[#C9A86A]" />
                  <h3 className="font-serif font-bold text-sm text-[#F7F4EE]">
                    Search Engine Optimization (SEO)
                  </h3>
                </div>

                {/* Focus Keyword */}
                <div>
                  <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-1 font-semibold">
                    Focus Target Keyword
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sector 22D Yamuna Expressway"
                    value={editingPost.focusKeyword || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, focusKeyword: e.target.value })}
                    className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
                  />
                </div>

                {/* Meta Title with 60-char counter */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
                      Meta Title
                    </label>
                    <span className={`text-[10px] font-bold ${titleLen > 60 ? 'text-red-400' : 'text-[#C9A86A]'}`}>
                      {titleLen}/60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editingPost.metaTitle || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, metaTitle: e.target.value })}
                    placeholder="Title shown on Google SERP..."
                    className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
                  />
                </div>

                {/* Meta Description with 160-char counter */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
                      Meta Description
                    </label>
                    <span className={`text-[10px] font-bold ${descLen > 160 ? 'text-red-400' : 'text-[#C9A86A]'}`}>
                      {descLen}/160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={editingPost.metaDescription || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, metaDescription: e.target.value })}
                    placeholder="Search snippet summary (160 characters)..."
                    className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl p-2.5 text-xs text-[#F7F4EE] resize-none"
                  />
                </div>

                {/* Google SERP Snippet Preview */}
                <div className="p-3 rounded-xl bg-white text-slate-800 text-xs shadow-inner">
                  <div className="text-[9px] text-slate-500 mb-0.5">https://dxn-orion.com › blog › {editingPost.slug || 'url-slug'}</div>
                  <div className="text-[#1a0dab] font-medium hover:underline text-xs line-clamp-1">
                    {editingPost.metaTitle || editingPost.title || 'Page Title'}
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                    {editingPost.metaDescription || editingPost.excerpt || 'Meta description summary text...'}
                  </div>
                </div>

                {/* Live SEO Score Checklist */}
                <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                  <span className="text-[10px] text-[#C9A86A] uppercase font-bold tracking-wider block">
                    Live SEO Readiness Checklist
                  </span>

                  <div className="flex items-center gap-2">
                    {hasKeywordInTitle ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                    <span className={hasKeywordInTitle ? 'text-[#F7F4EE]' : 'text-[#94A3B8]'}>Focus keyword in Title</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasKeywordInSlug ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                    <span className={hasKeywordInSlug ? 'text-[#F7F4EE]' : 'text-[#94A3B8]'}>Focus keyword in URL slug</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasKeywordInMeta ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                    <span className={hasKeywordInMeta ? 'text-[#F7F4EE]' : 'text-[#94A3B8]'}>Focus keyword in Meta Description</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasH2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                    <span className={hasH2 ? 'text-[#F7F4EE]' : 'text-[#94A3B8]'}>Contains at least one H2 heading</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasGoodLength ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                    <span className={hasGoodLength ? 'text-[#F7F4EE]' : 'text-[#94A3B8]'}>Word count: {wordCount} words (min 300)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
