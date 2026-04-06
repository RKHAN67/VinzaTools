import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode, RefreshCw } from 'lucide-react';

export const QRCodeGenerator = () => {
  const [text, setText] = useState('https://vinzatools.com');
  const [size, setSize] = useState(280);
  const [dark, setDark] = useState('#111111');
  const [light, setLight] = useState('#ffffff');
  const [image, setImage] = useState('');

  useEffect(() => {
    QRCode.toDataURL(text || 'https://vinzatools.com', {
      width: size,
      margin: 2,
      color: { dark, light },
    }).then(setImage);
  }, [text, size, dark, light]);

  return (
    <div className="min-h-[620px] bg-[#0a0505] rounded-[28px] border border-rose-500/20 p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
          <QrCode className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">QR Code Generator</h2>
          <p className="text-sm text-rose-200/60">Create QR codes for URLs, contact cards, events, and product pages.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,0.9fr] gap-6">
        <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
          <label className="text-xs uppercase tracking-[0.25em] text-rose-300/60">Text or URL</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 rounded-2xl border border-white/10 bg-[#0f0a0a] p-4 text-white outline-none focus:border-rose-500/40"
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="text-sm text-slate-300 space-y-2">
              <span className="block">Size</span>
              <input type="range" min={180} max={420} step={20} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-rose-500 cursor-pointer" />
            </label>
            <label className="text-sm text-slate-300 space-y-2">
              <span className="block">Foreground</span>
              <input type="color" value={dark} onChange={(e) => setDark(e.target.value)} className="w-full h-11 rounded-xl bg-transparent cursor-pointer" />
            </label>
            <label className="text-sm text-slate-300 space-y-2">
              <span className="block">Background</span>
              <input type="color" value={light} onChange={(e) => setLight(e.target.value)} className="w-full h-11 rounded-xl bg-transparent cursor-pointer" />
            </label>
          </div>
          <button onClick={() => setText('https://vinzatools.com')} className="cursor-pointer px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
            <RefreshCw size={16} />
            Reset Demo
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 flex flex-col items-center justify-center gap-5">
          <div className="rounded-[32px] bg-white p-5 shadow-2xl">
            {image && <img src={image} alt="QR code" className="w-[280px] max-w-full" />}
          </div>
          <a
            href={image}
            download="vinzatools-qr-code.png"
            className="cursor-pointer px-5 py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Download QR Code
          </a>
        </div>
      </div>
    </div>
  );
};

