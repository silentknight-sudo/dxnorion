import React, { useState } from 'react';
import { Sparkles, Menu, X, PhoneCall } from 'lucide-react';

interface HeaderProps {
  onOpenEnquiry: (contextTitle?: string, configuration?: string) => void;
  activePath?: string;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEnquiry, activePath = '/', onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/' },
    { label: 'Floor Plans', path: '/floor-plans' },
    { label: 'Amenities', path: '/amenities' },
    { label: 'Location', path: '/location' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.pathname = path;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white backdrop-blur-md border-b border-[#E5E7EB] px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); handleNavClick('/'); }}
          aria-label="DXN Orion Sector 22D Yamuna Expressway – Home"
          className="flex items-center group cursor-pointer"
        >
          <span className="bg-white rounded-md px-2 py-1 flex items-center group-hover:opacity-90 transition-opacity">
            <img
              src="/logo.png"
              alt="DXN Orion Yamuna Expressway logo"
              width={178}
              height={63}
              className="h-8 sm:h-9 w-auto"
            />
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-wider font-medium text-[#4B5563]">
          {navItems.map((item) => {
            const isActive = activePath === item.path || (item.path !== '/' && activePath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`transition-colors cursor-pointer py-1 ${
                  isActive 
                    ? 'text-[#0E4D92] font-bold border-b border-[#0E4D92]' 
                    : 'hover:text-[#111827]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <a
            href="tel:+917217227777"
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#0E4D92] hover:text-[#0E4D92] px-2 py-1 rounded-lg border border-[#E5E7EB] bg-white/60 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="font-semibold">+91 72172 27777</span>
          </a>

          <button
            onClick={() => onOpenEnquiry('Priority Brochure & Price Matrix Request')}
            className="bg-[#F26522] hover:bg-[#D9541A] active:scale-95 text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-sm shadow-black/5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Brochure</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-[#111827] hover:bg-[#F4F6FA] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#0E4D92]" /> : <Menu className="w-5 h-5 text-[#111827]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#E5E7EB] bg-white backdrop-blur-xl px-2 pb-4 space-y-1 rounded-b-2xl animate-in fade-in duration-200">
          {navItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-[#EAF1FB] text-[#0E4D92] border border-[#E5E7EB]'
                    : 'text-[#111827] hover:bg-[#F4F6FA]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#F26522]" />}
              </button>
            );
          })}
          <div className="pt-2 px-1">
            <a
              href="tel:+917217227777"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E5E7EB] text-[#0E4D92] text-xs font-bold bg-[#F4F6FA]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Official Sales Desk: +91 72172 27777</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
