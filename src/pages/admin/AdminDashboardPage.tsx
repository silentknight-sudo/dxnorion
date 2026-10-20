import React, { useEffect, useState } from 'react';
import {
  Users, TrendingUp, Calendar, CheckCircle2, ArrowUpRight,
  Filter, FileText, Eye, Clock, Phone, Sparkles, RefreshCw, AlertCircle
} from 'lucide-react';
import { LeadStatus } from '../../types/index.ts';
import { adminFetch, getAdminToken, safeJson } from '../../utils/adminAuth.ts';
import { firestoreService } from '../../lib/firestoreService.ts';

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
    fetchStats(true);
    const interval = setInterval(() => {
      fetchStats(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    setErrorMessage(null);
    try {
      const res = await adminFetch('/api/admin/stats');
      const { ok, data, error } = await safeJson(res);
      if (ok && data) {
        setStats(data);
        return;
      }
      
      // Fallback: Compute metrics directly from Firebase Firestore leads
      try {
        const firestoreLeads = await firestoreService.getLeads();
        const valid = firestoreLeads.filter(l => 
          l.name && !['Vikram Malhotra', 'Ananya Deshmukh', 'Col. Rajeshwar Singh (Retd.)', 'Kavita Chawla', 'Deepak Agrawal', 'Test User', 'TEST', 'Test'].includes(l.name)
        );
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const weekStart = now.getTime() - 7 * 24 * 60 * 60 * 1000;
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        const statusCounts: Record<LeadStatus, number> = {
          NEW: 0, CONTACTED: 0, INTERESTED: 0, SITE_VISIT: 0, CLOSED: 0, NOT_INTERESTED: 0
        };
        valid.forEach(l => {
          if (statusCounts[l.status] !== undefined) statusCounts[l.status]++;
        });

        const fallbackStats = {
          totalLeads: valid.length,
          leadsToday: valid.filter(l => new Date(l.createdAt).getTime() >= todayStart).length,
          leadsThisWeek: valid.filter(l => new Date(l.createdAt).getTime() >= weekStart).length,
          leadsThisMonth: valid.filter(l => new Date(l.createdAt).getTime() >= monthStart).length,
          conversionRate: valid.length ? Math.round((statusCounts.CLOSED / valid.length) * 100) : 0,
          statusCounts,
          sourceCounts: {},
          campaignCounts: {},
          recentLeads: valid.slice(0, 10),
          topPosts: []
        };
        setStats(fallbackStats);
        return;
      } catch (cloudErr) {
        console.warn('Firestore fallback stats warning:', cloudErr);
      }

      if (res.status === 401) {
        setErrorMessage('Session expired or unauthorized. Please re-authenticate.');
      } else {
        setErrorMessage(error || `Server status ${res.status}.`);
      }
    } catch (e: any) {
      console.error('fetchStats error:', e);
      setErrorMessage(e.message || 'Error fetching metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-[#4B5563]">Loading CRM intelligence...</div>;
  }

  if (!stats) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto p-6 glass-panel rounded-2xl border border-red-500/30">
        <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#111827]">Metrics Unavailable</h3>
          <p className="text-xs text-red-300 mt-1">
            {errorMessage || 'Unable to load dashboard metrics.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => fetchStats(true)}
            className="px-4 py-2 rounded-xl gold-gradient-bg text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
          <a
            href="/admin/login"
            className="px-4 py-2 rounded-xl bg-[#F4F6FA] hover:bg-[#F4F6FA] text-[#111827] text-xs font-medium transition-colors"
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
    CLOSED: 'bg-emerald-600/30 text-emerald-700 border-emerald-500',
    NOT_INTERESTED: 'bg-slate-500/20 text-slate-400 border-slate-500/40'
  };

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-[#E5E7EB]">
          <span className="text-[10px] text-[#4B5563] uppercase font-semibold block">Total Enquiries</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#111827]">
              {stats.totalLeads}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center">
              +100% active
            </span>
          </div>
          <span className="text-[9px] text-[#4B5563] mt-1 block">Expressions of Interest</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#E5E7EB]">
          <span className="text-[10px] text-[#4B5563] uppercase font-semibold block">Leads Today</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#0E4D92]">
              {stats.leadsToday}
            </span>
            <span className="text-[10px] font-bold text-[#0E4D92]">
              +{stats.leadsThisWeek} this week
            </span>
          </div>
          <span className="text-[9px] text-[#4B5563] mt-1 block">Real-time incoming pace</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#E5E7EB]">
          <span className="text-[10px] text-[#4B5563] uppercase font-semibold block">Site Visits Booked</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#111827]">
              {stats.statusCounts.SITE_VISIT || 0}
            </span>
            <span className="text-[10px] text-purple-400 font-bold">
              High intent
            </span>
          </div>
          <span className="text-[9px] text-[#4B5563] mt-1 block">Scheduled golf previews</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#E5E7EB]">
          <span className="text-[10px] text-[#4B5563] uppercase font-semibold block">EOI Conversion Rate</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400">
              {stats.conversionRate}%
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">Closed Tokens</span>
          </div>
          <span className="text-[9px] text-[#4B5563] mt-1 block">Lead to token conversion</span>
        </div>
      </div>

      {/* Middle Section: Status Funnel & Source Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status Funnel */}
        <div className="glass-panel p-5 rounded-2xl border border-[#E5E7EB]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-3">
            <h3 className="font-bold text-sm text-[#111827]">
              Lead Progression Funnel
            </h3>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-[10px] text-[#0E4D92] hover:underline cursor-pointer"
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
                  className="p-2 rounded-xl bg-white/60 hover:bg-white transition-colors cursor-pointer border border-[#E5E7EB]"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-[#111827]">{label}</span>
                    <span className="font-bold text-[#0E4D92]">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#F4F6FA] overflow-hidden">
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
        <div className="glass-panel p-5 rounded-2xl border border-[#E5E7EB]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-3">
            <h3 className="font-bold text-sm text-[#111827]">
              Lead Capture Source Breakdown
            </h3>
            <span className="text-[10px] text-[#4B5563]">First-Touch Attribution</span>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.sourceCounts || {}).map(([src, count]: [string, any]) => {
              const percent = stats.totalLeads ? Math.round((count / stats.totalLeads) * 100) : 0;
              return (
                <div key={src} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/40">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#F26522]" />
                    <span className="capitalize text-[#111827]">
                      {src.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111827]">{count}</span>
                    <span className="text-[10px] text-[#4B5563]">({percent}%)</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
            <span className="text-[10px] text-[#4B5563] uppercase block mb-1 font-semibold">
              Top UTM Campaigns
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(stats.campaignCounts || {}).map(([cmp, cnt]: [string, any]) => (
                <span
                  key={cmp}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-[#EAF1FB] text-[#0E4D92] border border-[#E5E7EB]"
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
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-[#E5E7EB]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-3">
            <h3 className="font-bold text-sm text-[#111827]">
              Latest Enquiries
            </h3>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs text-[#0E4D92] hover:underline cursor-pointer"
            >
              Full Leads Manager &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-[#4B5563] uppercase border-b border-[#E5E7EB]">
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
                  <tr key={lead.id} className="hover:bg-[#F4F6FA] transition-colors">
                    <td className="py-2.5">
                      <span className="font-semibold text-[#111827] block">{lead.name}</span>
                      <span className="text-[10px] text-[#4B5563]">{lead.phone}</span>
                    </td>
                    <td className="py-2.5 text-[#0E4D92]">
                      {lead.configuration.replace('_', '+')}
                    </td>
                    <td className="py-2.5 text-[#4B5563] capitalize text-[10px]">
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
                        className="text-xs text-[#0E4D92] hover:underline font-medium cursor-pointer"
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
        <div className="glass-panel p-5 rounded-2xl border border-[#E5E7EB]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-3">
            <h3 className="font-bold text-sm text-[#111827]">
              Top Blog Posts
            </h3>
            <button
              onClick={() => onNavigateTab('blog')}
              className="text-xs text-[#0E4D92] hover:underline cursor-pointer"
            >
              CMS &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {stats.topPosts.map((post: any) => (
              <div key={post.id} className="p-2.5 rounded-xl bg-white/60 border border-[#E5E7EB]">
                <h4 className="text-xs font-semibold text-[#111827] line-clamp-1">
                  {post.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-[#4B5563] mt-1.5">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-[#0E4D92]" />
                    {post.views} views
                  </span>
                  <span className="text-[#0E4D92] uppercase font-semibold">
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
