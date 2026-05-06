import React, { useEffect, useMemo, useState } from 'react';
import {
  Upload,
  Trash2,
  Plus,
  FolderOpen,
  ShieldCheck,
  Cpu,
  Image as ImageIcon,
} from 'lucide-react';

interface ImageEntry {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface PreviewData {
  url: string;
  size: number;
  format: 'webp' | 'jpeg';
}

interface DiffStats {
  pixelCount: number;
  changedPixels: number;
  differencePercent: number;
}

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unable to read file'));
      }
    };
    reader.onerror = () => reject(new Error('File load failed'));
    reader.readAsDataURL(file);
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Unsupported image format'));
    img.src = src;
  });

const toBlobAsync = (
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create image'));
          return;
        }
        resolve(blob);
      },
      type,
      quality
    );
  });

const compressImageToTarget = async (
  src: string,
  targetBytes: number,
  format: 'image/webp' | 'image/jpeg'
): Promise<PreviewData> => {
  const img = await loadImage(src);
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  let currentFormat = format;
  let bestBlob: Blob | null = null;

  const compress = async () => {
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    let low = 0.12;
    let high = 0.92;
    let lastGood: Blob | null = null;
    let candidate: Blob | null = null;

    while (high - low > 0.03) {
      const quality = (low + high) / 2;
      candidate = await toBlobAsync(canvas, currentFormat, quality);
      if (candidate.size <= targetBytes) {
        lastGood = candidate;
        low = quality;
      } else {
        high = quality;
      }
    }

    if (lastGood) {
      return lastGood;
    }

    if (candidate) {
      return candidate;
    }

    throw new Error('Unable to compress image');
  };

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const blob = await compress();
      if (blob.size <= targetBytes || attempt === 2) {
        return {
          url: URL.createObjectURL(blob),
          size: blob.size,
          format: currentFormat === 'image/webp' ? 'webp' : 'jpeg',
        };
      }
      bestBlob = blob;
    } catch {
      if (currentFormat === 'image/webp') {
        currentFormat = 'image/jpeg';
      } else {
        throw new Error('Compression format not supported');
      }
    }

    width = Math.max(320, Math.round(width * 0.85));
    height = Math.max(320, Math.round(height * 0.85));
  }

  if (bestBlob) {
    return {
      url: URL.createObjectURL(bestBlob),
      size: bestBlob.size,
      format: currentFormat === 'image/webp' ? 'webp' : 'jpeg',
    };
  }

  throw new Error('Unable to generate preview');
};

const buildDiffMap = async (
  leftUrl: string,
  rightUrl: string
): Promise<{ url: string; stats: DiffStats }> => {
  const [left, right] = await Promise.all([
    loadImage(leftUrl),
    loadImage(rightUrl),
  ]);
  const width = Math.min(left.naturalWidth, right.naturalWidth);
  const height = Math.min(left.naturalHeight, right.naturalHeight);

  const leftCanvas = document.createElement('canvas');
  const rightCanvas = document.createElement('canvas');
  leftCanvas.width = width;
  leftCanvas.height = height;
  rightCanvas.width = width;
  rightCanvas.height = height;

  const leftCtx = leftCanvas.getContext('2d');
  const rightCtx = rightCanvas.getContext('2d');
  if (!leftCtx || !rightCtx) throw new Error('Canvas not supported');

  leftCtx.drawImage(left, 0, 0, width, height);
  rightCtx.drawImage(right, 0, 0, width, height);

  const leftData = leftCtx.getImageData(0, 0, width, height).data;
  const rightData = rightCtx.getImageData(0, 0, width, height).data;
  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = width;
  diffCanvas.height = height;
  const diffCtx = diffCanvas.getContext('2d');
  if (!diffCtx) throw new Error('Canvas not supported');
  const diffImage = diffCtx.createImageData(width, height);

  let changedPixels = 0;
  const totalPixels = width * height;

  for (let i = 0; i < leftData.length; i += 4) {
    const dr = Math.abs(leftData[i] - rightData[i]);
    const dg = Math.abs(leftData[i + 1] - rightData[i + 1]);
    const db = Math.abs(leftData[i + 2] - rightData[i + 2]);
    const difference = dr + dg + db;
    const offset = i;
    if (difference > 18) {
      diffImage.data[offset] = 255;
      diffImage.data[offset + 1] = 60;
      diffImage.data[offset + 2] = 60;
      diffImage.data[offset + 3] = 220;
      changedPixels += 1;
    } else {
      diffImage.data[offset] = leftData[offset];
      diffImage.data[offset + 1] = leftData[offset + 1];
      diffImage.data[offset + 2] = leftData[offset + 2];
      diffImage.data[offset + 3] = 255;
    }
  }

  diffCtx.putImageData(diffImage, 0, 0);

  return {
    url: diffCanvas.toDataURL('image/png'),
    stats: {
      pixelCount: totalPixels,
      changedPixels,
      differencePercent: Number(
        ((changedPixels / totalPixels) * 100).toFixed(2)
      ),
    },
  };
};

const downloadDataUrl = (url: string, filename: string) => {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getImageByteCount = (dataUrl: string) => {
  const header = dataUrl.split(',')[0];
  const base64Length = dataUrl.length - header.length - 1;
  return Math.round((base64Length * 3) / 4);
};

export const ImageCompare = () => {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [mode, setMode] = useState<'slider' | 'side-by-side' | 'diff'>(
    'slider'
  );
  const [sliderPos, setSliderPos] = useState(50);
  const [compressedPreview, setCompressedPreview] =
    useState<PreviewData | null>(null);
  const [diffUrl, setDiffUrl] = useState<string | null>(null);
  const [diffStats, setDiffStats] = useState<DiffStats | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isDiffing, setIsDiffing] = useState(false);

  useEffect(() => {
    return () => {
      if (compressedPreview) {
        URL.revokeObjectURL(compressedPreview.url);
      }
    };
  }, [compressedPreview]);

  const canCompare = images.length >= 2;
  const originalSize = images.length > 0 ? images[0].size : 0;

  const imageList = useMemo(
    () =>
      images.map((entry) => ({
        ...entry,
        displaySize: formatSize(entry.size),
      })),
    [images]
  );

  useEffect(() => {
    if (!canCompare) {
      setDiffUrl(null);
      setDiffStats(null);
    }
  }, [canCompare]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const entries: ImageEntry[] = [];
    for (
      let index = 0;
      index < files.length && entries.length < 2;
      index += 1
    ) {
      const file = files[index];
      const url = await readFileAsDataUrl(file);
      entries.push({
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url,
      });
    }

    setImages((prev) => {
      const next = [...prev, ...entries];
      return next.slice(0, 2);
    });
    setCompressedPreview(null);
    setPreviewError(null);
    setDiffUrl(null);
    setDiffStats(null);
  };

  const reset = () => {
    setImages([]);
    setCompressedPreview(null);
    setDiffUrl(null);
    setDiffStats(null);
    setPreviewError(null);
    setSliderPos(50);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((image) => image.id !== id));
    setCompressedPreview(null);
    setDiffUrl(null);
    setDiffStats(null);
  };

  const generate100kbPreview = async () => {
    if (!images.length) return;
    setIsGeneratingPreview(true);
    setPreviewError(null);
    setCompressedPreview(null);

    try {
      if (compressedPreview) {
        URL.revokeObjectURL(compressedPreview.url);
      }
      const preview = await compressImageToTarget(
        images[0].url,
        100 * 1024,
        'image/webp'
      );
      setCompressedPreview(preview);
    } catch (error) {
      setPreviewError(
        (error as Error)?.message || 'Unable to create 100KB preview'
      );
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const generateDiffPreview = async () => {
    if (!canCompare) return;
    setIsDiffing(true);
    setDiffUrl(null);
    setDiffStats(null);
    setPreviewError(null);

    try {
      const { url, stats } = await buildDiffMap(images[0].url, images[1].url);
      setDiffUrl(url);
      setDiffStats(stats);
    } catch (error) {
      setPreviewError(
        (error as Error)?.message || 'Unable to build diff preview'
      );
    } finally {
      setIsDiffing(false);
    }
  };

  const totalSize = images.reduce((sum, image) => sum + image.size, 0);

  return (
    <div className="min-h-screen bg-[#0f0a0a] text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <ImageIcon size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Image Compare & Diff Tool
            </h1>
            <p className="text-sm text-slate-400">
              Compare two images without altering the original quality, or
              generate a 100KB preview for side-by-side evaluation.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <Plus size={20} />
              <h3 className="font-bold text-sm uppercase tracking-wider">
                Upload Images
              </h3>
            </div>
            <label className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group">
              <div className="w-14 h-14 bg-[#0f0a0a] rounded-xl flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Upload size={28} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white group-hover:text-rose-400 transition-colors">
                  Upload one or two images
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  JPG, PNG, WebP, AVIF, GIF
                </p>
              </div>
              <input
                type="file"
                multiple
                onChange={handleUpload}
                className="hidden"
                accept="image/*"
              />
            </label>
            {images.length > 0 && (
              <div className="space-y-3">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#0f0a0a] border border-white/10"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900">
                      <img
                        src={image.url}
                        className="w-full h-full object-cover"
                        alt={image.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {image.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatSize(image.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="rounded-xl bg-[#0f0a0a] p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
              <ShieldCheck size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider">
                Quality First
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Original images remain untouched. Comparison and 100KB preview
              generation happen in your browser only.
            </p>
          </div>

          <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
              <Cpu size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider">
                Compare Mode
              </h3>
            </div>
            <div className="grid gap-3">
              {(['slider', 'side-by-side', 'diff'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all ${mode === value ? 'border-rose-500 bg-rose-500/10 text-white' : 'border-white/10 bg-[#0f0a0a] text-slate-300 hover:border-rose-500/30'}`}
                >
                  <span className="block uppercase tracking-[0.24em] text-[10px] text-slate-500 mb-1">
                    {value.replace('-', ' ')}
                  </span>
                  {value === 'slider'
                    ? 'Slider compare'
                    : value === 'side-by-side'
                      ? 'Side-by-side view'
                      : 'Difference map'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          {images.length === 0 ? (
            <div className="h-[520px] bg-[#1a1414] border border-white/10 rounded-2xl border-dashed flex flex-col items-center justify-center text-center p-12 group hover:border-rose-500/30 transition-all">
              <div className="w-24 h-24 bg-[#0f0a0a] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FolderOpen
                  size={48}
                  className="text-slate-600 group-hover:text-rose-400 transition-colors"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Upload images to compare
              </h3>
              <p className="text-slate-400 max-w-md">
                Drag or choose one or two images to inspect pixel changes, diff
                maps, or 100KB preview quality.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-[#1a1414] border border-white/10 rounded-3xl p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white">
                      Compare & Review
                    </h2>
                    <p className="text-sm text-slate-400">
                      Use the tools below to compare images and verify any
                      visual changes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-xl border border-white/10 bg-[#0f0a0a] px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:border-rose-500/30 transition-all"
                  >
                    Clear Images
                  </button>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
                <div className="space-y-6">
                  <div className="bg-[#1a1414] border border-white/10 rounded-3xl overflow-hidden">
                    <div className="relative bg-[#090606]">
                      {mode === 'slider' && images.length >= 2 ? (
                        <div className="relative overflow-hidden">
                          <img
                            src={images[0].url}
                            alt="Base"
                            className="w-full h-auto block"
                          />
                          <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${sliderPos}%` }}
                          >
                            <img
                              src={images[1].url}
                              alt="Compare"
                              className="w-full h-auto block"
                            />
                          </div>
                          <div
                            className="absolute top-0 h-full w-1 bg-rose-500/70"
                            style={{ left: `${sliderPos}%` }}
                          />
                        </div>
                      ) : mode === 'side-by-side' && images.length >= 2 ? (
                        <div className="grid grid-cols-2 gap-2">
                          <img
                            src={images[0].url}
                            alt="Image 1"
                            className="w-full h-auto object-contain bg-[#090606]"
                          />
                          <img
                            src={images[1].url}
                            alt="Image 2"
                            className="w-full h-auto object-contain bg-[#090606]"
                          />
                        </div>
                      ) : mode === 'diff' && images.length >= 2 ? (
                        <div className="rounded-3xl border border-white/10 bg-[#090606] p-4">
                          <div className="text-center text-sm text-slate-400 mb-4">
                            Generate the diff preview to highlight pixel-level
                            changes.
                          </div>
                          <button
                            type="button"
                            onClick={generateDiffPreview}
                            disabled={isDiffing}
                            className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-600"
                          >
                            {isDiffing ? 'Generating diff…' : 'Create diff map'}
                          </button>
                        </div>
                      ) : (
                        <div className="py-24 text-center text-slate-500">
                          Upload two images and choose a compare mode to see
                          results.
                        </div>
                      )}
                    </div>

                    {mode === 'slider' && images.length >= 2 && (
                      <div className="p-4 bg-[#0f0a0a] border-t border-white/10">
                        <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                          <span>Slider position</span>
                          <span>{sliderPos}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="90"
                          value={sliderPos}
                          onChange={(e) => setSliderPos(Number(e.target.value))}
                          className="w-full accent-rose-500"
                        />
                      </div>
                    )}

                    {mode === 'diff' && diffUrl && (
                      <div className="bg-[#090606]">
                        <img
                          src={diffUrl}
                          alt="Diff"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-[#1a1414] border border-white/10 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          100KB Preview
                        </h3>
                        <p className="text-sm text-slate-400">
                          Create a small preview for the first image without
                          changing its original version.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={generate100kbPreview}
                        disabled={images.length === 0 || isGeneratingPreview}
                        className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${images.length === 0 || isGeneratingPreview ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
                      >
                        {isGeneratingPreview
                          ? 'Generating…'
                          : 'Create 100KB Preview'}
                      </button>
                    </div>

                    {compressedPreview ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-3xl overflow-hidden bg-[#090606] border border-white/10">
                          <img
                            src={compressedPreview.url}
                            alt="100KB preview"
                            className="w-full h-auto object-contain"
                          />
                        </div>
                        <div className="rounded-3xl p-4 bg-[#0f0a0a] border border-white/10 text-sm text-slate-300 space-y-3">
                          <div>
                            <p className="font-bold text-white">
                              Original size
                            </p>
                            <p>{formatSize(originalSize)}</p>
                          </div>
                          <div>
                            <p className="font-bold text-white">Preview size</p>
                            <p>{formatSize(compressedPreview.size)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              downloadDataUrl(
                                compressedPreview.url,
                                `image-100kb-preview.${compressedPreview.format}`
                              )
                            }
                            className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
                          >
                            Download Preview
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-3xl border border-dashed border-white/10 bg-[#090606] p-8 text-center text-slate-500">
                        {previewError || 'No preview generated yet.'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#1a1414] border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Image Summary
                        </h3>
                        <p className="text-sm text-slate-400">
                          Sizes and metadata for the images currently loaded.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {imageList.map((image) => (
                        <div
                          key={image.id}
                          className="rounded-2xl border border-white/10 bg-[#0f0a0a] p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900">
                              <img
                                src={image.url}
                                className="w-full h-full object-cover"
                                alt={image.name}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">
                                {image.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {image.displaySize}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-2xl border border-white/10 bg-[#090606] p-4 text-sm text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Total images</span>
                        <span>{images.length}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span>Total raw size</span>
                        <span>{formatSize(totalSize)}</span>
                      </div>
                    </div>
                  </div>

                  {diffStats && (
                    <div className="bg-[#1a1414] border border-white/10 rounded-3xl p-6">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            Diff Statistics
                          </h3>
                          <p className="text-sm text-slate-400">
                            Pixel-level difference summary for the comparison
                            region.
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-[#090606] p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                            Changed pixels
                          </p>
                          <p className="mt-2 text-2xl font-black text-white">
                            {formatSize(diffStats.changedPixels)}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-[#090606] p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                            Difference ratio
                          </p>
                          <p className="mt-2 text-2xl font-black text-white">
                            {diffStats.differencePercent}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
