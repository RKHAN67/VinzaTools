import React, { useMemo, useState } from 'react';
import { Archive, Clock3, Download, Scale, Sparkles, Upload } from 'lucide-react';
import JSZip from 'jszip';

export type UtilityMode = 'unit-converter' | 'time-converter' | 'archive-converter';

interface UtilityConvertersProps {
  mode: UtilityMode;
}

const UNIT_GROUPS = {
  length: {
    label: 'Length',
    units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254 },
  },
  weight: {
    label: 'Weight',
    units: { kg: 1, g: 0.001, lb: 0.45359237, oz: 0.0283495 },
  },
  storage: {
    label: 'Storage',
    units: { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 },
  },
} as const;

export const UtilityConverters = ({ mode }: UtilityConvertersProps) => {
  const [category, setCategory] = useState<keyof typeof UNIT_GROUPS>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [value, setValue] = useState('1');
  const [timeValue, setTimeValue] = useState('60');
  const [timeFrom, setTimeFrom] = useState('seconds');
  const [timeTo, setTimeTo] = useState('minutes');
  const [files, setFiles] = useState<File[]>([]);
  const [archiveUrl, setArchiveUrl] = useState('');
  const [archiveName, setArchiveName] = useState('');

  const unitOptions = UNIT_GROUPS[category].units;

  const convertedValue = useMemo(() => {
    const numeric = Number(value || 0);
    const base = numeric * unitOptions[fromUnit as keyof typeof unitOptions];
    return base / unitOptions[toUnit as keyof typeof unitOptions];
  }, [fromUnit, toUnit, unitOptions, value]);

  const convertedTime = useMemo(() => {
    const multipliers: Record<string, number> = {
      seconds: 1,
      minutes: 60,
      hours: 3600,
      days: 86400,
    };
    const numeric = Number(timeValue || 0);
    return (numeric * multipliers[timeFrom]) / multipliers[timeTo];
  }, [timeFrom, timeTo, timeValue]);

  const buildArchive = async () => {
    if (!files.length) return;
    const zip = new JSZip();
    for (const file of files) {
      zip.file(file.name, file);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    if (archiveUrl) URL.revokeObjectURL(archiveUrl);
    setArchiveUrl(URL.createObjectURL(blob));
    setArchiveName(`vinzatools-archive-${Date.now()}.zip`);
  };

  if (mode === 'archive-converter') {
    return (
      <div className="space-y-6 rounded-[2rem] border border-white/10 bg-[#130d0d] p-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-rose-400">
            <Sparkles size={14} />
            Utility Workflow
          </div>
          <h2 className="text-3xl font-black text-white">Archive Converter</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            Bundle uploaded files into a ready-to-download ZIP archive.
          </p>
        </div>

        <div className="rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
          <label className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-bold text-white">
            <Upload size={16} />
            Upload Files
            <input
              type="file"
              className="hidden"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
          </label>

          <div className="mt-5 space-y-3">
            {files.map((file) => (
              <div
                key={`${file.name}-${file.size}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
              >
                {file.name}
              </div>
            ))}
          </div>

          <button
            onClick={buildArchive}
            disabled={!files.length}
            className="mt-5 cursor-pointer inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Archive size={16} />
            Build ZIP Archive
          </button>

          {archiveUrl && (
            <a
              href={archiveUrl}
              download={archiveName}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white"
            >
              <Download size={16} />
              Download Archive
            </a>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'time-converter') {
    return (
      <div className="space-y-6 rounded-[2rem] border border-white/10 bg-[#130d0d] p-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-rose-400">
            <Sparkles size={14} />
            Utility Workflow
          </div>
          <h2 className="text-3xl font-black text-white">Time Converter</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            Convert seconds, minutes, hours, and days instantly.
          </p>
        </div>

        <div className="grid gap-4 rounded-[1.7rem] border border-white/10 bg-black/20 p-5 md:grid-cols-3">
          <label className="space-y-2 text-sm text-slate-300">
            <span>Value</span>
            <input
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span>From</span>
            <select
              value={timeFrom}
              onChange={(e) => setTimeFrom(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
            >
              {['seconds', 'minutes', 'hours', 'days'].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span>To</span>
            <select
              value={timeTo}
              onChange={(e) => setTimeTo(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
            >
              {['seconds', 'minutes', 'hours', 'days'].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-[1.7rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
            <Clock3 size={16} />
            Converted Value
          </div>
          <div className="text-3xl font-black text-emerald-200">
            {convertedTime.toFixed(4)} {timeTo}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-[2rem] border border-white/10 bg-[#130d0d] p-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-rose-400">
          <Sparkles size={14} />
          Utility Workflow
        </div>
        <h2 className="text-3xl font-black text-white">Unit Converter</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
          Convert common length, weight, and storage values without leaving the page.
        </p>
      </div>

      <div className="grid gap-4 rounded-[1.7rem] border border-white/10 bg-black/20 p-5 md:grid-cols-4">
        <label className="space-y-2 text-sm text-slate-300">
          <span>Category</span>
          <select
            value={category}
            onChange={(e) => {
              const next = e.target.value as keyof typeof UNIT_GROUPS;
              setCategory(next);
              const units = Object.keys(UNIT_GROUPS[next].units);
              setFromUnit(units[0]);
              setToUnit(units[1] || units[0]);
            }}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
          >
            {Object.entries(UNIT_GROUPS).map(([key, group]) => (
              <option key={key} value={key}>
                {group.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Value</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>From</span>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
          >
            {Object.keys(unitOptions).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>To</span>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
          >
            {Object.keys(unitOptions).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-[1.7rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
          <Scale size={16} />
          Converted Value
        </div>
        <div className="text-3xl font-black text-emerald-200">
          {convertedValue.toFixed(4)} {toUnit}
        </div>
      </div>
    </div>
  );
};

