import React from 'react';
import { ChevronRight } from 'lucide-react';
import { LandingPage as LandingPageData } from '../seo/pages.ts';

interface LandingPageProps {
  page: LandingPageData;
  onNavigate: (path: string) => void;
  onOpenEnquiry: (contextTitle: string) => void;
}

// Keyword landing pages (/price-list, /faq). Content comes from src/seo/pages.ts so the
// server-rendered crawler HTML and what visitors see stay identical.
export const LandingPage: React.FC<LandingPageProps> = ({ page, onNavigate, onOpenEnquiry }) => (
  <div className="max-w-4xl mx-auto px-4 pt-24 pb-16 space-y-6">
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
      <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }} className="hover:text-[#C9A86A]">Home</a>
      <ChevronRight className="w-3 h-3 text-[#C9A86A]/40" />
      <span className="text-[#C9A86A]">{page.breadcrumb}</span>
    </nav>

    <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#F7F4EE] leading-tight">{page.h1}</h1>

    <div
      className="glass-panel p-6 sm:p-10 rounded-3xl border border-[#C9A86A]/30 text-sm text-[#94A3B8] leading-relaxed space-y-4
        [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-lg [&_h2]:text-[#F7F4EE] [&_h2]:pt-2
        [&_h3]:font-semibold [&_h3]:text-[#F7F4EE] [&_h3]:pt-2
        [&_strong]:text-[#F7F4EE] [&_a]:text-[#C9A86A] [&_a]:underline
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
        [&_table]:w-full [&_table]:text-left [&_th]:text-[#C9A86A] [&_th]:py-2 [&_th]:border-b [&_th]:border-white/10
        [&_td]:py-2 [&_td]:border-b [&_td]:border-white/5"
      dangerouslySetInnerHTML={{ __html: page.mainHtml }}
    />

    <div className="text-center">
      <button
        onClick={() => onOpenEnquiry(`${page.breadcrumb} Page`)}
        className="px-6 py-3 rounded-xl bg-[#C9A86A] text-[#0B1426] font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
      >
        Get Price List &amp; Floor Plans
      </button>
    </div>
  </div>
);
