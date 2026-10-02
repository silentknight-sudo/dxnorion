import React, { useState, useEffect } from 'react';
import { X, Sparkles, Gift } from 'lucide-react';

interface ExitIntentModalProps {
  onOpenEnquiry: (context: string) => void;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ onOpenEnquiry }) => {
  const [shown, setShown] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show after 30 seconds if not already shown in session
    if (sessionStorage.getItem('dxn_exit_intent_dismissed')) {
      return;
    }

    const timer = setTimeout(() => {
      setShown(true);
    }, 30000);

    // Also trigger on mouse leave window
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed && !sessionStorage.getItem('dxn_exit_intent_dismissed')) {
        setShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [dismissed]);

  const handleDismiss = () => {
    setShown(false);
    setDismissed(true);
    sessionStorage.setItem('dxn_exit_intent_dismissed', 'true');
  };

  const handleClaim = () => {
    handleDismiss();
    onOpenEnquiry('Exit Intent: Priority Pre-Launch Allotment');
  };

  if (!shown) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 max-w-xs glass-panel p-4 rounded-2xl border border-[#C9A86A] shadow-2xl animate-in slide-in-from-bottom duration-300">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#F7F4EE]"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#C9A86A]/20 border border-[#C9A86A]/40 flex items-center justify-center shrink-0 text-[#C9A86A]">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A86A]">
            Phase 1 Window Closing
          </span>
          <h4 className="text-xs font-serif font-bold text-[#F7F4EE] leading-tight mt-0.5">
            Save up to ₹28 Lakhs at Pre-Launch
          </h4>
          <p className="text-[10px] text-[#94A3B8] mt-1 leading-relaxed">
            Register your non-binding EOI today to lock inaugural prices &amp; corner golf-facing units.
          </p>
        </div>
      </div>

      <button
        onClick={handleClaim}
        className="w-full mt-3 py-2 rounded-xl gold-gradient-bg text-[#0B1426] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#C9A86A]/20"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#0B1426]" />
        <span>Claim Priority Pass</span>
      </button>
    </div>
  );
};
