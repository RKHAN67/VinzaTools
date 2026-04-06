import { useMemo, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Download, Image as ImageIcon, Upload, Zap } from 'lucide-react';

export const ImageCompressor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressed, setCompressed] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => {
    const originalSize = file ? file.size / 1024 / 1024 : 0;
    const compressedSize = compressed ? compressed.size / 1024 / 1024 : 0;
    const saved = originalSize && compressedSize ? ((originalSize - compressedSize) / originalSize) * 100 : 0;
    return { originalSize, compressedSize, saved };
  }, [file, compressed]);

  const handleSelect = async (selected: File) => {
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setCompressed(null);
  };

  const runCompression = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const blob = await imageCompression(file, {
        maxSizeMB: Math.max(0.1, quality * 2),
        initialQuality: quality,
        useWebWorker: true,
        maxWidthOrHeight: 2400,
      });
      setCompressed(blob);
    } finally {
      setLoading(false);
    }
  };

  const downloadUrl = compressed ? URL.createObjectURL(compressed) : null;
  const downloadName = file ? file.name.replace(/\.[^.]+$/, '') + '-compressed.jpg' : 'compressed-image.jpg';

  return (
    <div className="min-h-[620px] bg-[#0a0505] rounded-[28px] border border-rose-500/20 p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
          <ImageIcon className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Image Compressor</h2>
          <p className="text-sm text-rose-200/60">Compress JPG, PNG, or WEBP images for web uploads and faster pages.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,0.9fr] gap-6">
        <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
          {!preview ? (
            <label className="cursor-pointer min-h-80 rounded-3xl border border-dashed border-rose-500/30 bg-[#0f0a0a] flex flex-col items-center justify-center gap-4 text-center p-8">
              <Upload className="text-rose-400" size={40} />
              <div>
                <p className="text-white font-black text-xl">Upload an image</p>
                <p className="text-sm text-slate-400">PNG, JPG, JPEG, WEBP supported</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleSelect(e.target.files[0])} />
            </label>
          ) : (
            <img src={preview} alt="Preview" className="w-full rounded-3xl border border-white/10 object-cover max-h-[420px]" />
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-black">
              <Zap className="text-amber-400" size={18} />
              Compression Settings
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Quality</span>
                <span className="text-white font-bold">{Math.round(quality * 100)}%</span>
              </div>
              <input type="range" min={0.2} max={0.95} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-rose-500 cursor-pointer" />
            </div>
            <button
              onClick={runCompression}
              disabled={!file || loading}
              className="cursor-pointer w-full px-4 py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Compressing...' : 'Compress Image'}
            </button>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={downloadName}
                className="cursor-pointer w-full px-4 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download Compressed Image
              </a>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Original Size</span><span className="text-white font-bold">{stats.originalSize.toFixed(2)} MB</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Compressed Size</span><span className="text-white font-bold">{stats.compressedSize.toFixed(2)} MB</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Saved</span><span className="text-emerald-400 font-bold">{stats.saved > 0 ? `${stats.saved.toFixed(0)}%` : '0%'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
