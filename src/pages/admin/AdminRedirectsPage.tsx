import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus, Trash2, ExternalLink, ShieldCheck } from 'lucide-react';
import { Redirect } from '../../types/index.ts';
import { adminFetch } from '../../utils/adminAuth.ts';

export const AdminRedirectsPage: React.FC = () => {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [fromPath, setFromPath] = useState('');
  const [toPath, setToPath] = useState('');
  const [statusCode, setStatusCode] = useState<number>(301);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = async () => {
    try {
      const res = await adminFetch('/api/redirects');
      if (res.ok) {
        const data = await res.json();
        setRedirects(data);
      }
    } catch (e) {}
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromPath || !toPath) return;

    setLoading(true);
    try {
      const res = await adminFetch('/api/redirects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromPath: fromPath.startsWith('/') ? fromPath : '/' + fromPath,
          toPath: toPath.startsWith('/') || toPath.startsWith('http') ? toPath : '/' + toPath,
          statusCode
        })
      });

      if (res.ok) {
        setFromPath('');
        setToPath('');
        fetchRedirects();
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await adminFetch(`/api/redirects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchRedirects();
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-3 border-b border-[#E5E7EB]">
        <h2 className="font-bold text-xl text-[#111827]">
          URL Redirects &amp; SEO Forwarding (301 / 302)
        </h2>
        <p className="text-xs text-[#4B5563]">
          Manage server-level HTTP redirects to preserve search engine link equity and prevent 404 dead ends.
        </p>
      </div>

      {/* Add New Redirect Form */}
      <form onSubmit={handleAdd} className="glass-panel p-5 rounded-2xl border border-[#E5E7EB] space-y-3">
        <h3 className="font-bold text-sm text-[#111827]">Add New Redirect Rule</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-[#4B5563] uppercase block mb-1">Old / Source Path</label>
            <input
              type="text"
              required
              placeholder="/brochure-download"
              value={fromPath}
              onChange={(e) => setFromPath(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs text-[#111827]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#4B5563] uppercase block mb-1">Target Destination</label>
            <input
              type="text"
              required
              placeholder="/#enquire or /floor-plans"
              value={toPath}
              onChange={(e) => setToPath(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs text-[#111827]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#4B5563] uppercase block mb-1">HTTP Status</label>
            <select
              value={statusCode}
              onChange={(e) => setStatusCode(parseInt(e.target.value, 10))}
              className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs text-[#111827]"
            >
              <option value={301}>301 (Permanent Redirect)</option>
              <option value={302}>302 (Temporary Redirect)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 rounded-xl gold-gradient-bg text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer mt-2"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>Add Redirect Rule</span>
        </button>
      </form>

      {/* Redirects Table */}
      <div className="glass-panel rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-white text-[10px] text-[#4B5563] uppercase border-b border-[#E5E7EB]">
            <tr>
              <th className="p-3">Source Path</th>
              <th className="p-3">Redirects To</th>
              <th className="p-3">Status Code</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {redirects.map((r) => (
              <tr key={r.id} className="hover:bg-[#F4F6FA]">
                <td className="p-3 font-mono text-[#111827]">{r.fromPath}</td>
                <td className="p-3 font-mono text-[#0E4D92]">{r.toPath}</td>
                <td className="p-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#F4F6FA] text-[#0E4D92] font-bold">
                    {r.statusCode}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1 rounded text-red-400 hover:bg-red-500/20"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
