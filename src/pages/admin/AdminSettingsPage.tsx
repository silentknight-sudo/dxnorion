import React, { useState, useEffect } from 'react';
import { Save, Lock, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { SiteSettings } from '../../types/index.ts';
import { adminFetch, safeJson } from '../../utils/adminAuth.ts';
import { firestoreService } from '../../lib/firestoreService.ts';

interface AdminSettingsPageProps {
  onSettingsUpdated: (settings: SiteSettings) => void;
}

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ onSettingsUpdated }) => {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'DXN Orion',
    phone: '+917217227777',
    whatsappNumber: '+917217227777',
    email: 'sales@dxn-orion.com',
    reraNumber: 'UPRERA-PRJ-2025-APP-88492',
    ga4Id: 'G-DXNORION22D',
    metaPixelId: '7849102938471',
    googleAdsId: 'AW-984029182',
    gscVerification: 'google-site-verification=dxn_orion_yamuna_exp_sec22d',
    updatedAt: new Date().toISOString()
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwStatus, setPwStatus] = useState<string | null>(null);

  useEffect(() => {
    // 1. Load directly from Firebase Firestore
    firestoreService.getSettings().then(cloudSettings => {
      if (cloudSettings) {
        setSettings(cloudSettings);
        onSettingsUpdated(cloudSettings);
      }
    }).catch(console.warn);

    // 2. Real-time Firestore sync
    const unsubscribe = firestoreService.subscribeToSettings((liveSettings) => {
      if (liveSettings) {
        setSettings(liveSettings);
        onSettingsUpdated(liveSettings);
      }
    });

    // 3. Fallback check from API with safeJson
    fetch('/api/settings')
      .then(safeJson)
      .then(({ ok, data }) => {
        if (ok && data) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const updated = {
        ...settings,
        updatedAt: new Date().toISOString()
      };

      // 1. Direct Firebase Firestore save
      await firestoreService.saveSettings(updated);

      // 2. Server API sync with safeJson
      try {
        const res = await adminFetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        const { ok, data } = await safeJson(res);
        if (ok && data) {
          setSettings(data);
          onSettingsUpdated(data);
        } else {
          setSettings(updated);
          onSettingsUpdated(updated);
        }
      } catch {
        setSettings(updated);
        onSettingsUpdated(updated);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e: any) {
      console.error('Error saving settings:', e);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwStatus(null);

    if (newPassword.length < 8) {
      setPwStatus('Error: Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwStatus('Error: Passwords do not match.');
      return;
    }

    try {
      const res = await adminFetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      });
      const { ok, data, error } = await safeJson(res);
      if (ok) {
        setPwStatus('Success: Admin password updated successfully.');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwStatus(`Error: ${error || data?.error || 'Failed to update password'}`);
      }
    } catch {
      setPwStatus('Error updating password.');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="pb-3 border-b border-white/10">
        <h2 className="font-serif font-bold text-xl text-[#F7F4EE]">
          Site Configuration, Compliance &amp; Tracking
        </h2>
        <p className="text-xs text-[#94A3B8]">
          Configure public sales hotline, UP RERA registration number, and digital marketing tracking tags.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="glass-panel p-6 rounded-3xl border border-[#C9A86A]/30 space-y-4">
        <h3 className="font-serif font-bold text-base text-[#F7F4EE]">
          General &amp; Compliance Details
        </h3>

        {savedSuccess && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Settings saved successfully. Changes are now reflected live across all public pages!</span>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase block mb-1 font-semibold">
              Project Display Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase block mb-1 font-semibold">
              UP RERA Registration Number
            </label>
            <input
              type="text"
              value={settings.reraNumber}
              onChange={(e) => setSettings({ ...settings, reraNumber: e.target.value })}
              className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#C9A86A] font-bold"
            />
            <span className="text-[9px] text-[#94A3B8]">Displayed on header, footer &amp; legal disclaimer</span>
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase block mb-1 font-semibold">
              Official Sales Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase block mb-1 font-semibold">
              Sales Desk WhatsApp Number
            </label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] text-[#94A3B8] uppercase block mb-1 font-semibold">
              Official Enquiry Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
            />
          </div>
        </div>

        <h3 className="font-serif font-bold text-base text-[#F7F4EE] pt-4 border-t border-white/10">
          Analytics &amp; Conversion Tracking IDs
        </h3>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase block mb-1 font-semibold">
              Google Analytics 4 Measurement ID
            </label>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              value={settings.ga4Id}
              onChange={(e) => setSettings({ ...settings, ga4Id: e.target.value })}
              className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase block mb-1 font-semibold">
              Meta Pixel ID
            </label>
            <input
              type="text"
              placeholder="7849102938471"
              value={settings.metaPixelId}
              onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
              className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase block mb-1 font-semibold">
              Google Ads Conversion Tag ID
            </label>
            <input
              type="text"
              placeholder="AW-984029182"
              value={settings.googleAdsId}
              onChange={(e) => setSettings({ ...settings, googleAdsId: e.target.value })}
              className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase block mb-1 font-semibold">
              Search Console Meta Verification
            </label>
            <input
              type="text"
              placeholder="google-site-verification=xxxx"
              value={settings.gscVerification}
              onChange={(e) => setSettings({ ...settings, gscVerification: e.target.value })}
              className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="py-2.5 px-6 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md shadow-[#C9A86A]/20 mt-3"
        >
          <Save className="w-4 h-4 text-[#0B1426]" />
          <span>{saving ? 'Updating...' : 'Save Site Settings'}</span>
        </button>
      </form>

      {/* Password Change Form */}
      <form onSubmit={handlePasswordChange} className="glass-panel p-6 rounded-3xl border border-[#C9A86A]/30 space-y-4">
        <h3 className="font-serif font-bold text-base text-[#F7F4EE] flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#C9A86A]" />
          <span>Change Admin Password</span>
        </h3>

        {pwStatus && (
          <div className={`p-3 rounded-xl text-xs ${
            pwStatus.startsWith('Success')
              ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40'
              : 'bg-red-500/20 text-red-200 border border-red-500/40'
          }`}>
            {pwStatus}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase block mb-1 font-semibold">
              New Password (min 8 characters)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase block mb-1 font-semibold">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="py-2 px-5 rounded-xl border border-[#C9A86A] text-[#C9A86A] hover:bg-[#C9A86A]/10 font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};
