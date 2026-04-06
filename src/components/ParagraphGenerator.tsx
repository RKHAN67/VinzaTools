import { useMemo, useState } from 'react';
import { FileText, Copy, Check, Sparkles, Type, AlignLeft, Download, RefreshCw, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ParagraphGenerator = () => {
  const [paraCount, setParaCount] = useState(3);
  const [paraSize, setParaSize] = useState<'short' | 'medium' | 'long'>('medium');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatorSeed = {
    short: [
      'VinzaTools makes everyday file work simple.',
      'Upload, process, and download in one flow.',
      'Fast results with clean design.',
      'Built to keep your workflow moving.',
      'Clear steps, friendly UI, and smart tools.'
    ],
    medium: [
      'VinzaTools is built to remove friction from daily tasks by keeping every utility in one friendly workspace.',
      'Our tools help you turn files into results quickly, with clear steps and consistent layouts.',
      'From PDFs to images to text, each tool focuses on speed, clarity, and trust.',
      'We keep interfaces simple so you can finish work without confusion or extra clicks.'
    ],
    long: [
      'VinzaTools brings your essential utilities into a single, easy-to-navigate platform so you can finish work faster and with confidence.',
      'Every tool follows the same clean layout and clear flow: upload, customize options, process, and download results.',
      'Whether you are converting files, editing PDFs, or improving images, the experience stays consistent and friendly.',
      'We focus on clarity and speed so even complex tasks feel simple for every user.'
    ]
  };

  const generatedText = useMemo(() => {
    const pool = generatorSeed[paraSize];
    const paragraphs = [];
    for (let i = 0; i < paraCount; i += 1) {
      paragraphs.push(pool.map((s) => s).join(' '));
    }
    return paragraphs.join('\n\n');
  }, [paraCount, paraSize]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 600);
  };

  const sizeConfig = {
    short: { label: 'Short', desc: 'Quick snippets', icon: Type, color: 'from-rose-400 to-pink-500' },
    medium: { label: 'Medium', desc: 'Balanced content', icon: AlignLeft, color: 'from-rose-500 to-red-600' },
    long: { label: 'Long', desc: 'Detailed paragraphs', icon: FileText, color: 'from-red-500 to-red-700' }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0505] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-red-900/10 pointer-events-none" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Header */}
      <div className="relative bg-[#151010]/80 backdrop-blur-xl border-b border-rose-500/20 px-8 py-5 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Paragraph Generator</h1>
            <p className="text-sm text-rose-400/70">Generate clean placeholder text for your designs</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} className="animate-pulse" />
          AI Powered
        </div>
      </div>

      <div className="flex-1 p-8 md:p-12 overflow-y-auto relative z-10">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#151010]/80 backdrop-blur-md border border-rose-500/20 rounded-3xl p-8 shadow-2xl shadow-black/40"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <Settings size={20} className="text-rose-400" />
              </div>
              <h2 className="text-lg font-black text-rose-400 uppercase tracking-widest">Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Paragraph Count */}
              <div className="space-y-4">
                <label className="text-sm font-black text-rose-300 uppercase tracking-wider flex items-center gap-2">
                  <Type size={16} />
                  Paragraph Count
                </label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setParaCount(Math.max(1, paraCount - 1))}
                    className="w-12 h-12 bg-[#0f0a0a] border-2 border-rose-500/30 rounded-xl text-rose-400 hover:border-rose-500 hover:bg-rose-500/10 transition-all font-bold text-xl"
                  >
                    -
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={paraCount}
                      onChange={(e) => setParaCount(Math.min(10, Math.max(1, Number(e.target.value))))}
                      className="w-full px-6 py-4 bg-[#0f0a0a] border-2 border-rose-500/30 rounded-2xl text-white text-center text-2xl font-black focus:border-rose-500 focus:shadow-lg focus:shadow-rose-500/20 outline-none transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-400/50 text-sm font-bold">
                      max 10
                    </div>
                  </div>
                  <button 
                    onClick={() => setParaCount(Math.min(10, paraCount + 1))}
                    className="w-12 h-12 bg-[#0f0a0a] border-2 border-rose-500/30 rounded-xl text-rose-400 hover:border-rose-500 hover:bg-rose-500/10 transition-all font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-4">
                <label className="text-sm font-black text-rose-300 uppercase tracking-wider flex items-center gap-2">
                  <AlignLeft size={16} />
                  Paragraph Length
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['short', 'medium', 'long'] as const).map((size) => {
                    const config = sizeConfig[size];
                    const Icon = config.icon;
                    return (
                      <button
                        key={size}
                        onClick={() => setParaSize(size)}
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group ${
                          paraSize === size 
                            ? `bg-gradient-to-br ${config.color} border-transparent text-white shadow-lg shadow-rose-500/30` 
                            : 'bg-[#0f0a0a] border-rose-500/20 text-rose-400/70 hover:border-rose-500/40'
                        }`}
                      >
                        <Icon size={24} className={paraSize === size ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
                        <span className="text-xs font-bold uppercase tracking-wider">{config.label}</span>
                        {paraSize === size && (
                          <motion.div 
                            layoutId="activeSize"
                            className="absolute inset-0 rounded-2xl ring-2 ring-white/30"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-rose-500/20">
              <div className="flex items-center gap-3 text-sm text-rose-400/60">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 rounded-lg border border-rose-500/20">
                  <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
                  <span className="font-medium">Auto-updates</span>
                </div>
                <span className="text-rose-400/40">•</span>
                <span>{generatedText.length} characters</span>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleRegenerate}
                  className="group px-6 py-3 bg-[#0f0a0a] border-2 border-rose-500/30 rounded-xl font-bold text-rose-300 hover:border-rose-500/60 hover:bg-rose-500/10 transition-all flex items-center gap-2"
                >
                  <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                  Refresh
                </button>
                
                <motion.button
                  onClick={handleCopy}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative px-8 py-3 rounded-xl font-bold flex items-center gap-2 overflow-hidden transition-all ${
                    copied 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                      : 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={20} />
                        <span>Copied!</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Copy size={20} />
                        <span>Copy Text</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Output Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#151010]/80 backdrop-blur-md border border-rose-500/20 rounded-3xl p-8 shadow-2xl shadow-black/40 relative overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                  <FileText size={20} className="text-rose-400" />
                </div>
                <h3 className="text-sm font-black text-rose-400 uppercase tracking-widest">Generated Output</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-400/50 font-medium px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/20">
                  {paraCount} paragraphs • {paraSize}
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${paraCount}-${paraSize}-${isGenerating}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative"
              >
                <div className="bg-[#0f0a0a] rounded-2xl p-6 border border-rose-500/20 relative overflow-hidden group">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />
                  
                  <pre className="whitespace-pre-wrap text-base text-rose-100/90 leading-relaxed font-medium relative z-10">
                    {generatedText}
                  </pre>
                  
                  {/* Hover overlay with copy hint */}
                  <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-4 py-2 bg-rose-500 text-white rounded-full text-sm font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Click copy to grab text
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stats footer */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-rose-500/10 text-xs text-rose-400/50">
              <div className="flex gap-4">
                <span>Words: {generatedText.split(/\s+/).length}</span>
                <span>•</span>
                <span>Characters: {generatedText.length}</span>
                <span>•</span>
                <span>Paragraphs: {paraCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>Ready to use</span>
              </div>
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { icon: Sparkles, title: 'Instant Copy', desc: 'One click to clipboard' },
              { icon: RefreshCw, title: 'Live Preview', desc: 'Updates in real-time' },
              { icon: Download, title: 'Multiple Sizes', desc: 'Short, medium, long' }
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-[#151010]/40 border border-rose-500/10 rounded-2xl text-rose-400/60">
                <div className="p-2 bg-rose-500/10 rounded-lg">
                  <tip.icon size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-rose-300">{tip.title}</div>
                  <div className="text-xs text-rose-400/50">{tip.desc}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
