import React, { useState } from 'react';
import { Lock, Mail, Shield, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { setAdminToken, setStoredAdminUser } from '../../utils/adminAuth.ts';

interface AdminLoginPageProps {
  onLoginSuccess: (user: any) => void;
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      if (data.token) {
        setAdminToken(data.token);
      }
      if (data.user) {
        setStoredAdminUser(data.user);
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1426] flex items-center justify-center p-4">
      {/* noindex meta enforcement */}
      <div className="w-full max-w-sm glass-panel p-6 sm:p-8 rounded-3xl border border-[#C9A86A] shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-14 -right-14 w-28 h-28 bg-[#C9A86A]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-full border border-[#C9A86A] flex items-center justify-center bg-[#C9A86A]/10 mx-auto mb-2">
            <span className="font-serif font-bold text-[#C9A86A] text-sm">DO</span>
          </div>
          <h1 className="font-serif font-bold text-xl text-[#F7F4EE]">
            DXN Orion Admin Console
          </h1>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">
            Executive CRM &amp; Content Management System
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-1 font-semibold">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[#C9A86A]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl pl-9 pr-3 py-2 text-xs text-[#F7F4EE] placeholder-[#94A3B8] focus:border-[#C9A86A] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-1 font-semibold">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-[#C9A86A]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-xl pl-9 pr-3 py-2 text-xs text-[#F7F4EE] placeholder-[#94A3B8] focus:border-[#C9A86A] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C9A86A]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all hover:brightness-105 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#0B1426]" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-[#0B1426]" />
                <span>Authorize &amp; Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            onClick={() => onNavigate('/')}
            className="text-[10px] text-[#94A3B8] hover:text-[#C9A86A] transition-colors cursor-pointer"
          >
            &larr; Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
