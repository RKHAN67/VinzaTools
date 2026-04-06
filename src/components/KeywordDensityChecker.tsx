import { useMemo, useState } from 'react';
import { BarChart3, Search } from 'lucide-react';

const STOP_WORDS = new Set([
  'the','and','for','with','that','this','from','your','have','into','you','are','was','were','but','not','can','our','their','his','her','its','about','than','then','they','them','there','what','when','where','which'
]);

export const KeywordDensityChecker = () => {
  const [text, setText] = useState('');

  const stats = useMemo<Array<{ keyword: string; count: number; density: string }>>(() => {
    const words: string[] = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
    const meaningful = words.filter((word) => word.length > 2 && !STOP_WORDS.has(word));
    const counts = meaningful.reduce<Record<string, number>>((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});
    const total = meaningful.length || 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([keyword, count]) => ({
        keyword,
        count,
        density: ((count / total) * 100).toFixed(2),
      }));
  }, [text]);

  return (
    <div className="min-h-[620px] bg-[#0a0505] rounded-[28px] border border-rose-500/20 p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <BarChart3 className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Keyword Density Checker</h2>
          <p className="text-sm text-rose-200/60">Check repeated keywords and topical focus for SEO content and blog drafts.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,0.9fr] gap-6">
        <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
          <label className="text-xs uppercase tracking-[0.25em] text-rose-300/60">Content Input</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste article, landing page copy, or blog content here..." className="w-full h-96 rounded-2xl border border-white/10 bg-[#0f0a0a] p-4 text-white outline-none focus:border-rose-500/40" />
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Search className="text-rose-400" size={18} />
            <h3 className="text-white font-black">Top Keywords</h3>
          </div>
          <div className="space-y-3">
            {stats.map((item) => (
              <div key={item.keyword} className="rounded-2xl border border-white/10 bg-[#0f0a0a] p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-white font-bold">{item.keyword}</p>
                  <p className="text-xs text-slate-400">{item.count} mentions</p>
                </div>
                <div className="text-rose-300 font-black">{item.density}%</div>
              </div>
            ))}
            {!stats.length && <p className="text-sm text-slate-500">Keyword insights will appear here after you paste content.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
