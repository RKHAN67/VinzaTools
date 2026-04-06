import { useMemo, useState } from 'react';
import { Check, Copy, Palette, Shuffle } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

const randomHex = () =>
  `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;

export const ColorPaletteGenerator = () => {
  const [baseColor, setBaseColor] = useState('#ff4d6d');
  const [copied, setCopied] = useState<string | null>(null);

  const palette = useMemo(() => {
    const clean = baseColor.replace('#', '');
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const shift = (amount: number) => {
      const clamp = (value: number) => Math.max(0, Math.min(255, value));
      return `#${[clamp(r + amount), clamp(g + amount), clamp(b + amount)]
        .map((value) => value.toString(16).padStart(2, '0'))
        .join('')}`;
    };

    return [shift(60), shift(30), baseColor, shift(-30), shift(-60)];
  }, [baseColor]);

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(null), 1400);
  };

  return (
    <div className="min-h-[620px] bg-[#0a0505] rounded-[28px] border border-rose-500/20 p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
          <Palette className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Color Palette Generator</h2>
          <p className="text-sm text-rose-200/60">Build brand palettes for posters, sites, and social media designs.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[0.8fr,1.2fr] gap-6">
        <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
          <HexColorPicker color={baseColor} onChange={setBaseColor} className="!w-full" />
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f0a0a] p-4">
            <span className="text-slate-300">Base Color</span>
            <span className="text-white font-black">{baseColor.toUpperCase()}</span>
          </div>
          <button
            onClick={() => setBaseColor(randomHex())}
            className="cursor-pointer w-full px-4 py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
          >
            <Shuffle size={16} />
            Random Palette
          </button>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {palette.map((color) => (
            <button
              key={color}
              onClick={() => copy(color)}
              className="cursor-pointer rounded-3xl border border-white/10 overflow-hidden bg-[#151010] text-left hover:border-rose-500/30 transition-colors"
            >
              <div className="h-44" style={{ backgroundColor: color }} />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-black">{color.toUpperCase()}</span>
                  {copied === color ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} className="text-slate-400" />}
                </div>
                <p className="text-xs text-slate-400">Click to copy</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
