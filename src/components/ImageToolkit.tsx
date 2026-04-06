import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Crop,
  Download,
  FlipHorizontal2,
  FlipVertical2,
  Image as ImageIcon,
  Pipette,
  RotateCw,
  ScanSearch,
  SlidersHorizontal,
  Sparkles,
  Upload,
} from 'lucide-react';

export type ImageToolkitMode =
  | 'resize'
  | 'crop'
  | 'rotate'
  | 'flip'
  | 'enlarge'
  | 'color-picker';

interface ImageToolkitProps {
  mode: ImageToolkitMode;
  title?: string;
  description?: string;
}

const TOOL_META: Record<ImageToolkitMode, { title: string; description: string }> = {
  resize: {
    title: 'Resize Image',
    description: 'Resize images with manual width and height controls.',
  },
  crop: {
    title: 'Crop Image',
    description: 'Crop image areas with percentage-based controls.',
  },
  rotate: {
    title: 'Rotate Image',
    description: 'Rotate images by any angle and export instantly.',
  },
  flip: {
    title: 'Flip Image',
    description: 'Flip your image horizontally or vertically in one click.',
  },
  enlarge: {
    title: 'Image Enlarger',
    description: 'Scale images up smoothly for previews and quick exports.',
  },
  'color-picker': {
    title: 'Color Picker',
    description: 'Pick exact colors from any uploaded image.',
  },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const ImageToolkit = ({
  mode,
  title,
  description,
}: ImageToolkitProps) => {
  const meta = TOOL_META[mode];
  const resolvedTitle = title || meta.title;
  const resolvedDescription = description || meta.description;
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string>('');
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [resizeWidth, setResizeWidth] = useState(1280);
  const [resizeHeight, setResizeHeight] = useState(720);
  const [rotation, setRotation] = useState(90);
  const [flipHorizontal, setFlipHorizontal] = useState(true);
  const [flipVertical, setFlipVertical] = useState(false);
  const [enlargeScale, setEnlargeScale] = useState(1.5);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(80);
  const [cropHeight, setCropHeight] = useState(80);
  const [pickedColor, setPickedColor] = useState('#ffffff');
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [sourceUrl, resultUrl]);

  const loadFile = (next: File) => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    const url = URL.createObjectURL(next);
    setFile(next);
    setSourceUrl(url);
    setResultUrl('');
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      setResizeWidth(img.naturalWidth);
      setResizeHeight(img.naturalHeight);
    };
    img.src = url;
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0];
    if (next) loadFile(next);
  };

  const drawProcessedImage = async () => {
    if (!file || !sourceUrl) return;
    setProcessing(true);

    try {
      const img = new Image();
      img.src = sourceUrl;
      await img.decode();

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');

      let outputWidth = img.naturalWidth;
      let outputHeight = img.naturalHeight;

      if (mode === 'resize') {
        outputWidth = resizeWidth;
        outputHeight = resizeHeight;
      } else if (mode === 'enlarge') {
        outputWidth = Math.round(img.naturalWidth * enlargeScale);
        outputHeight = Math.round(img.naturalHeight * enlargeScale);
      } else if (mode === 'crop') {
        outputWidth = Math.max(1, Math.round((img.naturalWidth * cropWidth) / 100));
        outputHeight = Math.max(1, Math.round((img.naturalHeight * cropHeight) / 100));
      } else if (mode === 'rotate') {
        const turns = Math.abs(rotation) % 180 === 90;
        outputWidth = turns ? img.naturalHeight : img.naturalWidth;
        outputHeight = turns ? img.naturalWidth : img.naturalHeight;
      }

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      if (mode === 'crop') {
        const sx = Math.round((img.naturalWidth * cropX) / 100);
        const sy = Math.round((img.naturalHeight * cropY) / 100);
        const sw = Math.max(1, Math.round((img.naturalWidth * cropWidth) / 100));
        const sh = Math.max(1, Math.round((img.naturalHeight * cropHeight) / 100));
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outputWidth, outputHeight);
      } else if (mode === 'rotate') {
        ctx.translate(outputWidth / 2, outputHeight / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      } else if (mode === 'flip') {
        ctx.save();
        ctx.translate(flipHorizontal ? outputWidth : 0, flipVertical ? outputHeight : 0);
        ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
        ctx.drawImage(img, 0, 0, outputWidth, outputHeight);
        ctx.restore();
      } else {
        ctx.drawImage(img, 0, 0, outputWidth, outputHeight);
      }

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((value) => {
          if (!value) {
            reject(new Error('Image export failed'));
            return;
          }
          resolve(value);
        }, 'image/png');
      });

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } finally {
      setProcessing(false);
    }
  };

  const handleCanvasPick = async (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (mode !== 'color-picker' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${[r, g, b]
      .map((value) => value.toString(16).padStart(2, '0'))
      .join('')}`;
    setPickedColor(hex);
    setRecentColors((prev) => [hex, ...prev.filter((item) => item !== hex)].slice(0, 8));

    if ('clipboard' in navigator) {
      try {
        await navigator.clipboard.writeText(hex);
      } catch {
        // ignore clipboard failures
      }
    }
  };

  useEffect(() => {
    if (mode !== 'color-picker' || !sourceUrl || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    };
    img.src = sourceUrl;
  }, [mode, sourceUrl]);

  const downloadName = useMemo(() => {
    const base = (file?.name || resolvedTitle)
      .replace(/\.[^.]+$/, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
    return `${base}-${mode}.png`;
  }, [file, mode, resolvedTitle]);

  const secondaryControls =
    mode === 'resize' ? (
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">
          <span>Width</span>
          <input
            type="number"
            min={1}
            value={resizeWidth}
            onChange={(e) => setResizeWidth(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Height</span>
          <input
            type="number"
            min={1}
            value={resizeHeight}
            onChange={(e) => setResizeHeight(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
          />
        </label>
      </div>
    ) : mode === 'crop' ? (
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ['X Start %', cropX, setCropX],
          ['Y Start %', cropY, setCropY],
          ['Width %', cropWidth, setCropWidth],
          ['Height %', cropHeight, setCropHeight],
        ].map(([label, value, setter]) => (
          <label key={label as string} className="space-y-2 text-sm text-slate-300">
            <span>{label as string}</span>
            <input
              type="range"
              min={0}
              max={label === 'Width %' || label === 'Height %' ? 100 : 95}
              value={value as number}
              onChange={(e) =>
                (setter as React.Dispatch<React.SetStateAction<number>>)(
                  clamp(Number(e.target.value), 0, 100)
                )
              }
              className="w-full accent-rose-500"
            />
            <div className="text-xs text-slate-500">{value as number}%</div>
          </label>
        ))}
      </div>
    ) : mode === 'rotate' ? (
      <label className="space-y-2 text-sm text-slate-300">
        <span>Rotation Angle</span>
        <select
          value={rotation}
          onChange={(e) => setRotation(Number(e.target.value))}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
        >
          {[90, 180, 270, 360].map((value) => (
            <option key={value} value={value}>
              {value}°
            </option>
          ))}
        </select>
      </label>
    ) : mode === 'flip' ? (
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => setFlipHorizontal((prev) => !prev)}
          className={`cursor-pointer rounded-2xl border px-4 py-4 text-left ${
            flipHorizontal
              ? 'border-rose-500/40 bg-rose-500/10 text-white'
              : 'border-white/10 bg-black/20 text-slate-400'
          }`}
        >
          <FlipHorizontal2 className="mb-2 text-rose-300" size={18} />
          Horizontal flip
        </button>
        <button
          onClick={() => setFlipVertical((prev) => !prev)}
          className={`cursor-pointer rounded-2xl border px-4 py-4 text-left ${
            flipVertical
              ? 'border-rose-500/40 bg-rose-500/10 text-white'
              : 'border-white/10 bg-black/20 text-slate-400'
          }`}
        >
          <FlipVertical2 className="mb-2 text-rose-300" size={18} />
          Vertical flip
        </button>
      </div>
    ) : mode === 'enlarge' ? (
      <label className="space-y-2 text-sm text-slate-300">
        <span>Scale Factor</span>
        <input
          type="range"
          min={1}
          max={4}
          step={0.1}
          value={enlargeScale}
          onChange={(e) => setEnlargeScale(Number(e.target.value))}
          className="w-full accent-rose-500"
        />
        <div className="text-xs text-slate-500">{enlargeScale.toFixed(1)}x</div>
      </label>
    ) : null;

  return (
    <div className="space-y-6 rounded-[2rem] border border-white/10 bg-[#130d0d] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-rose-400">
            <Sparkles size={14} />
            Image Workflow
          </div>
          <h2 className="text-3xl font-black text-white">{resolvedTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            {resolvedDescription}
          </p>
        </div>
        <label className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20">
          <Upload size={16} />
          Upload Image
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <div className="space-y-4 rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <SlidersHorizontal size={16} className="text-rose-300" />
            Tool Controls
          </div>
          {secondaryControls}

          {mode !== 'color-picker' && (
            <button
              onClick={drawProcessedImage}
              disabled={!file || processing}
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mode === 'crop' ? <Crop size={16} /> : mode === 'rotate' ? <RotateCw size={16} /> : <ImageIcon size={16} />}
              {processing ? 'Processing...' : `Run ${resolvedTitle}`}
            </button>
          )}

          {mode === 'color-picker' && (
            <div className="rounded-2xl border border-white/10 bg-[#110c0c] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                <Pipette size={15} className="text-rose-300" />
                Picked Color
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="h-14 w-14 rounded-2xl border border-white/10"
                  style={{ background: pickedColor }}
                />
                <div>
                  <div className="text-lg font-black text-white">{pickedColor}</div>
                  <div className="text-xs text-slate-500">Click any part of the image to sample</div>
                </div>
              </div>
              {recentColors.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {recentColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setPickedColor(color)}
                      className="cursor-pointer h-10 w-10 rounded-xl border border-white/10"
                      style={{ background: color }}
                      title={color}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <ScanSearch size={16} className="text-rose-300" />
            Preview
          </div>

          {!sourceUrl ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-[#0f0a0a] text-center">
              <div className="space-y-3">
                <ImageIcon size={36} className="mx-auto text-rose-400" />
                <p className="text-sm text-slate-400">Upload an image to start.</p>
              </div>
            </div>
          ) : mode === 'color-picker' ? (
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0f0a0a] p-4">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasPick}
                className="max-h-[520px] w-full cursor-crosshair rounded-2xl object-contain"
              />
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#0f0a0a] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <Upload size={13} />
                  Original
                </div>
                <img
                  src={sourceUrl}
                  alt="Original"
                  className="max-h-[420px] w-full rounded-2xl object-contain"
                />
                <div className="mt-3 text-xs text-slate-500">
                  {imageSize.width} x {imageSize.height}px
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-[#0f0a0a] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <Sparkles size={13} />
                  Output
                </div>
                {resultUrl ? (
                  <>
                    <img
                      src={resultUrl}
                      alt="Processed"
                      className="max-h-[420px] w-full rounded-2xl object-contain"
                    />
                    <a
                      href={resultUrl}
                      download={downloadName}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white"
                    >
                      <Download size={16} />
                      Download Result
                    </a>
                  </>
                ) : (
                  <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-slate-500">
                    Run the tool to preview the final result.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
