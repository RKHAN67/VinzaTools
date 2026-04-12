import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Download,
  RefreshCw,
  Search,
  Sparkles,
  Star,
} from 'lucide-react';
import { apiFetch, apiHref } from '../api';
import bluevinzaCorporateStudioCover from '../assets/theme-covers/bluevinza-corporate-studio.webp';
import luminaEditorialBlogCover from '../assets/theme-covers/lumina-editorial-blog.webp';
import signaturePersonalPortfolioCover from '../assets/theme-covers/signature-personal-portfolio.webp';
import vinzaLuxuryStorefrontCover from '../assets/theme-covers/vinza-luxury-storefront.webp';

type ThemeSummary = {
  id: string;
  name: string;
  description?: string;
  relativePath: string;
  fileCount: number;
  previewFiles: string[];
  hasPreview?: boolean;
  canBuildPreview?: boolean;
  isFallback?: boolean;
};

type SortMode = 'popular' | 'name' | 'files';

type ThemeMeta = {
  category: string;
  badge: string;
  compatibility: string;
  score: string;
  accent: string;
  blurb: string;
};

const THEME_COVERS: Record<string, string> = {
  'bluevinza-corporate-studio': bluevinzaCorporateStudioCover,
  'lumina-editorial-blog': luminaEditorialBlogCover,
  'signature-personal-portfolio': signaturePersonalPortfolioCover,
  'vinza-luxury-storefront': vinzaLuxuryStorefrontCover,
  'html-theme-preview': signaturePersonalPortfolioCover,
};

const FALLBACK_THEMES: ThemeSummary[] = Object.keys(THEME_COVERS).map((id) => ({
  id,
  name: id.replace(/[-_]+/g, ' '),
  description: '',
  relativePath: '',
  fileCount: 120,
  previewFiles: [],
  hasPreview: false,
  canBuildPreview: false,
  isFallback: true,
}));

const formatThemeTitle = (theme: ThemeSummary) =>
  theme.name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getThemeMeta = (theme: ThemeSummary): ThemeMeta => {
  const raw = theme.id.toLowerCase();
  if (raw.includes('luxury')) {
    return {
      category: 'Luxury Store',
      badge: 'Trending',
      compatibility: 'Shopify',
      score: '9.5',
      accent: 'from-fuchsia-500 via-rose-500 to-orange-500',
      blurb:
        'High-end storefront direction for modern brands, premium catalogs, and stylish ecommerce presentation.',
    };
  }
  if (raw.includes('bluevinza')) {
    return {
      category: 'Corporate',
      badge: 'Agency Pick',
      compatibility: 'WordPress',
      score: '9.3',
      accent: 'from-sky-500 via-blue-500 to-indigo-500',
      blurb:
        'Corporate website theme for company profiles, consulting, services, and polished business presentation.',
    };
  }
  if (raw.includes('lumina')) {
    return {
      category: 'Editorial',
      badge: 'Newest',
      compatibility: 'WordPress',
      score: '9.1',
      accent: 'from-violet-500 via-fuchsia-500 to-pink-500',
      blurb:
        'Editorial theme with magazine sections, article-first layouts, and typography-driven storytelling.',
    };
  }
  if (raw.includes('html-theme')) {
    return {
      category: 'HTML Template',
      badge: 'Preview',
      compatibility: 'HTML',
      score: '8.8',
      accent: 'from-emerald-500 via-teal-500 to-cyan-500',
      blurb:
        'Lightweight HTML preview template for quick demos and static landing pages.',
    };
  }
  return {
    category: 'Portfolio',
    badge: 'Creator Pick',
    compatibility: 'WordPress',
    score: '8.9',
    accent: 'from-amber-500 via-orange-500 to-rose-500',
    blurb:
      'Portfolio theme for personal brands, creators, freelancers, and visual showcase pages.',
  };
};

const getThemeDescription = (theme: ThemeSummary) =>
  theme.description?.trim() || getThemeMeta(theme).blurb;

const getThemeDisplayName = (theme: ThemeSummary) => {
  const raw = theme.id.toLowerCase();
  if (raw.includes('luxury')) return 'Vinza Luxury Commerce';
  if (raw.includes('bluevinza')) return 'BlueVinza Business Studio';
  if (raw.includes('lumina')) return 'Lumina Editorial Journal';
  if (raw.includes('signature')) return 'Signature Portfolio Canvas';
  if (raw.includes('html-theme')) return 'HTML Theme Preview';
  return formatThemeTitle(theme);
};

const sortThemes = (themes: ThemeSummary[], mode: SortMode) => {
  const next = [...themes];
  if (mode === 'name') {
    return next.sort((a, b) => formatThemeTitle(a).localeCompare(formatThemeTitle(b)));
  }
  if (mode === 'files') {
    return next.sort((a, b) => b.fileCount - a.fileCount);
  }
  return next.sort((a, b) => parseFloat(getThemeMeta(b).score) - parseFloat(getThemeMeta(a).score));
};

export const ThemesPage = () => {
  const [themes, setThemes] = useState<ThemeSummary[]>([]);
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('popular');
  const [loading, setLoading] = useState(false);
  const [buildingPreview, setBuildingPreview] = useState<string>('');
  const [downloadingThemeId, setDownloadingThemeId] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [error, setError] = useState('');

  const loadThemes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/shopify/themes');
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('Theme service is temporarily unavailable.');
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load themes');
      setThemes(sortThemes(data.themes || [], sortMode));
    } catch (err: any) {
      setThemes(sortThemes(FALLBACK_THEMES, sortMode));
      setError(err.message || 'Unable to load themes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThemes();
  }, []);

  useEffect(() => {
    setThemes((prev) => sortThemes(prev, sortMode));
  }, [sortMode]);

  const filteredThemes = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sortThemes(
      themes.filter((theme) =>
        !term
          ? true
          : [theme.name, theme.relativePath, getThemeDescription(theme), getThemeMeta(theme).category, getThemeMeta(theme).compatibility]
              .join(' ')
              .toLowerCase()
              .includes(term)
      ),
      sortMode
    );
  }, [themes, search, sortMode]);

  const openPreviewInNewTab = async (theme: ThemeSummary) => {
    setError('');
    setStatusNote('');
    const popup = window.open('', '_blank', 'noopener,noreferrer');
    try {
      if (!theme.hasPreview && !theme.canBuildPreview) {
        setStatusNote('Preview will be available soon for this theme.');
        if (popup && !popup.closed) popup.close();
        return;
      }
      if (theme.hasPreview) {
        const href = await apiHref(`/theme-preview/${encodeURIComponent(theme.id)}`);
        if (popup) {
          popup.location.href = href;
        } else {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
        setStatusNote(`${getThemeDisplayName(theme)} preview opened in a new tab.`);
        return;
      }

      if (theme.canBuildPreview) {
        setBuildingPreview(theme.id);
        const res = await apiFetch(`/api/shopify/themes/${encodeURIComponent(theme.id)}/prepare-preview`, {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to prepare preview');
        await loadThemes();
        const href = await apiHref(`/theme-preview/${encodeURIComponent(theme.id)}`);
        if (popup) {
          popup.location.href = href;
        } else {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
        setStatusNote(`${getThemeDisplayName(theme)} preview opened in a new tab.`);
      }
    } catch (err: any) {
      if (popup && !popup.closed) popup.close();
      setError(err.message || 'Could not open theme preview.');
    } finally {
      setBuildingPreview('');
    }
  };

  const downloadTheme = async (themeId: string) => {
    const target = themes.find((item) => item.id === themeId);
    if (target?.isFallback) {
      setStatusNote('Downloads are temporarily unavailable. Please try again later.');
      return;
    }
    setDownloadingThemeId(themeId);
    setStatusNote('Preparing theme download...');
    setError('');
    try {
      const res = await apiFetch(`/api/shopify/themes/${encodeURIComponent(themeId)}/download`);
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Theme download failed');
      }

      const blob = await res.blob();
      const href = window.URL.createObjectURL(blob);
      const filename =
        res.headers
          .get('content-disposition')
          ?.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i)?.[1]
          ?.replace(/['"]/g, '') || `${themeId}.zip`;

      const link = document.createElement('a');
      link.href = href;
      link.download = decodeURIComponent(filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(href);
      setStatusNote('Theme download started successfully.');
    } catch (err: any) {
      setError(err.message || 'Theme download failed.');
      setStatusNote('');
    } finally {
      setDownloadingThemeId('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0a0a] px-4 py-6 md:px-6">
      <div className="mx-auto max-w-[1450px] space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#151010] shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr,0.8fr] lg:p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-rose-300">
                <Sparkles size={14} />
                Theme Library
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                Browse ready-made themes with a cleaner marketplace view
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
                Pick a theme, open the preview in a new tab, and download the full package without extra clutter under the cards.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-[#0f0a0a] p-5">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-rose-400">Library Status</div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-black text-white">{filteredThemes.length}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">Themes</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-black text-white">{filteredThemes.filter((item) => item.hasPreview).length}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">Live Preview</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-black text-white">{filteredThemes.reduce((sum, item) => sum + item.fileCount, 0)}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">Files</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-[1.6rem] border border-white/10 bg-[#151010] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-[240px] flex-1 lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search themes..."
              className="w-full rounded-full border border-white/10 bg-[#0f0a0a] py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-rose-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Best sellers', value: 'popular' as SortMode },
              { label: 'Newest', value: 'name' as SortMode },
              { label: 'Most files', value: 'files' as SortMode },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setSortMode(item.value)}
                className={`vinza-button rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  sortMode === item.value
                    ? 'border-white bg-white text-black'
                    : 'border-white/10 bg-transparent text-slate-300 hover:border-white/20 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={loadThemes}
              className="vinza-button flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0f0a0a] shadow-sm transition hover:shadow-lg hover:shadow-rose-500/15"
              aria-label="Refresh themes"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}
        {statusNote && !error && <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-200">{statusNote}</div>}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredThemes.map((theme) => {
            const meta = getThemeMeta(theme);
            return (
              <article
                key={theme.id}
                className="group overflow-hidden rounded-[0.95rem] border border-white/10 bg-[#151010] shadow-[0_20px_55px_rgba(0,0,0,0.34)] transition-all duration-300 hover:-translate-y-1 hover:border-rose-400/25 hover:shadow-[0_28px_70px_rgba(244,63,94,0.12)]"
              >
                <div className="relative overflow-hidden border-b border-white/10 bg-[#120d0d]">
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${meta.accent}`} />
                  <img
                    src={THEME_COVERS[theme.id] || vinzaLuxuryStorefrontCover}
                    alt={`${getThemeDisplayName(theme)} cover`}
                    className="h-[220px] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.035] sm:h-[250px]"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#151010] via-[#151010]/30 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    <Star size={12} className="fill-current" />
                    {meta.badge}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <div className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      {meta.category}
                    </div>
                    <div className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      {meta.compatibility}
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-400">
                        {theme.hasPreview ? 'Live Preview Ready' : 'Build Preview Available'}
                      </div>
                      <h2 className="mt-2 text-2xl font-black leading-tight text-white">{getThemeDisplayName(theme)}</h2>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center">
                      <div className="text-lg font-black text-white">{meta.score}</div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Score</div>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-slate-400">{getThemeDescription(theme)}</p>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
                      {theme.fileCount} files
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
                      {theme.hasPreview ? 'Live Preview' : 'Preview Ready'}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
                      {meta.compatibility}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => openPreviewInNewTab(theme)}
                      disabled={buildingPreview === theme.id}
                      className="vinza-button flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {buildingPreview === theme.id ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <ArrowUpRight size={16} />
                      )}
                      {buildingPreview === theme.id ? 'Preparing...' : 'Preview'}
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadTheme(theme.id)}
                      disabled={downloadingThemeId === theme.id}
                      className="vinza-button flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:border-rose-400/25 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {downloadingThemeId === theme.id ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                      {downloadingThemeId === theme.id ? 'Preparing...' : 'Download'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!loading && filteredThemes.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-rose-500/20 bg-[#151010] px-6 py-16 text-center text-slate-500 shadow-[0_18px_50px_rgba(0,0,0,0.4)]">
            <Sparkles size={48} className="mx-auto mb-4 text-rose-500/20" />
            <p>No themes found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
