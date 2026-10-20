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
    <div className="min-h-screen bg-white text-[#111827]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white backdrop-blur-md border-b border-[#E5E7EB] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-[#0E4D92] flex items-center justify-center bg-[#EAF1FB]">
              <span className="font-bold text-[#0E4D92] text-xs">DO</span>
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider uppercase text-[#111827]">
                DXN Orion <span className="text-[10px] text-[#0E4D92] font-sans font-semibold">CRM Panel</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <button
              onClick={() => onNavigatePublic('/')}
              className="hidden sm:flex items-center gap-1.5 text-[#4B5563] hover:text-[#0E4D92] transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#F4F6FA] border border-[#E5E7EB]">
              <span className="font-semibold text-[#111827]">{user.name || user.email}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#EAF1FB] text-[#0E4D92] font-bold">
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
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 border-b border-[#E5E7EB] pb-3">
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
                    ? 'gold-gradient-bg text-white shadow-md shadow-black/5 font-bold'
                    : 'glass-panel text-[#111827] hover:bg-[#F4F6FA]'
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
