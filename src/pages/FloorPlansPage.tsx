import React, { useState } from 'react';
import { Lock, FileText, CheckCircle2, Compass, Layers, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { LeadConfiguration } from '../types/index.ts';

interface FloorPlansPageProps {
  onOpenEnquiry: (contextTitle: string, config: string) => void;
  onNavigate: (path: string) => void;
}

export const FloorPlansPage: React.FC<FloorPlansPageProps> = ({ onOpenEnquiry, onNavigate }) => {
  const [selectedPlan, setSelectedPlan] = useState<'3BHK' | '3BHK_SERVANT' | '4BHK_SERVANT'>('3BHK_SERVANT');

  const plans = {
    '3BHK': {
      title: '3 BHK Luxury Suite',
      type: 'Type A',
      superArea: '1,900 Sq.Ft.',
      carpetArea: '1,280 Sq.Ft.',
      balconyArea: '240 Sq.Ft.',
      facing: 'Panoramic Golf Greens (North-East)',
      unitsPerFloor: '4 Units / Floor (Dual Core)',
      price: 'Price on Request',
      description: 'Engineered for executive families seeking open-plan living, private bedroom zoning, and deep running balconies overlooking the golf horizon.',
      specs: [
        'Master Bedroom (14′ × 16′) with walk-in wardrobe and en-suite bath',
        'Expansive Living & Dining (22′ × 14′) opening to 8ft wide balcony',
        'Two spacious guest/children bedrooms with private balconies',
        'Gourmet modular kitchen with attached utility and wash yard',
        'Engineered Italian marble flooring in foyer and common living areas',
        'Acoustically insulated double-glazed floor-to-ceiling facade windows'
      ]
    },
    '3BHK_SERVANT': {
      title: '3 BHK + Servant Quarter',
      type: 'Type B (Most Preferred)',
      superArea: '2,400 Sq.Ft.',
      carpetArea: '1,640 Sq.Ft.',
      balconyArea: '320 Sq.Ft.',
      facing: 'Double-Height Corner Golf Horizons',
      unitsPerFloor: '4 Units / Floor with Dedicated Service Lift',
      price: 'Price on Request',
      description: 'Our flagship residence featuring a dramatic double-height living room, independent servant quarter with discrete service elevator access, and multi-side light exposure.',
      specs: [
        'Double-height grand living hall (25′ × 16′) with 22-foot high panoramic glass',
        'Master Suite (16′ × 18′) with private sundeck and spa bathtub provision',
        'Independent Servant/Utility room with private service corridor entry',
        'All three bedrooms feature en-suite baths and dedicated dress areas',
        'Wrap-around corner balcony (320 Sq.Ft.) with 180° uninterrupted golf view',
        'Provision for VRV / VRF centralized climate control system'
      ]
    },
    '4BHK_SERVANT': {
      title: '4 BHK + Servant Palatial Estate',
      type: 'Type C (Presidential)',
      superArea: '3,000 Sq.Ft.',
      carpetArea: '2,080 Sq.Ft.',
      balconyArea: '420 Sq.Ft.',
      facing: 'Triple-Aspect Championship Golf & Sky Deck',
      unitsPerFloor: 'Private Lift Lobby (2 Lifts / Core)',
      price: 'Price on Request',
      description: 'The pinnacle of luxury in Sector 22D. Expansive 4-bedroom layout with dual master suites, formal family lounge, chef kitchen, and private elevator landing.',
      specs: [
        'Palatial living & banquet dining arena (28′ × 18′) with terrace lounge',
        'Dual Master Suites with timber flooring and oversized walk-in closets',
        'Dedicated Puja/Meditation room and separate study/work enclave',
        'Chef kitchen with breakfast island, pantry, and attached utility area',
        'Independent domestic help quarters with attached washroom',
        'Private elevator foyer providing absolute confidentiality and security'
      ]
    }
  };

  const current = plans[selectedPlan];

  return (
    <div className="max-w-4xl mx-auto pt-20 pb-24 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[10px] sm:text-xs font-bold text-[#C9A86A] uppercase tracking-widest block mb-1">
          Master Planned Layouts
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F7F4EE]">
          Exclusive Floor Plans
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 max-w-xl mx-auto">
          Low-density 4-to-a-core luxury residences in Sector 22D, Yamuna Expressway. Explore protected blueprints and specifications.
        </p>
      </div>

      {/* Plan Selector Tabs */}
      <div className="flex justify-center mb-8">
        <div className="glass-panel p-1.5 rounded-2xl border border-[#C9A86A]/40 flex gap-1 sm:gap-2 max-w-md w-full">
          <button
            onClick={() => setSelectedPlan('3BHK')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedPlan === '3BHK'
                ? 'gold-gradient-bg text-[#0B1426] shadow-md shadow-[#C9A86A]/20'
                : 'text-[#F7F4EE] hover:bg-white/5'
            }`}
          >
            3 BHK (1,900 sq ft)
          </button>
          <button
            onClick={() => setSelectedPlan('3BHK_SERVANT')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
              selectedPlan === '3BHK_SERVANT'
                ? 'gold-gradient-bg text-[#0B1426] shadow-md shadow-[#C9A86A]/20'
                : 'text-[#F7F4EE] hover:bg-white/5'
            }`}
          >
            3 BHK+S (2,400 sq ft)
          </button>
          <button
            onClick={() => setSelectedPlan('4BHK_SERVANT')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedPlan === '4BHK_SERVANT'
                ? 'gold-gradient-bg text-[#0B1426] shadow-md shadow-[#C9A86A]/20'
                : 'text-[#F7F4EE] hover:bg-white/5'
            }`}
          >
            4 BHK+S (3,000 sq ft)
          </button>
        </div>
      </div>

      {/* Active Floor Plan Card */}
      <div className="glass-panel rounded-3xl border border-[#C9A86A] overflow-hidden shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A86A]">
              {current.type}
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#F7F4EE] mt-0.5">
              {current.title}
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              {current.description}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-lg font-serif font-bold text-[#C9A86A]">
              {current.superArea}
            </span>
            <p className="text-[10px] text-[#94A3B8]">Super Built-Up Area</p>
          </div>
        </div>

        {/* Protected Schematic Blueprint View */}
        <div className="relative my-6 h-64 sm:h-80 rounded-2xl bg-[#0B1426] border border-[#C9A86A]/30 overflow-hidden flex items-center justify-center p-4">
          {/* Blueprint Grid Watermark */}
          <div className="w-full h-full opacity-20 filter blur-[2px] border-2 border-dashed border-[#C9A86A]/60 flex flex-col justify-between p-4 bg-[linear-gradient(to_right,#C9A86A_1px,transparent_1px),linear-gradient(to_bottom,#C9A86A_1px,transparent_1px)] bg-[size:24px_24px]">
            <div className="flex justify-between h-1/2 gap-4">
              <div className="w-1/2 border border-[#C9A86A]/50 rounded p-2" />
              <div className="w-1/2 border border-[#C9A86A]/50 rounded p-2" />
            </div>
            <div className="h-1/2 border-t border-[#C9A86A]/50 mt-2 rounded" />
          </div>

          <div className="absolute inset-0 bg-[#0B1426]/75 backdrop-blur-[3px] flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-[#C9A86A]/20 border border-[#C9A86A] flex items-center justify-center text-[#C9A86A] mb-2 shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#F7F4EE]">
              Architectural Blueprint Protected
            </h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mt-1">
              Detailed room dimensions, structural cad files, and electrical layouts are reserved for verified pre-launch buyers.
            </p>
            <button
              onClick={() => onOpenEnquiry(`Unlock Blueprint: ${current.title}`, selectedPlan)}
              className="mt-4 py-2.5 px-6 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C9A86A]/20 cursor-pointer active:scale-95"
            >
              <FileText className="w-4 h-4 text-[#0B1426]" />
              <span>Unlock Architectural Layout PDF</span>
            </button>
          </div>
        </div>

        {/* Spatial Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-white/10 text-xs">
          <div className="p-3 bg-[#0B1426]/60 rounded-xl border border-[#C9A86A]/20">
            <span className="text-[10px] text-[#94A3B8] block">Carpet Area</span>
            <span className="font-bold text-[#F7F4EE]">{current.carpetArea}</span>
          </div>
          <div className="p-3 bg-[#0B1426]/60 rounded-xl border border-[#C9A86A]/20">
            <span className="text-[10px] text-[#94A3B8] block">Balcony Deck</span>
            <span className="font-bold text-[#F7F4EE]">{current.balconyArea}</span>
          </div>
          <div className="p-3 bg-[#0B1426]/60 rounded-xl border border-[#C9A86A]/20">
            <span className="text-[10px] text-[#94A3B8] block">Orientation</span>
            <span className="font-bold text-[#C9A86A]">{current.facing}</span>
          </div>
          <div className="p-3 bg-[#0B1426]/60 rounded-xl border border-[#C9A86A]/20">
            <span className="text-[10px] text-[#94A3B8] block">Core Privacy</span>
            <span className="font-bold text-[#F7F4EE]">{current.unitsPerFloor}</span>
          </div>
        </div>

        {/* Detailed Room Specifications */}
        <div className="mt-6">
          <h4 className="text-sm font-serif font-bold text-[#F7F4EE] mb-3">
            Layout Highlights &amp; Spatial Specifications
          </h4>
          <div className="grid sm:grid-cols-2 gap-2.5 text-xs text-[#94A3B8]">
            {current.specs.map((spec, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A86A] shrink-0 mt-0.5" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#94A3B8]">Indicative Price Structure:</span>
            <div className="text-lg font-serif font-bold text-[#C9A86A]">
              Exclusive Pre-Launch CLP Plan
            </div>
          </div>
          <button
            onClick={() => onOpenEnquiry(`Pre-Launch Pricing for ${current.title}`, selectedPlan)}
            className="w-full sm:w-auto py-3 px-8 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C9A86A]/25 cursor-pointer active:scale-95"
          >
            Request Instant Price Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
