import { useMemo, useState } from 'react';
import { CaseSensitive, Check, Copy, RefreshCw } from 'lucide-react';

const titleCase = (value: string) =>
  value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

export const CaseConverter = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const outputs = useMemo(
    () => ({
      uppercase: text.toUpperCase(),
      lowercase: text.toLowerCase(),
      titlecase: titleCase(text),
      sentencecase:
        text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
    }),
    [text]
  );

  const copy = async (key: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-[620px] bg-[#0a0505] rounded-[28px] border border-rose-500/20 p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <CaseSensitive className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Case Converter</h2>
          <p className="text-sm text-rose-200/60">Switch text to uppercase, lowercase, title case, or sentence case.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,1fr] gap-6">
        <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-[0.25em] text-rose-300/60">Input Text</label>
            <button
              onClick={() => setText('')}
              className="cursor-pointer px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors text-sm font-bold flex items-center gap-2"
            >
              <RefreshCw size={15} />
              Clear
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text here..."
            className="w-full h-96 rounded-2xl border border-white/10 bg-[#0f0a0a] p-4 text-white outline-none focus:border-rose-500/40"
          />
        </div>

        <div className="space-y-4">
          {[
            ['uppercase', 'UPPERCASE'],
            ['lowercase', 'lowercase'],
            ['titlecase', 'Title Case'],
            ['sentencecase', 'Sentence case'],
          ].map(([key, label]) => (
            <div key={key} className="rounded-3xl border border-white/10 bg-[#151010] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-black">{label}</h3>
                <button
                  onClick={() => copy(key, outputs[key as keyof typeof outputs])}
                  className="cursor-pointer px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 transition-colors text-sm font-bold flex items-center gap-2"
                >
                  {copied === key ? <Check size={15} /> : <Copy size={15} />}
                  {copied === key ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="min-h-24 rounded-2xl border border-white/10 bg-[#0f0a0a] p-4 text-slate-200 whitespace-pre-wrap">
                {outputs[key as keyof typeof outputs] || <span className="text-slate-500">Converted text will appear here.</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
