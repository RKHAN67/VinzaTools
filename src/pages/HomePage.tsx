import React, { useRef, useState } from 'react';
import {
  ArrowUpRight,
  Wand2,
  Globe,
  Layers,
  Clock,
  Eraser,
} from 'lucide-react';

import type { Tool, ToolCategory, ShowcaseTab } from '../types/app';
import { BrandMark } from '../components/BrandMark';
const HomeSecondarySections = React.lazy(() =>
  import('../sections/home/HomeSecondarySections').then((m) => ({
    default: m.HomeSecondarySections,
  }))
);

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
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 640px)').matches;
  });
  const [showAllHomeTools, setShowAllHomeTools] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);
  const secondaryTriggerRef = useRef<HTMLDivElement | null>(null);
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

  React.useEffect(() => {
    if (showSecondary) return;
    if (typeof window === 'undefined') return;
    const node = secondaryTriggerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShowSecondary(true);
        }
      },
      { rootMargin: '280px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [showSecondary]);


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

  return (
    <div className="min-h-screen bg-[#0f0a0a] text-white overflow-x-hidden selection:bg-rose-500/30">
      {/* Static Background */}
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
          <div className="absolute top-0 left-1/4 w-[420px] h-[420px] bg-rose-500/10 rounded-full blur-[90px] md:w-[600px] md:h-[600px] md:blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[360px] h-[360px] bg-orange-500/10 rounded-full blur-[80px] md:w-[500px] md:h-[500px] md:blur-[100px]" />
        </div>
      )}

      {/* Minimal Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0f0a0a]/90 border-b border-white/5 px-6 py-3">
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
                  className="vinza-button cursor-pointer group px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-semibold hover:bg-white/10 hover:border-rose-400/30 hover:shadow-[0_20px_50px_rgba(244,63,94,0.12)] transition-all flex items-center gap-3"
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

        <div ref={secondaryTriggerRef} className="h-1 w-full" aria-hidden="true" />
        {showSecondary ? (
          <React.Suspense
            fallback={
              <div className="mb-32 rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">
                Loading tools...
              </div>
            }
          >
            <HomeSecondarySections
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              filteredTools={filteredTools}
              featuredTools={featuredTools}
              handleToolClick={handleToolClick}
              showcaseTab={showcaseTab}
              setShowcaseTab={setShowcaseTab}
              showcaseTabsVisible={showcaseTabsVisible}
              showcaseFiltered={showcaseFiltered}
              openSubTool={openSubTool}
              devSubtools={devSubtools}
              mediaSubtools={mediaSubtools}
              goTools={goTools}
              isMobile={isMobile}
              showAllHomeTools={showAllHomeTools}
              setShowAllHomeTools={setShowAllHomeTools}
            />
          </React.Suspense>
        ) : (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-center text-sm text-slate-400">
            Scroll to load the full tool library.
          </div>
        )}
      </div>
    </div>
  );
};
