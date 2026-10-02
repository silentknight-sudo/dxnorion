import React, { useState } from 'react';
import { PhoneCall, MessageCircle, Mail, MapPin, Clock, ShieldCheck, Send, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getStoredUtm } from '../utils/utm.ts';
import { fireLeadConversion } from '../utils/analytics.ts';
import { LeadConfiguration, LeadSource } from '../types/index.ts';
import { firestoreService } from '../lib/firestoreService.ts';

interface ContactPageProps {
  onLeadSuccess: (leadId: string) => void;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onLeadSuccess,
  phone = '+91 72172 27777',
  whatsappNumber = '917217227777',
  email = 'sales@dxn-orion.com'
}) => {
  const [name, setName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [config, setConfig] = useState<LeadConfiguration>('3BHK_SERVANT');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const cleanWa = whatsappNumber.replace(/\D/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUserPhone = userPhone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanUserPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (name.trim().length < 2) {
      setError('Please enter your full name.');
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
          phone: cleanUserPhone,
          email: userEmail.trim() || undefined,
          configuration: config,
          message: message.trim() || undefined,
          source: 'contact_page' as LeadSource,
          landingPage: '/contact',
          consent: true,
          utmSource: utmData?.utmSource,
          utmMedium: utmData?.utmMedium,
          utmCampaign: utmData?.utmCampaign,
          utmTerm: utmData?.utmTerm,
          utmContent: utmData?.utmContent,
          gclid: utmData?.gclid,
          fbclid: utmData?.fbclid
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');

      fireLeadConversion({ configuration: config, source: 'contact_page', leadId: data.leadId });

      firestoreService.saveLead({
        id: data.leadId,
        name: name.trim(),
        phone: cleanUserPhone,
        email: userEmail.trim() || undefined,
        configuration: config,
        source: 'contact_page',
        message: message.trim() || undefined,
        landingPage: '/contact',
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

      onLeadSuccess(data.leadId);
    } catch (err: any) {
      setError(err.message || 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-20 pb-24 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[10px] sm:text-xs font-bold text-[#C9A86A] uppercase tracking-widest block mb-1">
          Official Sales Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F7F4EE]">
          Connect with DXN Orion
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 max-w-xl mx-auto">
          Our senior relationship managers are available 7 days a week to schedule private preview appointments, answer compliance queries, and share architectural dossiers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-[#C9A86A]/30">
            <h3 className="font-serif font-bold text-base text-[#F7F4EE] mb-4">
              Direct Channels
            </h3>

            <div className="space-y-4 text-xs">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1426]/60 border border-[#C9A86A]/20 hover:border-[#C9A86A] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#C9A86A]/15 flex items-center justify-center text-[#C9A86A] shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">Priority Hotline</span>
                  <span className="font-bold text-[#F7F4EE]">{phone}</span>
                </div>
              </a>

              <a
                href={`https://wa.me/${cleanWa}?text=Hi%2C%20I%20would%20like%20to%20connect%20with%20DXN%20Orion%20sales%20desk.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#075E54]/20 border border-[#25D366]/30 hover:border-[#25D366] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#25D366]/20 flex items-center justify-center text-[#25D366] shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#25D366] block font-semibold">Instant WhatsApp Desk</span>
                  <span className="font-bold text-[#F7F4EE]">{phone}</span>
                </div>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1426]/60 border border-[#C9A86A]/20 hover:border-[#C9A86A] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#C9A86A]/15 flex items-center justify-center text-[#C9A86A] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">Official Email</span>
                  <span className="font-bold text-[#F7F4EE]">{email}</span>
                </div>
              </a>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-[#C9A86A]/30 text-xs space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C9A86A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#F7F4EE] block">Site &amp; Preview Gallery</span>
                <p className="text-[#94A3B8] mt-0.5">
                  Sector 22D, Yamuna Expressway Industrial Development Area (YEIDA), Greater Noida, Gautam Buddha Nagar, Uttar Pradesh — 203201
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-white/10">
              <Clock className="w-5 h-5 text-[#C9A86A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#F7F4EE] block">Working Hours</span>
                <p className="text-[#94A3B8] mt-0.5">
                  Monday to Sunday: 9:30 AM – 7:00 PM (Prior appointment recommended for VIP preview lounge)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Query Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#C9A86A] shadow-2xl">
          <h3 className="font-serif font-bold text-lg text-[#F7F4EE] mb-1">
            Request Sales Desk Callback
          </h3>
          <p className="text-xs text-[#94A3B8] mb-4">
            Receive dedicated personal briefing within 15 minutes.
          </p>

          {error && (
            <div className="p-2 mb-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] text-[#94A3B8] block mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. Devendra Singhania"
                className="w-full bg-[#0B1426]/80 border border-[#C9A86A]/30 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#94A3B8]/60 focus:border-[#C9A86A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#94A3B8] block mb-1">Mobile Number</label>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 rounded-xl border border-[#C9A86A]/30 bg-[#0B1426]/80 text-xs text-[#C9A86A] font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full bg-[#0B1426]/80 border border-[#C9A86A]/30 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#94A3B8]/60 focus:border-[#C9A86A] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#94A3B8] block mb-1">Special Requirements (Optional)</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Preferred floor, payment plan questions, or site visit scheduling..."
                className="w-full bg-[#0B1426]/80 border border-[#C9A86A]/30 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#94A3B8]/60 focus:border-[#C9A86A] focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C9A86A]/20 flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-98 transition-all hover:brightness-105 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B1426]" />
                  <span>Connecting with Sales Desk...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#0B1426]" />
                  <span>Submit Pre-Launch Request</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#94A3B8] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>Official Channel Sales Partner. Zero spam guarantee.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
