import React from 'react';
import { PhoneCall, MessageCircle, Sparkles } from 'lucide-react';
import { trackEvent } from '../utils/analytics.ts';

interface StickyBottomBarProps {
  onOpenEnquiry: (context?: string) => void;
  phone?: string;
  whatsappNumber?: string;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  onOpenEnquiry,
  phone = '+917217227777',
  whatsappNumber = '917217227777'
}) => {
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const cleanWa = whatsappNumber.replace(/\D/g, '');
  const prefilledMessage = encodeURIComponent(
    'Hi, I am interested in DXN Orion Sector 22D Yamuna Expressway. Please share the pre-launch price list and floor plans.'
  );

  const handleCallClick = () => {
    trackEvent('click_call', { phone: cleanPhone });
  };

  const handleWaClick = () => {
    trackEvent('click_whatsapp', { whatsapp: cleanWa });
  };

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-40 bg-white backdrop-blur-xl border-t border-[#E5E7EB] px-3 py-2.5 shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        {/* Call Desk Button */}
        <a
          href={`tel:${cleanPhone}`}
          onClick={handleCallClick}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#F4F6FA] border border-[#E5E7EB] text-[#111827] hover:text-[#0E4D92] active:scale-95 transition-all text-center"
        >
          <PhoneCall className="w-4 h-4 text-[#0E4D92] mb-0.5" />
          <span className="text-[10px] font-semibold tracking-wider">Call Desk</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${cleanWa}?text=${prefilledMessage}`}
          onClick={handleWaClick}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#25D366] border border-[#25D366] text-white hover:border-[#25D366] active:scale-95 transition-all text-center"
        >
          <MessageCircle className="w-4 h-4 text-white mb-0.5" />
          <span className="text-[10px] font-semibold tracking-wider">WhatsApp</span>
        </a>

        {/* Quick Enquire CTA Button */}
        <button
          onClick={() => onOpenEnquiry('Bottom Sticky Bar CTA')}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl gold-gradient-bg text-white font-bold shadow-md shadow-black/5 active:scale-95 transition-all cursor-pointer text-center"
        >
          <Sparkles className="w-4 h-4 mb-0.5 text-white" />
          <span className="text-[10px] uppercase tracking-wider font-extrabold">Enquire</span>
        </button>
      </div>
    </aside>
  );
};
