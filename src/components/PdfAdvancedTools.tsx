import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownToLine,
  FileImage,
  FileStack,
  Layers,
  RefreshCw,
  Scissors,
  Sparkles,
} from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export type PdfAdvancedMode =
  | 'organize'
  | 'flatten'
  | 'resize'
  | 'extract-images'
  | 'page-remover'
  | 'extract-pages';

interface PdfAdvancedToolsProps {
  mode: PdfAdvancedMode;
  title?: string;
  description?: string;
}

const MODE_META: Record<PdfAdvancedMode, { title: string; description: string }> =
  {
    organize: {
      title: 'Organize PDF',
      description: 'Reorder PDF pages with a custom page order string like 3,1,2.',
    },
    flatten: {
      title: 'Flatten PDF',
      description: 'Render pages into a flattened PDF for safer sharing.',
    },
    resize: {
      title: 'Resize PDF',
      description: 'Fit PDF pages into A4 or Letter layout.',
    },
    'extract-images': {
      title: 'Extract Image from PDF',
      description: 'Export each page as a clean PNG image zip.',
    },
    'page-remover': {
      title: 'PDF Page Remover',
      description: 'Remove selected pages from a PDF.',
    },
    'extract-pages': {
      title: 'Extract Pages from PDF',
      description: 'Extract selected pages into a fresh PDF file.',
    },
  };

const parsePageList = (value: string, pageCount: number) => {
  const pages = new Set<number>();
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((segment) => {
      if (segment.includes('-')) {
        const [startRaw, endRaw] = segment.split('-').map((part) => Number(part.trim()));
        const start = Math.max(1, Math.min(pageCount, startRaw || 1));
        const end = Math.max(1, Math.min(pageCount, endRaw || start));
        const from = Math.min(start, end);
        const to = Math.max(start, end);
        for (let page = from; page <= to; page += 1) pages.add(page);
      } else {
        const page = Number(segment);
        if (page >= 1 && page <= pageCount) pages.add(page);
      }
    });
  return Array.from(pages).sort((a, b) => a - b);
};

const renderPdfPageToPng = async (file: File, pageNumber: number) => {
  const data = await file.arrayBuffer();
  const pdf = await getDocument({ data }).promise;
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas unavailable.');
  await page.render({ canvasContext: context, viewport, canvas }).promise;
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => {
      if (!value) {
        reject(new Error('PNG export failed.'));
        return;
      }
      resolve(value);
    }, 'image/png');
  });
  return blob;
};

export const PdfAdvancedTools = ({
  mode,
  title,
  description,
}: PdfAdvancedToolsProps) => {
  const meta = MODE_META[mode];
  const resolvedTitle = title || meta.title;
  const resolvedDescription = description || meta.description;
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultName, setResultName] = useState('');
  const [pageInput, setPageInput] = useState('1');
  const [pageOrder, setPageOrder] = useState('1');
  const [paperSize, setPaperSize] = useState<'a4' | 'letter'>('a4');

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const loadMeta = async (nextFile: File) => {
    const bytes = await nextFile.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const total = pdf.getPageCount();
    setPageCount(total);
    setPageInput(`1-${total}`);
    setPageOrder(Array.from({ length: total }, (_, index) => index + 1).join(','));
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0];
    if (!next) return;
    setFile(next);
    setError('');
    setResultName('');
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl('');
    await loadMeta(next);
  };

  const saveBlob = (blob: Blob, filename: string) => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(URL.createObjectURL(blob));
    setResultName(filename);
  };

  const processPdf = async () => {
    if (!file) {
      setError('Upload a PDF first.');
      return;
    }

    setProcessing(true);
    setError('');
    setStatus('Processing PDF...');
    try {
      if (mode === 'extract-images') {
        const zip = new JSZip();
        for (let page = 1; page <= pageCount; page += 1) {
          const blob = await renderPdfPageToPng(file, page);
          zip.file(`page-${page}.png`, blob);
        }
        const archive = await zip.generateAsync({ type: 'blob' });
        saveBlob(archive, `${file.name.replace(/\.pdf$/i, '')}-images.zip`);
        setStatus('Images extracted successfully.');
        return;
      }

      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      if (mode === 'extract-pages' || mode === 'page-remover') {
        const selected = parsePageList(pageInput, pageCount);
        const nextPdf = await PDFDocument.create();
        const pageIndexes =
          mode === 'extract-pages'
            ? selected.map((item) => item - 1)
            : Array.from({ length: pageCount }, (_, index) => index).filter(
                (index) => !selected.includes(index + 1)
              );
        const copied = await nextPdf.copyPages(pdf, pageIndexes);
        copied.forEach((page) => nextPdf.addPage(page));
        const output = await nextPdf.save();
        saveBlob(
          new Blob([output], { type: 'application/pdf' }),
          `${file.name.replace(/\.pdf$/i, '')}-${mode}.pdf`
        );
        setStatus('PDF pages updated successfully.');
        return;
      }

      if (mode === 'organize') {
        const orderedPages = parsePageList(pageOrder, pageCount);
        const nextPdf = await PDFDocument.create();
        const copied = await nextPdf.copyPages(
          pdf,
          orderedPages.map((item) => item - 1)
        );
        copied.forEach((page) => nextPdf.addPage(page));
        const output = await nextPdf.save();
        saveBlob(
          new Blob([output], { type: 'application/pdf' }),
          `${file.name.replace(/\.pdf$/i, '')}-organized.pdf`
        );
        setStatus('PDF order updated successfully.');
        return;
      }

      if (mode === 'resize') {
        const sizes =
          paperSize === 'a4'
            ? { width: 595.28, height: 841.89 }
            : { width: 612, height: 792 };
        const nextPdf = await PDFDocument.create();
        const pages = await nextPdf.copyPages(
          pdf,
          Array.from({ length: pdf.getPageCount() }, (_, index) => index)
        );

        for (const sourcePage of pages) {
          const page = nextPdf.addPage([sizes.width, sizes.height]);
          const dims = sourcePage.getSize();
          const scale = Math.min(sizes.width / dims.width, sizes.height / dims.height);
          const embedded = await nextPdf.embedPage(sourcePage);
          page.drawPage(embedded, {
            x: (sizes.width - dims.width * scale) / 2,
            y: (sizes.height - dims.height * scale) / 2,
            width: dims.width * scale,
            height: dims.height * scale,
          });
        }

        const output = await nextPdf.save();
        saveBlob(
          new Blob([output], { type: 'application/pdf' }),
          `${file.name.replace(/\.pdf$/i, '')}-${paperSize}.pdf`
        );
        setStatus('PDF resized successfully.');
        return;
      }

      if (mode === 'flatten') {
        const nextPdf = await PDFDocument.create();
        for (let page = 1; page <= pageCount; page += 1) {
          const pngBlob = await renderPdfPageToPng(file, page);
          const pngBytes = await pngBlob.arrayBuffer();
          const image = await nextPdf.embedPng(pngBytes);
          const flatPage = nextPdf.addPage([image.width, image.height]);
          flatPage.drawRectangle({
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
            color: rgb(1, 1, 1),
          });
          flatPage.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
          });
        }
        const output = await nextPdf.save();
        saveBlob(
          new Blob([output], { type: 'application/pdf' }),
          `${file.name.replace(/\.pdf$/i, '')}-flattened.pdf`
        );
        setStatus('PDF flattened successfully.');
      }
    } catch (err: any) {
      setError(err.message || 'PDF processing failed.');
      setStatus('');
    } finally {
      setProcessing(false);
    }
  };

  const helperInputs =
    mode === 'organize' ? (
      <label className="space-y-2 text-sm text-slate-300">
        <span>Page Order</span>
        <input
          value={pageOrder}
          onChange={(e) => setPageOrder(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
          placeholder="3,1,2"
        />
      </label>
    ) : mode === 'extract-pages' || mode === 'page-remover' ? (
      <label className="space-y-2 text-sm text-slate-300">
        <span>Pages</span>
        <input
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
          placeholder="1-3,5"
        />
      </label>
    ) : mode === 'resize' ? (
      <label className="space-y-2 text-sm text-slate-300">
        <span>Paper Size</span>
        <select
          value={paperSize}
          onChange={(e) => setPaperSize(e.target.value as 'a4' | 'letter')}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
        >
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
        </select>
      </label>
    ) : null;

  const actionIcon =
    mode === 'flatten' ? (
      <Layers size={16} />
    ) : mode === 'extract-images' ? (
      <FileImage size={16} />
    ) : mode === 'page-remover' ? (
      <Scissors size={16} />
    ) : (
      <FileStack size={16} />
    );

  return (
    <div className="space-y-6 rounded-[2rem] border border-white/10 bg-[#130d0d] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-rose-400">
            <Sparkles size={14} />
            PDF Workflow
          </div>
          <h2 className="text-3xl font-black text-white">{resolvedTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            {resolvedDescription}
          </p>
        </div>
        <label className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-bold text-white">
          <ArrowDownToLine size={16} />
          Upload PDF
          <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <div className="space-y-4 rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
          <div className="text-sm font-semibold text-white">Controls</div>
          {helperInputs}
          <button
            onClick={processPdf}
            disabled={!file || processing}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? <RefreshCw className="animate-spin" size={16} /> : actionIcon}
            {processing ? 'Processing...' : `Run ${resolvedTitle}`}
          </button>

          {status && <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-200">{status}</div>}
          {error && <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
        </div>

        <div className="space-y-4 rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
          <div className="text-sm font-semibold text-white">File Status</div>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#0f0a0a] p-4">
            {file ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="text-sm font-semibold text-white">{file.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{pageCount} pages detected</div>
                </div>

                {resultUrl && (
                  <a
                    href={resultUrl}
                    download={resultName}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white"
                  >
                    <ArrowDownToLine size={16} />
                    Download Result
                  </a>
                )}
              </div>
            ) : (
              <div className="flex min-h-[220px] items-center justify-center text-center text-sm text-slate-500">
                Upload a PDF to start using this tool.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
