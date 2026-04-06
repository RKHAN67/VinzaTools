/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Download, 
  Youtube, 
  AlertCircle, 
  Loader2, 
  Image as ImageIcon,
  ExternalLink,
  Upload,
  FileImage,
  RefreshCw,
  Link2,
  Sparkles,
  Check,
  Trash2,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThumbnailOption {
  id: string;
  label: string;
  url: string;
  quality: string;
}

type ImageFormat = 'jpg' | 'png' | 'webp' | 'avif';

const formatConfig = {
  jpg: { color: 'from-blue-400 to-blue-600', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  png: { color: 'from-emerald-400 to-teal-600', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  webp: { color: 'from-rose-400 to-pink-600', bg: 'bg-rose-500/20', border: 'border-rose-500/30' },
  avif: { color: 'from-purple-400 to-violet-600', bg: 'bg-purple-500/20', border: 'border-purple-500/30' }
};

export const YoutubeThumbnailDownloader = () => {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<ThumbnailOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>('jpg');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const extractVideoId = (input: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
    const match = input.match(regex);
    return match ? match[1] : null;
  };

  const checkImageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (img.width === 120 && img.height === 90 && url.includes('maxresdefault')) {
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const mimeType = selectedFormat === 'jpg' ? 'image/jpeg' : `image/${selectedFormat}`;
      const dataUrl = canvas.toDataURL(mimeType, 1.0);
      
      const link = document.createElement('a');
      link.href = dataUrl;
      const name = fileName.split('.')[0];
      link.download = `${name}.${selectedFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      window.open(imageUrl, '_blank');
    }
  };

  const fetchThumbnails = async () => {
    setError('');
    const id = extractVideoId(url);
    if (!id) {
      setError('Please enter a valid YouTube link.');
      return;
    }
    setLoading(true);
    setVideoId(id);
    const options = [
      { id: 'max', label: 'Ultra HD', quality: '4K/1080p', url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg` },
      { id: 'sd', label: 'Standard', quality: '640x480', url: `https://img.youtube.com/vi/${id}/sddefault.jpg` },
      { id: 'hq', label: 'High', quality: '480x360', url: `https://img.youtube.com/vi/${id}/hqdefault.jpg` },
      { id: 'mq', label: 'Medium', quality: '320x180', url: `https://img.youtube.com/vi/${id}/mqdefault.jpg` },
    ];
    const validThumbnails: ThumbnailOption[] = [];
    for (const option of options) {
      const exists = await checkImageExists(option.url);
      if (exists) validThumbnails.push(option);
    }
    setThumbnails(validThumbnails);
    setLoading(false);
    setUploadedImage(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setThumbnails([]);
        setUrl('');
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAll = () => {
    setUrl('');
    setThumbnails([]);
    setUploadedImage(null);
    setUploadedFileName('');
    setError('');
    setVideoId(null);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0505] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/20 via-[#0a0505] to-[#0a0505]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
      
      {/* Animated Orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Header */}
      <header className="relative z-20 px-8 py-6 border-b border-rose-500/10 bg-[#0a0505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 blur-lg rounded-full" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-red-500 to-rose-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
                <Youtube size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                YouTube <span className="text-red-500">Thumbnail</span> Downloader
              </h1>
              <p className="text-sm text-rose-400/60 mt-0.5">Download thumbnails or convert any image</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full">
            <Sparkles size={14} className="text-rose-400" />
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Multi-Format</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm font-bold uppercase tracking-wider"
              >
                <Youtube size={14} />
                YouTube thumbnails
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Thumbnail & <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-600">Image Converter</span>
              </h2>
              <p className="text-lg text-rose-400/60 max-w-2xl mx-auto">
                Download YouTube thumbnails in HD or convert any image to JPG, PNG, WEBP, or AVIF format.
              </p>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* YouTube Link Input */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#151010] border border-rose-500/20 rounded-3xl p-8 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                    <Link2 size={20} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">YouTube Link</h3>
                    <p className="text-xs text-rose-400/60">Paste video URL to fetch thumbnails</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="https://youtube.com/watch?v=..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchThumbnails()}
                      className="w-full px-5 py-4 bg-[#0f0a0a] border-2 border-rose-500/20 rounded-2xl text-white placeholder-rose-400/30 focus:border-rose-500 focus:shadow-lg focus:shadow-rose-500/10 outline-none transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-400/30">
                      <Youtube size={20} />
                    </div>
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fetchThumbnails}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-500/25 hover:shadow-red-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <Download size={24} />
                    )}
                    {loading ? 'Fetching...' : 'Fetch Thumbnails'}
                  </motion.button>
                </div>
              </motion.div>

              {/* Upload Image */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#151010] border border-rose-500/20 rounded-3xl p-8 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <Upload size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Upload Image</h3>
                    <p className="text-xs text-rose-400/60">Convert any image to your chosen format</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-rose-400/50">
                    Upload any image file and convert it to JPG, PNG, WEBP, or AVIF format instantly.
                  </p>
                  
                  <label className="group relative w-full py-4 bg-[#0f0a0a] border-2 border-dashed border-rose-500/30 rounded-2xl hover:border-rose-500/60 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileImage size={24} className="text-rose-400" />
                    </div>
                    <span className="font-bold text-rose-300">Choose File</span>
                    <span className="text-xs text-rose-400/50">PNG, JPG, WEBP supported</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
              </motion.div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3"
                >
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertCircle size={20} className="text-red-400" />
                  </div>
                  <span className="font-bold text-red-300">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Format Selector */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#151010] border border-rose-500/20 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-black text-rose-400 uppercase tracking-widest">
                  Target Format
                </label>
                <span className="text-xs text-rose-400/50">Select output format</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {(['jpg', 'png', 'webp', 'avif'] as ImageFormat[]).map((format) => {
                  const config = formatConfig[format];
                  const isActive = selectedFormat === format;
                  return (
                    <motion.button
                      key={format}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFormat(format)}
                      className={`relative px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all ${
                        isActive 
                          ? `${config.bg} ${config.border} border-2 text-white shadow-lg` 
                          : 'bg-[#0f0a0a] border border-rose-500/20 text-rose-400/60 hover:border-rose-500/40'
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="formatIndicator"
                          className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-20 rounded-xl`} 
                        />
                      )}
                      <span className="relative z-10">{format}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="wait">
                {uploadedImage && (
                  <motion.div
                    key="uploaded"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#151010] border border-rose-500/20 rounded-3xl p-6 shadow-2xl"
                  >
                    <div className="aspect-video rounded-2xl overflow-hidden border border-rose-500/20 bg-[#0f0a0a] mb-4 relative group">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded" 
                        className="w-full h-full object-contain" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white font-medium border border-white/20">
                          Uploaded
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold text-white truncate max-w-[180px]">{uploadedFileName}</div>
                        <div className="text-xs text-rose-400/50">Original image</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setUploadedImage(null)} 
                          className="p-2 bg-[#0f0a0a] border border-rose-500/30 rounded-xl text-rose-400 hover:border-rose-500/60 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => downloadImage(uploadedImage, uploadedFileName)} 
                          className="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-rose-500/25 flex items-center gap-2"
                        >
                          <RefreshCw size={16} />
                          Convert
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {thumbnails.map((thumb, idx) => (
                  <motion.div
                    key={thumb.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-[#151010] border border-rose-500/20 rounded-3xl p-6 shadow-2xl group"
                  >
                    <div className="aspect-video rounded-2xl overflow-hidden border border-rose-500/20 bg-[#0f0a0a] mb-4 relative">
                      <img 
                        src={thumb.url} 
                        alt={thumb.label} 
                        referrerPolicy="no-referrer" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
                        {thumb.quality}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-lg font-black text-white">{thumb.label}</div>
                        <div className="text-xs text-rose-400/50">YouTube thumbnail</div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open(thumb.url, '_blank')} 
                          className="p-2 bg-[#0f0a0a] border border-rose-500/30 rounded-xl text-rose-400 hover:border-rose-500/60 transition-all"
                        >
                          <ExternalLink size={18} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => downloadImage(thumb.url, `youtube-thumbnail-${videoId}-${thumb.id}`)} 
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/25 flex items-center gap-2"
                        >
                          <Download size={18} />
                          Download
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {thumbnails.length === 0 && !uploadedImage && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
                  <Play size={40} className="text-rose-400/50" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to Start</h3>
                <p className="text-rose-400/50 max-w-md mx-auto">
                  Paste a YouTube link to fetch thumbnails or upload an image to convert it to your preferred format.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};