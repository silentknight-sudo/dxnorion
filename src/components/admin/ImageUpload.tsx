import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { adminFetch } from '../../utils/adminAuth.ts';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  altText?: string;
  onAltChange?: (alt: string) => void;
  recommendedSize?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Cover Image',
  value,
  onChange,
  altText,
  onAltChange,
  recommendedSize = '1200 x 630px (Max 8MB)',
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualInputOpen, setManualInputOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processAndUploadFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP, SVG, GIF).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('File is too large. Maximum allowed size is 8MB.');
      return;
    }

    setError(null);
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Data = e.target?.result as string;
        if (!base64Data) {
          throw new Error('Could not read image file.');
        }

        const res = await adminFetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Data,
            filename: file.name
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Upload failed.');
        }

        onChange(data.url);
        if (onAltChange && (!altText || altText.trim() === '')) {
          // Auto-generate clean alt text from file name
          const cleanName = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .trim();
          onAltChange(cleanName);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to upload image. Please try again.');
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read local file.');
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block font-semibold">
          {label}
        </label>
        <span className="text-[10px] text-[#C9A86A]">{recommendedSize}</span>
      </div>

      {error && (
        <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Image Preview Box */
        <div className="relative rounded-2xl border border-[#C9A86A]/40 overflow-hidden bg-[#0B1426]/90 p-3 group">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Thumbnail */}
            <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
              <img
                src={value}
                alt={altText || 'Uploaded image preview'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%231e293b"/><text x="50%" y="50%" fill="%2394a3b8" dominant-baseline="middle" text-anchor="middle" font-size="12">Invalid Image</text></svg>';
                }}
              />
              <div className="absolute top-1.5 left-1.5 bg-emerald-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Check className="w-2.5 h-2.5" />
                <span>Uploaded</span>
              </div>
            </div>

            {/* Info & Replace / Remove Controls */}
            <div className="flex-1 w-full space-y-2">
              <div className="text-xs text-[#F7F4EE] font-medium truncate max-w-xs sm:max-w-md">
                {value.startsWith('/uploads/') ? value.replace('/uploads/', '') : value}
              </div>

              {onAltChange && (
                <div>
                  <label className="text-[9px] text-[#94A3B8] uppercase block mb-0.5">
                    Image Alt Description (SEO)
                  </label>
                  <input
                    type="text"
                    value={altText || ''}
                    onChange={(e) => onAltChange(e.target.value)}
                    placeholder="Descriptive alt text for Google Image Search..."
                    className="w-full bg-[#0B1426] border border-[#C9A86A]/30 rounded-lg px-2.5 py-1 text-xs text-[#F7F4EE] placeholder-[#94A3B8] focus:border-[#C9A86A] focus:outline-none"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="py-1 px-3 rounded-lg bg-[#C9A86A]/20 hover:bg-[#C9A86A]/30 border border-[#C9A86A]/50 text-[#DFBF82] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${uploading ? 'animate-spin' : ''}`} />
                  <span>{uploading ? 'Uploading...' : 'Replace Image'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="py-1 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Drag & Drop Area */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-[#C9A86A] bg-[#C9A86A]/10 scale-[1.01]'
              : 'border-[#C9A86A]/40 bg-[#0B1426]/60 hover:bg-[#0B1426]/90 hover:border-[#C9A86A]'
          }`}
        >
          {uploading ? (
            <div className="py-4 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-8 h-8 text-[#C9A86A] animate-spin" />
              <p className="text-xs font-medium text-[#DFBF82]">Uploading image to server...</p>
              <p className="text-[10px] text-[#94A3B8]">Optimizing and saving file</p>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-2xl border border-[#C9A86A]/50 bg-[#C9A86A]/10 flex items-center justify-center text-[#C9A86A]">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#F7F4EE]">
                  Click to browse or drag &amp; drop your image here
                </p>
                <p className="text-[10px] text-[#94A3B8] mt-0.5">
                  Supports PNG, JPG, WebP, SVG (Auto-compressed for ultra-fast loading)
                </p>
              </div>
              <button
                type="button"
                className="mt-1 py-1.5 px-4 rounded-xl gold-gradient-bg text-[#0B1426] text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all pointer-events-none"
              >
                Choose File from Device
              </button>
            </div>
          )}
        </div>
      )}

      {/* Manual link input toggle fallback */}
      <div className="text-right">
        <button
          type="button"
          onClick={() => setManualInputOpen(!manualInputOpen)}
          className="text-[10px] text-[#94A3B8] hover:text-[#C9A86A] transition-colors cursor-pointer"
        >
          {manualInputOpen ? 'Hide link input' : 'Paste link manually instead'}
        </button>
      </div>

      {manualInputOpen && (
        <div className="p-3 bg-[#0B1426] rounded-xl border border-white/10 space-y-1.5 animate-in fade-in">
          <label className="text-[9px] text-[#94A3B8] uppercase block">
            Direct Image URL Link
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-[#0B1426]/90 border border-[#C9A86A]/30 rounded-lg px-2.5 py-1 text-xs text-[#F7F4EE] placeholder-[#94A3B8] focus:border-[#C9A86A] focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};
