import React from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'disclaimer';
  reraNumber?: string;
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({
  type,
  reraNumber = 'UPRERA-PRJ-2025-APP-88492',
  onNavigate
}) => {
  return (
    <div className="max-w-3xl mx-auto pt-20 pb-24 px-4">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-[11px] text-[#94A3B8] mb-6">
        <button onClick={() => onNavigate('/')} className="hover:text-[#C9A86A]">Home</button>
        <ChevronRight className="w-3 h-3 text-[#C9A86A]/40" />
        <span className="text-[#C9A86A]">{type === 'privacy' ? 'Privacy Policy' : 'Statutory Disclaimer'}</span>
      </nav>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-[#C9A86A]/30 space-y-6 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
        <div className="flex items-center gap-2 pb-4 border-b border-white/10">
          <ShieldCheck className="w-6 h-6 text-[#C9A86A]" />
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#F7F4EE]">
              {type === 'privacy' ? 'Privacy Policy & Data Protection' : 'Statutory Disclaimer & Compliance'}
            </h1>
            <span className="text-[10px] text-[#C9A86A] uppercase font-semibold">
              RERA Application No: {reraNumber}
            </span>
          </div>
        </div>

        {type === 'privacy' ? (
          <>
            <section className="space-y-2">
              <h2 className="font-serif font-bold text-base text-[#F7F4EE]">1. Commitment to Privacy</h2>
              <p>
                At DXN Orion and our authorized marketing agency Elite Capital Advisors, we respect your privacy and are committed to safeguarding personal information collected through our digital pre-launch channels.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-base text-[#F7F4EE]">2. Information We Collect</h2>
              <p>
                When you express interest in DXN Orion (Sector 22D, Yamuna Expressway), we collect your name, contact phone number, email address, preferred apartment configuration (3 BHK / 4 BHK), and marketing referral data (UTM attribution parameters).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-base text-[#F7F4EE]">3. Purpose of Data Processing</h2>
              <p>
                Your contact details are exclusively utilized to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide verified pre-launch price matrices, floor plans, and master layouts.</li>
                <li>Coordinate private site visits and VIP preview appointments.</li>
                <li>Transmit statutory RERA registration milestones and official developer updates.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-base text-[#F7F4EE]">4. Zero Spam &amp; Third-Party Sharing</h2>
              <p>
                We do not sell, rent, or lease your personal identifiers to any external third-party telemarketers or advertisers. Communications are conducted strictly via our dedicated relationship managers.
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-2">
              <h2 className="font-serif font-bold text-base text-[#F7F4EE]">1. Authorized Marketing Partner Notice</h2>
              <p>
                This website is managed by an authorized channel sales partner (Elite Capital Advisors) and serves exclusively for informational purposes. It does not constitute an advertisement, booking offer, contract, or guarantee of allotment.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-base text-[#F7F4EE]">2. UP RERA Statutory Compliance</h2>
              <p>
                The project &ldquo;DXN Orion&rdquo; situated in Sector 22D, Yamuna Expressway, Greater Noida, Uttar Pradesh, is in its pre-launch conceptual stage. Formal application for project registration under the Real Estate (Regulation and Development) Act is currently under process with the Uttar Pradesh Real Estate Regulatory Authority (UP RERA).
              </p>
              <p>
                No financial bookings, advances, or allotments are accepted on this platform. Any submissions through this website represent solely a non-binding Expression of Interest (EOI).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-base text-[#F7F4EE]">3. Artistic Impressions &amp; Tentative Specifications</h2>
              <p>
                All 3D architectural renders, elevation drawings, floor plans, lifestyle amenities, and landscape layouts displayed are artist&apos;s impressions and are indicative only. Dimensions, configurations, and pricing are subject to final municipal and statutory approvals.
              </p>
            </section>
          </>
        )}

        <div className="pt-4 border-t border-white/10 text-[11px] text-[#94A3B8] flex justify-between items-center">
          <span>Last Updated: October 2026</span>
          <button onClick={() => onNavigate('/')} className="text-[#C9A86A] underline">
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
