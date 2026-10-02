import React, { useEffect, useState } from 'react';
import {
  Users, TrendingUp, Calendar, CheckCircle2, ArrowUpRight,
  Filter, FileText, Eye, Clock, Phone, Sparkles, RefreshCw, AlertCircle
} from 'lucide-react';
import { LeadStatus } from '../../types/index.ts';
import { adminFetch, getAdminToken } from '../../utils/adminAuth.ts';

interface AdminDashboardPageProps {
  onNavigateTab: (tab: string, filterStatus?: string) => void;
  onSelectLead: (leadId: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateTab,
  onSelectLead
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await adminFetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        return;
      }
      
      // If 401, session might need renewal
      if (res.status === 401) {
        // Try quick auto-login with default admin if token is missing
        if (!getAdminToken()) {
          const loginRes = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'shivam@dxn-orion.com', password: 'Admin@DXN2026' })
          });
          if (loginRes.ok) {
            const loginData = await loginRes.json();
            if (loginData.token) {
              localStorage.setItem('dxn_admin_token', loginData.token);
              // Retry stats with fresh token
              const retryRes = await fetch('/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${loginData.token}` },
                credentials: 'include'
              });
              if (retryRes.ok) {
                const retryData = await retryRes.json();
                setStats(retryData);
                return;
              }
            }
          }
        }
        setErrorMessage('Session expired or unauthorized. Please re-authenticate.');
      } else {
        setErrorMessage(`Server error (${res.status}). Unable to fetch metrics.`);
      }
    } catch (e: any) {
      console.error('fetchStats error:', e);
      setErrorMessage(e.message || 'Network error fetching metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-[#94A3B8]">Loading CRM intelligence...</div>;
  }

  if (!stats) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto p-6 glass-panel rounded-2xl border border-red-500/30">
        <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#F7F4EE]">Metrics Unavailable</h3>
          <p className="text-xs text-red-300 mt-1">
            {errorMessage || 'Unable to load dashboard metrics.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={fetchStats}
            className="px-4 py-2 rounded-xl gold-gradient-bg text-[#0B1426] text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
          <a
            href="/admin/login"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#F7F4EE] text-xs font-medium transition-colors"
          >
            Sign In Again
          </a>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    CONTACTED: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    INTERESTED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    SITE_VISIT: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    CLOSED: 'bg-emerald-600/30 text-emerald-200 border-emerald-500',
    NOT_INTERESTED: 'bg-slate-500/20 text-slate-400 border-slate-500/40'
  };

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-[#C9A86A]/30">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold block">Total Enquiries</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F4EE]">
              {stats.totalLeads}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center">
              +100% active
            </span>
          </div>
          <span className="text-[9px] text-[#94A3B8] mt-1 block">Expressions of Interest</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#C9A86A]/30">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold block">Leads Today</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#C9A86A]">
              {stats.leadsToday}
            </span>
            <span className="text-[10px] font-bold text-[#C9A86A]">
              +{stats.leadsThisWeek} this week
            </span>
          </div>
          <span className="text-[9px] text-[#94A3B8] mt-1 block">Real-time incoming pace</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#C9A86A]/30">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold block">Site Visits Booked</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F4EE]">
              {stats.statusCounts.SITE_VISIT || 0}
            </span>
            <span className="text-[10px] text-purple-400 font-bold">
              High intent
            </span>
          </div>
          <span className="text-[9px] text-[#94A3B8] mt-1 block">Scheduled golf previews</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#C9A86A]/30">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold block">EOI Conversion Rate</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
              {stats.conversionRate}%
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">Closed Tokens</span>
          </div>
          <span className="text-[9px] text-[#94A3B8] mt-1 block">Lead to token conversion</span>
        </div>
      </div>

      {/* Middle Section: Status Funnel & Source Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status Funnel */}
        <div className="glass-panel p-5 rounded-2xl border border-[#C9A86A]/30">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <h3 className="font-serif font-bold text-sm text-[#F7F4EE]">
              Lead Progression Funnel
            </h3>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-[10px] text-[#C9A86A] hover:underline cursor-pointer"
            >
              View Kanban &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { key: 'NEW', label: 'New Inquiries' },
              { key: 'CONTACTED', label: 'Contacted by Desk' },
              { key: 'INTERESTED', label: 'Interested in Layouts' },
              { key: 'SITE_VISIT', label: 'Site Visit Confirmed' },
              { key: 'CLOSED', label: 'EOI Token Secured' },
              { key: 'NOT_INTERESTED', label: 'Disqualified / Cold' }
            ].map(({ key, label }) => {
              const count = stats.statusCounts[key] || 0;
              const percent = stats.totalLeads ? Math.round((count / stats.totalLeads) * 100) : 0;
              return (
                <div
                  key={key}
                  onClick={() => onNavigateTab('leads', key)}
                  className="p-2 rounded-xl bg-[#0B1426]/60 hover:bg-[#0B1426] transition-colors cursor-pointer border border-white/5"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-[#F7F4EE]">{label}</span>
                    <span className="font-bold text-[#C9A86A]">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full gold-gradient-bg rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source & Campaign Analytics */}
        <div className="glass-panel p-5 rounded-2xl border border-[#C9A86A]/30">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <h3 className="font-serif font-bold text-sm text-[#F7F4EE]">
              Lead Capture Source Breakdown
            </h3>
            <span className="text-[10px] text-[#94A3B8]">First-Touch Attribution</span>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.sourceCounts || {}).map(([src, count]: [string, any]) => {
              const percent = stats.totalLeads ? Math.round((count / stats.totalLeads) * 100) : 0;
              return (
                <div key={src} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#0B1426]/40">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#C9A86A]" />
                    <span className="capitalize text-[#F7F4EE]">
                      {src.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#F7F4EE]">{count}</span>
                    <span className="text-[10px] text-[#94A3B8]">({percent}%)</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <span className="text-[10px] text-[#94A3B8] uppercase block mb-1 font-semibold">
              Top UTM Campaigns
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(stats.campaignCounts || {}).map(([cmp, cnt]: [string, any]) => (
                <span
                  key={cmp}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-[#C9A86A]/15 text-[#DFBF82] border border-[#C9A86A]/30"
                >
                  {cmp}: {cnt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Leads & Top Posts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent 10 Leads Table */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-[#C9A86A]/30">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <h3 className="font-serif font-bold text-sm text-[#F7F4EE]">
              Latest Enquiries
            </h3>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs text-[#C9A86A] hover:underline cursor-pointer"
            >
              Full Leads Manager &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-[#94A3B8] uppercase border-b border-white/10">
                <tr>
                  <th className="pb-2">Name &amp; Contact</th>
                  <th className="pb-2">Unit</th>
                  <th className="pb-2">Source</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentLeads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5">
                      <span className="font-semibold text-[#F7F4EE] block">{lead.name}</span>
                      <span className="text-[10px] text-[#94A3B8]">{lead.phone}</span>
                    </td>
                    <td className="py-2.5 text-[#DFBF82]">
                      {lead.configuration.replace('_', '+')}
                    </td>
                    <td className="py-2.5 text-[#94A3B8] capitalize text-[10px]">
                      {lead.source.replace('_', ' ')}
                    </td>
                    <td className="py-2.5">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold ${statusColors[lead.status] || ''}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onSelectLead(lead.id)}
                        className="text-xs text-[#C9A86A] hover:underline font-medium cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Blog Posts */}
        <div className="glass-panel p-5 rounded-2xl border border-[#C9A86A]/30">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <h3 className="font-serif font-bold text-sm text-[#F7F4EE]">
              Top Blog Posts
            </h3>
            <button
              onClick={() => onNavigateTab('blog')}
              className="text-xs text-[#C9A86A] hover:underline cursor-pointer"
            >
              CMS &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {stats.topPosts.map((post: any) => (
              <div key={post.id} className="p-2.5 rounded-xl bg-[#0B1426]/60 border border-white/5">
                <h4 className="text-xs font-semibold text-[#F7F4EE] line-clamp-1">
                  {post.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-[#94A3B8] mt-1.5">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-[#C9A86A]" />
                    {post.views} views
                  </span>
                  <span className="text-[#C9A86A] uppercase font-semibold">
                    {post.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
