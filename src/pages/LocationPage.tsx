import React from 'react';
import { MapPin, Plane, Clapperboard, Navigation, Map, Download, CheckCircle2, Building, Car, Compass } from 'lucide-react';

interface LocationPageProps {
  onOpenEnquiry: (contextTitle: string) => void;
  onNavigate: (path: string) => void;
}

export const LocationPage: React.FC<LocationPageProps> = ({ onOpenEnquiry, onNavigate }) => {
  const hubs = [
    {
      icon: Plane,
      name: "Noida International Airport (Jewar)",
      sub: "Upcoming Global Aviation Hub & Cargo Terminal",
      distance: "14 km",
      time: "15 Mins",
      details: "Direct signal-free connectivity on the primary 6-lane Yamuna Expressway corridor."
    },
    {
      icon: Clapperboard,
      name: "International Film City",
      sub: "Sector 21, Yamuna Expressway (1,000 Acres)",
      distance: "7 km",
      time: "8 Mins",
      details: "World-class film studios, sound stages, animation academies, and entertainment zones."
    },
    {
      icon: Navigation,
      name: "Eastern Peripheral Expressway (EPE)",
      sub: "Direct Ring-Road Freight & Passenger Transit",
      distance: "4.5 km",
      time: "5 Mins",
      details: "Bypasses central Delhi traffic, linking Kundli, Ghaziabad, Faridabad, and Palwal."
    },
    {
      icon: Map,
      name: "Pari Chowk, Greater Noida",
      sub: "Existing Metro Station & Commercial Downtown",
      distance: "18 km",
      time: "20 Mins",
      details: "Established social infrastructure, shopping malls, universities, and commercial complexes."
    },
    {
      icon: Car,
      name: "Buddh International Circuit (BIC)",
      sub: "Formula One & MotoGP Racing Arena",
      distance: "6 km",
      time: "7 Mins",
      details: "Surrounded by sprawling sports city developments, international cricket stadium, and golf greens."
    },
    {
      icon: Building,
      name: "YEIDA Electronic City & Semiconductor Hub",
      sub: "Major Tech & Manufacturing Employment Hub",
      distance: "10 km",
      time: "12 Mins",
      details: "Government sanctioned mega clusters attracting multinational tech conglomerates and high-salaried professionals."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pt-20 pb-24 px-4">
      {/* Page Header */}
      <div className="text-center mb-8">
        <span className="text-[10px] sm:text-xs font-bold text-[#C9A86A] uppercase tracking-widest block mb-1">
          Strategic Epicenter of NCR
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F7F4EE]">
          DXN Orion Location – Sector 22D, Yamuna Expressway
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 max-w-xl mx-auto">
          Positioned directly on the Yamuna Expressway growth corridor between Greater Noida and Jewar International Airport.
        </p>
      </div>

      {/* Stylized Transit Radar Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#C9A86A] shadow-2xl mb-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#F7F4EE]">
            <MapPin className="w-4 h-4 text-[#C9A86A]" />
            <span>Yamuna Expressway Transit Matrix</span>
          </div>
          <span className="text-xs text-[#C9A86A] bg-[#C9A86A]/15 px-3 py-0.5 rounded-full border border-[#C9A86A]/30 font-semibold">
            Signal-Free Access
          </span>
        </div>

        <div className="divide-y divide-white/10 mt-2">
          {hubs.map((hub, idx) => {
            const Icon = hub.icon;
            return (
              <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C9A86A]/15 border border-[#C9A86A]/30 flex items-center justify-center text-[#C9A86A] shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#F7F4EE]">
                      {hub.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-[#C9A86A] font-medium">
                      {hub.sub}
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      {hub.details}
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pl-12 sm:pl-0">
                  <span className="text-xs sm:text-sm font-serif font-bold text-[#C9A86A] bg-[#0B1426] px-2.5 py-1 rounded-lg border border-[#C9A86A]/30">
                    {hub.time}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] mt-0.5">Approx. {hub.distance}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            onClick={() => onOpenEnquiry('Download Location Dossier & Masterplan Map')}
            className="w-full sm:w-auto py-3 px-8 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C9A86A]/20 cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <Download className="w-4 h-4 text-[#0B1426]" />
            <span>Download High-Res Master Plan &amp; Location Map</span>
          </button>
        </div>
      </div>

      {/* Map Embed / Visualization */}
      <div className="glass-panel p-5 rounded-3xl border border-[#C9A86A]/40 overflow-hidden shadow-xl mb-10">
        <h3 className="font-serif font-bold text-base text-[#F7F4EE] mb-3 flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#C9A86A]" />
          <span>Interactive Location Geography</span>
        </h3>
        
        {/* Responsive Lazy-loaded OpenStreetMap / Google Map container */}
        <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-white/10 bg-[#0B1426]">
          <iframe
            title="DXN Orion Sector 22D Yamuna Expressway Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56214.3724890666!2d77.5312!3d28.2831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cc28faecb47f7%3A0x6e2c38d4f40f29bf!2sSector%2022D%2C%20Yamuna%20Expressway%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            className="w-full h-full border-0 filter brightness-90 contrast-110"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute top-3 left-3 bg-[#0B1426]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#C9A86A]/40 text-xs text-[#F7F4EE] shadow-lg">
            <span className="text-[10px] text-[#C9A86A] uppercase font-bold block">Pinpoint</span>
            <span className="font-serif font-bold">Sector 22D, Yamuna Expressway</span>
          </div>
        </div>
      </div>

      {/* Masterplan Zonal Advantages */}
      <div className="grid sm:grid-cols-2 gap-4 text-xs">
        <div className="glass-panel p-5 rounded-2xl border border-[#C9A86A]/20">
          <h4 className="font-serif font-bold text-sm text-[#F7F4EE] mb-2 text-[#C9A86A]">
            Low-Density Zonal Masterplan
          </h4>
          <p className="text-[#94A3B8] leading-relaxed">
            YEIDA&apos;s urban development regulations in Sector 22D enforce strict maximum Ground Coverage and Floor Area Ratios (FAR). This ensures expansive natural green buffers, private golf vistas, and wide 45m collector roads, preventing urban congestion.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#C9A86A]/20">
          <h4 className="font-serif font-bold text-sm text-[#F7F4EE] mb-2 text-[#C9A86A]">
            Upcoming Multi-Modal Transit
          </h4>
          <p className="text-[#94A3B8] leading-relaxed">
            The sanctioned Rapid Rail Transit System (RRTS) and high-speed metro line will link Noida International Airport directly with Delhi Indira Gandhi Airport via Yamuna Expressway, alongside India&apos;s first Personal Rapid Transit (Pod Taxi) project.
          </p>
        </div>
      </div>
    </div>
  );
};
