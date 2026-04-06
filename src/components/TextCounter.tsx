import { useMemo, useState } from 'react';
import { 
  FileText, Hash, AlignLeft, Type, Sparkles, 
  RotateCcw, Copy, Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TextCounter = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const sentences = text.match(/[^.!?]+[.!?]/g)?.length || (trimmed ? 1 : 0);
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const readingTime = Math.ceil(words / 200); // avg reading speed
    return { words, chars, sentences, paragraphs, readingTime };
  }, [text]);

  const handleClear = () => setText('');
  
  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    { 
      key: 'words', 
      label: 'Words', 
      value: stats.words, 
      icon: Hash, 
      color: 'from-rose-400 to-pink-500',
      desc: 'Total word count'
    },
    { 
      key: 'chars', 
      label: 'Characters', 
      value: stats.chars, 
      icon: AlignLeft, 
      color: 'from-rose-500 to-red-600',
      desc: 'With spaces'
    },
    { 
      key: 'sentences', 
      label: 'Sentences', 
      value: stats.sentences, 
      icon: FileText, 
      color: 'from-red-500 to-red-700',
      desc: 'Punctuation based'
    },
    { 
      key: 'paragraphs', 
      label: 'Paragraphs', 
      value: stats.paragraphs, 
      icon: Type, 
      color: 'from-pink-500 to-rose-600',
      desc: 'Line breaks'
    },
    { 
      key: 'readingTime', 
      label: 'Read Time', 
      value: `${stats.readingTime}m`, 
      icon: Sparkles, 
      color: 'from-amber-500 to-orange-600',
      desc: '200 wpm avg'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-[#0a0505] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-red-900/10 pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Header */}
      <div className="relative bg-[#151010]/80 backdrop-blur-xl border-b border-rose-500/20 px-8 py-5 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Word & Character Counter</h1>
            <p className="text-sm text-rose-400/70">Real-time word, character, sentence, and paragraph stats</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {text && (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  copied 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleClear}
                className="p-2 bg-[#0f0a0a] border border-rose-500/30 rounded-xl text-rose-400 hover:border-rose-500/60 hover:bg-rose-500/10 transition-all"
              >
                <RotateCcw size={18} />
              </motion.button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 p-8 md:p-12 overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Input Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="bg-[#151010]/80 backdrop-blur-md border border-rose-500/20 rounded-3xl p-1 shadow-2xl shadow-black/40">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-rose-500/10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-rose-500/10 rounded-lg">
                    <Type size={16} className="text-rose-400" />
                  </div>
                  <span className="text-sm font-bold text-rose-300">Input Text</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-rose-400/50">
                  <span className="px-3 py-1.5 bg-rose-500/10 rounded-full border border-rose-500/20">
                    Auto-analyzing
                  </span>
                </div>
              </div>
              
              {/* Textarea */}
              <div className="p-4">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-64 p-6 bg-[#0f0a0a] border-2 border-rose-500/20 rounded-2xl text-rose-100 placeholder-rose-400/30 focus:border-rose-500 focus:shadow-lg focus:shadow-rose-500/10 outline-none resize-none text-lg leading-relaxed transition-all"
                  placeholder="Start typing or paste your text here to see real-time statistics..."
                  spellCheck={false}
                />
              </div>
              
              {/* Bottom bar */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-rose-500/10 bg-[#0f0a0a]/50 rounded-b-3xl">
                <div className="flex items-center gap-4 text-xs text-rose-400/50">
                  <span>{stats.chars} characters</span>
                  <span className="w-1 h-1 bg-rose-500/30 rounded-full" />
                  <span>{stats.words} words</span>
                </div>
                <div className="text-xs text-rose-400/30">
                  {text ? 'Typing...' : 'Waiting for input'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative bg-[#151010]/80 backdrop-blur-md border border-rose-500/20 rounded-2xl p-6 overflow-hidden"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-xl text-white shadow-lg`}>
                        <Icon size={18} />
                      </div>
                      <motion.div 
                        key={stat.value}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-3xl font-black text-white"
                      >
                        {stat.value}
                      </motion.div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-rose-300 uppercase tracking-wider">
                        {stat.label}
                      </div>
                      <div className="text-xs text-rose-400/50">
                        {stat.desc}
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-rose-500/0 group-hover:ring-rose-500/30 transition-all" />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Progress Visualization */}
          {text && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-[#151010]/60 border border-rose-500/20 rounded-2xl p-6"
            >
              <h3 className="text-sm font-black text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles size={16} />
                Analysis Overview
              </h3>
              
              <div className="space-y-4">
                {/* Word density bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-rose-300">
                    <span>Text Density</span>
                    <span>{Math.min(100, (stats.words / 500) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-3 bg-[#0f0a0a] rounded-full overflow-hidden border border-rose-500/20">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (stats.words / 500) * 100)}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full"
                    />
                  </div>
                </div>

                {/* Character distribution */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-[#0f0a0a] rounded-xl border border-rose-500/10">
                    <div className="text-rose-400/50 text-xs mb-1">Avg Word Length</div>
                    <div className="text-xl font-black text-white">
                      {stats.words ? (stats.chars / stats.words).toFixed(1) : 0}
                    </div>
                    <div className="text-xs text-rose-400/30">characters per word</div>
                  </div>
                  <div className="p-4 bg-[#0f0a0a] rounded-xl border border-rose-500/10">
                    <div className="text-rose-400/50 text-xs mb-1">Sentences</div>
                    <div className="text-xl font-black text-white">{stats.sentences}</div>
                    <div className="text-xs text-rose-400/30">~{stats.words ? Math.round(stats.words / stats.sentences) : 0} words each</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!text && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
                <Type size={40} className="text-rose-400/50" />
              </div>
              <h3 className="text-lg font-bold text-rose-300 mb-2">Ready to Analyze</h3>
              <p className="text-rose-400/50 max-w-md mx-auto">
                Type or paste your text above to see detailed statistics including word count, character count, and reading time.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
