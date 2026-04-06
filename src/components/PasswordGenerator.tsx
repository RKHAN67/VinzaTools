import { useMemo, useState } from 'react';
import { Check, Copy, KeyRound, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

const randomChar = (source: string) => source[Math.floor(Math.random() * source.length)];

const buildPassword = (length: number, options: Record<string, boolean>) => {
  const sets = {
    uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
    lowercase: 'abcdefghijkmnopqrstuvwxyz',
    numbers: '23456789',
    symbols: '!@#$%^&*()_+-={}[]<>?',
  };

  const activeSets = Object.entries(options).filter(([, enabled]) => enabled);
  if (!activeSets.length) return '';

  const required = activeSets.map(([key]) => randomChar(sets[key as keyof typeof sets]));
  const pool = activeSets.map(([key]) => sets[key as keyof typeof sets]).join('');
  const remaining = Array.from({ length: Math.max(0, length - required.length) }, () =>
    randomChar(pool)
  );

  return [...required, ...remaining]
    .sort(() => Math.random() - 0.5)
    .join('')
    .slice(0, length);
};

export const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState(0);

  const password = useMemo(() => buildPassword(length, options), [length, options, seed]);
  const strength = useMemo(() => {
    let score = 0;
    score += length >= 12 ? 1 : 0;
    score += Number(options.uppercase);
    score += Number(options.lowercase);
    score += Number(options.numbers);
    score += Number(options.symbols);
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: '30%' };
    if (score <= 4) return { label: 'Good', color: 'bg-amber-500', width: '65%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  }, [length, options]);

  const toggleOption = (key: keyof typeof options) =>
    setOptions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (Object.values(next).every((value) => !value)) return prev;
      return next;
    });

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-[640px] bg-[#0a0505] rounded-[28px] border border-rose-500/20 p-6 md:p-8 space-y-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(244,63,94,0.12),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(249,115,22,0.12),_transparent_30%)] pointer-events-none" />
      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <KeyRound className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Secure Password Generator</h2>
              <p className="text-sm text-rose-200/60">
                Generate strong passwords for accounts, apps, and admin panels.
              </p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-[0.2em]">
            Private Tool
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.3fr,0.7fr] gap-6">
          <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-5">
            <div className="rounded-2xl border border-rose-500/20 bg-[#0f0a0a] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-rose-300/60 mb-2">Generated Password</p>
                  <p className="text-white text-xl md:text-2xl font-black break-all">{password || 'Select at least one rule'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSeed((v) => v + 1)}
                    className="cursor-pointer p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors"
                  >
                    <RefreshCw size={18} />
                  </button>
                  <button
                    onClick={handleCopy}
                    className="cursor-pointer px-4 py-3 rounded-xl border border-rose-500/20 bg-rose-500 text-white font-bold flex items-center gap-2 hover:bg-rose-600 transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-rose-200/70">Password Length</span>
                <span className="text-white font-bold">{length} characters</span>
              </div>
              <input
                type="range"
                min={8}
                max={48}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ['uppercase', 'Uppercase letters'],
                ['lowercase', 'Lowercase letters'],
                ['numbers', 'Numbers'],
                ['symbols', 'Symbols'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleOption(key as keyof typeof options)}
                  className={`cursor-pointer rounded-2xl border p-4 text-left transition-all ${
                    options[key as keyof typeof options]
                      ? 'border-rose-500/40 bg-rose-500/10 text-white'
                      : 'border-white/10 bg-[#0f0a0a] text-slate-400'
                  }`}
                >
                  <p className="font-bold">{label}</p>
                  <p className="text-xs mt-1 opacity-70">Tap to include or remove</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-400" size={18} />
                <h3 className="text-white font-black">Strength Meter</h3>
              </div>
              <div className="h-3 rounded-full bg-black/40 overflow-hidden">
                <div className={`h-full ${strength.color}`} style={{ width: strength.width }} />
              </div>
              <p className="text-sm text-slate-300">
                Current strength: <span className="text-white font-bold">{strength.label}</span>
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Sparkles className="text-amber-400" size={18} />
                <h3 className="text-white font-black">Helpful Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Use 12+ characters for better security.</li>
                <li>Mix letters, numbers, and symbols.</li>
                <li>Avoid reusing the same password on multiple sites.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
