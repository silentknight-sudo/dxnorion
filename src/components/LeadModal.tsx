import React, { useState } from 'react';
import { X, Send, Shield, Check, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getStoredUtm } from '../utils/utm.ts';
import { fireLeadConversion } from '../utils/analytics.ts';
import { LeadConfiguration, LeadSource } from '../types/index.ts';
import { firestoreService } from '../lib/firestoreService.ts';

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

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      // Success! Fire conversion and confetti
      fireLeadConversion({ configuration: config, source: 'modal', leadId: data.leadId });

      firestoreService.saveLead({
        id: data.leadId,
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
      }).catch(console.error);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C9A86A', '#DFBF82', '#FFFFFF', '#0B1426']
        });
      } catch (e) {}

      setIsSuccess(true);
      if (onSuccessRedirect) {
        setTimeout(() => {
          onSuccessRedirect(data.leadId);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1426]/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm glass-panel p-5 rounded-3xl border border-[#C9A86A] shadow-2xl overflow-hidden">
        {/* Decorative Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#C9A86A]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 text-[#F7F4EE] flex items-center justify-center hover:bg-white/20 transition-colors z-20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#C9A86A] uppercase tracking-wider block">
                VIP Priority Access
              </span>
              <h3 className="text-base font-serif font-bold text-[#F7F4EE] mt-0.5">
                {contextTitle}
              </h3>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Instant delivery via WhatsApp &amp; Email
              </p>
            </div>

            {error && (
              <div className="p-2 mb-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs">
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
                  className="w-full bg-[#0B1426]/80 border border-[#C9A86A]/30 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#94A3B8] focus:border-[#C9A86A] focus:outline-none focus:ring-1 focus:ring-[#C9A86A]"
                />
              </div>

              <div className="flex gap-2">
                <span className="inline-flex items-center px-2.5 rounded-xl border border-[#C9A86A]/30 bg-[#0B1426]/80 text-xs text-[#C9A86A] font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="WhatsApp Mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0B1426]/80 border border-[#C9A86A]/30 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#94A3B8] focus:border-[#C9A86A] focus:outline-none focus:ring-1 focus:ring-[#C9A86A]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase tracking-wider shadow-md shadow-[#C9A86A]/20 flex items-center justify-center gap-2 mt-1 cursor-pointer active:scale-98 transition-all hover:brightness-105 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0B1426]" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#0B1426]" />
                    <span>Instant Download</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[8px] text-[#94A3B8] pt-1">
                <Shield className="w-3 h-3 text-[#C9A86A]" />
                <span>Authorized Project Partner. Zero Spam Guaranteed.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#C9A86A]/20 border border-[#C9A86A] flex items-center justify-center mx-auto text-[#C9A86A]">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#F7F4EE]">Thank You!</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Your priority allocation request has been verified. The pre-launch pricing matrix and floor plan dossier have been dispatched to your WhatsApp.
            </p>
            <div className="pt-2">
              <button
                onClick={resetAndClose}
                className="w-full py-2.5 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs cursor-pointer active:scale-95"
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
