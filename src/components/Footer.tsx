import React from 'react';
import { ShieldCheck } from 'lucide-react';

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
            Floor Plans
          </button>
          <span className="text-[#C9A86A]/30">•</span>
          <button onClick={() => handleNavClick('/amenities')} className="hover:text-[#C9A86A] transition-colors cursor-pointer">
            Amenities
          </button>
          <span className="text-[#C9A86A]/30">•</span>
          <button onClick={() => handleNavClick('/location')} className="hover:text-[#C9A86A] transition-colors cursor-pointer">
            Location Advantage
          </button>
          <span className="text-[#C9A86A]/30">•</span>
          <button onClick={() => handleNavClick('/blog')} className="hover:text-[#C9A86A] transition-colors cursor-pointer">
            Real Estate Blog
          </button>
          <span className="text-[#C9A86A]/30">•</span>
          <button onClick={() => handleNavClick('/contact')} className="hover:text-[#C9A86A] transition-colors cursor-pointer">
            Contact Sales Desk
          </button>
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
          <div className="flex items-center space-x-3">
            <button onClick={() => handleNavClick('/privacy-policy')} className="hover:text-[#C9A86A] transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => handleNavClick('/disclaimer')} className="hover:text-[#C9A86A] transition-colors">
              Disclaimer
            </button>
            <span>•</span>
            <span>© {new Date().getFullYear()} DXN Orion. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
