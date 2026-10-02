import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Filter, Download, Trash2, CheckCircle2, Phone, MessageCircle,
  Calendar, Clock, User, X, Plus, ChevronRight, LayoutGrid, List,
  Send, ExternalLink, AlertCircle, ArrowUpDown, RefreshCw, Bell, Sparkles
} from 'lucide-react';
import { Lead, LeadStatus, LeadConfiguration, LeadSource, LeadActivity } from '../../types/index.ts';
import { adminFetch } from '../../utils/adminAuth.ts';

interface AdminLeadsPageProps {
  initialStatusFilter?: string;
  selectedLeadId?: string | null;
  onClearSelectedLead?: () => void;
}

export const AdminLeadsPage: React.FC<AdminLeadsPageProps> = ({
  initialStatusFilter,
  selectedLeadId,
  onClearSelectedLead
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [newLeadAlert, setNewLeadAlert] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const prevLeadsCount = useRef<number>(0);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || 'ALL');
  const [configFilter, setConfigFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer / Detail modal
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'NOTE' | 'CALL' | 'WHATSAPP'>('NOTE');

  // Update status filter if initialStatusFilter changes (e.g. from Dashboard KPI click)
  useEffect(() => {
    if (initialStatusFilter) {
      setStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  // Initial fetch and filter changes
  useEffect(() => {
    fetchLeads(true);
  }, [statusFilter, configFilter, sourceFilter]);

  // Real-time live auto-poll every 6 seconds so incoming leads appear automatically
  useEffect(() => {
    const timer = setInterval(() => {
      fetchLeads(false);
    }, 6000);
    return () => clearInterval(timer);
  }, [statusFilter, configFilter, sourceFilter, search]);

  useEffect(() => {
    if (selectedLeadId && leads.length > 0) {
      const match = leads.find(l => l.id === selectedLeadId);
      if (match) openLeadDrawer(match);
    }
  }, [selectedLeadId, leads]);

  const fetchLeads = async (isManual = false) => {
    if (isManual) {
      setRefreshing(true);
    }
    try {
      let url = '/api/leads?limit=100';
      if (statusFilter !== 'ALL') url += `&status=${statusFilter}`;
      if (configFilter !== 'ALL') url += `&configuration=${configFilter}`;
      if (sourceFilter !== 'ALL') url += `&source=${sourceFilter}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const res = await adminFetch(url);
      if (res.ok) {
        const data = await res.json();
        const incoming: Lead[] = data.leads || [];

        // Detect newly arrived lead on background poll
        if (prevLeadsCount.current > 0 && incoming.length > prevLeadsCount.current) {
          const newest = incoming[0];
          setNewLeadAlert(`New enquiry from ${newest.name} (${newest.phone}) just received!`);
          setTimeout(() => setNewLeadAlert(null), 8000);
        }
        prevLeadsCount.current = incoming.length;

        setLeads(incoming);
        setLastSynced(new Date());
      }
    } catch (e) {
      console.error('Failed to load leads:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openLeadDrawer = async (lead: Lead) => {
    setActiveLead(lead);
    try {
      const res = await adminFetch(`/api/leads/${lead.id}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch (e) {}
  };

  const closeLeadDrawer = () => {
    setActiveLead(null);
    if (onClearSelectedLead) onClearSelectedLead();
  };

  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await adminFetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(leads.map(l => (l.id === leadId ? updated : l)));
        if (activeLead && activeLead.id === leadId) {
          setActiveLead(updated);
          // Refresh activities
          const actRes = await adminFetch(`/api/leads/${leadId}`);
          if (actRes.ok) {
            const data = await actRes.json();
            setActivities(data.activities || []);
          }
        }
      }
    } catch (e) {}
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead || !newNote.trim()) return;

    try {
      const res = await adminFetch(`/api/leads/${activeLead.id}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: noteType, content: newNote.trim() })
      });
      if (res.ok) {
        const act = await res.json();
        setActivities([act, ...activities]);
        setNewNote('');
      }
    } catch (e) {}
  };

  const handleBulkStatus = async (status: LeadStatus) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await adminFetch('/api/leads/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'STATUS_CHANGE', ids: selectedIds, status })
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchLeads();
      }
    } catch (e) {}
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to permanently delete ${selectedIds.length} leads?`)) return;

    try {
      const res = await adminFetch('/api/leads/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE', ids: selectedIds })
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchLeads();
      }
    } catch (e) {}
  };

  const statusList: LeadStatus[] = ['NEW', 'CONTACTED', 'INTERESTED', 'SITE_VISIT', 'CLOSED', 'NOT_INTERESTED'];

  const statusBadge = (st: LeadStatus) => {
    const map: Record<LeadStatus, string> = {
      NEW: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      CONTACTED: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      INTERESTED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      SITE_VISIT: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      CLOSED: 'bg-emerald-600/30 text-emerald-200 border-emerald-500',
      NOT_INTERESTED: 'bg-slate-500/20 text-slate-400 border-slate-500/40'
    };
    return (
      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold ${map[st]}`}>
        {st}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[#C9A86A]/30 flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#C9A86A]" />
          <input
            type="text"
            placeholder="Search name, phone, email, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
            className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F7F4EE] placeholder-[#94A3B8] focus:border-[#C9A86A] focus:outline-none"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0B1426] border border-[#C9A86A]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#F7F4EE] focus:border-[#C9A86A] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            {statusList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={configFilter}
            onChange={(e) => setConfigFilter(e.target.value)}
            className="bg-[#0B1426] border border-[#C9A86A]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#F7F4EE] focus:border-[#C9A86A] focus:outline-none"
          >
            <option value="ALL">All Units</option>
            <option value="3BHK">3 BHK</option>
            <option value="3BHK_SERVANT">3 BHK+S</option>
            <option value="4BHK_SERVANT">4 BHK+S</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-[#0B1426] border border-[#C9A86A]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#F7F4EE] focus:border-[#C9A86A] focus:outline-none"
          >
            <option value="ALL">All Sources</option>
            <option value="hero_form">Hero Form</option>
            <option value="modal">Brochure Modal</option>
            <option value="floor_plans">Floor Plans</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="blog_cta">Blog CTA</option>
            <option value="contact_page">Contact Page</option>
          </select>

          {/* View Toggle */}
          <div className="flex rounded-xl border border-[#C9A86A]/30 bg-[#0B1426] overflow-hidden p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#C9A86A] text-[#0B1426]' : 'text-[#94A3B8] hover:text-[#F7F4EE]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'kanban' ? 'bg-[#C9A86A] text-[#0B1426]' : 'text-[#94A3B8] hover:text-[#F7F4EE]'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Refresh Leads Button */}
          <button
            onClick={() => fetchLeads(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#C9A86A]/20 hover:bg-[#C9A86A]/30 border border-[#C9A86A]/50 text-[#DFBF82] text-xs font-semibold cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            title="Refresh Leads Immediately"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#C9A86A]' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          {/* Export CSV */}
          <a
            href="/api/leads/export"
            download
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-[#C9A86A]/40 text-[#C9A86A] hover:bg-[#C9A86A]/10 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </a>
        </div>
      </div>

      {/* Live Sync Status & New Lead Toast Banner */}
      <div className="flex items-center justify-between px-1 text-[11px] text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-medium">Live Sync Active</span>
          <span>•</span>
          <span>Auto-checks every 6s</span>
          <span>•</span>
          <span>Last synced: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        <div className="text-[11px] text-[#DFBF82]">
          Showing <span className="font-bold text-[#F7F4EE]">{leads.length}</span> lead{leads.length !== 1 ? 's' : ''}
        </div>
      </div>

      {newLeadAlert && (
        <div className="glass-panel p-3.5 rounded-2xl border border-emerald-500 bg-emerald-500/10 flex items-center justify-between text-xs text-emerald-200 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span className="font-semibold text-white">{newLeadAlert}</span>
          </div>
          <button
            onClick={() => setNewLeadAlert(null)}
            className="p-1 hover:bg-emerald-500/20 rounded-lg text-emerald-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bulk Actions Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="glass-panel p-3 rounded-xl border border-[#C9A86A] flex items-center justify-between text-xs animate-in fade-in">
          <span className="text-[#F7F4EE] font-medium">
            {selectedIds.length} leads selected
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#94A3B8]">Set status:</span>
            <select
              onChange={(e) => e.target.value && handleBulkStatus(e.target.value as LeadStatus)}
              className="bg-[#0B1426] border border-white/20 rounded-lg px-2 py-1 text-[11px] text-[#F7F4EE]"
              defaultValue=""
            >
              <option value="" disabled>Change status to...</option>
              {statusList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={handleBulkDelete}
              className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/40 border border-red-500/30"
              title="Delete Selected"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content: Table or Kanban */}
      {viewMode === 'table' ? (
        <div className="glass-panel rounded-2xl border border-[#C9A86A]/30 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1426]/80 text-[10px] text-[#94A3B8] uppercase border-b border-white/10">
                <tr>
                  <th className="p-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === leads.length && leads.length > 0}
                      onChange={(e) => setSelectedIds(e.target.checked ? leads.map(l => l.id) : [])}
                    />
                  </th>
                  <th className="p-3">Lead &amp; Contact</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Source &amp; Campaign</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => {
                  const isChecked = selectedIds.includes(lead.id);
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => openLeadDrawer(lead)}
                    >
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds([...selectedIds, lead.id]);
                            else setSelectedIds(selectedIds.filter(id => id !== lead.id));
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-[#F7F4EE] block">{lead.name}</span>
                        <div className="flex items-center gap-2 text-[10px] text-[#94A3B8]">
                          <span>+91 {lead.phone}</span>
                          {lead.email && <span>• {lead.email}</span>}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-[#C9A86A] font-semibold">
                          {lead.configuration.replace('_', '+')}
                        </span>
                        {lead.budget && (
                          <span className="text-[10px] text-[#94A3B8] block">{lead.budget}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="capitalize text-[11px] text-[#F7F4EE] block">
                          {lead.source.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">
                          {lead.utmCampaign || 'organic'}
                        </span>
                      </td>
                      <td className="p-3 text-[10px] text-[#94A3B8]">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                          className="bg-[#0B1426] border border-white/20 rounded-lg px-2 py-1 text-[10px] text-[#F7F4EE] focus:border-[#C9A86A]"
                        >
                          {statusList.map(st => <option key={st} value={st}>{st}</option>)}
                        </select>
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`tel:+91${lead.phone}`}
                            className="p-1 rounded bg-[#0B1426] border border-white/10 text-[#C9A86A] hover:bg-[#C9A86A]/20"
                            title="Call Lead"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/91${lead.phone}?text=${encodeURIComponent(`Hi ${lead.name}, thank you for your interest in DXN Orion Sector 22D Yamuna Expressway. I am reaching out from the sales desk to share the floor plans & price list.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-[#075E54]/30 border border-[#25D366]/30 text-[#25D366] hover:bg-[#075E54]/50"
                            title="WhatsApp Lead"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statusList.map((colStatus) => {
            const colLeads = leads.filter(l => l.status === colStatus);
            return (
              <div
                key={colStatus}
                className="glass-panel rounded-2xl p-3 border border-[#C9A86A]/20 flex flex-col h-[75vh]"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <span className="text-[10px] font-bold text-[#F7F4EE] uppercase tracking-wider">
                    {colStatus.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold text-[#C9A86A] bg-[#C9A86A]/10 px-1.5 py-0.5 rounded">
                    {colLeads.length}
                  </span>
                </div>

                <div className="space-y-2 overflow-y-auto pr-1 flex-1">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => openLeadDrawer(lead)}
                      className="p-3 rounded-xl bg-[#0B1426]/90 border border-white/10 hover:border-[#C9A86A] transition-all cursor-pointer shadow-md text-xs space-y-1.5"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-[#F7F4EE]">{lead.name}</span>
                        <span className="text-[9px] text-[#C9A86A] font-bold">
                          {lead.configuration.replace('_', '+')}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#94A3B8]">{lead.phone}</p>
                      <div className="flex items-center justify-between text-[9px] text-[#94A3B8] pt-1 border-t border-white/5">
                        <span className="capitalize">{lead.source.replace('_', ' ')}</span>
                        <span>{new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lead Detail Drawer Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0B1426] border-l border-[#C9A86A]/40 h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] text-[#C9A86A] uppercase font-bold tracking-wider">
                  Lead Dossier #{activeLead.id}
                </span>
                <h2 className="text-xl font-serif font-bold text-[#F7F4EE] mt-0.5">
                  {activeLead.name}
                </h2>
              </div>
              <button
                onClick={closeLeadDrawer}
                className="w-8 h-8 rounded-full bg-white/10 text-[#F7F4EE] flex items-center justify-center hover:bg-white/20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions (Call & WhatsApp) */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:+91${activeLead.phone}`}
                className="py-2.5 px-3 rounded-xl bg-[#111D36] border border-[#C9A86A]/40 text-[#F7F4EE] hover:text-[#C9A86A] flex items-center justify-center gap-2 text-xs font-semibold"
              >
                <Phone className="w-4 h-4 text-[#C9A86A]" />
                <span>Call Lead Desk</span>
              </a>

              <a
                href={`https://wa.me/91${activeLead.phone}?text=${encodeURIComponent(`Hi ${activeLead.name}, this is the official sales desk for DXN Orion Sector 22D Yamuna Expressway. I am sharing the requested floor plans and pre-launch price matrix.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#075E54] border border-[#25D366]/40 text-[#F7F4EE] flex items-center justify-center gap-2 text-xs font-semibold shadow-lg"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Open WhatsApp</span>
              </a>
            </div>

            {/* Lead Status & Attributes */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Status:</span>
                <select
                  value={activeLead.status}
                  onChange={(e) => handleUpdateStatus(activeLead.id, e.target.value as LeadStatus)}
                  className="bg-[#0B1426] border border-[#C9A86A]/40 rounded-lg px-2.5 py-1 text-xs text-[#F7F4EE] font-semibold"
                >
                  {statusList.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Configuration:</span>
                <span className="font-bold text-[#C9A86A]">
                  {activeLead.configuration.replace('_', '+')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Phone:</span>
                <span className="font-semibold text-[#F7F4EE]">+91 {activeLead.phone}</span>
              </div>

              {activeLead.email && (
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Email:</span>
                  <span className="font-semibold text-[#F7F4EE]">{activeLead.email}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Source / Landing:</span>
                <span className="capitalize text-[#F7F4EE]">
                  {activeLead.source.replace('_', ' ')} ({activeLead.landingPage})
                </span>
              </div>

              {activeLead.utmCampaign && (
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Campaign:</span>
                  <span className="text-[#DFBF82]">{activeLead.utmCampaign}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-[#94A3B8] pt-2 border-t border-white/10">
                <span>Received At:</span>
                <span>{new Date(activeLead.createdAt).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Activities & Notes Timeline */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-sm text-[#F7F4EE] flex items-center justify-between">
                <span>Activity &amp; Relationship History</span>
                <span className="text-[10px] text-[#C9A86A]">{activities.length} entries</span>
              </h3>

              {/* Add Note / Activity Form */}
              <form onSubmit={handleAddActivity} className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value as any)}
                    className="bg-[#111D36] border border-[#C9A86A]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#F7F4EE]"
                  >
                    <option value="NOTE">Internal Note</option>
                    <option value="CALL">Call Logged</option>
                    <option value="WHATSAPP">WhatsApp Sent</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Log conversation details or client preference..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 bg-[#111D36] border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE] placeholder-[#94A3B8] focus:border-[#C9A86A] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="py-1.5 px-3 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Activity Feed */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {activities.map((act) => (
                  <div key={act.id} className="p-3 rounded-xl bg-[#111D36]/80 border border-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                      <span className="font-bold text-[#C9A86A]">{act.type}</span>
                      <span>{new Date(act.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[#F7F4EE] leading-relaxed">{act.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
