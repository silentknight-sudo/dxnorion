import React, { useState, useEffect } from 'react';
import { Search, Clock, Calendar, ArrowRight, BookOpen, Eye, Tag as TagIcon, Sparkles } from 'lucide-react';
import { Post, Category } from '../types/index.ts';

interface BlogListPageProps {
  onNavigate: (path: string) => void;
  onOpenEnquiry: (contextTitle: string) => void;
  categoryFilter?: string;
  tagFilter?: string;
}

export const BlogListPage: React.FC<BlogListPageProps> = ({
  onNavigate,
  onOpenEnquiry,
  categoryFilter,
  tagFilter
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>(categoryFilter || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [selectedCat, tagFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = '/api/posts?status=PUBLISHED';
      if (selectedCat && selectedCat !== 'all') {
        url += `&category=${encodeURIComponent(selectedCat)}`;
      }
      if (tagFilter) {
        url += `&tag=${encodeURIComponent(tagFilter)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (e) {}
  };

  const filteredPosts = posts.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
  });

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="max-w-5xl mx-auto pt-20 pb-24 px-4">
      {/* Header & Title */}
      <div className="text-center mb-8">
        <span className="text-[10px] sm:text-xs font-bold text-[#C9A86A] uppercase tracking-widest block mb-1">
          Yamuna Expressway Real Estate Journal
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F7F4EE]">
          Insights, Trends &amp; Location Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 max-w-xl mx-auto">
          In-depth research on Jewar Airport, Sector 22D growth dynamics, RERA guidelines, and pre-launch property investment in Greater Noida.
        </p>
      </div>

      {/* Search Bar & Category Filter Bar */}
      <div className="space-y-4 mb-8">
        {/* Search Input */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#C9A86A]" />
          <input
            type="text"
            placeholder="Search articles on Sector 22D, Jewar Airport, RERA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111D36]/80 border border-[#C9A86A]/30 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#F7F4EE] placeholder-[#94A3B8] focus:outline-none focus:border-[#C9A86A]"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCat('all')}
            className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCat === 'all'
                ? 'gold-gradient-bg text-[#0B1426] shadow-sm'
                : 'glass-panel text-[#F7F4EE] hover:bg-white/10'
            }`}
          >
            All Articles
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.slug)}
              className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCat === c.slug
                  ? 'gold-gradient-bg text-[#0B1426] shadow-sm'
                  : 'glass-panel text-[#F7F4EE] hover:bg-white/10'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Indicator */}
      {(tagFilter || categoryFilter) && (
        <div className="mb-6 p-3 rounded-xl bg-[#C9A86A]/10 border border-[#C9A86A]/30 flex items-center justify-between text-xs text-[#C9A86A]">
          <span>
            Showing filtered articles for: <strong>{tagFilter || categoryFilter}</strong>
          </span>
          <button onClick={() => onNavigate('/blog')} className="underline text-xs cursor-pointer">
            Clear Filter
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-[#94A3B8]">Loading real estate intelligence...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-16 text-center glass-panel rounded-3xl p-8 border border-white/10">
          <BookOpen className="w-8 h-8 text-[#C9A86A] mx-auto mb-2" />
          <h3 className="font-serif font-bold text-base text-[#F7F4EE]">No Articles Found</h3>
          <p className="text-xs text-[#94A3B8] mt-1">Try adjusting your search keywords or category filters.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured Post Card */}
          {featuredPost && (
            <div
              onClick={() => onNavigate(`/blog/${featuredPost.slug}`)}
              className="glass-panel rounded-3xl overflow-hidden border border-[#C9A86A] shadow-2xl cursor-pointer hover:border-[#C9A86A]/80 transition-all group"
            >
              <div className="grid md:grid-cols-2 gap-6 p-6 sm:p-8">
                <div className="relative rounded-2xl overflow-hidden h-52 sm:h-72">
                  <img
                    src={featuredPost.coverImageUrl}
                    alt={featuredPost.coverImageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B1426]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#C9A86A]/40 text-[10px] text-[#C9A86A] font-bold uppercase">
                    Featured Analysis
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-[#C9A86A] font-semibold uppercase tracking-wider mb-2">
                      <span>{featuredPost.categoryName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#94A3B8]">
                        <Clock className="w-3 h-3 text-[#C9A86A]" />
                        {featuredPost.readingTime} min read
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F4EE] group-hover:text-[#C9A86A] transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#94A3B8] mt-2.5 leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-[#94A3B8]">
                      By {featuredPost.authorName}
                    </span>
                    <span className="text-xs text-[#C9A86A] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Full Guide <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Posts Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onNavigate(`/blog/${post.slug}`)}
                className="glass-panel rounded-2xl overflow-hidden border border-[#C9A86A]/25 hover:border-[#C9A86A]/70 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={post.coverImageUrl}
                      alt={post.coverImageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#0B1426]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] text-[#C9A86A] font-bold uppercase">
                      {post.categoryName}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-[10px] text-[#94A3B8] mb-2">
                      <Clock className="w-3 h-3 text-[#C9A86A]" />
                      <span>{post.readingTime} min read</span>
                      <span>•</span>
                      <Eye className="w-3 h-3 text-[#C9A86A]" />
                      <span>{post.views} views</span>
                    </div>

                    <h3 className="text-base font-serif font-bold text-[#F7F4EE] group-hover:text-[#C9A86A] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#94A3B8] mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0">
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#C9A86A] font-semibold">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blog Newsletter / Lead CTA */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#C9A86A] mt-14 text-center max-w-xl mx-auto">
        <Sparkles className="w-6 h-6 text-[#C9A86A] mx-auto mb-2" />
        <h3 className="font-serif font-bold text-lg text-[#F7F4EE]">
          Stay Ahead of Yamuna Expressway Price Revisions
        </h3>
        <p className="text-xs text-[#94A3B8] mt-1">
          Receive quarterly infrastructure milestones, airport operational updates, and confidential pre-launch price sheets directly.
        </p>
        <button
          onClick={() => onOpenEnquiry('Blog Newsletter & Market Intelligence Dossier')}
          className="mt-4 py-2.5 px-8 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C9A86A]/20 cursor-pointer"
        >
          Subscribe to Investor Updates
        </button>
      </div>
    </div>
  );
};
