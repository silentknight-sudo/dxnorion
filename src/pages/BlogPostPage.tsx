import React, { useState, useEffect } from 'react';
import {
  Clock, Calendar, User, Share2, MessageCircle, Linkedin, Twitter,
  Link2, ChevronRight, ChevronDown, Check, ArrowLeft, Sparkles, BookOpen
} from 'lucide-react';
import { Post } from '../types/index.ts';
import { trackEvent } from '../utils/analytics.ts';
import { applySeo } from '../seo/applySeo.ts';
import { clampDescription, NOT_FOUND_SEO } from '../seo/pages.ts';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onOpenEnquiry: (contextTitle: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigate, onOpenEnquiry }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`);
      if (!res.ok) {
        applySeo({ title: NOT_FOUND_SEO.title, description: NOT_FOUND_SEO.description, path: `/blog/${slug}`, noindex: true });
        throw new Error('Not found');
      }
      const data = await res.json();
      setPost(data);
      applySeo({
        title: data.metaTitle || data.title,
        description: clampDescription(data.metaDescription || data.excerpt || data.title),
        path: `/blog/${data.slug}`,
        noindex: Boolean(data.noindex),
        image: data.ogImageUrl || (data.coverImageUrl?.startsWith('http') ? data.coverImageUrl : undefined),
        type: 'article'
      });

      // Track article view
      trackEvent('blog_view', { slug: data.slug, title: data.title });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (network: string) => {
    if (!post) return;
    const url = window.location.href;
    const title = post.title;

    if (network === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + url)}`, '_blank');
    } else if (network === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (network === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (network === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto pt-32 pb-24 text-center text-xs text-[#4B5563]">
        Loading analysis article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto pt-32 pb-24 px-4 text-center">
        <h2 className="text-xl font-bold text-[#111827]">Article Not Found</h2>
        <p className="text-xs text-[#4B5563] mt-2">The requested blog post could not be retrieved.</p>
        <button
          onClick={() => onNavigate('/blog')}
          className="mt-4 py-2 px-6 rounded-xl gold-gradient-bg text-white text-xs font-bold"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto pt-20 pb-24 px-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-[11px] text-[#4B5563] mb-6">
        <button onClick={() => onNavigate('/')} className="hover:text-[#0E4D92]">Home</button>
        <ChevronRight className="w-3 h-3 text-[#0E4D92]" />
        <button onClick={() => onNavigate('/blog')} className="hover:text-[#0E4D92]">Blog</button>
        <ChevronRight className="w-3 h-3 text-[#0E4D92]" />
        <span className="text-[#0E4D92] truncate max-w-xs">{post.categoryName}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF1FB] border border-[#E5E7EB] text-[10px] text-[#0E4D92] font-semibold uppercase tracking-wider mb-3">
          <span>{post.categoryName}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-[#111827] leading-tight">
          {post.title}
        </h1>

        <p className="text-xs sm:text-sm text-[#4B5563] mt-3 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Metadata Byline */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 my-4 border-y border-[#E5E7EB] text-xs text-[#4B5563]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EAF1FB] border border-[#E5E7EB] flex items-center justify-center text-[#0E4D92] font-bold text-xs">
              {post.authorName ? post.authorName.split(' ').map((n: string) => n[0]).join('').slice(0, 3) : 'SPS'}
            </div>
            <div>
              <span className="font-semibold text-[#111827] block">{post.authorName}</span>
              <span className="text-[10px] text-[#4B5563]">Senior Infrastructure Analyst</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#0E4D92]" />
              {post.readingTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#0E4D92]" />
              Updated {new Date(post.updatedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Social Share Bar */}
        <div className="flex items-center justify-between text-xs text-[#4B5563]">
          <span className="flex items-center gap-1.5 font-medium">
            <Share2 className="w-3.5 h-3.5 text-[#0E4D92]" />
            Share Article:
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleShare('whatsapp')}
              className="p-1.5 rounded-lg bg-[#075E54]/40 border border-[#25D366]/40 text-[#25D366] hover:bg-[#075E54]/60 transition-colors"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="p-1.5 rounded-lg bg-[#0077b5]/20 border border-[#0077b5]/40 text-[#0077b5] hover:bg-[#0077b5]/40 transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="p-1.5 rounded-lg bg-[#F4F6FA] border border-[#E5E7EB] text-[#111827] hover:bg-[#F4F6FA] transition-colors"
              title="Share on Twitter"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="p-1.5 rounded-lg bg-[#EAF1FB] border border-[#E5E7EB] text-[#0E4D92] hover:bg-[#EAF1FB] transition-colors flex items-center gap-1 text-[10px]"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E5E7EB] mb-8 shadow-xl">
        <img
          src={post.coverImageUrl}
          alt={post.coverImageAlt}
          className="w-full h-64 sm:h-96 object-cover"
        />
      </div>

      {/* Article Content Area */}
      <div className="post-body prose max-w-none text-[#374151] text-sm leading-relaxed space-y-4">
        <div
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          className="[&>h2]:text-xl [&>h2]:[&>h2]:font-bold [&>h2]:text-[#111827] [&>h2]:mt-6 [&>h2]:mb-2 [&>h2]:text-[#0E4D92] [&>p]:leading-relaxed [&>p]:text-[#4B5563] [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ol]:list-decimal [&>ol]:pl-5"
        />

        {/* Mid-Article Inline Lead CTA Card */}
        <div className="glass-panel p-6 rounded-2xl border border-[#0E4D92] my-8 text-center space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E4D92]">
            Exclusive Opportunity in Sector 22D
          </span>
          <h3 className="text-lg font-bold text-[#111827]">
            Register for Pre-Launch Allotments at DXN Orion
          </h3>
          <p className="text-xs text-[#4B5563] max-w-md mx-auto">
            Take advantage of pre-launch 10:90 subvention pay plans and locked inaugural pricing before public commercial escalation.
          </p>
          <button
            onClick={() => onOpenEnquiry(`Blog Inline CTA: ${post.title}`)}
            className="py-2.5 px-6 rounded-xl gold-gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-black/5 cursor-pointer active:scale-95"
          >
            Enquire for Priority Floor Plans
          </button>
        </div>
      </div>

      {/* Article FAQ Accordion */}
      {post.faqJson && post.faqJson.length > 0 && (
        <section className="mt-12 pt-8 border-t border-[#E5E7EB]">
          <h3 className="font-bold text-xl text-[#111827] mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-2.5">
            {post.faqJson.map((faq, idx) => (
              <details key={idx} className="group glass-panel rounded-xl border border-[#E5E7EB] overflow-hidden">
                <summary className="flex justify-between items-center p-3.5 cursor-pointer list-none select-none text-xs sm:text-sm font-semibold text-[#111827]">
                  <span>{faq.question}</span>
                  <ChevronDown className="w-4 h-4 text-[#0E4D92] transform transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-3.5 pb-3.5 text-xs text-[#4B5563] border-t border-[#E5E7EB] pt-2 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Tags Cloud */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
          <span className="text-xs text-[#4B5563] block mb-2 font-medium">Explore Related Topics:</span>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(`/blog?tag=${encodeURIComponent(tag)}`)}
                className="text-[11px] px-3 py-1 rounded-lg bg-[#F4F6FA] border border-[#E5E7EB] text-[#0E4D92] hover:bg-[#EAF1FB] transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Related Posts Section */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section className="mt-12 pt-8 border-t border-[#E5E7EB]">
          <h3 className="font-bold text-xl text-[#111827] mb-4">
            Related Investment Guides
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {post.relatedPosts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onNavigate(`/blog/${rel.slug}`)}
                className="glass-panel p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#0E4D92] transition-all cursor-pointer group"
              >
                <div className="h-28 rounded-lg overflow-hidden mb-2.5">
                  <img
                    src={rel.coverImageUrl}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[9px] text-[#0E4D92] uppercase font-bold block">
                  {rel.categoryName}
                </span>
                <h4 className="text-xs font-bold text-[#111827] group-hover:text-[#0E4D92] line-clamp-2 mt-1">
                  {rel.title}
                </h4>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* End of Post CTA */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#0E4D92] mt-12 text-center">
        <Sparkles className="w-6 h-6 text-[#0E4D92] mx-auto mb-2" />
        <h3 className="font-bold text-lg text-[#111827]">
          Reserve Your Pre-Launch Allotment at DXN Orion
        </h3>
        <p className="text-xs text-[#4B5563] mt-1 max-w-md mx-auto">
          Connect directly with our authorized sales desk to receive the complete price matrix and architectural blueprints.
        </p>
        <button
          onClick={() => onOpenEnquiry(`Blog Footer CTA: ${post.title}`)}
          className="mt-4 py-2.5 px-8 rounded-xl gold-gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-black/5 cursor-pointer active:scale-95"
        >
          Request Priority Call Back
        </button>
      </div>
    </article>
  );
};
