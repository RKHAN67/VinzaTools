import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Zap,
  ArrowUpRight,
  Wand2,
  FileText,
  Image,
  Video,
  Code,
  Lock,
  Globe,
  Layers,
  Clock,
  Download,
  Eraser,
  X,
  Menu,
  ChevronRight,
  Star,
  Terminal,
  Cpu,
  Music,
  Shield,
  Rocket,
  MousePointer2,
  Command,
  ArrowRight,
} from 'lucide-react';

import type { Tool, ToolCategory, ShowcaseTab } from '../types/app';
import { BrandMark } from '../components/BrandMark';

type ShowcaseTool = {
  id: string;
  name: string;
  desc: string;
  icon: any;
  status: 'live' | 'coming';
  action?: string;
  tab: ShowcaseTab;
};

type SubTool = { id: string; name: string; desc: string; icon: any };

interface HomePageProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  activeCategory: ToolCategory | 'all';
  setActiveCategory: (value: ToolCategory | 'all') => void;
  filteredTools: Tool[];
  featuredTools: Tool[];
  handleToolClick: (tool: Tool) => void;
  showcaseTab: ShowcaseTab;
  setShowcaseTab: (tab: ShowcaseTab) => void;
  showcaseTabsVisible: { id: ShowcaseTab; label: string }[];
  showcaseFiltered: ShowcaseTool[];
  openSubTool: (toolId: string, subAction: string) => void;
  devSubtools: SubTool[];
  mediaSubtools: SubTool[];
  goTools: () => void;
}

export const HomePage = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  filteredTools,
  featuredTools,
  handleToolClick,
  showcaseTab,
  setShowcaseTab,
  showcaseTabsVisible,
  showcaseFiltered,
  openSubTool,
  devSubtools,
  mediaSubtools,
  goTools,
}: HomePageProps) => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllHomeTools, setShowAllHomeTools] = useState(false);
  const freshToolsCount = featuredTools.length;
  const backgroundRemoverTool = [...featuredTools, ...filteredTools].find(
    (tool) => tool.id === 'bg-remover'
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const handleChange = () => setIsMobile(mediaQuery.matches);
    handleChange();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  React.useEffect(() => {
    setShowAllHomeTools(false);
  }, [activeCategory, searchQuery]);

  const spotlightLabels: Record<string, string> = {
    'shopify-helper': 'Shopify Exclusive',
    'qr-code-generator': 'Marketing Ready',
    'image-compressor': 'Speed Boost',
    'db-viewer': 'Admin Favorite',
    'csv-viewer': 'Spreadsheet Ready',
    'keyword-density-checker': 'SEO Focus',
    'color-palette-generator': 'Brand Builder',
    'resize-image': 'Image Upgrade',
    'crop-image': 'Quick Edit',
    'color-picker': 'Design Pick',
    'rotate-image': 'Photo Fix',
    'flip-image': 'Mirror Tool',
    'image-enlarger': 'AI Style',
    'gif-maker': 'Motion Ready',
    'organize-pdf': 'PDF Workflow',
    'flatten-pdf': 'PDF Cleanup',
    'resize-pdf': 'Page Fit',
    'extract-image-from-pdf': 'Asset Pull',
    'pdf-page-remover': 'Page Delete',
    'extract-pages-from-pdf': 'Page Extract',
    'crop-video': 'Video Edit',
    'trim-video': 'Quick Cut',
    'video-converter': 'Format Switch',
    'audio-converter': 'Audio Ready',
    'mp4-to-mp3': 'Music Pull',
    'video-to-gif': 'Social Clip',
    'gif-to-mp4': 'Creator Flow',
    'unit-converter': 'Utility',
    'time-converter': 'Everyday Tool',
    'archive-converter': 'File Pack',
  };

  const stats = [
    {
      label: 'Tool Library',
      value: '94',
      icon: Globe,
      color: 'from-rose-400 to-orange-500',
    },
    {
      label: 'Theme Packs',
      value: '4',
      icon: Layers,
      color: 'from-coral-400 to-rose-500',
    },
    {
      label: 'Core Categories',
      value: '6',
      icon: Clock,
      color: 'from-orange-400 to-amber-500',
    },
  ];

  const features = [
    {
      title: 'Quick Workflows',
      desc: 'Open the right tool fast and finish common tasks without extra setup.',
      icon: Zap,
      gradient: 'from-rose-400 via-coral-500 to-orange-500',
    },
    {
      title: 'Safer Processing',
      desc: 'Handle PDFs, images, and downloads in one controlled workspace.',
      icon: Shield,
      gradient: 'from-orange-400 via-amber-500 to-yellow-500',
    },
    {
      title: 'Simple Steps',
      desc: 'Background remover, PDF tools, and media downloaders stay easy to use.',
      icon: MousePointer2,
      gradient: 'from-rose-400 via-pink-500 to-coral-500',
    },
  ];

  const mobileCommandLimit = 8;
  const commandCenterTools =
    isMobile && !showAllHomeTools
      ? filteredTools.slice(0, mobileCommandLimit)
      : filteredTools;
  const hiddenCommandTools = Math.max(filteredTools.length - commandCenterTools.length, 0);

  return (
    <div className="min-h-screen bg-[#0f0a0a] text-white overflow-x-hidden selection:bg-rose-500/30">
      {/* Static Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Minimal Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0f0a0a]/90 backdrop-blur-xl border-b border-white/5 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-mono">
          <BrandMark compact />
          <div className="hidden md:flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-300">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
Platform Live
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
              94 tools
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
              Themes + Shopify
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20">
        {/* Hero Section */}
        <section className="mb-32 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                  FILE
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-coral-500 to-orange-500 mt-2">
                  MAGIC
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-md leading-relaxed">
                Open practical tools for{' '}
                <span className="text-rose-400 font-semibold">background removal</span>,{' '}
                <span className="text-rose-400 font-semibold">PDF work</span>, and{' '}
                <span className="text-rose-400 font-semibold">YouTube, TikTok, Instagram, and Facebook downloads</span>{' '}
                from one clean workspace.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={goTools}
                  className="vinza-button group relative px-8 py-5 bg-white text-[#0f0a0a] rounded-2xl font-bold text-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_18px_40px_rgba(255,255,255,0.08)] hover:shadow-[0_24px_55px_rgba(244,63,94,0.18)]"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Start Creating
                    <ArrowUpRight
                      size={20}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-200 to-orange-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (backgroundRemoverTool) {
                      handleToolClick(backgroundRemoverTool);
                      return;
                    }
                    goTools();
                  }}
                  className="vinza-button cursor-pointer group px-8 py-5 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-2xl font-semibold hover:bg-white/10 hover:border-rose-400/30 hover:shadow-[0_20px_50px_rgba(244,63,94,0.12)] transition-all flex items-center gap-3"
                >
                  <Eraser size={18} className="transition-transform duration-300 group-hover:scale-110" />
                  Try Background Remover
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  'Background Remover',
                  'PDF to Word',
                  'YouTube Downloader',
                  'Instagram Downloader',
                  'TikTok Downloader',
                  'Facebook Downloader',
                ].map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300"
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-white/10">
                {stats.map((stat, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div
                      className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - 3D Card Stack */}
            <div className="relative h-[600px] hidden lg:block">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`absolute w-80 h-96 rounded-3xl p-6 cursor-pointer transition-all duration-500
                    ${i === 0 ? 'top-20 right-20 bg-[#1a1414] rotate-12 opacity-60 scale-90' : ''}
                    ${i === 1 ? 'top-10 right-10 bg-[#1f1919] rotate-6 opacity-80 scale-95' : ''}
                    ${i === 2 ? 'top-0 right-0 bg-gradient-to-br from-rose-100 to-white rotate-0 hover:scale-105' : ''}
                  `}
                  onClick={() => {
                    if (i === 2) {
                      openSubTool('pdf-tools', 'merge');
                    }
                  }}
                  onMouseEnter={() => setActiveCard(i)}
                  onMouseLeave={() => setActiveCard(null)}
>
                  {i === 2 ? (
                    <div className="h-full flex flex-col justify-between text-[#0f0a0a]">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Wand2 className="text-white" size={28} />
                        </div>
                        <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full animate-pulse">
                          LIVE
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          PDF Alchemist
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Transform, merge, split, compress
                        </p>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openSubTool('pdf-tools', 'merge');
                          }}
                          className="vinza-button group cursor-pointer inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-rose-600 font-semibold shadow-sm transition-all hover:border-rose-300 hover:bg-rose-100 hover:shadow-md"
                        >
                          <span>Try Now</span>
                          <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col justify-between opacity-40">
                      <div
                        className={`w-12 h-12 rounded-xl ${i === 0 ? 'bg-rose-500/20' : 'bg-orange-500/20'}`}
                      />
                      <div className="space-y-3">
                        <div className="h-3 bg-white/20 rounded-full w-3/4" />
                        <div className="h-3 bg-white/10 rounded-full w-1/2" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-32">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feat.gradient} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`}
                />

                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feat.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <feat.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-rose-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-32">
          <div className="rounded-[2rem] border border-white/10 bg-[#161010] p-8 md:p-10 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-rose-300">
                  <Rocket size={14} />
                  {freshToolsCount} Fresh Tools
                </div>
                <h2 className="mt-5 text-4xl md:text-5xl font-black tracking-tight text-white">
                  New arrivals your users can start using today
                </h2>
                <p className="mt-4 text-base md:text-lg text-rose-100/65">
                  Fresh image, video, PDF, utility, Shopify, and admin-friendly tools now sit in one clean section so users can instantly spot what is new without hunting through the full catalog.
                </p>
              </div>

              <button
                type="button"
                onClick={goTools}
                className="vinza-button group cursor-pointer inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all hover:border-rose-400/40 hover:bg-white/10 hover:shadow-[0_24px_50px_rgba(244,63,94,0.12)]"
              >
                Explore all tools
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {featuredTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleToolClick(tool)}
                    className="vinza-button cursor-pointer group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-rose-400/30 hover:shadow-2xl hover:shadow-rose-900/10"
                  >
                    <div className="absolute right-0 top-0 h-28 w-28 bg-gradient-to-br from-rose-500/20 to-orange-500/20 blur-3xl transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
                    <div className="relative z-10 space-y-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-900/30">
                          <Icon size={24} />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-emerald-200">
                            New
                          </span>
                          <span className="rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-rose-200">
                            {spotlightLabels[tool.id] || 'New Tool'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-black text-white">{tool.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-rose-100/65">
                          {tool.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 text-sm font-bold text-rose-200">
                        <span>Open now</span>
                        <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Command Center */}
        <section className="mb-32">
          <div className="bg-[#1a1414] backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
              <div>
                <h2 className="text-4xl font-black mb-2 flex items-center gap-3">
                  <Command className="text-rose-400" size={32} />
                  Command Center
                </h2>
                <p className="text-gray-400">
                  Your creative arsenal, organized.
                </p>
              </div>

              <div className="relative w-full lg:w-96 group">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative flex items-center bg-black/50 border border-white/20 rounded-2xl overflow-hidden focus-within:border-rose-500/50 transition-colors">
                  <Search className="ml-4 text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search tools, formats, actions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-4 bg-transparent text-white placeholder-gray-500 outline-none"
                  />
                  <div className="px-3 py-1 mr-3 bg-white/10 rounded-lg text-xs text-gray-400 font-mono border border-white/10">
                    ⌘K
                  </div>
                </div>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide mb-6">
              {[
                'all',
                'creative',
                'image',
                'pdf',
                'media',
                'developer',
                'text',
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={`relative px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-white text-[#0f0a0a] shadow-lg shadow-white/25'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat === 'all'
                    ? '🔥 All Tools'
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  {activeCategory === cat && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-rose-400 to-orange-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {commandCenterTools.map((tool, index) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className={`group relative p-6 rounded-2xl border text-left transition-all duration-300 hover:scale-[1.02] overflow-hidden ${
                    index === 0 || index === 5
                      ? 'lg:col-span-2 bg-gradient-to-br from-rose-500/20 to-orange-500/20 border-rose-500/30 hover:border-rose-400/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-rose-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity`}
                  />

                  <div className="relative z-10 flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        index === 0 || index === 5
                          ? 'bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-500/30'
                          : 'bg-white/10 group-hover:bg-white/20'
                      } transition-all duration-300`}
                    >
                      <tool.icon className="text-white" size={24} />
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="text-gray-600 group-hover:text-rose-400 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                    />
                  </div>

                  <h3 className="text-lg font-bold mb-2 group-hover:text-rose-300 transition-colors relative z-10">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 relative z-10 group-hover:text-gray-300">
                    {tool.description}
                  </p>
                </button>
              ))}
            </div>

            {isMobile && filteredTools.length > mobileCommandLimit && (
              <div className="mt-6 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllHomeTools((prev) => !prev)}
                  className="vinza-button rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-rose-400/30 hover:bg-white/10"
                >
                  {showAllHomeTools ? 'Show fewer tools' : `Show ${hiddenCommandTools} more tools`}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* PDF Powerhouse - Terminal Style */}
        <section className="mb-32">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                <Terminal className="text-rose-400" size={28} />
                <span className="text-rose-400">PDF</span> Powerhouse
              </h2>
              <p className="text-gray-400">
                The complete document operating system
              </p>
            </div>
          </div>

          <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl font-mono">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-6 py-4 bg-white/5 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="ml-4 px-4 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                pdf-workspace — bash — 80x24
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-2 bg-black/50 overflow-x-auto border-b border-white/5">
              {showcaseTabsVisible.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setShowcaseTab(tab.id)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    showcaseTab === tab.id
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {showcaseFiltered.map((tool) => {
                const isLive = tool.status === 'live' && tool.action;
                return (
                  <button
                    key={tool.id}
                    onClick={() =>
                      isLive && openSubTool('pdf-tools', tool.action as string)
                    }
                    disabled={!isLive}
                    className={`group relative p-6 rounded-xl border text-left transition-all duration-300 ${
                      isLive
                        ? 'bg-white/5 border-white/10 hover:border-rose-500/50 hover:bg-rose-500/5'
                        : 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isLive
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-gray-800 text-gray-600'
                        }`}
                      >
                        <tool.icon size={20} />
                      </div>
                      {isLive && (
                        <div className="px-2 py-1 bg-rose-500/20 text-rose-400 text-xs font-bold rounded-full border border-rose-500/30">
                          ONLINE
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold mb-2 text-white group-hover:text-rose-300 transition-colors font-sans">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-sans">
                      {tool.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dev Tools - Matrix Vibes */}
        <section className="mb-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/20 to-orange-900/20 rounded-3xl" />

          <div className="relative p-8 lg:p-12 rounded-3xl border border-rose-500/20 bg-[#0a0a0a]/80 backdrop-blur-sm overflow-hidden">
            <div className="relative z-10 flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center border border-rose-500/30">
                  <Cpu className="text-rose-400" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">DevTools</h2>
                  <p className="text-rose-400/80 font-mono text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                    $ npm run build-awesome
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-rose-500/10 rounded-full border border-rose-500/30 text-rose-400 text-sm">
                <Zap size={16} className="animate-pulse" />
                <span>Tool-ready workspace</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {devSubtools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => openSubTool('dev-tools', tool.id)}
                  className="group p-6 bg-black/40 border border-rose-500/20 rounded-2xl hover:border-rose-400/50 hover:bg-rose-500/10 transition-all duration-300 text-left relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-400/0 to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-rose-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <tool.icon className="text-rose-400" size={20} />
                    </div>
                    <h3 className="font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300">
                      {tool.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Media Downloader - Neon Cards */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-coral-400 to-orange-400">
                MediaFlow
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Download public media from YouTube, TikTok, Instagram, and Facebook with one simple workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediaSubtools.map((tool, index) => (
              <button
                key={tool.id}
                onClick={() => openSubTool('mediaflow-downloader', tool.id)}
                className="group relative h-72 rounded-3xl overflow-hidden border border-white/10 hover:border-rose-500/50 transition-all duration-500"
              >
                {/* Animated Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    index === 0
                      ? 'from-rose-600/30 to-coral-600/30'
                      : index === 1
                        ? 'from-coral-600/30 to-orange-600/30'
                        : 'from-orange-600/30 to-amber-600/30'
                  } opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative h-full p-8 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <div
                      className={`w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
                        index === 0
                          ? 'group-hover:bg-rose-500/20 group-hover:border-rose-500/50'
                          : index === 1
                            ? 'group-hover:bg-coral-500/20 group-hover:border-coral-500/50'
                            : 'group-hover:bg-orange-500/20 group-hover:border-orange-500/50'
                      }`}
                    >
                      <tool.icon className="text-white" size={28} />
                    </div>
                    <Download
                      className="text-white/50 group-hover:text-white group-hover:translate-y-1 transition-all"
                      size={24}
                    />
                  </div>

                  <div className="transform group-hover:translate-y-0 transition-transform">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300">
                      {tool.name}
                    </h3>
                    <p className="text-white/70 group-hover:text-white/90">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <section className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-coral-600 to-orange-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />

          <div className="relative py-20 px-8 text-center">
            <h2 className="text-5xl font-black mb-6 text-white drop-shadow-lg">
              Ready to create?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Open your tools, process files, and move through work faster with one clean workspace.
            </p>
            <button
              type="button"
              onClick={goTools}
              className="group px-10 py-5 bg-white text-[#0f0a0a] font-bold text-lg rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              <Rocket size={24} className="group-hover:animate-bounce" />
              Get Started Free
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
