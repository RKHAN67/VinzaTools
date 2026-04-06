import React, { useState } from 'react';
import { 
  Upload, Download, RefreshCw, Image as ImageIcon, 
  Sparkles, Check, FileImage, Zap, Shield, X, 
  Settings2, ArrowRight, ImagePlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp';

const formatToMime: Record<ImageFormat, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp'
};

const formatConfig = {
  png: { 
    color: 'from-emerald-400 to-teal-500', 
    bg: 'bg-emerald-500/20', 
    border: 'border-emerald-500/30',
    desc: 'Lossless quality',
    icon: '✦'
  },
  jpg: { 
    color: 'from-rose-400 to-pink-500', 
    bg: 'bg-rose-500/20', 
    border: 'border-rose-500/30',
    desc: 'Small file size',
    icon: '◈'
  },
  jpeg: { 
    color: 'from-amber-400 to-orange-500', 
    bg: 'bg-amber-500/20', 
    border: 'border-amber-500/30',
    desc: 'Web compatible',
    icon: '◇'
  },
  webp: { 
    color: 'from-purple-400 to-violet-500', 
    bg: 'bg-purple-500/20', 
    border: 'border-purple-500/30',
    desc: 'Modern format',
    icon: '✧'
  }
};

export const ImageConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [format, setFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState(0.92);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const processFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) processFile(f);
  };

  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setFormat('png');
    setQuality(0.92);
  };

  const convertImage = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(url);
            reject(new Error('Canvas not supported'));
            return;
          }
          ctx.drawImage(img, 0, 0);
          const mime = formatToMime[format];
          const q = (format === 'png') ? undefined : quality;
          canvas.toBlob((b) => {
            URL.revokeObjectURL(url);
            if (!b) {
              reject(new Error('Conversion failed'));
              return;
            }
            resolve(b);
          }, mime, q);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Invalid image'));
        };
        img.src = url;
      });

      setResult(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const makeDownloadName = () => {
    const base = (file?.name || 'image').replace(/\.[^/.]+$/, '');
    return `${base}.${format}`;
  };

  const currentFormat = formatConfig[format];

  return (
    <div className="h-full flex flex-col bg-[#0a0505] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/20 via-[#0a0505] to-[#0a0505]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
      
      {/* Animated Orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Header */}
      <header className="relative z-20 px-8 py-6 border-b border-rose-500/10 bg-[#0a0505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-rose-500/30 blur-lg rounded-full" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-700 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/25">
                <ImageIcon size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Image <span className="text-rose-500">Converter</span>
              </h1>
              <p className="text-sm text-rose-400/60 mt-0.5">Transform images with zero quality loss</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full">
            <Shield size={14} className="text-rose-400" />
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">100% Private</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto p-8">
          
          {!result ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
              
              {/* Left Column - Upload */}
              <div className="lg:col-span-7 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full"
                >
                  <div 
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative h-full min-h-[500px] group transition-all duration-500 ${dragActive ? 'scale-[1.02]' : ''}`}
                  >
                    {/* Glow Border */}
                    <div className={`absolute -inset-px bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500 rounded-3xl blur opacity-0 transition-opacity duration-500 ${dragActive ? 'opacity-75' : 'group-hover:opacity-40'}`} />
                    
                    <div className={`relative h-full rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
                      file 
                        ? 'border-rose-500/50 bg-[#151010]' 
                        : dragActive
                          ? 'border-rose-400 bg-[#151010]/80'
                          : 'border-rose-500/20 bg-[#151010]/50 hover:border-rose-500/40'
                    }`}>
                      
                      {!file ? (
                        <label className="cursor-pointer h-full flex flex-col items-center justify-center p-12 space-y-8">
                          <motion.div 
                            animate={{ y: dragActive ? -10 : 0, scale: dragActive ? 1.1 : 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative"
                          >
                            <div className="absolute inset-0 bg-rose-500/30 blur-2xl rounded-full scale-150 animate-pulse" />
                            <div className="relative w-32 h-32 bg-gradient-to-br from-rose-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-500/30 rotate-3 group-hover:rotate-6 transition-transform duration-300">
                              <ImagePlus size={48} className="text-white" />
                            </div>
                          </motion.div>
                          
                          <div className="text-center space-y-3">
                            <h3 className="text-3xl font-black text-white">
                              Drop image here
                            </h3>
                            <p className="text-rose-400/60 text-lg">
                              or click to browse from your device
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3 px-6 py-3 bg-[#0f0a0a] border border-rose-500/30 rounded-2xl">
                            <FileImage size={18} className="text-rose-400" />
                            <span className="text-sm font-semibold text-rose-300">Supports PNG, JPG, WEBP</span>
                          </div>
                          
                          <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                      ) : (
                        <div className="h-full flex flex-col p-8">
                          {/* Preview Header */}
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center border border-rose-500/30">
                                <FileImage size={20} className="text-rose-400" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white truncate max-w-xs">{file.name}</p>
                                <p className="text-xs text-rose-400/60">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <button 
                              onClick={resetAll}
                              className="p-2 hover:bg-rose-500/10 rounded-xl transition-colors group"
                            >
                              <X size={20} className="text-rose-400 group-hover:text-rose-300" />
                            </button>
                          </div>

                          {/* Image Preview */}
                          <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#0f0a0a] border border-rose-500/20">
                            <img 
                              src={preview!} 
                              alt="Preview" 
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm text-white font-medium border border-white/20">
                                Original Image
                              </span>
                            </div>
                          </div>

                          {/* Convert Button */}
                          <div className="mt-6">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={convertImage}
                              disabled={processing}
                              className="w-full py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                              {processing ? (
                                <RefreshCw size={24} className="animate-spin" />
                              ) : (
                                <Zap size={24} className="animate-pulse" />
                              )}
                              {processing ? 'Converting...' : 'Convert Image'}
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Settings */}
              <div className="lg:col-span-5 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#151010] border border-rose-500/20 rounded-3xl p-8 shadow-2xl"
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-8 pb-6 border-b border-rose-500/10">
                    <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                      <Settings2 size={20} className="text-rose-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white">Output Settings</h2>
                      <p className="text-xs text-rose-400/60">Configure conversion options</p>
                    </div>
                  </div>

                  {/* Format Selection */}
                  <div className="space-y-4 mb-8">
                    <label className="text-xs font-black text-rose-400 uppercase tracking-widest">
                      Target Format
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['png', 'jpg', 'jpeg', 'webp'] as ImageFormat[]).map((f) => {
                        const config = formatConfig[f];
                        const isActive = format === f;
                        return (
                          <motion.button
                            key={f}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFormat(f)}
                            className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                              isActive 
                                ? `${config.bg} ${config.border} border-current` 
                                : 'bg-[#0f0a0a] border-rose-500/10 hover:border-rose-500/30'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <span className={`text-2xl font-black uppercase ${isActive ? 'text-white' : 'text-rose-300/70'}`}>
                                {config.icon} {f}
                              </span>
                              {isActive && (
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`w-6 h-6 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center shadow-lg`}
                                >
                                  <Check size={14} className="text-white" />
                                </motion.div>
                              )}
                            </div>
                            <p className={`text-xs ${isActive ? 'text-white/80' : 'text-rose-400/40'}`}>
                              {config.desc}
                            </p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quality Slider */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-rose-400 uppercase tracking-widest">
                        Quality Level
                      </label>
                      <span className={`text-2xl font-black ${format === 'png' ? 'text-rose-400/30' : 'text-white'}`}>
                        {Math.round(quality * 100)}%
                      </span>
                    </div>
                    
                    <div className="relative h-14 bg-[#0f0a0a] rounded-2xl border border-rose-500/20 px-4 flex items-center">
                      <input
                        type="range"
                        min="0.5"
                        max="1"
                        step="0.01"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        disabled={format === 'png'}
                        className="w-full h-2 bg-rose-500/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-rose-500/50 disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </div>
                    
                    {format === 'png' ? (
                      <div className="flex items-center gap-2 text-xs text-amber-400/80 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                        <Sparkles size={14} />
                        <span>PNG uses lossless compression. Quality setting disabled.</span>
                      </div>
                    ) : (
                      <p className="text-xs text-rose-400/40">
                        Higher quality results in larger file size
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#151010] border border-rose-500/20 rounded-2xl">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3 border border-emerald-500/30">
                      <Shield size={20} className="text-emerald-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">Secure</h4>
                    <p className="text-xs text-rose-400/50">Browser-based processing</p>
                  </div>
                  <div className="p-4 bg-[#151010] border border-rose-500/20 rounded-2xl">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mb-3 border border-purple-500/30">
                      <Zap size={20} className="text-purple-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">Instant</h4>
                    <p className="text-xs text-rose-400/50">Real-time conversion</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Success Result View */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-[#151010] border border-rose-500/20 rounded-3xl overflow-hidden shadow-2xl">
                {/* Success Header */}
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b border-emerald-500/20 px-8 py-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                      <Check size={24} className="text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">Conversion Complete!</h2>
                      <p className="text-sm text-emerald-400/70">Your image is ready for download</p>
                    </div>
                  </div>
                  <button 
                    onClick={resetAll}
                    className="px-4 py-2 bg-[#0f0a0a] border border-rose-500/30 rounded-xl text-sm font-bold text-rose-300 hover:border-rose-500/60 transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={16} />
                    New Conversion
                  </button>
                </div>

                {/* Preview Area */}
                <div className="p-12 bg-[#0a0505] relative">
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-30" style={{ 
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #f43f5e 1px, transparent 0)', 
                    backgroundSize: '24px 24px' 
                  }} />
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 flex justify-center"
                  >
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img 
                        src={result} 
                        alt="Converted" 
                        className="relative max-h-[400px] rounded-2xl shadow-2xl border border-rose-500/20"
                      />
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#151010] border border-rose-500/30 rounded-full text-xs font-bold text-rose-300 shadow-xl">
                        {makeDownloadName()}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Action Bar */}
                <div className="px-8 py-6 bg-[#151010] border-t border-rose-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-rose-400/60">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span>Ready to download</span>
                    </div>
                  </div>
                  
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={result} 
                    download={makeDownloadName()}
                    className="group relative px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 transition-all flex items-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Download size={24} />
                    <span className="relative">Download Image</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};