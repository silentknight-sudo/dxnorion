import React, { useState } from 'react';
import {
  Home, Users, Trees, Flag, Download, TrendingUp, Compass, Clock, Lock,
  FileText, Crown, Waves, Dumbbell, Sparkle, Baby, CloudSun, Flower2,
  ShieldCheck, MapPin, Plane, Clapperboard, Navigation, Map, BadgeCheck,
  ChevronDown, Shield, Check, Loader2, Sparkles, ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getStoredUtm } from '../utils/utm.ts';
import { fireLeadConversion, trackEvent } from '../utils/analytics.ts';
import { LeadConfiguration, LeadSource } from '../types/index.ts';
import { firestoreService } from '../lib/firestoreService.ts';
import { safeJson } from '../utils/adminAuth.ts';

interface HomePageProps {
  onOpenEnquiry: (contextTitle?: string, configuration?: string) => void;
  onNavigate: (path: string) => void;
  onLeadSuccess: (leadId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenEnquiry,
  onNavigate,
  onLeadSuccess
}) => {
  // Hero Form State
  const [heroName, setHeroName] = useState('');
  const [heroPhone, setHeroPhone] = useState('');
  const [heroEmail, setHeroEmail] = useState('');
  const [heroConfig, setHeroConfig] = useState<LeadConfiguration>('3BHK');
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);

  // Second Section Form State
  const [secName, setSecName] = useState('');
  const [secPhone, setSecPhone] = useState('');
  const [secEmail, setSecEmail] = useState('');
  const [secConfig, setSecConfig] = useState<LeadConfiguration>('3BHK_SERVANT');
  const [secLoading, setSecLoading] = useState(false);
  const [secError, setSecError] = useState<string | null>(null);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroError(null);

    const cleanPhone = heroPhone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setHeroError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (heroName.trim().length < 2) {
      setHeroError('Please enter your full name (at least 2 characters).');
      return;
    }

    setHeroLoading(true);

    try {
      const utmData = getStoredUtm();
      const generatedId = 'lead-' + Math.random().toString(36).substring(2, 9);

      // 1. Direct Firebase Firestore save (guarantees lead is recorded instantly)
      await firestoreService.saveLead({
        id: generatedId,
        name: heroName.trim(),
        phone: cleanPhone,
        email: heroEmail.trim() || undefined,
        configuration: heroConfig,
        source: 'hero_form',
        landingPage: '/',
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
            name: heroName.trim(),
            phone: cleanPhone,
            email: heroEmail.trim() || undefined,
            configuration: heroConfig,
            source: 'hero_form' as LeadSource,
            landingPage: '/',
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

        const { ok, data } = await safeJson(res);
        if (ok && data?.leadId) {
          finalLeadId = data.leadId;
        }
      } catch (apiErr) {
        console.warn('API sync background notice:', apiErr);
      }

      fireLeadConversion({ configuration: heroConfig, source: 'hero_form', leadId: finalLeadId });

      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C9A86A', '#DFBF82', '#FFFFFF', '#0B1426']
        });
      } catch (e) {}

      onLeadSuccess(finalLeadId);
    } catch (err: any) {
      setHeroError(err.message || 'Error submitting details. Please try again.');
    } finally {
      setHeroLoading(false);
    }
  };

  const handleSecSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecError(null);

    const cleanPhone = secPhone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setSecError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (secName.trim().length < 2) {
      setSecError('Please enter your full name.');
      return;
    }

    setSecLoading(true);

    try {
      const utmData = getStoredUtm();
      const generatedId = 'lead-' + Math.random().toString(36).substring(2, 9);

      // 1. Direct Firebase Firestore save
      await firestoreService.saveLead({
        id: generatedId,
        name: secName.trim(),
        phone: cleanPhone,
        email: secEmail.trim() || undefined,
        configuration: secConfig,
        source: 'modal',
        landingPage: '/',
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
            name: secName.trim(),
            phone: cleanPhone,
            email: secEmail.trim() || undefined,
            configuration: secConfig,
            source: 'modal' as LeadSource,
            landingPage: '/',
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

        const { ok, data } = await safeJson(res);
        if (ok && data?.leadId) {
          finalLeadId = data.leadId;
        }
      } catch (apiErr) {
        console.warn('API sync notice:', apiErr);
      }

      fireLeadConversion({ configuration: secConfig, source: 'section_8_form', leadId: finalLeadId });

      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C9A86A', '#DFBF82', '#FFFFFF', '#0B1426']
        });
      } catch (e) {}

      onLeadSuccess(finalLeadId);
    } catch (err: any) {
      setSecError(err.message || 'Error submitting details.');
    } finally {
      setSecLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto pt-14 pb-20">
      {/* BEGIN: Section1_Hero */}
      <section className="relative min-h-[92vh] flex flex-col justify-end px-4 pt-10 pb-6 overflow-hidden">
        {/* Background Tower Render */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Dusk architectural 3D render of ultra-luxury modern high-rise glass residential towers overlooking a lush green championship golf course and illuminated swimming pool, warm champagne golden interior lights, twilight sky, deep midnight navy atmosphere, ultra realistic architectural visualization"
            className="w-full h-full object-cover object-center transform scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5pTukeE2hQkmXut-7c8iJ0yI61f-uCHv8VYP7ZWazC1nbxF-o6pZvc6bFD3qPLWuYYhW71XwY4fTfHHwN1OAV-ys3BryEpwm_4AYB9zjJIhanugWiuBmzXz-WNtiCeUe6JUKF21nViuaD5Uwoz001Z1sooeyVwR4Dj4g2gtzSFZZ49Rn8E8ypv6H5ci2hAfbohZCltgRHA0jBdnC5NS4fCMwyvXMc1bhWpY6IKdHJeF8ZetQ9hb3d"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/60 to-[#0B1426]/20" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0B1426]/30 to-[#0B1426]/90" />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/20 border border-[#C9A86A]/40 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A] animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A] absolute" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#C9A86A] pl-2">
              PRE-LAUNCH | SEC 22D, YAMUNA EXP
            </span>
          </div>

          {/* Headings */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F7F4EE] tracking-tight leading-tight">
              Luxury Living Beside the <span className="gold-text-gradient italic">Greens</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 leading-relaxed max-w-xl">
              Ultra-modern 3 &amp; 4 BHK sky estates overlooking panoramic golf courses. 15 Mins from Noida Int&apos;l Airport (Jewar).
            </p>
          </div>

          {/* 4 Key Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
            <div className="flex items-center gap-2 bg-[#0B1426]/80 border border-[#C9A86A]/30 rounded-lg p-2 backdrop-blur-sm">
              <Home className="w-4 h-4 text-[#C9A86A] shrink-0" />
              <span className="font-medium text-[#F7F4EE]/90">3 &amp; 4 BHK Residences</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0B1426]/80 border border-[#C9A86A]/30 rounded-lg p-2 backdrop-blur-sm">
              <Users className="w-4 h-4 text-[#C9A86A] shrink-0" />
              <span className="font-medium text-[#F7F4EE]/90">4 Units Per Floor</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0B1426]/80 border border-[#C9A86A]/30 rounded-lg p-2 backdrop-blur-sm">
              <Trees className="w-4 h-4 text-[#C9A86A] shrink-0" />
              <span className="font-medium text-[#F7F4EE]/90">~11 Lush Acres</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0B1426]/80 border border-[#C9A86A]/30 rounded-lg p-2 backdrop-blur-sm">
              <Flag className="w-4 h-4 text-[#C9A86A] shrink-0" />
              <span className="font-medium text-[#F7F4EE]/90">Golf Course Views</span>
            </div>
          </div>

          {/* Glassmorphism Pre-Launch Form */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl shadow-2xl border border-[#C9A86A]/40 mt-3 max-w-xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div>
                <p className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#C9A86A] uppercase">
                  Priority Allocation Window
                </p>
                <p className="text-xs text-[#F7F4EE]/80 font-light">
                  Register to receive special pre-launch benefits
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C9A86A]/20 text-[#C9A86A] border border-[#C9A86A]/40">
                Phase 1
              </span>
            </div>

            {heroError && (
              <div className="p-2 mb-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs">
                {heroError}
              </div>
            )}

            <form className="space-y-3" onSubmit={handleHeroSubmit}>
              <div>
                <input
                  className="w-full bg-[#0B1426]/60 border border-[#C9A86A]/30 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#94A3B8] focus:outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A]"
                  placeholder="Full Name"
                  required
                  type="text"
                  value={heroName}
                  onChange={(e) => setHeroName(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <span className="inline-flex items-center px-2.5 rounded-xl border border-[#C9A86A]/30 bg-[#0B1426]/60 text-xs text-[#C9A86A] font-medium">
                  +91
                </span>
                <input
                  className="w-full bg-[#0B1426]/60 border border-[#C9A86A]/30 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#94A3B8] focus:outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A]"
                  pattern="[0-9]{10}"
                  placeholder="Phone Number"
                  required
                  type="tel"
                  value={heroPhone}
                  onChange={(e) => setHeroPhone(e.target.value)}
                />
              </div>

              <button
                className="w-full gold-gradient-bg hover:brightness-105 active:scale-[0.98] transition-all text-[#0B1426] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#C9A86A]/25 mt-2 cursor-pointer disabled:opacity-50"
                type="submit"
                disabled={heroLoading}
              >
                {heroLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0B1426]" />
                    <span>Processing EOI...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-[#0B1426]" />
                    <span>Get Price List &amp; Floor Plans</span>
                  </>
                )}
              </button>
              <p className="text-[9px] text-center text-[#94A3B8]">
                🔒 100% Privacy. Zero Spam Guaranteed.
              </p>
            </form>
          </div>
        </div>
      </section>
      {/* END: Section1_Hero */}

      {/* BEGIN: Section2_TrustStrip */}
      <section className="border-y border-[#C9A86A]/20 bg-[#111D36]/80 py-4 px-3">
        <div className="grid grid-cols-4 gap-2 text-center divide-x divide-[#C9A86A]/15">
          <div className="px-1">
            <p className="text-[#C9A86A] font-serif font-bold text-sm sm:text-base tracking-tight">15 Mins</p>
            <p className="text-[9px] sm:text-xs text-[#94A3B8] mt-0.5 leading-tight">To Jewar Int&apos;l Airport</p>
          </div>
          <div className="px-1">
            <p className="text-[#C9A86A] font-serif font-bold text-sm sm:text-base tracking-tight">11 Acres</p>
            <p className="text-[9px] sm:text-xs text-[#94A3B8] mt-0.5 leading-tight">Expansive Masterplan</p>
          </div>
          <div className="px-1">
            <p className="text-[#C9A86A] font-serif font-bold text-sm sm:text-base tracking-tight">80%</p>
            <p className="text-[9px] sm:text-xs text-[#94A3B8] mt-0.5 leading-tight">Open Green Vistas</p>
          </div>
          <div className="px-1">
            <p className="text-[#C9A86A] font-serif font-bold text-sm sm:text-base tracking-tight">Tier-1</p>
            <p className="text-[9px] sm:text-xs text-[#94A3B8] mt-0.5 leading-tight">A++ Contractor</p>
          </div>
        </div>
      </section>
      {/* END: Section2_TrustStrip */}

      {/* BEGIN: Section3_WhyPreLaunch */}
      <section className="py-12 px-4">
        <div className="text-center mb-6">
          <span className="text-[10px] sm:text-xs font-bold text-[#C9A86A] uppercase tracking-widest">
            Early Adopter Edge
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F4EE] mt-1">
            Why Invest at Pre-Launch?
          </h2>
          <div className="w-12 h-0.5 bg-[#C9A86A] mx-auto mt-2" />
        </div>

        <div className="space-y-3.5">
          {/* Card 1 */}
          <div className="glass-panel p-4 rounded-xl border border-[#C9A86A]/30 flex items-start gap-3.5 hover:border-[#C9A86A]/60 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#C9A86A]/15 border border-[#C9A86A]/40 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-[#C9A86A]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#F7F4EE] font-serif">Inaugural Price Benefit</h3>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                Save up to ₹28 Lakhs compared to future public launch iterations. Enjoy guaranteed early-mover pricing advantage.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-4 rounded-xl border border-[#C9A86A]/30 flex items-start gap-3.5 hover:border-[#C9A86A]/60 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#C9A86A]/15 border border-[#C9A86A]/40 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-[#C9A86A]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#F7F4EE] font-serif">First Pick of Premium Inventory</h3>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                Choose preferred high-floor panoramic golf-facing balconies and corner units before general release.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-4 rounded-xl border border-[#C9A86A]/30 flex items-start gap-3.5 hover:border-[#C9A86A]/60 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#C9A86A]/15 border border-[#C9A86A]/40 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#C9A86A]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#F7F4EE] font-serif">Flexible Construction-Linked Pay Plan</h3>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                Relaxed 10:90 and staggered pre-launch payment milestones curated strictly for first 50 expressions of interest.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            className="w-full py-3 px-4 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-[#C9A86A]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all hover:brightness-105"
            onClick={() => onOpenEnquiry('Pre-Launch Pricing Matrix Request')}
          >
            <Lock className="w-3.5 h-3.5 text-[#0B1426]" />
            <span>Unlock Pre-Launch Price Matrix</span>
          </button>
        </div>
      </section>
      {/* END: Section3_WhyPreLaunch */}

      {/* BEGIN: Section4_Configurations */}
      <section className="py-10 px-4 bg-[#111D36]/50">
        <div className="text-center mb-6">
          <span className="text-[10px] sm:text-xs font-bold text-[#C9A86A] uppercase tracking-widest">
            Master Planned Layouts
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F4EE] mt-1">Exclusive Residences</h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Spacious 4-to-a-core luxury residences with private elevators
          </p>
        </div>

        <div className="space-y-4">
          {/* Configuration Card 1 */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-[#C9A86A]/30">
            <div className="p-4 border-b border-[#C9A86A]/20 bg-[#0B1426]/40 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#C9A86A] uppercase font-bold tracking-widest">Type A</span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#F7F4EE]">3 BHK Luxury</h3>
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm font-bold text-[#C9A86A]">1,900 Sq.Ft.</span>
                <p className="text-[10px] text-[#94A3B8]">Super Built-Up Area</p>
              </div>
            </div>
            <div className="p-4">
              {/* Blurred Floorplan Graphics */}
              <div className="relative h-32 rounded-xl overflow-hidden bg-[#0B1426] border border-white/10 flex items-center justify-center p-3 mb-4">
                <div className="w-full h-full opacity-20 filter blur-[1.5px] border-2 border-dashed border-[#C9A86A]/50 flex flex-col justify-between p-2">
                  <div className="flex justify-between h-1/2 gap-2">
                    <div className="w-1/2 border border-[#C9A86A]/40" />
                    <div className="w-1/2 border border-[#C9A86A]/40" />
                  </div>
                  <div className="h-1/2 border-t border-[#C9A86A]/40 mt-1" />
                </div>
                <div className="absolute inset-0 bg-[#0B1426]/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-2">
                  <Lock className="w-5 h-5 text-[#C9A86A] mb-1" />
                  <span className="text-xs font-semibold text-[#F7F4EE]">Floor Plan Protected</span>
                  <span className="text-[10px] text-[#94A3B8]">Exclusive for verified pre-launch buyers</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-4 pt-1">
                <span className="text-[#94A3B8]">Price:</span>
                <span className="font-serif font-bold text-[#C9A86A] text-sm tracking-wide">Price on Request</span>
              </div>
              <button
                className="w-full py-2.5 rounded-xl border border-[#C9A86A] bg-[#C9A86A]/10 hover:bg-[#C9A86A] hover:text-[#0B1426] text-[#C9A86A] font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => onOpenEnquiry('Unlock 3 BHK Luxury Floor Plan', '3BHK')}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Unlock 3 BHK Floor Plan</span>
              </button>
            </div>
          </div>

          {/* Configuration Card 2 */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-[#C9A86A]/50 relative shadow-lg shadow-[#C9A86A]/5">
            <div className="absolute top-0 right-0 bg-[#C9A86A] text-[#0B1426] text-[9px] font-bold px-3 py-0.5 rounded-bl-lg uppercase tracking-wider">
              Most Preferred
            </div>
            <div className="p-4 border-b border-[#C9A86A]/20 bg-[#0B1426]/40 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#C9A86A] uppercase font-bold tracking-widest">Type B</span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#F7F4EE]">3 BHK + Servant</h3>
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm font-bold text-[#C9A86A]">2,400 Sq.Ft.</span>
                <p className="text-[10px] text-[#94A3B8]">Super Built-Up Area</p>
              </div>
            </div>
            <div className="p-4">
              <div className="relative h-32 rounded-xl overflow-hidden bg-[#0B1426] border border-white/10 flex items-center justify-center p-3 mb-4">
                <div className="w-full h-full opacity-20 filter blur-[1.5px] border-2 border-dashed border-[#C9A86A]/50 flex flex-col justify-between p-2">
                  <div className="flex justify-between h-1/2 gap-2">
                    <div className="w-1/3 border border-[#C9A86A]/40" />
                    <div className="w-2/3 border border-[#C9A86A]/40" />
                  </div>
                  <div className="h-1/2 border-t border-[#C9A86A]/40 mt-1" />
                </div>
                <div className="absolute inset-0 bg-[#0B1426]/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-2">
                  <Lock className="w-5 h-5 text-[#C9A86A] mb-1" />
                  <span className="text-xs font-semibold text-[#F7F4EE]">Floor Plan Protected</span>
                  <span className="text-[10px] text-[#94A3B8]">Includes Double Height Corner Balcony</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-4 pt-1">
                <span className="text-[#94A3B8]">Price:</span>
                <span className="font-serif font-bold text-[#C9A86A] text-sm tracking-wide">Price on Request</span>
              </div>
              <button
                className="w-full py-2.5 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:brightness-105"
                onClick={() => onOpenEnquiry('Unlock 3 BHK + Servant Floor Plan', '3BHK_SERVANT')}
              >
                <FileText className="w-3.5 h-3.5 text-[#0B1426]" />
                <span>Unlock 3 BHK+S Floor Plan</span>
              </button>
            </div>
          </div>

          {/* Configuration Card 3 */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-[#C9A86A]/30">
            <div className="p-4 border-b border-[#C9A86A]/20 bg-[#0B1426]/40 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#C9A86A] uppercase font-bold tracking-widest">Type C</span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#F7F4EE]">4 BHK + Servant</h3>
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm font-bold text-[#C9A86A]">3,000 Sq.Ft.</span>
                <p className="text-[10px] text-[#94A3B8]">Super Built-Up Area</p>
              </div>
            </div>
            <div className="p-4">
              <div className="relative h-32 rounded-xl overflow-hidden bg-[#0B1426] border border-white/10 flex items-center justify-center p-3 mb-4">
                <div className="w-full h-full opacity-20 filter blur-[1.5px] border-2 border-dashed border-[#C9A86A]/50 flex flex-col justify-between p-2">
                  <div className="flex justify-between h-1/3 gap-1">
                    <div className="w-1/2 border border-[#C9A86A]/40" />
                    <div className="w-1/2 border border-[#C9A86A]/40" />
                  </div>
                  <div className="h-2/3 border-t border-[#C9A86A]/40 mt-1" />
                </div>
                <div className="absolute inset-0 bg-[#0B1426]/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-2">
                  <Lock className="w-5 h-5 text-[#C9A86A] mb-1" />
                  <span className="text-xs font-semibold text-[#F7F4EE]">Floor Plan Protected</span>
                  <span className="text-[10px] text-[#94A3B8]">Panoramic Master Suite &amp; Golf Deck</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-4 pt-1">
                <span className="text-[#94A3B8]">Price:</span>
                <span className="font-serif font-bold text-[#C9A86A] text-sm tracking-wide">Price on Request</span>
              </div>
              <button
                className="w-full py-2.5 rounded-xl border border-[#C9A86A] bg-[#C9A86A]/10 hover:bg-[#C9A86A] hover:text-[#0B1426] text-[#C9A86A] font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => onOpenEnquiry('Unlock 4 BHK + Servant Floor Plan', '4BHK_SERVANT')}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Unlock 4 BHK+S Floor Plan</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={() => onNavigate('/floor-plans')}
            className="text-xs text-[#C9A86A] hover:underline font-semibold"
          >
            Explore Full Interactive Floor Plans &amp; Dimensions &rarr;
          </button>
        </div>
      </section>
      {/* END: Section4_Configurations */}

      {/* BEGIN: Section5_CuratedAmenities */}
      <section className="py-12 px-4">
        <div className="text-center mb-6">
          <span className="text-[10px] sm:text-xs font-bold text-[#C9A86A] uppercase tracking-widest">
            Resort Living
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F4EE] mt-1">
            Curated Lifestyle Amenities
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">Designed for holistic wellness &amp; elite leisure</p>
        </div>

        {/* Amenity Hero Image */}
        <div className="relative rounded-2xl overflow-hidden border border-[#C9A86A]/30 mb-6 shadow-xl">
          <img
            alt="Luxury clubhouse with infinity pool, cabanas, lush tropical landscaping and modern glass pavilion lounge at twilight with warm gold lighting, architectural visualization"
            className="w-full h-52 sm:h-72 object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZh4yQ8pDNsgkv2XSHTd53fMGCg7XNEzc1L1W5jf6hqrpE7RKe8LCnoNpwwIHgkCRNn_Vbt3jn361tf5p4Nvxb1zejlam__Uy26CcR2QMDUwEg9RtsibbEla0m04Z-lt-eiQSrE-XwOVLgXGmylZl8s04h_oxrF5WIbhwcmUbMH6HHZd5hg2GDrYjbBJ_6KR-Ei3NbNHdJpDGuYbReHgKC2rPWsYxkWtPaABCDUEVOugSo_ukA9ufC"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-serif font-bold text-[#F7F4EE]">
              The Grand Pavilion &amp; Lap Pool
            </span>
            <span className="text-[9px] sm:text-xs bg-[#C9A86A]/90 text-[#0B1426] font-bold px-2 py-0.5 rounded">
              60,000 Sq.Ft. Clubhouse
            </span>
          </div>
        </div>

        {/* 8 Luxury Amenity Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="glass-panel p-3 rounded-xl border border-[#C9A86A]/20 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A86A]/15 flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4 text-[#C9A86A]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F7F4EE]">Palatial Clubhouse</h4>
              <p className="text-[9px] text-[#94A3B8]">Cigar &amp; Wine Lounge</p>
            </div>
          </div>

          <div className="glass-panel p-3 rounded-xl border border-[#C9A86A]/20 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A86A]/15 flex items-center justify-center shrink-0">
              <Waves className="w-4 h-4 text-[#C9A86A]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F7F4EE]">Infinity Edge Pool</h4>
              <p className="text-[9px] text-[#94A3B8]">Cabanas &amp; Sun Decks</p>
            </div>
          </div>

          <div className="glass-panel p-3 rounded-xl border border-[#C9A86A]/20 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A86A]/15 flex items-center justify-center shrink-0">
              <Dumbbell className="w-4 h-4 text-[#C9A86A]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F7F4EE]">Gym &amp; Aerobics</h4>
              <p className="text-[9px] text-[#94A3B8]">Technogym Equipped</p>
            </div>
          </div>

          <div className="glass-panel p-3 rounded-xl border border-[#C9A86A]/20 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A86A]/15 flex items-center justify-center shrink-0">
              <Sparkle className="w-4 h-4 text-[#C9A86A]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F7F4EE]">Ayurveda Spa</h4>
              <p className="text-[9px] text-[#94A3B8]">Steam, Sauna &amp; Salon</p>
            </div>
          </div>

          <div className="glass-panel p-3 rounded-xl border border-[#C9A86A]/20 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A86A]/15 flex items-center justify-center shrink-0">
              <Baby className="w-4 h-4 text-[#C9A86A]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F7F4EE]">Kids Play Arena</h4>
              <p className="text-[9px] text-[#94A3B8]">Safe Toddler Splash Zone</p>
            </div>
          </div>

          <div className="glass-panel p-3 rounded-xl border border-[#C9A86A]/20 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A86A]/15 flex items-center justify-center shrink-0">
              <CloudSun className="w-4 h-4 text-[#C9A86A]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F7F4EE]">Sky Observatory</h4>
              <p className="text-[9px] text-[#94A3B8]">Telescopic View Deck</p>
            </div>
          </div>

          <div className="glass-panel p-3 rounded-xl border border-[#C9A86A]/20 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A86A]/15 flex items-center justify-center shrink-0">
              <Flower2 className="w-4 h-4 text-[#C9A86A]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F7F4EE]">Zen Greens</h4>
              <p className="text-[9px] text-[#94A3B8]">Aromatic Herb Gardens</p>
            </div>
          </div>

          <div className="glass-panel p-3 rounded-xl border border-[#C9A86A]/20 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A86A]/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#C9A86A]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F7F4EE]">24x7 Concierge</h4>
              <p className="text-[9px] text-[#94A3B8]">Valet &amp; High Security</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => onNavigate('/amenities')}
            className="text-xs text-[#C9A86A] hover:underline font-semibold"
          >
            View Complete List of 35+ Luxury Amenities &rarr;
          </button>
        </div>
      </section>
      {/* END: Section5_CuratedAmenities */}

      {/* BEGIN: Section6_LocationAdvantage */}
      <section className="py-10 px-4 bg-[#111D36]/40">
        <div className="text-center mb-6">
          <span className="text-[10px] sm:text-xs font-bold text-[#C9A86A] uppercase tracking-widest">
            Epicenter of Growth
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F4EE] mt-1">Sector 22D Advantage</h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Unmatched high-speed transit &amp; mega infrastructure
          </p>
        </div>

        {/* Stylized Location Map Graphic */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-[#C9A86A]/30 mb-6">
          <div className="relative bg-[#0B1426]/90 rounded-xl p-4 border border-[#C9A86A]/20 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#C9A86A_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-[11px] sm:text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A86A]" />
                  Yamuna Expressway Growth Corridor
                </span>
                <span className="text-[9px] sm:text-xs text-[#C9A86A] uppercase font-semibold">Hub of NCR</span>
              </div>

              {/* Stylized Node List */}
              <div className="space-y-3 pt-1">
                {/* Item 1 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#C9A86A]/20 flex items-center justify-center">
                      <Plane className="w-3 h-3 text-[#C9A86A]" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-[#F7F4EE] block">Noida Int&apos;l Airport (Jewar)</span>
                      <span className="text-[9px] text-[#94A3B8]">Upcoming Global Aviation Hub</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#C9A86A] bg-[#C9A86A]/10 px-2 py-0.5 rounded-full border border-[#C9A86A]/30">
                    15 Mins
                  </span>
                </div>

                {/* Item 2 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#C9A86A]/20 flex items-center justify-center">
                      <Clapperboard className="w-3 h-3 text-[#C9A86A]" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-[#F7F4EE] block">International Film City</span>
                      <span className="text-[9px] text-[#94A3B8]">Sector 21, Yamuna Expressway</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#C9A86A] bg-[#C9A86A]/10 px-2 py-0.5 rounded-full border border-[#C9A86A]/30">
                    8 Mins
                  </span>
                </div>

                {/* Item 3 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#C9A86A]/20 flex items-center justify-center">
                      <Navigation className="w-3 h-3 text-[#C9A86A]" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-[#F7F4EE] block">Eastern Peripheral Exp. (EPE)</span>
                      <span className="text-[9px] text-[#94A3B8]">Direct Signal-Free Connectivity</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#C9A86A] bg-[#C9A86A]/10 px-2 py-0.5 rounded-full border border-[#C9A86A]/30">
                    5 Mins
                  </span>
                </div>

                {/* Item 4 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#C9A86A]/20 flex items-center justify-center">
                      <Map className="w-3 h-3 text-[#C9A86A]" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-[#F7F4EE] block">Pari Chowk, Greater Noida</span>
                      <span className="text-[9px] text-[#94A3B8]">Metro &amp; Commercial Center</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#C9A86A] bg-[#C9A86A]/10 px-2 py-0.5 rounded-full border border-[#C9A86A]/30">
                    20 Mins
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            className="w-full mt-4 py-2.5 rounded-xl border border-[#C9A86A]/40 text-[#C9A86A] text-xs font-bold hover:bg-[#C9A86A]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => onOpenEnquiry('Location & Masterplan Dossier Request')}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Detailed Location Map &amp; Transit Dossier</span>
          </button>
        </div>
      </section>
      {/* END: Section6_LocationAdvantage */}

      {/* BEGIN: Section7_Gallery */}
      <section className="py-12 px-4">
        <div className="text-center mb-6">
          <span className="text-[10px] sm:text-xs font-bold text-[#C9A86A] uppercase tracking-widest">
            Architectural Grandeur
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F4EE] mt-1">Crafted for Connoisseurs</h2>
        </div>

        {/* Feature Gallery Item */}
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-[#C9A86A]/30 group">
            <img
              alt="Interior ultra luxury high ceiling living room in a modern penthouse with floor to ceiling glass windows opening to a private balcony overlooking a championship green golf course, champagne gold and warm timber accents, plush Italian sofa, architectural render"
              className="w-full h-56 sm:h-80 object-cover transform duration-500 hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6HwftogRFHzOgLRfLPH-nqLJnnNbwAivmQj-e3eS12gQ28ChzDsQJRxjkHoxhV0oeAqyOzGg3okKjjIqLLjNildWfYZ8kBFzbDt2jTB9kwywbZa_ucL5_F0uxZ40NEoaPzE89CZ4FRuWlf6S-PVkpONhUh2IrQBDibcYV3gpp4XREiDFUow_SoCa8lNpnCvrqwAWBqooWwXEk24FlH84O1Nh0L_4rx3Bh2HLJcve68wdjFR0Kcaul"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426]/90 via-[#0B1426]/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <span className="text-[10px] sm:text-xs text-[#C9A86A] uppercase font-bold tracking-widest">
                Double-Height Living Rooms
              </span>
              <p className="text-xs sm:text-sm text-[#F7F4EE] font-serif">
                Floor-to-ceiling panoramic glass facing the golf horizons
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="relative rounded-xl overflow-hidden border border-[#C9A86A]/20 h-28 sm:h-40">
              <img
                alt="Tower exterior facade at dusk"
                className="w-full h-full object-cover object-top"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5pTukeE2hQkmXut-7c8iJ0yI61f-uCHv8VYP7ZWazC1nbxF-o6pZvc6bFD3qPLWuYYhW71XwY4fTfHHwN1OAV-ys3BryEpwm_4AYB9zjJIhanugWiuBmzXz-WNtiCeUe6JUKF21nViuaD5Uwoz001Z1sooeyVwR4Dj4g2gtzSFZZ49Rn8E8ypv6H5ci2hAfbohZCltgRHA0jBdnC5NS4fCMwyvXMc1bhWpY6IKdHJeF8ZetQ9hb3d"
              />
              <div className="absolute inset-0 bg-[#0B1426]/40" />
              <div className="absolute bottom-2 left-2">
                <span className="text-[9px] sm:text-xs text-[#F7F4EE] font-semibold block">
                  Glass Facade Towers
                </span>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-[#C9A86A]/20 h-28 sm:h-40">
              <img
                alt="Clubhouse pool evening view"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZh4yQ8pDNsgkv2XSHTd53fMGCg7XNEzc1L1W5jf6hqrpE7RKe8LCnoNpwwIHgkCRNn_Vbt3jn361tf5p4Nvxb1zejlam__Uy26CcR2QMDUwEg9RtsibbEla0m04Z-lt-eiQSrE-XwOVLgXGmylZl8s04h_oxrF5WIbhwcmUbMH6HHZd5hg2GDrYjbBJ_6KR-Ei3NbNHdJpDGuYbReHgKC2rPWsYxkWtPaABCDUEVOugSo_ukA9ufC"
              />
              <div className="absolute inset-0 bg-[#0B1426]/40" />
              <div className="absolute bottom-2 left-2">
                <span className="text-[9px] sm:text-xs text-[#F7F4EE] font-semibold block">
                  Cabana Pool Deck
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Section7_Gallery */}

      {/* BEGIN: Section_AuthorityApprovals */}
      <section className="py-10 px-4">
        <div className="text-center mb-6">
          <span className="text-[10px] sm:text-xs font-bold text-[#C9A86A] uppercase tracking-widest">
            Institutional Trust &amp; Regulatory Compliance
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F4EE] mt-1">
            Statutory Approvals &amp; Authority Verifications
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-xl mx-auto">
            Engineered under the master planning guidelines of Yamuna Expressway Industrial Development Authority (YEIDA) and Uttar Pradesh RERA.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {/* Card 1: UP RERA */}
          <div className="glass-panel p-4 rounded-2xl border border-[#C9A86A]/30 flex flex-col justify-between hover:border-[#C9A86A] transition-all">
            <div>
              <div className="w-9 h-9 rounded-full bg-[#C9A86A]/20 flex items-center justify-center text-[#C9A86A] mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#F7F4EE]">UP RERA Compliant</h3>
              <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                Formal application under process with UP RERA. All sales governed by state statutory real estate norms.
              </p>
            </div>
            <a
              href="https://up-rera.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#DFBF82] font-semibold hover:underline mt-3 inline-flex items-center gap-1"
            >
              <span>Verify on UP RERA Portal</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Card 2: YEIDA Master Plan */}
          <div className="glass-panel p-4 rounded-2xl border border-[#C9A86A]/30 flex flex-col justify-between hover:border-[#C9A86A] transition-all">
            <div>
              <div className="w-9 h-9 rounded-full bg-[#C9A86A]/20 flex items-center justify-center text-[#C9A86A] mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#F7F4EE]">YEIDA Master Plan 2031</h3>
              <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                Zoned under low-density residential master plan with 45-meter arterial access and 100-meter green buffer belts.
              </p>
            </div>
            <a
              href="https://yamunaexpresswayauthority.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#DFBF82] font-semibold hover:underline mt-3 inline-flex items-center gap-1"
            >
              <span>YEIDA Official Portal</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Card 3: Jewar Aerocity Hub */}
          <div className="glass-panel p-4 rounded-2xl border border-[#C9A86A]/30 flex flex-col justify-between hover:border-[#C9A86A] transition-all">
            <div>
              <div className="w-9 h-9 rounded-full bg-[#C9A86A]/20 flex items-center justify-center text-[#C9A86A] mb-3">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#F7F4EE]">Jewar Airport Corridor</h3>
              <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                15 minutes direct signal-free expressway access to Noida International Airport (Jewar) aviation zone.
              </p>
            </div>
            <a
              href="https://nialjewar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#DFBF82] font-semibold hover:underline mt-3 inline-flex items-center gap-1"
            >
              <span>NIAL Project Updates</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Card 4: IGBC Pre-Certified */}
          <div className="glass-panel p-4 rounded-2xl border border-[#C9A86A]/30 flex flex-col justify-between hover:border-[#C9A86A] transition-all">
            <div>
              <div className="w-9 h-9 rounded-full bg-[#C9A86A]/20 flex items-center justify-center text-[#C9A86A] mb-3">
                <Trees className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#F7F4EE]">IGBC Gold Pre-Certified</h3>
              <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                Sustainable green building architecture with high-efficiency energy insulation, rainwater percolation, and EV charging.
              </p>
            </div>
            <a
              href="https://igbc.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#DFBF82] font-semibold hover:underline mt-3 inline-flex items-center gap-1"
            >
              <span>IGBC Green Standards</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>
      {/* END: Section_AuthorityApprovals */}

      {/* BEGIN: Section8_SecondEnquiryBlock */}
      <section className="py-10 px-4" id="enquire">
        <div className="glass-panel p-5 sm:p-8 rounded-3xl border border-[#C9A86A] relative shadow-2xl overflow-hidden">
          {/* Subtle Glow Orb */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#C9A86A]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 text-center mb-5">
            <span className="text-[10px] sm:text-xs text-[#C9A86A] uppercase font-bold tracking-widest">
              Limited Pre-Launch Allotments
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F4EE] mt-1">
              Secure Your Priority Pass
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              Register today for VIP invitation to the private launch preview
            </p>
          </div>

          {secError && (
            <div className="p-2 mb-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs">
              {secError}
            </div>
          )}

          <form className="space-y-3 relative z-10 max-w-lg mx-auto" onSubmit={handleSecSubmit}>
            <div>
              <label className="text-[10px] text-[#94A3B8] block mb-1">Your Name</label>
              <input
                className="w-full bg-[#0B1426]/80 border border-[#C9A86A]/30 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#94A3B8]/50 focus:border-[#C9A86A] focus:outline-none focus:ring-1 focus:ring-[#C9A86A]"
                placeholder="Ex. Arjun Singhania"
                required
                type="text"
                value={secName}
                onChange={(e) => setSecName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] text-[#94A3B8] block mb-1">Contact Number</label>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 rounded-xl border border-[#C9A86A]/30 bg-[#0B1426]/80 text-xs text-[#C9A86A] font-medium">
                  +91
                </span>
                <input
                  className="w-full bg-[#0B1426]/80 border border-[#C9A86A]/30 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#94A3B8]/50 focus:border-[#C9A86A] focus:outline-none focus:ring-1 focus:ring-[#C9A86A]"
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile"
                  required
                  type="tel"
                  value={secPhone}
                  onChange={(e) => setSecPhone(e.target.value)}
                />
              </div>
            </div>

            <button
              className="w-full py-3 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C9A86A]/20 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
              type="submit"
              disabled={secLoading}
            >
              {secLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B1426]" />
                  <span>Submitting Priority Pass...</span>
                </>
              ) : (
                <>
                  <BadgeCheck className="w-4 h-4 text-[#0B1426]" />
                  <span>Register for Pre-Launch Invitation</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[9px] text-[#94A3B8] pt-1">
              <Shield className="w-3 h-3 text-[#C9A86A]" />
              <span>Verified Official Pre-Launch Desk</span>
            </div>
          </form>
        </div>
      </section>
      {/* END: Section8_SecondEnquiryBlock */}

      {/* BEGIN: Section9_FAQAccordion */}
      <section className="py-10 px-4">
        <div className="text-center mb-6">
          <span className="text-[10px] sm:text-xs font-bold text-[#C9A86A] uppercase tracking-widest">
            Clarifications
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F4EE] mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-2.5 max-w-xl mx-auto">
          {/* Q1 */}
          <details className="group glass-panel rounded-xl border border-[#C9A86A]/20 overflow-hidden">
            <summary className="flex justify-between items-center p-3.5 cursor-pointer list-none select-none text-xs sm:text-sm font-semibold text-[#F7F4EE]">
              <span>Where exactly is DXN Orion situated?</span>
              <ChevronDown className="w-4 h-4 text-[#C9A86A] transform transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-3.5 pb-3.5 text-xs text-[#94A3B8] border-t border-white/5 pt-2 leading-relaxed">
              DXN Orion is located directly in Sector 22D, Yamuna Expressway, Greater Noida. It lies directly on the primary expressway corridor, just 15 minutes away from the upcoming Jewar International Airport and 8 minutes from the upcoming International Film City.
            </div>
          </details>

          {/* Q2 */}
          <details className="group glass-panel rounded-xl border border-[#C9A86A]/20 overflow-hidden">
            <summary className="flex justify-between items-center p-3.5 cursor-pointer list-none select-none text-xs sm:text-sm font-semibold text-[#F7F4EE]">
              <span>What are the pre-launch payment plans?</span>
              <ChevronDown className="w-4 h-4 text-[#C9A86A] transform transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-3.5 pb-3.5 text-xs text-[#94A3B8] border-t border-white/5 pt-2 leading-relaxed">
              Special flexible construction-linked plans (CLP) and attractive milestone payment structures (such as 10:90 pre-launch subvention windows) are available exclusively for first-phase pre-registered buyers.
            </div>
          </details>

          {/* Q3 */}
          <details className="group glass-panel rounded-xl border border-[#C9A86A]/20 overflow-hidden">
            <summary className="flex justify-between items-center p-3.5 cursor-pointer list-none select-none text-xs sm:text-sm font-semibold text-[#F7F4EE]">
              <span>What configurations and unit sizes are offered?</span>
              <ChevronDown className="w-4 h-4 text-[#C9A86A] transform transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-3.5 pb-3.5 text-xs text-[#94A3B8] border-t border-white/5 pt-2 leading-relaxed">
              The project offers ultra-spacious 3 BHK (1,900 sq ft), 3 BHK + Servant (2,400 sq ft), and palatial 4 BHK + Servant (3,000 sq ft) configurations, designed strictly 4 units per floor for ultimate privacy and panoramic golf views.
            </div>
          </details>

          {/* Q4 */}
          <details className="group glass-panel rounded-xl border border-[#C9A86A]/20 overflow-hidden">
            <summary className="flex justify-between items-center p-3.5 cursor-pointer list-none select-none text-xs sm:text-sm font-semibold text-[#F7F4EE]">
              <span>What is the current RERA and approval status?</span>
              <ChevronDown className="w-4 h-4 text-[#C9A86A] transform transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-3.5 pb-3.5 text-xs text-[#94A3B8] border-t border-white/5 pt-2 leading-relaxed">
              Master layout plans have been submitted and are under final statutory compliance and UP RERA processing. Commercial sales and formal allotment commence strictly post receipt of the official RERA registration number.
            </div>
          </details>

          {/* Q5 */}
          <details className="group glass-panel rounded-xl border border-[#C9A86A]/20 overflow-hidden">
            <summary className="flex justify-between items-center p-3.5 cursor-pointer list-none select-none text-xs sm:text-sm font-semibold text-[#F7F4EE]">
              <span>How do I secure priority allotment?</span>
              <ChevronDown className="w-4 h-4 text-[#C9A86A] transform transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-3.5 pb-3.5 text-xs text-[#94A3B8] border-t border-white/5 pt-2 leading-relaxed">
              Fill out the pre-launch registration form on this page or connect with our official sales desk. A dedicated relationship manager will share the provisional priority number and arrange an exclusive preview.
            </div>
          </details>
        </div>
      </section>
      {/* END: Section9_FAQAccordion */}
    </div>
  );
};
