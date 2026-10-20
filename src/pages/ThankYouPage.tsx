import React, { useEffect } from 'react';
import { CheckCircle2, MessageCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackEvent } from '../utils/analytics.ts';

interface ThankYouPageProps {
  leadId?: string;
  onNavigate: (path: string) => void;
  whatsappNumber?: string;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  leadId,
  onNavigate,
  whatsappNumber = '917217227777'
}) => {
  const cleanWa = whatsappNumber.replace(/\D/g, '');
  const passCode = 'DO-' + (leadId ? leadId.replace(/\D/g, '').slice(-4).padStart(4, '7') : '8821');

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#0E4D92', '#F26522', '#FFFFFF', '#111827']
      });
    } catch (e) {}

    // Track thank you conversion
    trackEvent('conversion_thank_you_view', { leadId, passCode });
  }, [leadId]);

  return (
    <div className="max-w-md mx-auto pt-24 pb-24 px-4 text-center">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#0E4D92] shadow-2xl space-y-5 relative overflow-hidden">
        {/* Glow Orb */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#EAF1FB] rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-full bg-[#EAF1FB] border border-[#0E4D92] flex items-center justify-center mx-auto text-[#0E4D92] shadow-lg shadow-black/5">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#0E4D92] block">
            Priority Expression of Interest Logged
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-1">
            Thank You!
          </h1>
          <p className="text-xs text-[#4B5563] mt-2 leading-relaxed">
            Your pre-launch priority reservation has been securely recorded. Our Senior Relationship Executive is reviewing your profile.
          </p>
        </div>

        {/* Priority Pass Ticket Badge */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] text-left relative">
          <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]">
            <span className="text-[10px] text-[#4B5563] uppercase">VIP Allocation Pass</span>
            <span className="text-[10px] font-bold text-[#0E4D92] bg-[#EAF1FB] px-2 py-0.5 rounded border border-[#E5E7EB]">
              Active Priority
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#111827] font-medium block">DXN Orion • Sector 22D</span>
              <span className="text-[10px] text-[#4B5563]">Yamuna Expressway</span>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-[#0E4D92] tracking-wider">
                {passCode}
              </span>
              <span className="text-[9px] text-[#4B5563] block">Pass Reference #</span>
            </div>
          </div>
        </div>

        {/* Immediate Next Steps */}
        <div className="space-y-2.5 pt-2">
          <a
            href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hi, I just submitted my pre-launch interest for DXN Orion (Pass #${passCode}). Please share the confidential floor plans & price matrix.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-[#075E54] hover:bg-[#075E54]/90 border border-[#25D366]/40 text-[#111827] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Receive Instant Dossier on WhatsApp</span>
          </a>

          <button
            onClick={() => onNavigate('/')}
            className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-[#0E4D92] hover:bg-[#EAF1FB] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Project Overview</span>
          </button>
        </div>

        <div className="pt-2 text-[9px] text-[#4B5563] flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0E4D92]" />
          <span>UP RERA statutory compliance desk • Elite Capital Advisors</span>
        </div>
      </div>
    </div>
  );
};
