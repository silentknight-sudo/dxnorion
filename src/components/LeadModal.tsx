import React, { useState } from 'react';
import { X, Send, Shield, Check, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getStoredUtm } from '../utils/utm.ts';
import { fireLeadConversion } from '../utils/analytics.ts';
import { LeadConfiguration, LeadSource } from '../types/index.ts';
import { firestoreService } from '../lib/firestoreService.ts';
import { safeJson } from '../utils/adminAuth.ts';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextTitle?: string;
  defaultConfig?: string;
  onSuccessRedirect?: (leadId: string) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  contextTitle = 'Request Priority Brochure',
  defaultConfig = '3BHK_SERVANT',
  onSuccessRedirect
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [config, setConfig] = useState<LeadConfiguration>(defaultConfig as LeadConfiguration);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side Indian Phone validation
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    if (name.trim().length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return;
    }

    setLoading(true);

    try {
      const utmData = getStoredUtm();
      const generatedId = 'lead-' + Math.random().toString(36).substring(2, 9);

      // 1. Direct Firebase Firestore save
      await firestoreService.saveLead({
        id: generatedId,
        name: name.trim(),
        phone: cleanPhone,
        email: email.trim() || undefined,
        configuration: config,
        source: 'modal',
        landingPage: window.location.pathname,
        status: 'NEW',
        consent: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // 2. Sync to API backend with safeJson
      let finalLeadId = generatedId;
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            phone: cleanPhone,
            email: email.trim() || undefined,
            configuration: config,
            source: 'modal' as LeadSource,
            landingPage: window.location.pathname,
            consent: true,
            utmSource: utmData?.utmSource,
            utmMedium: utmData?.utmMedium,
            utmCampaign: utmData?.utmCampaign,
            utmTerm: utmData?.utmTerm,
            utmContent: utmData?.utmContent,
            gclid: utmData?.gclid,
            fbclid: utmData?.fbclid,
            website: honeypot // honeypot spam trap
          })
        });

        const { ok, data } = await safeJson(res);
        if (ok && data?.leadId) {
          finalLeadId = data.leadId;
        }
      } catch (apiErr) {
        console.warn('API sync background notice:', apiErr);
      }

      // Success! Fire conversion and confetti
      fireLeadConversion({ configuration: config, source: 'modal', leadId: finalLeadId });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0E4D92', '#F26522', '#FFFFFF', '#111827']
        });
      } catch (e) {}

      setIsSuccess(true);
      if (onSuccessRedirect) {
        setTimeout(() => {
          onSuccessRedirect(finalLeadId);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm glass-panel p-5 rounded-3xl border border-[#0E4D92] shadow-2xl overflow-hidden">
        {/* Decorative Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#EAF1FB] rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-[#F4F6FA] text-[#111827] flex items-center justify-center hover:bg-[#F4F6FA] transition-colors z-20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#0E4D92] uppercase tracking-wider block">
                VIP Priority Access
              </span>
              <h3 className="text-base font-bold text-[#111827] mt-0.5">
                {contextTitle}
              </h3>
              <p className="text-[11px] text-[#4B5563] mt-0.5">
                Instant delivery via WhatsApp &amp; Email
              </p>
            </div>

            {error && (
              <div className="p-2 mb-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Honeypot field (hidden from humans) */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#111827] placeholder-[#9CA3AF] focus:border-[#0E4D92] focus:outline-none focus:ring-1 focus:ring-[#0E4D92]/40"
                />
              </div>

              <div className="flex gap-2">
                <span className="inline-flex items-center px-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#0E4D92] font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="WhatsApp Mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#111827] placeholder-[#9CA3AF] focus:border-[#0E4D92] focus:outline-none focus:ring-1 focus:ring-[#0E4D92]/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl gold-gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-black/5 flex items-center justify-center gap-2 mt-1 cursor-pointer active:scale-98 transition-all hover:brightness-105 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>Instant Download</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[8px] text-[#4B5563] pt-1">
                <Shield className="w-3 h-3 text-[#0E4D92]" />
                <span>Authorized Project Partner. Zero Spam Guaranteed.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF1FB] border border-[#0E4D92] flex items-center justify-center mx-auto text-[#0E4D92]">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#111827]">Thank You!</h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Your priority allocation request has been verified. The pre-launch pricing matrix and floor plan dossier have been dispatched to your WhatsApp.
            </p>
            <div className="pt-2">
              <button
                onClick={resetAndClose}
                className="w-full py-2.5 rounded-xl gold-gradient-bg text-white font-bold text-xs cursor-pointer active:scale-95"
              >
                Return to Overview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
