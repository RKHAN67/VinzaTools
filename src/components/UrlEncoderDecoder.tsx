import { useState } from 'react';
import { ArrowLeftRight, Check, Copy, Link2, RotateCcw } from 'lucide-react';

export const UrlEncoderDecoder = () => {
  const [input, setInput] = useState('');
  const [encoded, setEncoded] = useState('');
  const [decoded, setDecoded] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<'encoded' | 'decoded' | null>(null);

  const handleEncode = () => {
    setError('');
    const result = encodeURIComponent(input);
    setEncoded(result);
    setDecoded('');
  };

  const handleDecode = () => {
    try {
      setError('');
      const result = decodeURIComponent(input);
      setDecoded(result);
      setEncoded('');
    } catch {
      setError('This text is not a valid encoded URL string.');
    }
  };

  const handleSwap = () => {
    setInput(encoded || decoded || input);
    setEncoded('');
    setDecoded('');
    setError('');
  };

  const copyText = async (value: string, target: 'encoded' | 'decoded') => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(target);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-[620px] bg-[#0a0505] rounded-[28px] border border-rose-500/20 p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 flex items-center justify-center">
          <Link2 className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">URL Encoder & Decoder</h2>
          <p className="text-sm text-rose-200/60">Encode links for query strings or decode them back to readable text.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
          <label className="text-xs uppercase tracking-[0.25em] text-rose-300/60">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste URL text here..."
            className="w-full h-72 rounded-2xl border border-white/10 bg-[#0f0a0a] p-4 text-white outline-none focus:border-rose-500/40"
          />
          <div className="flex flex-wrap gap-3">
            <button onClick={handleEncode} className="cursor-pointer px-4 py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors">
              Encode
            </button>
            <button onClick={handleDecode} className="cursor-pointer px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors">
              Decode
            </button>
            <button onClick={handleSwap} className="cursor-pointer px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
              <ArrowLeftRight size={16} />
              Use Result as Input
            </button>
            <button onClick={() => { setInput(''); setEncoded(''); setDecoded(''); setError(''); }} className="cursor-pointer px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
          {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}
        </div>

        <div className="space-y-6">
          {[
            { label: 'Encoded Output', value: encoded, target: 'encoded' as const },
            { label: 'Decoded Output', value: decoded, target: 'decoded' as const },
          ].map((block) => (
            <div key={block.label} className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-black">{block.label}</h3>
                <button
                  onClick={() => copyText(block.value, block.target)}
                  className="cursor-pointer px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 transition-colors flex items-center gap-2 text-sm font-bold"
                >
                  {copied === block.target ? <Check size={15} /> : <Copy size={15} />}
                  {copied === block.target ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="min-h-40 rounded-2xl border border-white/10 bg-[#0f0a0a] p-4 text-slate-200 break-all">
                {block.value || <span className="text-slate-500">Your result will appear here.</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
