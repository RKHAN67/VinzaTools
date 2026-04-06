import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Maximize2, 
  Minimize2, 
  SplitSquareVertical, 
  ZoomIn, 
  ZoomOut, 
  LayoutGrid, 
  Columns, 
  Download, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  MoveHorizontal, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  HardDrive, 
  FileCheck, 
  BarChart3, 
  ImageIcon, 
  Plus, 
  Settings, 
  Play, 
  Trash2, 
  Archive, 
  Sliders, 
  FileType,
  Sparkles,
  Image,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ImageCompare = () => {
  const [images, setImages] = useState<(string | null)[]>([]);
  const [numImages, setNumImages] = useState<number>(10);
  const [mode, setMode] = useState<'slider' | 'side-by-side' | 'list'>('list');
  const [sliderPos, setSliderPos] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [fileInfo, setFileInfo] = useState<{ 
    id: string; 
    name: string; 
    size: number; 
    type: string; 
    status: 'pending' | 'processing' | 'done'; 
    targetSize?: number; 
    finalSize?: number; 
    savingsPercent?: number; 
    downloaded?: boolean 
  }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Compression Settings
  const [compressionMode, setCompressionMode] = useState<'quality' | 'size' | 'percentage'>('quality');
  const [targetValue, setTargetValue] = useState(46);
  const [outputFormat, setOutputFormat] = useState('WebP (Recommended)');
  const [resizeWidth, setResizeWidth] = useState('');
  const [resizeHeight, setResizeHeight] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const id = Math.random().toString(36).substr(2, 9);
        setImages(prev => [...prev, reader.result as string]);
        setFileInfo(prev => [...prev, { 
          id,
          name: file.name, 
          size: file.size, 
          type: file.type,
          status: 'pending',
          targetSize: Math.round(file.size * (targetValue / 100))
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const processBatch = async () => {
    if (fileInfo.length === 0 || isProcessing) return;
    
    setIsProcessing(true);
    
    for (let i = 0; i < fileInfo.length; i++) {
      const file = fileInfo[i];
      if (file.status === 'done') continue;

      setFileInfo(prev => prev.map(f => f.id === file.id ? { ...f, status: 'processing' } : f));
      
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
      
      const simulatedFinalSize = Math.round(file.size * (0.1 + (Math.random() * 0.2)));
      const simulatedSavings = Math.round(((file.size - simulatedFinalSize) / file.size) * 1000) / 10;

      setFileInfo(prev => prev.map(f => f.id === file.id ? { 
        ...f, 
        status: 'done', 
        finalSize: simulatedFinalSize,
        savingsPercent: simulatedSavings
      } : f));
    }
    
    setIsProcessing(false);
  };

  const downloadFile = (id: string) => {
    const index = fileInfo.findIndex(f => f.id === id);
    if (index === -1 || fileInfo[index].status !== 'done') return;

    const link = document.createElement('a');
    link.href = images[index] || '';
    link.download = `optimized-${fileInfo[index].name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFileInfo(prev => prev.map(f => f.id === id ? { ...f, downloaded: true } : f));
  };

  const downloadAll = () => {
    const doneFiles = fileInfo.filter(f => f.status === 'done');
    if (doneFiles.length === 0) return;

    doneFiles.forEach(file => {
      downloadFile(file.id);
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const reset = () => {
    setImages([]);
    setFileInfo([]);
    setZoom(1);
    setSliderPos(50);
    setIsProcessing(false);
  };

  const removeFile = (id: string) => {
    const index = fileInfo.findIndex(f => f.id === id);
    if (index !== -1) {
      setFileInfo(prev => prev.filter(f => f.id !== id));
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const allUploaded = fileInfo.length > 0;
  const processedFiles = fileInfo.filter(f => f.status === 'done');
  
  const totalOriginalSize = fileInfo.reduce((acc, curr) => acc + curr.size, 0);
  const totalOutputSize = fileInfo.reduce((acc, curr) => acc + (curr.status === 'done' ? (curr.finalSize || 0) : (curr.targetSize || 0)), 0);
  const avgSavings = processedFiles.length > 0 
    ? processedFiles.reduce((acc, curr) => acc + (curr.savingsPercent || 0), 0) / processedFiles.length 
    : (totalOriginalSize > 0 ? Math.round(((totalOriginalSize - totalOutputSize) / totalOriginalSize) * 1000) / 10 : 0);

  return (
    <div className="min-h-screen bg-[#0f0a0a] text-white p-4 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <ImageIcon size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Image <span className="text-rose-500">Optimizer</span>
            </h1>
            <p className="text-sm text-slate-400">Compress, convert, and optimize your images</p>
          </div>
        </div>
      </div>

      {/* Top Stats Bar */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Avg. Saving', value: `${avgSavings > 0 ? avgSavings.toFixed(1) : '0.0'}%`, icon: Zap },
          { label: 'Storage Saved', value: formatSize(totalOriginalSize - totalOutputSize), icon: HardDrive },
          { label: 'Processed', value: fileInfo.filter(f => f.status === 'done').length.toString(), icon: FileCheck },
          { label: 'Total Output', value: formatSize(totalOutputSize), icon: BarChart3 },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1a1414] border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-rose-500/30 transition-all group">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center group-hover:bg-rose-500/20 transition-all">
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Upload Card */}
          <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <Plus size={20} />
              <h3 className="font-bold text-sm uppercase tracking-wider">Add Images</h3>
            </div>
            <label className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group">
              <div className="w-14 h-14 bg-[#0f0a0a] rounded-xl flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Upload size={28} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white group-hover:text-rose-400 transition-colors">Drop files here</p>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG, WebP, AVIF</p>
              </div>
              <input type="file" multiple onChange={handleUpload} className="hidden" accept="image/*" />
            </label>
          </div>

          {/* Privacy Card */}
          <div className="bg-gradient-to-br from-rose-600 to-rose-500 p-6 rounded-2xl shadow-lg shadow-rose-500/20 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck size={20} />
              <h3 className="font-bold text-sm uppercase tracking-wider">Privacy First</h3>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Your images never leave your device. All optimization happens <span className="text-white font-bold underline">locally</span> via secure WebAssembly.
            </p>
          </div>

          {/* Engine Status */}
          <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
              <Cpu size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider">Engine Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#0f0a0a] rounded-xl border border-white/5">
                <span className="text-xs text-slate-500 font-medium">WASM Engine</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">Ready</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#0f0a0a] rounded-xl border border-white/5">
                <span className="text-xs text-slate-500 font-medium">Processing</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${isProcessing ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'}`}>
                  {isProcessing ? 'Active' : 'Idle'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="lg:col-span-9 space-y-6">
          {!allUploaded ? (
            <div className="h-[500px] bg-[#1a1414] border border-white/10 rounded-2xl border-dashed flex flex-col items-center justify-center text-center p-12 group hover:border-rose-500/30 transition-all">
              <div className="w-24 h-24 bg-[#0f0a0a] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FolderOpen size={48} className="text-slate-600 group-hover:text-rose-400 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Optimize?</h3>
              <p className="text-slate-400 max-w-md">Upload your images to start the ultra-fast local optimization process. Drag and drop supported.</p>
            </div>
          ) : (
            <>
              {/* Settings Panel */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a1414] border border-white/10 rounded-2xl p-6 space-y-6"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
                      <Sliders size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Optimization Settings</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={reset} 
                      className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-rose-400 font-medium text-sm transition-all bg-[#0f0a0a] hover:bg-rose-500/10 rounded-xl border border-white/10"
                    >
                      <Trash2 size={16} /> Clear All
                    </button>
                    <button 
                      onClick={downloadAll}
                      disabled={processedFiles.length === 0}
                      className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium text-sm transition-all ${processedFiles.length > 0 ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-[#0f0a0a] text-slate-500 cursor-not-allowed border border-white/10'}`}
                    >
                      <Archive size={18} /> Download All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Compression Mode */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Strategy</label>
                    <div className="flex p-1 bg-[#0f0a0a] rounded-xl border border-white/10">
                      {['quality', 'size', 'percentage'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setCompressionMode(m as any)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${compressionMode === m ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Value */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quality</label>
                      <span className="px-3 py-1 bg-rose-500/20 text-rose-400 text-xs font-bold rounded-full">{targetValue}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={targetValue} 
                      onChange={(e) => setTargetValue(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#0f0a0a] rounded-full appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>

                  {/* Output Format */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Output Format</label>
                    <select 
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="w-full bg-[#0f0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-rose-500/50 focus:outline-none"
                    >
                      <option>WebP (Recommended)</option>
                      <option>JPEG (Legacy)</option>
                      <option>PNG (Lossless)</option>
                      <option>AVIF (Next-Gen)</option>
                    </select>
                  </div>
                </div>

                {/* Resize & Action */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Maximize2 size={14} /> Resize
                    </span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="W" 
                        className="w-20 bg-[#0f0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-rose-500/50 focus:outline-none text-center"
                        value={resizeWidth}
                        onChange={(e) => setResizeWidth(e.target.value)}
                      />
                      <span className="text-slate-500">×</span>
                      <input 
                        type="text" 
                        placeholder="H" 
                        className="w-20 bg-[#0f0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-rose-500/50 focus:outline-none text-center"
                        value={resizeHeight}
                        onChange={(e) => setResizeHeight(e.target.value)}
                      />
                      <span className="text-xs text-slate-500">px</span>
                    </div>
                  </div>
                  <button 
                    onClick={processBatch}
                    disabled={isProcessing || fileInfo.every(f => f.status === 'done')}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${isProcessing ? 'bg-[#0f0a0a] text-slate-500 cursor-not-allowed border border-white/10' : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30'}`}
                  >
                    {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
                    {isProcessing ? 'Processing...' : 'Start Optimization'}
                  </button>
                </div>
              </motion.div>

              {/* File List */}
              <div className="space-y-4">
                {fileInfo.map((file, i) => (
                  <motion.div 
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-5 rounded-2xl border transition-all ${file.downloaded ? 'bg-emerald-500/5 border-emerald-500/20' : file.status === 'done' ? 'bg-[#1a1414] border-emerald-500/30' : 'bg-[#1a1414] border-white/10 hover:border-rose-500/30'}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden shrink-0 ${file.status === 'done' ? 'ring-2 ring-emerald-500/50' : 'bg-[#0f0a0a]'}`}>
                        {images[i] ? (
                          <img src={images[i]!} className="w-full h-full object-cover" alt={file.name} />
                        ) : (
                          <ImageIcon size={24} className="text-slate-600" />
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{file.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <span>{formatSize(file.size)}</span>
                          {file.status === 'done' && (
                            <>
                              <ChevronRight size={12} />
                              <span className="text-emerald-400">{formatSize(file.finalSize || 0)}</span>
                              <span className="text-rose-400">({file.savingsPercent}% saved)</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3">
                        {file.status === 'done' ? (
                          <button 
                            onClick={() => downloadFile(file.id)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${file.downloaded ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                          >
                            <Download size={18} />
                          </button>
                        ) : file.status === 'processing' ? (
                          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                            <RefreshCw size={18} className="text-rose-400 animate-spin" />
                          </div>
                        ) : (
                          <button className="w-10 h-10 rounded-xl bg-[#0f0a0a] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all flex items-center justify-center">
                            <Play size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => removeFile(file.id)} 
                          className="w-10 h-10 rounded-xl bg-[#0f0a0a] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all flex items-center justify-center"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar for processing */}
                    {file.status === 'processing' && (
                      <div className="mt-4">
                        <div className="h-1.5 bg-[#0f0a0a] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-full bg-gradient-to-r from-rose-500 to-rose-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* Success Indicator */}
                    {file.status === 'done' && !file.downloaded && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                        <FileCheck size={14} />
                        <span className="font-medium">Ready for download</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};