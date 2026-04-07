import React, { useEffect, useMemo, useState } from 'react';
import { Copy, KeyRound, ShieldCheck } from 'lucide-react';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const cleanSecret = (value: string) =>
  value
    .toUpperCase()
    .replace(/[^A-Z2-7]/g, '')
    .replace(/=+$/g, '');

const base32ToBytes = (input: string) => {
  const cleaned = cleanSecret(input);
  let bits = 0;
  let buffer = 0;
  const output: number[] = [];

  for (const char of cleaned) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) continue;
    buffer = (buffer << 5) | index;
    bits += 5;

    if (bits >= 8) {
      output.push((buffer >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
};

const getCounter = (timeMs: number) => Math.floor(timeMs / 1000 / 30);

const getTimeLeft = (timeMs: number) => 30 - (Math.floor(timeMs / 1000) % 30);

const formatCode = (code: number) => code.toString().padStart(6, '0');

const generateTotp = async (secret: string, timeMs: number) => {
  const keyBytes = base32ToBytes(secret);
  if (!keyBytes.length) throw new Error('Secret looks empty or invalid.');

  const counter = getCounter(timeMs);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(0, Math.floor(counter / 0x100000000));
  view.setUint32(4, counter);

  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, buffer));
  const offset = signature[signature.length - 1] & 0x0f;
  const binary =
    ((signature[offset] & 0x7f) << 24) |
    ((signature[offset + 1] & 0xff) << 16) |
    ((signature[offset + 2] & 0xff) << 8) |
    (signature[offset + 3] & 0xff);

  return formatCode(binary % 1000000);
};

export const GoogleAuthenticator = () => {
  const [secret, setSecret] = useState('');
  const [issuer, setIssuer] = useState('VinzaTools');
  const [label, setLabel] = useState('vinzatools');
  const [code, setCode] = useState('------');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(Date.now()));
  const [lastCounter, setLastCounter] = useState(getCounter(Date.now()));
  const [copied, setCopied] = useState('');

  const otpauth = useMemo(() => {
    const cleaned = cleanSecret(secret);
    if (!cleaned) return '';
    const encodedLabel = encodeURIComponent(label || 'vinzatools');
    const encodedIssuer = encodeURIComponent(issuer || 'VinzaTools');
    return `otpauth://totp/${encodedIssuer}:${encodedLabel}?secret=${cleaned}&issuer=${encodedIssuer}`;
  }, [secret, issuer, label]);

  const refreshCode = async (now = Date.now()) => {
    if (!secret.trim()) {
      setCode('------');
      setError('');
      return;
    }

    if (!crypto?.subtle) {
      setError('Your browser does not support secure crypto for TOTP generation.');
      setCode('------');
      return;
    }

    try {
      setError('');
      const next = await generateTotp(secret, now);
      setCode(next);
    } catch (err: any) {
      setError(err.message || 'Failed to generate code.');
      setCode('------');
    }
  };

  useEffect(() => {
    const tick = async () => {
      const now = Date.now();
      const counter = getCounter(now);
      const remaining = getTimeLeft(now);
      setTimeLeft(remaining);

      if (counter !== lastCounter) {
        setLastCounter(counter);
        await refreshCode(now);
      }
    };

    refreshCode();
    const timer = window.setInterval(() => {
      tick();
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secret, lastCounter]);

  const handleCopy = async (value: string, labelValue: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(labelValue);
      window.setTimeout(() => setCopied(''), 2000);
    } catch {
      setCopied('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1414] via-[#1c1315] to-[#151010] p-6 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-rose-200">
              <ShieldCheck size={14} />
              Two-Factor Helper
            </div>
            <h2 className="mt-4 text-3xl font-black text-white">Google Authenticator Codes</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
              Generate time-based OTP codes from your secret key. Use this for quick login testing or backup code checks.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
            <div className="text-3xl font-black tracking-[0.32em] text-white">{code}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.24em] text-rose-200">{timeLeft}s left</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-[#151010] p-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.24em] text-rose-300">Secret (Base32)</label>
            <input
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="JBSWY3DPEHPK3PXP"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0f0a0a] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
            />
            {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.24em] text-rose-300">Issuer</label>
              <input
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0f0a0a] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.24em] text-rose-300">Account Label</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0f0a0a] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => refreshCode()}
              className="vinza-button inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition hover:bg-rose-600"
            >
              <KeyRound size={16} />
              Generate Now
            </button>
            <button
              type="button"
              onClick={() => handleCopy(code, 'code')}
              className="vinza-button inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-rose-400/30 hover:bg-white/10"
            >
              <Copy size={16} />
              {copied === 'code' ? 'Copied' : 'Copy Code'}
            </button>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-[#151010] p-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-rose-300">Authenticator Setup Link</div>
            <p className="mt-2 text-sm text-slate-400">
              Use this otpauth link in your authenticator app to register the secret quickly.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0f0a0a] p-4 text-xs text-slate-300 break-all">
            {otpauth || 'Enter a secret to generate an otpauth link.'}
          </div>

          <button
            type="button"
            onClick={() => otpauth && handleCopy(otpauth, 'otpauth')}
            disabled={!otpauth}
            className="vinza-button inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-rose-400/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Copy size={16} />
            {copied === 'otpauth' ? 'Copied' : 'Copy Setup Link'}
          </button>

          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-200">
            Tip: Keep your secret private. This tool runs fully in your browser and does not save secrets.
          </div>
        </div>
      </div>
    </div>
  );
};
