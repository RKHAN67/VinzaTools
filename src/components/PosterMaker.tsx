import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Text, Rect, Circle, Image as KonvaImage, Group } from 'react-konva';
import { 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Type, 
  Layers, 
  Palette, 
  Layout, 
  Image as ImageIcon, 
  ChevronRight, 
  Phone, 
  Mail, 
  Globe, 
  Hash,
  Sparkles,
  Palette as PaletteIcon,
  Shapes,
  MousePointer2,
  RotateCcw,
  Save,
  Eye
} from 'lucide-react';
import useImage from 'use-image';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

const PosterImage = ({ url, x, y, width, height }: any) => {
  const [img] = useImage(url);
  return <KonvaImage image={img} x={x} y={y} width={width} height={height} draggable />;
};

export const PosterMaker = () => {
  const [step, setStep] = useState<'setup' | 'editor'>('setup');
  const [posterData, setPosterData] = useState({
    logo: null as string | null,
    heading: 'YOUR HEADING HERE',
    body: 'Add your descriptive body text here to explain your event or offer.',
    highlight: '50% OFF',
    contact: '+1 234 567 890',
    email: 'hello@example.com',
    website: 'www.example.com',
    buttonText: 'JOIN NOW',
    style: 'corporate' as 'minimal' | 'corporate' | 'creative'
  });

  const [elements, setElements] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  const stageRef = useRef<any>(null);

  // Dark theme colors
  const darkColors = {
    minimal: { bg: '#1a1414', text: '#ffffff', accent: '#f43f5e', secondary: '#94a3b8' },
    corporate: { bg: '#0f172a', text: '#ffffff', accent: '#3b82f6', secondary: '#64748b' },
    creative: { bg: '#0f0a0a', text: '#ffffff', accent: '#f97316', secondary: '#475569' }
  };

  const applyStyle = (style: 'minimal' | 'corporate' | 'creative') => {
    const colors = darkColors[style];
    let newElements: any[] = [];
    
    if (style === 'minimal') {
      newElements = [
        { id: 'bg', type: 'rect', x: 0, y: 0, width: 500, height: 700, fill: colors.bg },
        { id: 'accent_line', type: 'rect', x: 50, y: 140, width: 400, height: 3, fill: colors.accent },
        { id: 'title', type: 'text', text: posterData.heading, x: 50, y: 160, fontSize: 36, fill: colors.text, fontStyle: 'bold', width: 400, align: 'center' },
        { id: 'body', type: 'text', text: posterData.body, x: 75, y: 240, fontSize: 16, fill: colors.secondary, width: 350, align: 'center', lineHeight: 1.5 },
        { id: 'highlight_label', type: 'text', text: 'SPECIAL OFFER', x: 50, y: 380, fontSize: 12, fill: colors.secondary, fontStyle: 'bold', width: 400, align: 'center', letterSpacing: 4 },
        { id: 'highlight', type: 'text', text: posterData.highlight, x: 50, y: 410, fontSize: 64, fill: colors.accent, fontStyle: 'bold', width: 400, align: 'center' },
        { id: 'btn_bg', type: 'rect', x: 175, y: 520, width: 150, height: 45, fill: colors.accent, cornerRadius: 8 },
        { id: 'btn_text', type: 'text', text: posterData.buttonText, x: 175, y: 535, fontSize: 14, fill: '#ffffff', fontStyle: 'bold', width: 150, align: 'center' },
        { id: 'contact', type: 'text', text: `${posterData.contact} • ${posterData.website}`, x: 50, y: 640, fontSize: 12, fill: colors.secondary, width: 400, align: 'center' },
      ];
    } else if (style === 'corporate') {
      newElements = [
        { id: 'bg', type: 'rect', x: 0, y: 0, width: 500, height: 700, fill: colors.bg },
        { id: 'top_bar', type: 'rect', x: 0, y: 0, width: 500, height: 150, fill: colors.accent },
        { id: 'title', type: 'text', text: posterData.heading, x: 50, y: 200, fontSize: 42, fill: colors.text, fontStyle: 'bold', width: 400, align: 'center' },
        { id: 'body', type: 'text', text: posterData.body, x: 50, y: 300, fontSize: 18, fill: colors.secondary, width: 400, align: 'center', lineHeight: 1.4 },
        { id: 'highlight_bg', type: 'rect', x: 150, y: 420, width: 200, height: 100, fill: '#f43f5e', cornerRadius: 15 },
        { id: 'highlight', type: 'text', text: posterData.highlight, x: 150, y: 450, fontSize: 48, fill: '#ffffff', fontStyle: 'bold', width: 200, align: 'center' },
        { id: 'btn_bg', type: 'rect', x: 150, y: 550, width: 200, height: 50, fill: colors.accent, cornerRadius: 25 },
        { id: 'btn_text', type: 'text', text: posterData.buttonText, x: 150, y: 565, fontSize: 16, fill: '#ffffff', fontStyle: 'bold', width: 200, align: 'center' },
        { id: 'footer_bar', type: 'rect', x: 0, y: 650, width: 500, height: 50, fill: colors.accent },
        { id: 'contact', type: 'text', text: `Contact: ${posterData.contact} | ${posterData.website}`, x: 50, y: 668, fontSize: 12, fill: '#ffffff', width: 400, align: 'center' },
      ];
    } else {
      newElements = [
        { id: 'bg', type: 'rect', x: 0, y: 0, width: 500, height: 700, fill: colors.bg },
        { id: 'shape1', type: 'circle', x: 450, y: 50, radius: 150, fill: '#f43f5e', opacity: 0.15 },
        { id: 'shape2', type: 'rect', x: -50, y: 550, width: 300, height: 300, fill: '#3b82f6', opacity: 0.1, rotation: 45 },
        { id: 'shape3', type: 'circle', x: 100, y: 600, radius: 80, fill: '#f97316', opacity: 0.1 },
        { id: 'title', type: 'text', text: posterData.heading, x: 50, y: 120, fontSize: 52, fill: colors.text, fontStyle: 'bold', width: 400 },
        { id: 'body', type: 'text', text: posterData.body, x: 50, y: 320, fontSize: 20, fill: colors.secondary, width: 350, lineHeight: 1.6 },
        { id: 'highlight_label', type: 'text', text: 'UPCOMING', x: 50, y: 480, fontSize: 14, fill: '#f43f5e', fontStyle: 'bold', letterSpacing: 4 },
        { id: 'highlight', type: 'text', text: posterData.highlight, x: 50, y: 510, fontSize: 84, fill: '#f97316', fontStyle: 'bold' },
        { id: 'btn_bg', type: 'rect', x: 50, y: 620, width: 180, height: 50, fill: '#f43f5e', cornerRadius: 8 },
        { id: 'btn_text', type: 'text', text: posterData.buttonText, x: 50, y: 635, fontSize: 16, fill: '#ffffff', fontStyle: 'bold', width: 180, align: 'center' },
      ];
    }
    setElements(newElements);
  };

  useEffect(() => {
    if (step === 'editor') {
      applyStyle(posterData.style);
    }
  }, [step, posterData.heading, posterData.body, posterData.highlight, posterData.buttonText, posterData.contact, posterData.website, posterData.style]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPosterData({ ...posterData, logo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const downloadPoster = (format: 'png' | 'jpg' | 'pdf') => {
    if (format === 'pdf') {
      const uri = stageRef.current.toDataURL();
      const pdf = new jsPDF('p', 'px', [500, 700]);
      pdf.addImage(uri, 'PNG', 0, 0, 500, 700);
      pdf.save('poster.pdf');
    } else {
      const uri = stageRef.current.toDataURL({ mimeType: `image/${format}` });
      const link = document.createElement('a');
      link.download = `poster.${format}`;
      link.href = uri;
      link.click();
    }
  };

  // Dark theme classes
  const inputClass = "w-full bg-[#0f0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all outline-none text-sm";
  const labelClass = "text-xs font-bold text-slate-500 uppercase tracking-wider";
  const cardClass = "bg-[#1a1414] border border-white/10 rounded-2xl p-6 hover:border-rose-500/20 transition-all";
  const buttonClass = "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all";
  const tabClass = (active: boolean) => `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${active ? 'bg-rose-500 text-white' : 'bg-[#0f0a0a] text-slate-400 hover:text-white border border-white/10'}`;

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-[#0f0a0a] flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl w-full bg-[#1a1414] rounded-3xl border border-white/10 overflow-hidden flex flex-col lg:flex-row shadow-2xl"
        >
          {/* Left Panel - Form */}
          <div className="lg:w-1/2 p-12 bg-gradient-to-br from-rose-600 to-rose-500 text-white space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <PaletteIcon size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black">Create Stunning Posters</h1>
                  <p className="text-rose-100">Professional designs in seconds</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-rose-200">Poster Heading</label>
                <input 
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-rose-200/70 outline-none focus:bg-white/30 transition-all backdrop-blur-sm"
                  placeholder="Enter your main headline..."
                  value={posterData.heading}
                  onChange={e => setPosterData({ ...posterData, heading: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-rose-200">Description</label>
                <textarea 
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-rose-200/70 outline-none focus:bg-white/30 transition-all backdrop-blur-sm h-24 resize-none"
                  placeholder="Add your descriptive text..."
                  value={posterData.body}
                  onChange={e => setPosterData({ ...posterData, body: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-rose-200">Highlight (e.g. 50% OFF)</label>
                <input 
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-rose-200/70 outline-none focus:bg-white/30 transition-all backdrop-blur-sm"
                  value={posterData.highlight}
                  onChange={e => setPosterData({ ...posterData, highlight: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-rose-200">Contact</label>
                  <input 
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-rose-200/70 outline-none focus:bg-white/30 transition-all backdrop-blur-sm"
                    value={posterData.contact}
                    onChange={e => setPosterData({ ...posterData, contact: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-rose-200">Website</label>
                  <input 
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-rose-200/70 outline-none focus:bg-white/30 transition-all backdrop-blur-sm"
                    value={posterData.website}
                    onChange={e => setPosterData({ ...posterData, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-rose-200">Button Text</label>
                <input 
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-rose-200/70 outline-none focus:bg-white/30 transition-all backdrop-blur-sm"
                  value={posterData.buttonText}
                  onChange={e => setPosterData({ ...posterData, buttonText: e.target.value })}
                />
              </div>
            </div>

            <button 
              onClick={() => setStep('editor')}
              className="w-full py-4 bg-white text-rose-600 rounded-2xl font-black text-lg shadow-xl hover:bg-rose-50 transition-all flex items-center justify-center gap-2 group"
            >
              Generate Poster 
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Panel - Style Selection */}
          <div className="lg:w-1/2 p-12 space-y-8 bg-[#0f0a0a]">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Select a Style</h2>
              <p className="text-slate-400 text-sm">Choose a theme that matches your brand</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'minimal', name: 'Minimalist', desc: 'Clean, elegant, and modern', icon: Layout, color: 'from-slate-700 to-slate-600' },
                // { id: 'corporate', name: 'Corporate Pro', desc: 'Professional blue tones', icon: Briefcase, color: 'from-blue-600 to-blue-500' },
                { id: 'creative', name: 'Creative Dark', desc: 'Bold with vibrant accents', icon: Sparkles, color: 'from-rose-600 to-orange-500' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setPosterData({ ...posterData, style: s.id as any })}
                  className={`p-6 rounded-2xl border-2 text-left transition-all group ${posterData.style === s.id ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                      <s.icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white text-lg">{s.name}</p>
                        {posterData.style === s.id && (
                          <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{s.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Logo Upload */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Upload Logo (Optional)</h3>
              <label className="flex items-center gap-4 p-6 bg-[#1a1414] border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group">
                <div className="w-16 h-16 bg-[#0f0a0a] rounded-xl flex items-center justify-center border border-white/10 group-hover:border-rose-500/30 transition-all">
                  {posterData.logo ? (
                    <img src={posterData.logo} className="w-12 h-12 object-contain" alt="Logo" />
                  ) : (
                    <Upload size={24} className="text-slate-500 group-hover:text-rose-400 transition-colors" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">Choose File</p>
                  <p className="text-xs text-slate-500">PNG or JPG, max 2MB</p>
                </div>
                <input type="file" onChange={handleLogoUpload} className="hidden" accept="image/*" />
              </label>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0a0a] flex">
      {/* Sidebar */}
      <div className="w-96 bg-[#151010] border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                <PaletteIcon size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white">Poster Editor</h2>
                <p className="text-xs text-slate-500">Design Studio</p>
              </div>
            </div>
            <button 
              onClick={() => setStep('setup')} 
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
              title="Start Over"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('content')} className={tabClass(activeTab === 'content')}>
              <Type size={14} /> Content
            </button>
            <button onClick={() => setActiveTab('elements')} className={tabClass(activeTab === 'elements')}>
              <Shapes size={14} /> Elements
            </button>
            <button onClick={() => setActiveTab('download')} className={tabClass(activeTab === 'download')}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className={cardClass}>
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Type size={16} className="text-rose-400" /> Text Content
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Heading</label>
                    <input 
                      className={inputClass}
                      value={posterData.heading}
                      onChange={e => setPosterData({ ...posterData, heading: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Body Text</label>
                    <textarea 
                      className={`${inputClass} h-24 resize-none`}
                      value={posterData.body}
                      onChange={e => setPosterData({ ...posterData, body: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Highlight</label>
                    <input 
                      className={inputClass}
                      value={posterData.highlight}
                      onChange={e => setPosterData({ ...posterData, highlight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Button Text</label>
                    <input 
                      className={inputClass}
                      value={posterData.buttonText}
                      onChange={e => setPosterData({ ...posterData, buttonText: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className={cardClass}>
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Phone size={16} className="text-rose-400" /> Contact Info
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Phone</label>
                    <input 
                      className={inputClass}
                      value={posterData.contact}
                      onChange={e => setPosterData({ ...posterData, contact: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Email</label>
                    <input 
                      className={inputClass}
                      value={posterData.email}
                      onChange={e => setPosterData({ ...posterData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Website</label>
                    <input 
                      className={inputClass}
                      value={posterData.website}
                      onChange={e => setPosterData({ ...posterData, website: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Logo Management */}
              <div className={cardClass}>
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <ImageIcon size={16} className="text-rose-400" /> Logo
                </h3>
                {posterData.logo ? (
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-[#0f0a0a] rounded-xl flex items-center justify-center border border-white/10">
                      <img src={posterData.logo} className="max-w-full max-h-full object-contain p-4" alt="Logo" />
                    </div>
                    <button 
                      onClick={() => setPosterData({ ...posterData, logo: null })}
                      className="w-full py-2 bg-rose-500/10 text-rose-400 rounded-lg text-sm font-bold hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Remove Logo
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-3 p-8 bg-[#0f0a0a] border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-rose-500/50 hover:bg-rose-500/5 transition-all">
                    <Upload size={32} className="text-slate-500" />
                    <span className="text-sm font-medium text-slate-400">Upload Logo</span>
                    <input type="file" onChange={handleLogoUpload} className="hidden" accept="image/*" />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Elements Tab */}
          {activeTab === 'elements' && (
            <div className="space-y-6">
              <div className={cardClass}>
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Plus size={16} className="text-rose-400" /> Add Elements
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setElements([...elements, { 
                      id: Date.now().toString(), 
                      type: 'text', 
                      text: 'New Text', 
                      x: 100, 
                      y: 100, 
                      fontSize: 30, 
                      fill: '#ffffff',
                      fontStyle: 'bold'
                    }])} 
                    className="flex flex-col items-center gap-2 p-4 bg-[#0f0a0a] border border-white/10 rounded-xl hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group"
                  >
                    <Type size={24} className="text-slate-400 group-hover:text-rose-400 transition-colors" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white">Text</span>
                  </button>
                  <button 
                    onClick={() => setElements([...elements, { 
                      id: Date.now().toString(), 
                      type: 'rect', 
                      x: 150, 
                      y: 150, 
                      width: 100, 
                      height: 100, 
                      fill: '#f43f5e',
                      cornerRadius: 8
                    }])} 
                    className="flex flex-col items-center gap-2 p-4 bg-[#0f0a0a] border border-white/10 rounded-xl hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group"
                  >
                    <div className="w-6 h-6 bg-slate-400 rounded group-hover:bg-rose-400 transition-colors" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white">Rectangle</span>
                  </button>
                  <button 
                    onClick={() => setElements([...elements, { 
                      id: Date.now().toString(), 
                      type: 'circle', 
                      x: 200, 
                      y: 200, 
                      radius: 50, 
                      fill: '#3b82f6'
                    }])} 
                    className="flex flex-col items-center gap-2 p-4 bg-[#0f0a0a] border border-white/10 rounded-xl hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group"
                  >
                    <div className="w-6 h-6 bg-slate-400 rounded-full group-hover:bg-blue-400 transition-colors" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white">Circle</span>
                  </button>
                  <button 
                    onClick={() => setElements([...elements, { 
                      id: Date.now().toString(), 
                      type: 'rect', 
                      x: 100, 
                      y: 100, 
                      width: 200, 
                      height: 4, 
                      fill: '#f43f5e'
                    }])} 
                    className="flex flex-col items-center gap-2 p-4 bg-[#0f0a0a] border border-white/10 rounded-xl hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group"
                  >
                    <div className="w-8 h-1 bg-slate-400 rounded group-hover:bg-rose-400 transition-colors" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white">Line</span>
                  </button>
                </div>
              </div>

              {/* Selected Element Editor */}
              {selectedId && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${cardClass} border-rose-500/30 bg-rose-500/5`}
                >
                  <h3 className="text-sm font-bold text-rose-400 mb-4 flex items-center gap-2">
                    <MousePointer2 size={16} /> Edit Element
                  </h3>
                  
                  {(() => {
                    const el = elements.find(e => e.id === selectedId);
                    if (!el) return null;
                    
                    return (
                      <div className="space-y-4">
                        {el.type === 'text' && (
                          <div className="space-y-2">
                            <label className={labelClass}>Text Content</label>
                            <textarea 
                              className={`${inputClass} h-20 resize-none`}
                              value={el.text}
                              onChange={e => {
                                setElements(elements.map(item => 
                                  item.id === selectedId ? { ...item, text: e.target.value } : item
                                ));
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <label className={labelClass}>Color</label>
                          <div className="flex gap-2 flex-wrap">
                            {['#ffffff', '#f43f5e', '#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#1a1414'].map(color => (
                              <button
                                key={color}
                                onClick={() => {
                                  setElements(elements.map(item => 
                                    item.id === selectedId ? { ...item, fill: color } : item
                                  ));
                                }}
                                className={`w-8 h-8 rounded-lg border-2 transition-all ${el.fill === color ? 'border-white scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                            <input 
                              type="color" 
                              value={el.fill}
                              onChange={e => {
                                setElements(elements.map(item => 
                                  item.id === selectedId ? { ...item, fill: e.target.value } : item
                                ));
                              }}
                              className="w-8 h-8 rounded-lg cursor-pointer"
                            />
                          </div>
                        </div>

                        {el.type === 'text' && (
                          <div className="space-y-2">
                            <label className={labelClass}>Font Size</label>
                            <input 
                              type="range"
                              min="12"
                              max="72"
                              value={el.fontSize}
                              onChange={e => {
                                setElements(elements.map(item => 
                                  item.id === selectedId ? { ...item, fontSize: parseInt(e.target.value) } : item
                                ));
                              }}
                              className="w-full accent-rose-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>12px</span>
                              <span>{el.fontSize}px</span>
                              <span>72px</span>
                            </div>
                          </div>
                        )}

                        <button 
                          onClick={() => {
                            setElements(elements.filter(e => e.id !== selectedId));
                            setSelectedId(null);
                          }}
                          className="w-full py-3 bg-rose-500/20 text-rose-400 rounded-xl text-sm font-bold hover:bg-rose-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 size={16} /> Delete Element
                        </button>
                      </div>
                    );
                  })()}
                </motion.div>
              )}

              {/* Layer List */}
              <div className={cardClass}>
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Layers size={16} className="text-rose-400" /> Layers
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {elements.map((el, index) => (
                    <button
                      key={el.id}
                      onClick={() => setSelectedId(el.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        selectedId === el.id 
                          ? 'bg-rose-500/20 border border-rose-500/30' 
                          : 'bg-[#0f0a0a] border border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        {el.type === 'text' && <Type size={14} className="text-slate-400" />}
                        {el.type === 'rect' && <div className="w-3 h-3 rounded bg-current" style={{ color: el.fill }} />}
                        {el.type === 'circle' && <div className="w-3 h-3 rounded-full bg-current" style={{ color: el.fill }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {el.type === 'text' ? el.text.slice(0, 20) : `${el.type} ${index + 1}`}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">{el.type}</p>
                      </div>
                      {selectedId === el.id && (
                        <div className="w-2 h-2 bg-rose-400 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Download Tab */}
          {activeTab === 'download' && (
            <div className="space-y-6">
              <div className={cardClass}>
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Download size={16} className="text-rose-400" /> Export Poster
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => downloadPoster('png')}
                    className="w-full flex items-center justify-between p-4 bg-[#0f0a0a] border border-white/10 rounded-xl hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center">
                        <ImageIcon size={20} className="text-rose-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-white">Download PNG</p>
                        <p className="text-xs text-slate-500">High quality transparent</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-500 group-hover:text-rose-400 transition-colors" />
                  </button>

                  <button 
                    onClick={() => downloadPoster('jpg')}
                    className="w-full flex items-center justify-between p-4 bg-[#0f0a0a] border border-white/10 rounded-xl hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center">
                        <ImageIcon size={20} className="text-rose-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-white">Download JPG</p>
                        <p className="text-xs text-slate-500">Compressed for web</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-500 group-hover:text-rose-400 transition-colors" />
                  </button>

                  <button 
                    onClick={() => downloadPoster('pdf')}
                    className="w-full flex items-center justify-between p-4 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all group shadow-lg shadow-rose-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                          <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-bold">Download PDF</p>
                        <p className="text-xs text-rose-200">Print ready format</p>
                      </div>
                    </div>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className={cardClass}>
                <h3 className="text-sm font-bold text-white mb-4">Poster Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dimensions</span>
                    <span className="text-white font-medium">500 × 700 px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Style</span>
                    <span className="text-white font-medium capitalize">{posterData.style}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Elements</span>
                    <span className="text-white font-medium">{elements.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-[#0a0a0a] p-12 flex items-center justify-center overflow-hidden relative">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />

        <div className="relative bg-white shadow-2xl rounded-sm overflow-hidden">
          <Stage 
            width={500} 
            height={700} 
            ref={stageRef}
            onMouseDown={e => {
              if (e.target === e.target.getStage()) setSelectedId(null);
            }}
          >
            <Layer>
              {elements.map((el, i) => {
                if (el.type === 'rect') return (
                  <Rect 
                    key={el.id} 
                    {...el} 
                    draggable 
                    onClick={() => setSelectedId(el.id)}
                    onTap={() => setSelectedId(el.id)}
                    onDragEnd={e => {
                      const newEls = [...elements];
                      newEls[i] = { ...el, x: e.target.x(), y: e.target.y() };
                      setElements(newEls);
                    }}
                  />
                );
                if (el.type === 'circle') return (
                  <Circle 
                    key={el.id} 
                    {...el} 
                    draggable 
                    onClick={() => setSelectedId(el.id)}
                    onTap={() => setSelectedId(el.id)}
                    onDragEnd={e => {
                      const newEls = [...elements];
                      newEls[i] = { ...el, x: e.target.x(), y: e.target.y() };
                      setElements(newEls);
                    }}
                  />
                );
                if (el.type === 'text') return (
                  <Text 
                    key={el.id} 
                    {...el} 
                    draggable 
                    onClick={() => setSelectedId(el.id)}
                    onTap={() => setSelectedId(el.id)}
                    onDragEnd={e => {
                      const newEls = [...elements];
                      newEls[i] = { ...el, x: e.target.x(), y: e.target.y() };
                      setElements(newEls);
                    }}
                  />
                );
                return null;
              })}
              {posterData.logo && <PosterImage url={posterData.logo} x={50} y={40} width={60} height={60} />}
            </Layer>
          </Stage>
        </div>

        {/* Floating Help */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1414]/90 backdrop-blur border border-white/10 rounded-full px-6 py-3 text-sm text-slate-400 flex items-center gap-4">
          <span className="flex items-center gap-2">
            <MousePointer2 size={14} className="text-rose-400" />
            Click to select
          </span>
          <span className="w-px h-4 bg-white/20" />
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Drag to move
          </span>
        </div>
      </div>
    </div>
  );
};