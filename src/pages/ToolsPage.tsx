import React from 'react';
import { Search, ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';
import type { Tool, ToolCategory } from '../types/app';

const SCREENSHOT_NEW_TOOL_IDS = [
  'resize-image',
  'crop-image',
  'color-picker',
  'rotate-image',
  'flip-image',
  'image-enlarger',
  'gif-maker',
  'webp-to-png',
  'jfif-to-png',
  'heic-to-jpg',
  'heic-to-png',
  'webp-to-jpg',
  'organize-pdf',
  'flatten-pdf',
  'resize-pdf',
  'extract-image-from-pdf',
  'pdf-page-remover',
  'extract-pages-from-pdf',
  'crop-video',
  'trim-video',
  'video-converter',
  'audio-converter',
  'mp3-converter',
  'mp4-to-mp3',
  'video-to-mp3',
  'mp4-converter',
  'mov-to-mp4',
  'mp3-to-ogg',
  'video-to-gif',
  'mp4-to-gif',
  'webm-to-gif',
  'gif-to-mp4',
  'gif-to-apng',
  'apng-to-gif',
  'image-to-gif',
  'mov-to-gif',
  'avi-to-gif',
  'unit-converter',
  'time-converter',
  'archive-converter',
] as const;

class ToolErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error?.message || 'Tool failed to load.',
    };
  }

  componentDidUpdate(prevProps: { children: React.ReactNode }) {
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, message: '' });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[320px] rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-left">
          <div className="text-lg font-bold text-white">Tool failed to open</div>
          <p className="mt-2 text-sm text-rose-200/80">
            {this.state.message || 'This tool hit a runtime issue. We can now see the real error instead of an endless loading state.'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ToolsPageProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  activeCategory: ToolCategory | 'all';
  setActiveCategory: (value: ToolCategory | 'all') => void;
  filteredTools: Tool[];
  handleToolClick: (tool: Tool) => void;
  activeToolId: string | null;
  setActiveToolId: (id: string | null) => void;
  renderTool: () => React.ReactNode;
  activeToolName?: string;
}

export const ToolsPage = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  filteredTools,
  handleToolClick,
  activeToolId,
  setActiveToolId,
  renderTool,
  activeToolName,
}: ToolsPageProps) => {
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeToolId]);

  const newToolIds = new Set([
    ...SCREENSHOT_NEW_TOOL_IDS,
    'shopify-helper',
    'qr-code-generator',
    'image-compressor',
    'db-viewer',
    'csv-viewer',
    'keyword-density-checker',
    'color-palette-generator',
  ]);
  const visibleNewTools = filteredTools.filter((tool) => newToolIds.has(tool.id));

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      {!activeToolId && (
        <div className="bg-gradient-to-br from-rose-500/10 to-orange-500/10 rounded-3xl p-10 border border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-400 text-sm mb-4">
            <Sparkles size={14} />
            <span>Tools Hub</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-3">All Tools</h2>
          <p className="text-slate-400 max-w-lg">
            Search, filter, and open any tool instantly. Pick a tool and start
            working in seconds.
          </p>
        </div>
      )}

      {!activeToolId && visibleNewTools.length > 0 && (
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                <Sparkles size={14} />
                New Tools Added
              </div>
              <h3 className="text-2xl font-black text-white">
                {visibleNewTools.length} fresh tools from your screenshot reference are now in the app
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                Ab user ko clear dikh raha hai ke new tools add ho chuke hain. In cards par
                `New` badge bhi hai, aur aap category filter ke through unko easily spot kar sakte ho.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {visibleNewTools.slice(0, 8).map((tool) => (
                <span
                  key={tool.id}
                  className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200"
                >
                  {tool.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      {!activeToolId && (
        <div className="bg-[#1a1414] rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Find Your Tool
              </h3>
              <p className="text-slate-500 text-sm">
                Quick access to all utilities
              </p>
            </div>
            <div className="w-full lg:max-w-md relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-rose-500/50 text-white placeholder-slate-500 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      {!activeToolId && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat === 'all'
                ? 'All Tools'
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Tools Grid or Active Tool */}
      {!activeToolId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="group relative p-6 bg-[#1a1414] rounded-2xl border border-white/10 hover:border-rose-500/30 hover:bg-[#1f1919] transition-all text-left"
            >
              {newToolIds.has(tool.id) && (
                <span className="absolute right-4 top-4 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-rose-200">
                  New
                </span>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20 group-hover:bg-rose-500/20 transition-colors">
                  <tool.icon className="text-rose-400" size={22} />
                </div>
                <ChevronRight
                  size={18}
                  className="text-slate-600 group-hover:text-rose-400 group-hover:translate-x-1 transition-all"
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {tool.description}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-[#1a1414] rounded-3xl border border-white/10 overflow-hidden">
          {/* Tool Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveToolId(null);
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-2 text-slate-400 hover:text-rose-400 transition-colors font-medium"
            >
              <ArrowLeft size={18} />
              Back to Tools
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center border border-rose-500/20">
                <Sparkles className="text-rose-400" size={18} />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {activeToolName}
              </h2>
            </div>
          </div>

          {/* Tool Content */}
          <div className="p-6 tool-surface">
            <ToolErrorBoundary>
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-[320px] text-slate-400 text-sm">
                    Loading tool...
                  </div>
                }
              >
                {renderTool()}
              </React.Suspense>
            </ToolErrorBoundary>
          </div>
        </div>
      )}
    </div>
  );
};
