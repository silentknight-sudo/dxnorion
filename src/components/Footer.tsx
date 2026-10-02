import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  reraNumber?: string;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  reraNumber = 'UPRERA-PRJ-2025-APP-88492',
  onNavigate
}) => {
  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.pathname = path;
    }
  };

  return (
    <footer className="border-t border-[#C9A86A]/20 bg-[#111D36]/95 py-10 px-4 text-center text-[#94A3B8]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Emblem & Project Name */}
        <div className="flex items-center justify-center space-x-2.5">
          <div className="w-8 h-8 rounded-full border border-[#C9A86A]/50 flex items-center justify-center bg-[#C9A86A]/10">
            <span className="font-serif font-bold text-[#C9A86A] text-xs">DO</span>
          </div>
          <span className="font-serif font-bold text-base tracking-wider uppercase text-[#F7F4EE]">
            DXN Orion
          </span>
        </div>

        <p className="text-xs text-[#C9A86A] font-semibold uppercase tracking-wider">
          Sector 22D, Yamuna Expressway, Uttar Pradesh, India
        </p>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#F7F4EE]/80">
          <button onClick={() => handleNavClick('/')} className="hover:text-[#C9A86A] transition-colors cursor-pointer">
            Overview
          </button>
          <span className="text-[#C9A86A]/30">•</span>
          <button onClick={() => handleNavClick('/floor-plans')} className="hover:text-[#C9A86A] transition-colors cursor-pointer">
            3 &amp; 4 BHK Floor Plans
          </button>
          <span className="text-[#C9A86A]/30">•</span>
          <button onClick={() => handleNavClick('/amenities')} className="hover:text-[#C9A86A] transition-colors cursor-pointer">
            Resort Amenities
          </button>
          <span className="text-[#C9A86A]/30">•</span>
          <button onClick={() => handleNavClick('/location')} className="hover:text-[#C9A86A] transition-colors cursor-pointer">
            Location Advantage &amp; Jewar Airport
          </button>
          <span className="text-[#C9A86A]/30">•</span>
          <button onClick={() => handleNavClick('/blog')} className="hover:text-[#C9A86A] transition-colors cursor-pointer">
            Real Estate Market Research
          </button>
          <span className="text-[#C9A86A]/30">•</span>
          <button onClick={() => handleNavClick('/contact')} className="hover:text-[#C9A86A] transition-colors cursor-pointer">
            Priority Desk
          </button>
        </div>

        {/* Featured Market Guides for SEO Internal Link Equity */}
        <div className="border-t border-white/10 pt-5 max-w-4xl mx-auto">
          <span className="text-[10px] text-[#C9A86A] font-bold uppercase tracking-widest block mb-2">
            Featured Sector 22D Real Estate Intelligence &amp; Location Analysis
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-[#94A3B8]">
            <button onClick={() => handleNavClick('/blog/sector-22d-yamuna-expressway-complete-location-guide-2026')} className="hover:text-[#DFBF82] underline transition-colors cursor-pointer">
              Sector 22D Location Guide (2026)
            </button>
            <span>•</span>
            <button onClick={() => handleNavClick('/blog/why-property-near-noida-international-airport-is-gaining-value')} className="hover:text-[#DFBF82] underline transition-colors cursor-pointer">
              Jewar Airport Value Drivers
            </button>
            <span>•</span>
            <button onClick={() => handleNavClick('/blog/yamuna-expressway-vs-noida-extension-where-should-you-invest')} className="hover:text-[#DFBF82] underline transition-colors cursor-pointer">
              Yamuna Exp. vs Noida Extension
            </button>
            <span>•</span>
            <button onClick={() => handleNavClick('/blog/3-bhk-vs-4-bhk-choosing-the-right-luxury-apartment-size')} className="hover:text-[#DFBF82] underline transition-colors cursor-pointer">
              3 BHK vs 4 BHK Sizes
            </button>
            <span>•</span>
            <button onClick={() => handleNavClick('/blog/how-to-check-up-rera-registration-before-buying-a-flat')} className="hover:text-[#DFBF82] underline transition-colors cursor-pointer">
              UP RERA Buyer Checklist
            </button>
            <span>•</span>
            <button onClick={() => handleNavClick('/blog/upcoming-infrastructure-around-yeida-film-city-metro-and-expressways')} className="hover:text-[#DFBF82] underline transition-colors cursor-pointer">
              YEIDA Film City &amp; Pod Taxis
            </button>
          </div>
        </div>

        {/* Government Authority Verification & Regional Master Plan Links */}
        <div className="border-t border-white/5 pt-4 max-w-4xl mx-auto">
          <span className="text-[10px] text-[#94A3B8]/70 uppercase tracking-widest block mb-2 font-medium">
            Statutory Portals &amp; Official Regulatory Citations
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-[#94A3B8]/80">
            <a
              href="https://up-rera.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C9A86A] transition-colors"
            >
              UP RERA Official Portal ↗
            </a>
            <span>•</span>
            <a
              href="https://yamunaexpresswayauthority.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C9A86A] transition-colors"
            >
              YEIDA Master Plan 2031 ↗
            </a>
            <span>•</span>
            <a
              href="https://nialjewar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C9A86A] transition-colors"
            >
              Noida International Airport (NIAL) ↗
            </a>
            <span>•</span>
            <a
              href="https://igbc.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C9A86A] transition-colors"
            >
              IGBC Green Buildings ↗
            </a>
            <span>•</span>
            <a
              href="https://credaincr.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C9A86A] transition-colors"
            >
              CREDAI NCR Real Estate ↗
            </a>
            <span>•</span>
            <a
              href="https://nhai.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C9A86A] transition-colors"
            >
              NHAI Eastern Peripheral Corridor ↗
            </a>
          </div>
        </div>

        {/* Regulatory & Statutory Disclaimers */}
        <div className="max-w-2xl mx-auto space-y-3 text-[10px] leading-relaxed border-t border-white/10 pt-5 text-[#94A3B8]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/15 border border-[#C9A86A]/30 text-[#DFBF82] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>RERA Acknowledgment No: {reraNumber}</span>
          </div>

          <p className="text-amber-200/90 font-medium">
            *Disclaimers &amp; Statutory Notice: Project is currently under pre-launch stage. Formal application for RERA registration is under process with UP RERA. Visual representations, artistic renders, images, and dimensions are for conceptual presentation purposes only.
          </p>
          <p>
            This website is managed by an authorized marketing partner and serves solely to invite non-binding Expressions of Interest (EOI). It does not constitute an offer, allotment, or binding contract. All official allotment agreements will strictly adhere to Uttar Pradesh RERA guidelines upon formal registration grant.
          </p>
        </div>

        {/* Legal & Copyright */}
        <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] gap-2">
          <p className="text-[#94A3B8]/70">
            Official Channel Sales Partner: <span className="text-[#F7F4EE] font-medium">Elite Capital Advisors</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <a href="/sitemap.xml" target="_blank" rel="noopener" className="hover:text-[#C9A86A] transition-colors">
              XML Sitemap
            </a>
            <span>•</span>
            <a href="/blog/rss.xml" target="_blank" rel="noopener" className="hover:text-[#C9A86A] transition-colors">
              RSS Feed
            </a>
            <span>•</span>
            <button onClick={() => handleNavClick('/privacy-policy')} className="hover:text-[#C9A86A] transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => handleNavClick('/disclaimer')} className="hover:text-[#C9A86A] transition-colors">
              Disclaimer
            </button>
            <span>•</span>
            <button onClick={() => handleNavClick('/admin/login')} className="hover:text-[#C9A86A] transition-colors inline-flex items-center gap-1 opacity-60 hover:opacity-100">
              <Lock className="w-2.5 h-2.5" />
              <span>Admin Portal</span>
            </button>
            <span>•</span>
            <span>© {new Date().getFullYear()} DXN Orion. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
