import React, { useState } from 'react';
import {
  Crown, Waves, Dumbbell, Sparkle, Baby, CloudSun, Flower2, ShieldCheck,
  Coffee, Film, Utensils, Music, Bike, Zap, Wifi, Award
} from 'lucide-react';

interface AmenitiesPageProps {
  onOpenEnquiry: (contextTitle: string) => void;
  onNavigate: (path: string) => void;
}

export const AmenitiesPage: React.FC<AmenitiesPageProps> = ({ onOpenEnquiry, onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'club' | 'wellness' | 'sports' | 'nature'>('all');

  const amenities = [
    {
      icon: Crown,
      title: '60,000 Sq.Ft. Palatial Clubhouse',
      category: 'club',
      desc: 'Three-tiered architectural marvel housing a grand ballroom, private cigar lounge, and temperature-controlled atrium.'
    },
    {
      icon: Waves,
      title: 'Olympic-Length Infinity Lap Pool',
      category: 'wellness',
      desc: 'Heated luxury pool with zero-edge horizon spillover, submerged lounging cabanas, and integrated jacuzzi jets.'
    },
    {
      icon: Dumbbell,
      title: 'Technogym Fitness Studio',
      category: 'sports',
      desc: 'Biometrically equipped cardiovascular and strength zones curated with world-class Italian Technogym machinery.'
    },
    {
      icon: Sparkle,
      title: 'Ayurvedic Wellness Spa & Hammam',
      category: 'wellness',
      desc: 'Dedicated herbal hydrotherapy chambers, eucalyptus steam rooms, Finnish pine saunas, and private therapy suites.'
    },
    {
      icon: CloudSun,
      title: 'Rooftop Sky Observatory',
      category: 'nature',
      desc: 'Elevated astronomical stargazing terrace fitted with high-magnification automated celestial telescopes.'
    },
    {
      icon: Baby,
      title: 'Toddler Splash & Montessori Arena',
      category: 'sports',
      desc: 'Safe anti-microbial indoor sensory play zone, zero-depth water jets, and supervised crèche facility.'
    },
    {
      icon: Flower2,
      title: 'Aromatic Zen Botanical Gardens',
      category: 'nature',
      desc: 'Over 80% open lush terrain with lavender pathways, reflexology walking trails, and open-air yoga pavilions.'
    },
    {
      icon: Film,
      title: 'Private Dolby Atmos Screening Theatre',
      category: 'club',
      desc: 'Acoustically treated 32-seater private auditorium with plush leather recliners and 4K laser projection.'
    },
    {
      icon: Coffee,
      title: 'Artisan Cafe & Library Lounge',
      category: 'club',
      desc: 'Co-working reading enclaves serving specialty single-origin coffees with golf course panorama.'
    },
    {
      icon: Bike,
      title: 'Dedicated Cycling & Jogging Track',
      category: 'sports',
      desc: '2.4-kilometer cushioned rubberized running track weaving through landscaped oxygen-rich woodlands.'
    },
    {
      icon: Zap,
      title: 'Ultra-Fast EV Charging Bays',
      category: 'nature',
      desc: 'High-speed DC electric vehicle charging stations across all basement parking quadrants.'
    },
    {
      icon: ShieldCheck,
      title: '5-Tier AI Security & Concierge',
      category: 'club',
      desc: 'Biometric facial access, boom-barrier RFID recognition, 24x7 uniform concierge, and valet parking.'
    }
  ];

  const filtered = filter === 'all' ? amenities : amenities.filter(a => a.category === filter);

  return (
    <div className="max-w-5xl mx-auto pt-20 pb-24 px-4">
      {/* Page Header */}
      <div className="text-center mb-8">
        <span className="text-[10px] sm:text-xs font-bold text-[#C9A86A] uppercase tracking-widest block mb-1">
          Resort Living Masterplan
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F7F4EE]">
          DXN Orion Amenities – Curated Lifestyle
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 max-w-xl mx-auto">
          Over 60,000 sq.ft. of ultra-luxurious indoor and outdoor recreation designed for holistic wellness, elite entertainment, and sporting indulgence.
        </p>
      </div>

      {/* Featured Amenity Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#C9A86A]/40 mb-10 shadow-2xl">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZh4yQ8pDNsgkv2XSHTd53fMGCg7XNEzc1L1W5jf6hqrpE7RKe8LCnoNpwwIHgkCRNn_Vbt3jn361tf5p4Nvxb1zejlam__Uy26CcR2QMDUwEg9RtsibbEla0m04Z-lt-eiQSrE-XwOVLgXGmylZl8s04h_oxrF5WIbhwcmUbMH6HHZd5hg2GDrYjbBJ_6KR-Ei3NbNHdJpDGuYbReHgKC2rPWsYxkWtPaABCDUEVOugSo_ukA9ufC"
          alt="Clubhouse evening perspective"
          className="w-full h-64 sm:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#C9A86A] uppercase font-bold tracking-widest">
              Centerpiece Of Recreation
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F4EE] mt-1">
              The Grand Pavilion &amp; Heated Infinity Pool
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-lg">
              Overlooking expansive championship golf greens with shaded sun decks, private cabanas, and poolside cocktail lounge.
            </p>
          </div>
          <button
            onClick={() => onOpenEnquiry('Clubhouse & Amenities Tour Request')}
            className="py-2.5 px-6 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-lg shadow-[#C9A86A]/20"
          >
            Request Private Tour
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { key: 'all', label: 'All Amenities' },
          { key: 'club', label: 'Clubhouse & Leisure' },
          { key: 'wellness', label: 'Spa & Wellness' },
          { key: 'sports', label: 'Sports & Fitness' },
          { key: 'nature', label: 'Nature & Zen' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === tab.key
                ? 'gold-gradient-bg text-[#0B1426] shadow-md shadow-[#C9A86A]/20'
                : 'glass-panel text-[#F7F4EE] hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of 12 Curated Amenities */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-[#C9A86A]/25 hover:border-[#C9A86A]/60 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#C9A86A]/15 border border-[#C9A86A]/30 flex items-center justify-center text-[#C9A86A] mb-3 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-serif font-bold text-[#F7F4EE]">
                {item.title}
              </h4>
              <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom Conversion Prompt */}
      <div className="glass-panel mt-12 p-6 rounded-3xl border border-[#C9A86A] text-center max-w-xl mx-auto space-y-3">
        <h3 className="font-serif font-bold text-lg text-[#F7F4EE]">
          Experience Resort Living in Sector 22D
        </h3>
        <p className="text-xs text-[#94A3B8]">
          Pre-launch registrations include complimentary lifetime club membership privileges and priority allocations.
        </p>
        <button
          onClick={() => onOpenEnquiry('Amenities & Club Membership Inquiry')}
          className="py-2.5 px-8 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C9A86A]/25 cursor-pointer"
        >
          Enquire for Membership Privileges
        </button>
      </div>
    </div>
  );
};
