import React, { useState } from 'react';
import {
  LayoutDashboard, Users, FileText, Compass, Settings, LogOut,
  ExternalLink, Shield, Sparkles
} from 'lucide-react';
import { AdminDashboardPage } from './AdminDashboardPage.tsx';
import { AdminLeadsPage } from './AdminLeadsPage.tsx';
import { AdminBlogEditorPage } from './AdminBlogEditorPage.tsx';
import { AdminRedirectsPage } from './AdminRedirectsPage.tsx';
import { AdminSettingsPage } from './AdminSettingsPage.tsx';
import { AdminSeoPage } from './AdminSeoPage.tsx';
import { SiteSettings } from '../../types/index.ts';

interface AdminLayoutProps {
  user: any;
  onLogout: () => void;
  onNavigatePublic: (path: string) => void;
  onSettingsUpdated: (settings: SiteSettings) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  onLogout,
  onNavigatePublic,
  onSettingsUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'blog' | 'seo' | 'redirects' | 'settings'>('dashboard');
  const [initialLeadStatus, setInitialLeadStatus] = useState<string | undefined>(undefined);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const handleNavigateTab = (tab: string, filterStatus?: string) => {
    setActiveTab(tab as any);
    if (filterStatus) {
      setInitialLeadStatus(filterStatus);
    }
  };

  const handleSelectLeadFromDash = (leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab('leads');
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'leads', label: 'Leads & CRM', icon: Users },
    { key: 'blog', label: 'Blog & SEO Studio', icon: FileText },
    { key: 'seo', label: 'SEO & Backlinks Hub', icon: Sparkles },
    { key: 'redirects', label: 'Redirects (301)', icon: Compass },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B1426] text-[#F7F4EE]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0B1426]/95 backdrop-blur-md border-b border-[#C9A86A]/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-[#C9A86A] flex items-center justify-center bg-[#C9A86A]/10">
              <span className="font-serif font-bold text-[#C9A86A] text-xs">DO</span>
            </div>
            <div>
              <span className="text-sm font-serif font-bold tracking-wider uppercase text-[#F7F4EE]">
                DXN Orion <span className="text-[10px] text-[#C9A86A] font-sans font-semibold">CRM Panel</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <button
              onClick={() => onNavigatePublic('/')}
              className="hidden sm:flex items-center gap-1.5 text-[#94A3B8] hover:text-[#C9A86A] transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/10">
              <span className="font-semibold text-[#F7F4EE]">{user.name || user.email}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C9A86A]/20 text-[#DFBF82] font-bold">
                {user.role || 'ADMIN'}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 border-b border-white/10 pb-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key as any);
                  if (item.key === 'leads') {
                    setInitialLeadStatus('ALL');
                    setSelectedLeadId(null);
                  }
                }}
                className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'gold-gradient-bg text-[#0B1426] shadow-md shadow-[#C9A86A]/20 font-bold'
                    : 'glass-panel text-[#F7F4EE] hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'dashboard' && (
            <AdminDashboardPage
              onNavigateTab={handleNavigateTab}
              onSelectLead={handleSelectLeadFromDash}
            />
          )}

          {activeTab === 'leads' && (
            <AdminLeadsPage
              initialStatusFilter={initialLeadStatus}
              selectedLeadId={selectedLeadId}
              onClearSelectedLead={() => setSelectedLeadId(null)}
            />
          )}

          {activeTab === 'blog' && (
            <AdminBlogEditorPage
              onNavigatePublic={onNavigatePublic}
            />
          )}

          {activeTab === 'seo' && (
            <AdminSeoPage />
          )}

          {activeTab === 'redirects' && (
            <AdminRedirectsPage />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsPage
              onSettingsUpdated={onSettingsUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
};
