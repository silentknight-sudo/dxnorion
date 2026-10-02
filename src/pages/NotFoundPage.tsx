import React from 'react';
import { Home, Compass, BookOpen, Sparkles } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
  onOpenEnquiry: (contextTitle: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate, onOpenEnquiry }) => {
  return (
    <div className="max-w-md mx-auto pt-32 pb-28 px-4 text-center">
      <div className="glass-panel p-8 rounded-3xl border border-[#C9A86A] shadow-2xl space-y-4">
        <span className="text-5xl font-serif font-bold text-[#C9A86A] block">404</span>
        <h1 className="font-serif font-bold text-xl text-[#F7F4EE]">Page Not Found</h1>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          The property page or article you are seeking does not exist or has been relocated to our updated masterplan directory.
        </p>

        <div className="pt-4 space-y-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full py-2.5 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Home className="w-4 h-4 text-[#0B1426]" />
            <span>Return to Project Overview</span>
          </button>
          <button
            onClick={() => onNavigate('/floor-plans')}
            className="w-full py-2.5 rounded-xl border border-[#C9A86A]/40 text-[#C9A86A] hover:bg-[#C9A86A]/10 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore 3 &amp; 4 BHK Floor Plans</span>
          </button>
          <button
            onClick={() => onNavigate('/blog')}
            className="w-full py-2.5 rounded-xl border border-white/20 text-[#F7F4EE] hover:bg-white/10 font-medium text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Location &amp; Investment Guides</span>
          </button>
        </div>
      </div>
    </div>
  );
};
