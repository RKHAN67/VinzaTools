import { useMemo, useState } from 'react';
import { Check, Copy, Link, RefreshCw } from 'lucide-react';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const SlugGenerator = () => {
  const [title, setTitle] = useState('');
  const [copied, setCopied] = useState(false);
  const slug = useMemo(() => slugify(title), [title]);

  const copy = async () => {
    if (!slug) return;
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-[560px] bg-[#0a0505] rounded-[28px] border border-rose-500/20 p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <Link className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">SEO Slug Generator</h2>
          <p className="text-sm text-rose-200/60">Turn titles into clean, search-friendly URL slugs for pages and blogs.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-6">
        <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
          <label className="text-xs uppercase tracking-[0.25em] text-rose-300/60">Page Title or Headline</label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: Best PDF Tools for Students in Pakistan"
            className="w-full h-56 rounded-2xl border border-white/10 bg-[#0f0a0a] p-4 text-white outline-none focus:border-rose-500/40"
          />
          <div className="flex gap-3">
            <button
              onClick={copy}
              className="cursor-pointer px-4 py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors flex items-center gap-2"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy Slug'}
            </button>
            <button
              onClick={() => setTitle('')}
              className="cursor-pointer px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Reset
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-rose-300/60">Generated Slug</p>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-emerald-300 font-bold break-all">
            {slug || 'your-seo-slug-will-appear-here'}
          </div>
          <div className="space-y-2 text-sm text-slate-300">
            <p>Good slugs are short, readable, and keyword-focused.</p>
            <p>Avoid stop words, dates, and random numbers unless needed.</p>
            <p>Use the same slug in page URLs, blog posts, and landing pages.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
