import { useMemo, useState } from 'react';
import { Check, Copy, Fingerprint, RefreshCw } from 'lucide-react';

const createUuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
        const r = (Math.random() * 16) | 0;
        const v = char === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

export const UuidGenerator = () => {
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const uuids = useMemo(() => Array.from({ length: count }, () => createUuid()), [count, seed]);

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-[560px] bg-[#0a0505] rounded-[28px] border border-rose-500/20 p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
          <Fingerprint className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">UUID Generator</h2>
          <p className="text-sm text-rose-200/60">Generate unique IDs for databases, APIs, forms, and tracking events.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          {[5, 10, 20].map((value) => (
            <button
              key={value}
              onClick={() => setCount(value)}
              className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                count === value ? 'bg-rose-500 text-white' : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {value} IDs
            </button>
          ))}
          <button onClick={() => setSeed((v) => v + 1)} className="cursor-pointer px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
            <RefreshCw size={15} />
            Refresh
          </button>
          <button onClick={copyAll} className="cursor-pointer px-4 py-2 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors flex items-center gap-2">
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied' : 'Copy All'}
          </button>
        </div>

        <div className="grid gap-3">
          {uuids.map((uuid) => (
            <div key={uuid} className="rounded-2xl border border-white/10 bg-[#0f0a0a] p-4 text-white font-mono text-sm break-all">
              {uuid}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
