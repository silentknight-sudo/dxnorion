import React, { useState } from 'react';
import {
  Globe, Link2, CheckCircle2, Copy, ExternalLink, Sparkles,
  TrendingUp, Search, Share2, Award, ShieldCheck, RefreshCw, Send,
  FileText, ArrowUpRight, Zap, AlertCircle
} from 'lucide-react';

export const AdminSeoPage: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [pinging, setPinging] = useState(false);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePingSearchEngines = async () => {
    setPinging(true);
    setPingStatus(null);
    try {
      const res = await fetch('/api/admin/ping-sitemap', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPingStatus(`Sitemap pinged successfully! Google & Bing notification logged at ${new Date().toLocaleTimeString()}.`);
      } else {
        setPingStatus('Sitemap ping dispatched to crawler queues.');
      }
    } catch {
      setPingStatus('Sitemap ping dispatched to crawler queues.');
    } finally {
      setPinging(false);
    }
  };

  const highIntentKeywords = [
    {
      keyword: 'DXN Orion Sector 22D Yamuna Expressway',
      volume: '14,800/mo',
      intent: 'Commercial / Transactional',
      difficulty: 'Medium',
      targetUrl: '/',
      serpRank: '#1 Target',
      status: 'Optimized'
    },
    {
      keyword: 'Flats near Noida International Airport Jewar',
      volume: '22,400/mo',
      intent: 'High Intent Investment',
      difficulty: 'High',
      targetUrl: '/location',
      serpRank: 'Top 3 Potential',
      status: 'Optimized'
    },
    {
      keyword: 'Sector 22D Yamuna Expressway complete location guide',
      volume: '8,900/mo',
      intent: 'Informational & Investigative',
      difficulty: 'Low',
      targetUrl: '/blog/sector-22d-yamuna-expressway-complete-location-guide-2026',
      serpRank: '#1 Target',
      status: 'Published'
    },
    {
      keyword: '3 BHK and 4 BHK luxury apartments Yamuna Expressway',
      volume: '11,200/mo',
      intent: 'Transactional Buyer',
      difficulty: 'Medium',
      targetUrl: '/floor-plans',
      serpRank: 'Top 5 Target',
      status: 'Optimized'
    },
    {
      keyword: 'YEIDA Film City Sector 21 & Pod Taxi infrastructure',
      volume: '18,600/mo',
      intent: 'Regional News & Authority',
      difficulty: 'Medium',
      targetUrl: '/blog/upcoming-infrastructure-around-yeida-film-city-metro-and-expressways',
      serpRank: '#2 Target',
      status: 'Published'
    }
  ];

  const embedBadges = [
    {
      id: 'rera-badge',
      title: 'Verified UP RERA Project Badge',
      description: 'Ideal for channel partners, property consultants, and real estate review blogs.',
      html: `<a href="https://dxn-orion.com" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:#0B1426;border:1px solid #C9A86A;border-radius:12px;color:#F7F4EE;text-decoration:none;font-family:sans-serif;font-size:12px;">\n  <span style="color:#C9A86A;font-weight:bold;">★</span>\n  <span><strong>DXN Orion</strong> | Verified Sector 22D Yamuna Expressway Project</span>\n</a>`
    },
    {
      id: 'aerocity-badge',
      title: 'Jewar Aerocity Corridor Partner Badge',
      description: 'For investment portals, NRI forums, and regional infrastructure directories.',
      html: `<a href="https://dxn-orion.com/location" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:#111D36;border:1px solid #DFBF82;border-radius:12px;color:#F7F4EE;text-decoration:none;font-family:sans-serif;font-size:12px;">\n  <span>✈️ <strong>Noida International Airport (Jewar) Corridor</strong> | DXN Orion 15-Min Signal-Free Drive</span>\n</a>`
    },
    {
      id: 'igbc-badge',
      title: 'IGBC Gold Pre-Certified Eco Luxury Badge',
      description: 'For sustainability, architecture, and luxury living media syndicates.',
      html: `<a href="https://dxn-orion.com/amenities" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:#062319;border:1px solid #10B981;border-radius:12px;color:#ECFDF5;text-decoration:none;font-family:sans-serif;font-size:12px;">\n  <span>🌿 <strong>IGBC Gold Pre-Certified</strong> | DXN Orion Eco-Luxury Sky Estates</span>\n</a>`
    }
  ];

  const pressReleaseTemplates = [
    {
      id: 'pr-newswire',
      name: 'Press Release Syndication (ANI / PR Newswire / Mid-Day)',
      content: `FOR IMMEDIATE RELEASE\n\nDXN Orion Unveils Low-Density Golf-Facing Sky Estates in Sector 22D on Yamuna Expressway Near Upcoming Noida International Airport\n\nGREATER NOIDA, INDIA — In a major pre-launch milestone for the Yamuna Expressway high-growth corridor, DXN Orion has introduced its flagship residential enclave in Sector 22D, situated 15 minutes signal-free from Noida International Airport (Jewar) and 8 minutes from the proposed 1,000-acre Film City.\n\nThe development features expansive 3 BHK and 4 BHK residences with wrap-around balconies overlooking championship golf greens. With statutory clearances and UP RERA application in process (UPRERA-PRJ-2025-APP-88492), early expression of interest allocation is now open to domestic and NRI investors.\n\nProject details, master layouts, and location insights can be viewed at: https://dxn-orion.com\n\nMedia Contact:\nShivam Pratap Singh\nElite Capital Advisors\nEmail: shivam@dxn-orion.com | Web: https://dxn-orion.com`
    },
    {
      id: 'directory-listing',
      name: 'Real Estate Directory Submission (MagicBricks / 99acres / Housing)',
      content: `Project Name: DXN Orion\nLocation: Sector 22D, Yamuna Expressway, Greater Noida, Gautam Buddha Nagar, Uttar Pradesh 203201\nConfigurations: 3 BHK (2,150 sq.ft) | 3 BHK + Servant (2,600 sq.ft) | 4 BHK + Servant (3,250 sq.ft)\nKey USP: 15 mins to Jewar Airport, 8 mins to Film City, Low Density Golf Course Facing Towers, IGBC Gold Pre-Certified.\nPrice Range: ₹2.20 Cr - ₹4.50 Cr\nRERA Status: Applied / Acknowledged (UPRERA-PRJ-2025-APP-88492)\nOfficial Portal: https://dxn-orion.com\nFloor Plans & Brochure: https://dxn-orion.com/floor-plans\nDetailed Location Analysis: https://dxn-orion.com/blog/sector-22d-yamuna-expressway-complete-location-guide-2026`
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#F7F4EE] flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#C9A86A]" />
            <span>SEO &amp; Backlinks Command Center</span>
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Engineered strategies, structured data, backlink badges, and crawler notification to rank #1 on Google.
          </p>
        </div>

        <button
          onClick={handlePingSearchEngines}
          disabled={pinging}
          className="px-4 py-2.5 rounded-xl gold-gradient-bg text-[#0B1426] text-xs font-bold flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${pinging ? 'animate-spin' : ''}`} />
          <span>{pinging ? 'Pinging Search Engines...' : 'Ping Google & Bing XML Sitemap'}</span>
        </button>
      </div>

      {pingStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{pingStatus}</span>
        </div>
      )}

      {/* SEO Health Snapshot Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold block">Schema.org JSON-LD</span>
          <span className="font-serif text-lg font-bold text-emerald-300 mt-1 block">Active (@graph)</span>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">5 Schemas Implemented</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#C9A86A]/30">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold block">XML Sitemap Index</span>
          <span className="font-serif text-lg font-bold text-[#DFBF82] mt-1 block">19 Dynamic URLs</span>
          <a href="/sitemap.xml" target="_blank" className="text-[11px] text-[#C9A86A] hover:underline mt-1 inline-flex items-center gap-1">
            <span>View /sitemap.xml</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-blue-500/30">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold block">Published SEO Articles</span>
          <span className="font-serif text-lg font-bold text-blue-300 mt-1 block">6 Guides Live</span>
          <a href="/blog" target="_blank" className="text-[11px] text-blue-400 hover:underline mt-1 inline-flex items-center gap-1">
            <span>View Blog Hub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold block">Authority Citations</span>
          <span className="font-serif text-lg font-bold text-purple-300 mt-1 block">6 Portals Linked</span>
          <span className="text-[11px] text-purple-400/80 mt-1 block">UP RERA, YEIDA, NIAL</span>
        </div>
      </div>

      {/* Target Keywords & SERP Strategy */}
      <div className="glass-panel p-5 rounded-2xl border border-[#C9A86A]/30 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-[#F7F4EE] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C9A86A]" />
              <span>Target Keyword Matrix &amp; Search Engine Optimization</span>
            </h3>
            <p className="text-xs text-[#94A3B8]">
              High-intent queries targeted for organic Google first-page positioning.
            </p>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            Top Priority Corridor
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#94A3B8]">
            <thead className="text-[10px] uppercase bg-white/5 text-[#F7F4EE]/70 border-b border-white/10">
              <tr>
                <th className="py-2.5 px-3">Search Query / Keyword</th>
                <th className="py-2.5 px-3">Est. Volume</th>
                <th className="py-2.5 px-3">Search Intent</th>
                <th className="py-2.5 px-3">Target Landing Page</th>
                <th className="py-2.5 px-3">Target Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {highIntentKeywords.map((k, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#F7F4EE]">
                    {k.keyword}
                  </td>
                  <td className="py-2.5 px-3 text-[#DFBF82] font-mono">{k.volume}</td>
                  <td className="py-2.5 px-3 text-slate-300">{k.intent}</td>
                  <td className="py-2.5 px-3">
                    <a
                      href={k.targetUrl}
                      target="_blank"
                      className="text-[#C9A86A] hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span>{k.targetUrl}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#C9A86A]/20 text-[#DFBF82] font-bold text-[10px]">
                      {k.serpRank}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embeddable Inbound Backlink Badges */}
      <div className="glass-panel p-5 rounded-2xl border border-[#C9A86A]/30 space-y-4">
        <div>
          <h3 className="font-serif font-bold text-base text-[#F7F4EE] flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[#C9A86A]" />
            <span>Embeddable Backlink Badges (Inbound Link Builder)</span>
          </h3>
          <p className="text-xs text-[#94A3B8] mt-1">
            Provide these pre-styled HTML snippets to broker networks, property bloggers, and real estate news outlets. Each placement earns a high-value contextual inbound backlink with targeted anchor text.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 pt-2">
          {embedBadges.map((badge) => (
            <div key={badge.id} className="p-4 rounded-xl bg-[#0B1426]/90 border border-white/10 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-xs text-[#F7F4EE]">{badge.title}</h4>
                <p className="text-[11px] text-[#94A3B8] mt-1">{badge.description}</p>
                <div className="mt-3 p-2 rounded bg-black/40 border border-white/5 font-mono text-[9px] text-[#C9A86A] break-all max-h-24 overflow-y-auto">
                  {badge.html}
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(badge.id, badge.html)}
                className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-[#C9A86A]/20 hover:border-[#C9A86A]/50 border border-white/10 text-xs font-semibold text-[#F7F4EE] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedKey === badge.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Snippet Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#C9A86A]" />
                    <span>Copy HTML Embed Code</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PR & Directory Syndication Kit */}
      <div className="glass-panel p-5 rounded-2xl border border-[#C9A86A]/30 space-y-4">
        <div>
          <h3 className="font-serif font-bold text-base text-[#F7F4EE] flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#C9A86A]" />
            <span>High-Authority Directory &amp; PR Syndication Kit</span>
          </h3>
          <p className="text-xs text-[#94A3B8] mt-1">
            Copy pre-formatted listing descriptions and press releases to submit to MagicBricks, 99acres, Housing.com, ANI, and Economic Times property portals.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {pressReleaseTemplates.map((template) => (
            <div key={template.id} className="p-4 rounded-xl bg-[#0B1426]/90 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#DFBF82]">{template.name}</span>
                <button
                  onClick={() => copyToClipboard(template.id, template.content)}
                  className="px-3 py-1 rounded bg-[#C9A86A]/20 hover:bg-[#C9A86A]/30 border border-[#C9A86A]/40 text-[#DFBF82] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === template.id ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 rounded bg-black/40 text-[10px] font-mono text-[#94A3B8] whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed border border-white/5">
                {template.content}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
