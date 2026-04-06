import React, { useState } from 'react';
import {
  FileArchive,
  Upload,
  Download,
  RotateCw,
  RotateCcw,
  Layers,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Scissors,
  FileType,
  Presentation,
  FileSpreadsheet,
  Stamp,
  Lock,
  ShieldPlus,
  FileSearch,
  ScanLine,
  PenLine,
  Info,
  Settings,
  Key,
  Shield,
  X,
  Zap,
  Sparkles,
  Check,
  ArrowUpRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { PDFDocument, degrees, StandardFonts, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url';
import * as XLSX from 'xlsx';
import PptxGenJS from 'pptxgenjs';
import Tesseract from 'tesseract.js';
import { jsPDF } from 'jspdf';
import { apiFetch } from '../api';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export type PdfAction =
  | 'merge'
  | 'split'
  | 'compress'
  | 'pdf-to-jpg'
  | 'jpg-to-pdf'
  | 'rotate'
  | 'pdf-to-word'
  | 'pdf-to-ppt'
  | 'pdf-to-excel'
  | 'edit-pdf'
  | 'protect-pdf'
  | 'unlock-pdf'
  | 'sign-pdf'
  | 'ocr-pdf'
  | 'scan-to-pdf'
  | 'watermark-pdf'
  | 'word-to-pdf'
  | 'ppt-to-pdf'
  | 'excel-to-pdf'
  | 'html-to-pdf'
  | 'pdf-to-pdfa'
  | 'page-numbers'
  | 'crop-pdf'
  | 'compare-pdf'
  | 'redact-pdf'
  | 'translate-pdf';

interface PdfToolsProps {
  initialAction?: PdfAction;
  startInTool?: boolean;
}

export const PdfTools = ({ initialAction, startInTool }: PdfToolsProps) => {
  const [action, setAction] = useState<PdfAction>(initialAction || 'merge');
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultName, setResultName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(!startInTool);
  const [textInput, setTextInput] = useState('Sample text');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [ocrLang, setOcrLang] = useState('eng');
  const [ocrRange, setOcrRange] = useState('');
  const [rotateDegrees, setRotateDegrees] = useState(90);
  const [jpgScale, setJpgScale] = useState(2);
  const [jpgQuality, setJpgQuality] = useState(0.92);
  const [pageSize, setPageSize] = useState<'auto' | 'a4'>('auto');
  const [pageMargin, setPageMargin] = useState(20);
  const [compressUseObjectStreams, setCompressUseObjectStreams] =
    useState(true);
  const [compressRemoveMetadata, setCompressRemoveMetadata] = useState(false);
  const [watermarkSize, setWatermarkSize] = useState(64);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.35);
  const [watermarkPosition, setWatermarkPosition] = useState<
    'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  >('center');
  const [watermarkImageFile, setWatermarkImageFile] = useState<File | null>(
    null
  );
  const [watermarkImagePreview, setWatermarkImagePreview] = useState<
    string | null
  >(null);
  const [watermarkImageScale, setWatermarkImageScale] = useState(0.35);
  const [editFontSize, setEditFontSize] = useState(24);
  const [editPosition, setEditPosition] = useState<
    'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right'
  >('top-left');
  const [signPosition, setSignPosition] = useState<
    'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  >('bottom-right');
  const [signScale, setSignScale] = useState(0.35);
  const [mergeSort, setMergeSort] = useState(false);
  const [splitRange, setSplitRange] = useState('');
  const [includePageHeaders, setIncludePageHeaders] = useState(true);
  const [pptFitMode, setPptFitMode] = useState<'contain' | 'cover'>('contain');
  const [excelSheetName, setExcelSheetName] = useState('');
  const [htmlInput, setHtmlInput] = useState('');
  const [pdfaRemoveMetadata, setPdfaRemoveMetadata] = useState(true);
  const [pageNumberStart, setPageNumberStart] = useState(1);
  const [pageNumberSize, setPageNumberSize] = useState(14);
  const [pageNumberPosition, setPageNumberPosition] = useState<
    'bottom-center' | 'bottom-right' | 'top-right'
  >('bottom-center');
  const [cropTop, setCropTop] = useState(0);
  const [cropRight, setCropRight] = useState(0);
  const [cropBottom, setCropBottom] = useState(0);
  const [cropLeft, setCropLeft] = useState(0);
  const [translateLang, setTranslateLang] = useState('en');
  const [pdfPageCount, setPdfPageCount] = useState(1);
  const [editTargetPage, setEditTargetPage] = useState(1);
  const [editXPercent, setEditXPercent] = useState(12);
  const [editYPercent, setEditYPercent] = useState(85);
  const [editColorHex, setEditColorHex] = useState('#111111');
  const [editApplyAllPages, setEditApplyAllPages] = useState(false);
  const [editUseBackground, setEditUseBackground] = useState(false);
  const [editBackgroundHex, setEditBackgroundHex] = useState('#ffffff');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editImageScale, setEditImageScale] = useState(0.35);

  React.useEffect(() => {
    if (initialAction) {
      setAction(initialAction);
    }
    if (startInTool) {
      setShowGrid(false);
    }
  }, [initialAction, startInTool]);

  React.useEffect(() => {
    setFiles([]);
    setResult(null);
    setResultName(null);
    setErrorMessage(null);
    setPassword('');
    setConfirmPassword('');
    setSignatureFile(null);
    setSignaturePreview(null);
    setTextInput('Sample text');
    setWatermarkText('CONFIDENTIAL');
    setOcrLang('eng');
    setOcrRange('');
    setRotateDegrees(90);
    setJpgScale(2);
    setJpgQuality(0.92);
    setPageSize('auto');
    setPageMargin(20);
    setCompressUseObjectStreams(true);
    setCompressRemoveMetadata(false);
    setWatermarkSize(64);
    setWatermarkOpacity(0.35);
    setWatermarkPosition('center');
    setWatermarkImageFile(null);
    setWatermarkImagePreview(null);
    setWatermarkImageScale(0.35);
    setEditFontSize(24);
    setEditPosition('top-left');
    setSignPosition('bottom-right');
    setSignScale(0.35);
    setMergeSort(false);
    setSplitRange('');
    setIncludePageHeaders(true);
    setPptFitMode('contain');
    setExcelSheetName('');
    setHtmlInput('');
    setPdfaRemoveMetadata(true);
    setPageNumberStart(1);
    setPageNumberSize(14);
    setPageNumberPosition('bottom-center');
    setCropTop(0);
    setCropRight(0);
    setCropBottom(0);
    setCropLeft(0);
    setTranslateLang('en');
    setPdfPageCount(1);
    setEditTargetPage(1);
    setEditXPercent(12);
    setEditYPercent(85);
    setEditColorHex('#111111');
    setEditApplyAllPages(false);
    setEditUseBackground(false);
    setEditBackgroundHex('#ffffff');
    setEditImageFile(null);
    setEditImagePreview(null);
    setEditImageScale(0.35);
  }, [action]);

  React.useEffect(() => {
    const loadPdfMeta = async () => {
      if (action !== 'edit-pdf' || files.length !== 1) {
        setPdfPageCount(1);
        setEditTargetPage(1);
        return;
      }
      try {
        const bytes = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const totalPages = Math.max(1, pdf.getPageCount());
        setPdfPageCount(totalPages);
        setEditTargetPage((prev) => Math.min(prev, totalPages));
      } catch {
        setPdfPageCount(1);
        setEditTargetPage(1);
      }
    };
    loadPdfMeta();
  }, [action, files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files;
    if (f) {
      setFiles(Array.from(f));
      setResult(null);
      setResultName(null);
      setErrorMessage(null);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignatureFile(file);
      const url = URL.createObjectURL(file);
      setSignaturePreview(url);
    }
  };

  const handleWatermarkImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setWatermarkImageFile(file);
      const url = URL.createObjectURL(file);
      setWatermarkImagePreview(url);
    }
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      const url = URL.createObjectURL(file);
      setEditImagePreview(url);
    }
  };

  const parsePageRange = (range: string, pageCount: number) => {
    const indices = new Set<number>();
    const parts = range
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    for (const part of parts) {
      if (part.includes('-')) {
        const [startRaw, endRaw] = part.split('-').map((p) => p.trim());
        const start = Math.max(1, Number(startRaw));
        const end = Math.min(pageCount, Number(endRaw));
        if (!Number.isNaN(start) && !Number.isNaN(end)) {
          for (
            let i = Math.min(start, end);
            i <= Math.max(start, end);
            i += 1
          ) {
            indices.add(i - 1);
          }
        }
      } else {
        const num = Number(part);
        if (!Number.isNaN(num) && num >= 1 && num <= pageCount) {
          indices.add(num - 1);
        }
      }
    }
    return Array.from(indices).sort((a, b) => a - b);
  };

  const getPosition = (
    pageWidth: number,
    pageHeight: number,
    boxWidth: number,
    boxHeight: number,
    position:
      | 'top-left'
      | 'top-right'
      | 'center'
      | 'bottom-left'
      | 'bottom-right'
      | 'top-center'
      | 'bottom-center'
  ) => {
    const margin = 40;
    switch (position) {
      case 'top-left':
        return { x: margin, y: pageHeight - boxHeight - margin };
      case 'top-right':
        return {
          x: pageWidth - boxWidth - margin,
          y: pageHeight - boxHeight - margin,
        };
      case 'bottom-left':
        return { x: margin, y: margin };
      case 'bottom-right':
        return { x: pageWidth - boxWidth - margin, y: margin };
      case 'top-center':
        return {
          x: (pageWidth - boxWidth) / 2,
          y: pageHeight - boxHeight - margin,
        };
      case 'bottom-center':
        return { x: (pageWidth - boxWidth) / 2, y: margin };
      default:
        return {
          x: (pageWidth - boxWidth) / 2,
          y: (pageHeight - boxHeight) / 2,
        };
    }
  };

  const setResultBlob = (blob: Blob, name: string) => {
    if (result) URL.revokeObjectURL(result);
    setResult(URL.createObjectURL(blob));
    setResultName(name);
    setErrorMessage(null);
  };

  const mergePdfs = async (pdfFiles: File[]) => {
    const mergedPdf = await PDFDocument.create();
    const ordered = mergeSort
      ? [...pdfFiles].sort((a, b) => a.name.localeCompare(b.name))
      : pdfFiles;
    for (const file of ordered) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => mergedPdf.addPage(p));
    }
    return mergedPdf.save();
  };

  const splitPdf = async (pdfFile: File) => {
    const bytes = await pdfFile.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pageCount = pdf.getPageCount();
    const selectedPages = splitRange.trim()
      ? parsePageRange(splitRange, pageCount)
      : pdf.getPageIndices();

    if (selectedPages.length <= 1) {
      const single = await PDFDocument.create();
      const [page] = await single.copyPages(pdf, [selectedPages[0] ?? 0]);
      single.addPage(page);
      const out = await single.save();
      return {
        blob: new Blob([out], { type: 'application/pdf' }),
        name: 'split-page-1.pdf',
      };
    }

    const zip = new JSZip();
    for (const index of selectedPages) {
      const doc = await PDFDocument.create();
      const [page] = await doc.copyPages(pdf, [index]);
      doc.addPage(page);
      const out = await doc.save();
      zip.file(`page-${index + 1}.pdf`, out);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return { blob: zipBlob, name: 'split-pages.zip' };
  };

  const compressPdf = async (pdfFile: File) => {
    const bytes = await pdfFile.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    if (compressRemoveMetadata) {
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setKeywords([]);
      pdf.setCreator('');
      pdf.setProducer('');
    }
    const out = await pdf.save({ useObjectStreams: compressUseObjectStreams });
    return out;
  };

  const rotatePdf = async (pdfFile: File) => {
    const bytes = await pdfFile.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pages = pdf.getPages();
    pages.forEach((page) => page.setRotation(degrees(rotateDegrees)));
    return pdf.save();
  };

  const pdfToJpg = async (pdfFile: File) => {
    const data = await pdfFile.arrayBuffer();
    const doc = await getDocument({ data }).promise;
    const pageCount = doc.numPages;
    const zip = new JSZip();
    let singleBlob: Blob | null = null;

    for (let i = 1; i <= pageCount; i += 1) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: jpgScale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      await page.render({ canvasContext: ctx, viewport, canvas }).promise;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (!b) {
              reject(new Error('Failed to render JPG'));
              return;
            }
            resolve(b);
          },
          'image/jpeg',
          jpgQuality
        );
      });

      if (pageCount === 1) {
        singleBlob = blob;
      } else {
        zip.file(`page-${i}.jpg`, blob);
      }
    }

    if (pageCount === 1 && singleBlob) {
      return { blob: singleBlob, name: 'page-1.jpg' };
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return { blob: zipBlob, name: 'pages.zip' };
  };

  const imagesToPdf = async (imageFiles: File[]) => {
    const pdf = await PDFDocument.create();
    const a4Width = 595.28;
    const a4Height = 841.89;
    for (const file of imageFiles) {
      const bytes = await file.arrayBuffer();
      let embedded;
      if (file.type === 'image/jpeg') {
        embedded = await pdf.embedJpg(bytes);
      } else if (file.type === 'image/png') {
        embedded = await pdf.embedPng(bytes);
      } else {
        const img = new Image();
        const url = URL.createObjectURL(file);
        const bitmap = await new Promise<ImageBitmap>((resolve, reject) => {
          img.onload = async () => {
            try {
              const bmp = await createImageBitmap(img);
              resolve(bmp);
            } catch (err) {
              reject(err);
            } finally {
              URL.revokeObjectURL(url);
            }
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Unsupported image'));
          };
          img.src = url;
        });

        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        ctx.drawImage(bitmap, 0, 0);

        const pngBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (!b) {
              reject(new Error('Failed to convert image'));
              return;
            }
            resolve(b);
          }, 'image/png');
        });

        const pngBytes = await pngBlob.arrayBuffer();
        embedded = await pdf.embedPng(pngBytes);
      }

      const { width, height } = embedded.scale(1);
      if (pageSize === 'a4') {
        const page = pdf.addPage([a4Width, a4Height]);
        const maxW = a4Width - pageMargin * 2;
        const maxH = a4Height - pageMargin * 2;
        const ratio = Math.min(maxW / width, maxH / height);
        const w = width * ratio;
        const h = height * ratio;
        const x = (a4Width - w) / 2;
        const y = (a4Height - h) / 2;
        page.drawImage(embedded, { x, y, width: w, height: h });
      } else {
        const page = pdf.addPage([width, height]);
        page.drawImage(embedded, { x: 0, y: 0, width, height });
      }
    }
    return pdf.save();
  };

  const convertViaApi = async (
    endpoint: string,
    file?: File,
    extraFields: Record<string, string> = {}
  ) => {
    const form = new FormData();
    if (file) {
      form.append('file', file);
    }
    Object.entries(extraFields).forEach(([key, value]) => {
      form.append(key, value);
    });
    const response = await apiFetch(endpoint, {
      method: 'POST',
      body: form,
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error || 'Conversion failed');
    }
    return response.blob();
  };

  const wordToPdf = async (docxFile: File) => {
    return convertViaApi('/api/office/word-to-pdf', docxFile);
  };

  const pptToPdf = async (pptFile: File) => {
    return convertViaApi('/api/office/ppt-to-pdf', pptFile);
  };

  const excelToPdf = async (excelFile: File) => {
    return convertViaApi('/api/office/excel-to-pdf', excelFile);
  };

  const htmlToPdf = async (htmlFile?: File) => {
    const html = htmlFile ? '' : htmlInput.trim();
    if (!htmlFile && !html) {
      throw new Error('No HTML content found.');
    }
    return convertViaApi('/api/office/html-to-pdf', htmlFile, html ? { html } : {});
  };

  const pdfToPdfa = async (pdfFile: File) => {
    const bytes = await pdfFile.arrayBuffer();
    const src = await PDFDocument.load(bytes);
    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
    if (pdfaRemoveMetadata) {
      out.setTitle('');
      out.setAuthor('');
      out.setSubject('');
      out.setKeywords([]);
      out.setCreator('');
      out.setProducer('');
    }
    return out.save();
  };

  const addPageNumbers = async (pdfFile: File) => {
    const bytes = await pdfFile.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const size = pageNumberSize;
    const margin = 24;

    pdf.getPages().forEach((page, index) => {
      const label = String(pageNumberStart + index);
      const textWidth = font.widthOfTextAtSize(label, size);
      const { width, height } = page.getSize();
      let x = (width - textWidth) / 2;
      let y = margin;
      if (pageNumberPosition === 'bottom-right') {
        x = width - textWidth - margin;
        y = margin;
      } else if (pageNumberPosition === 'top-right') {
        x = width - textWidth - margin;
        y = height - size - margin;
      }
      page.drawText(label, { x, y, size, font, color: rgb(0.3, 0.3, 0.3) });
    });

    return pdf.save();
  };

  const cropPdf = async (pdfFile: File) => {
    const bytes = await pdfFile.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    pdf.getPages().forEach((page) => {
      const width = page.getWidth();
      const height = page.getHeight();
      const newWidth = Math.max(10, width - cropLeft - cropRight);
      const newHeight = Math.max(10, height - cropTop - cropBottom);
      const x = Math.max(0, cropLeft);
      const y = Math.max(0, cropBottom);
      page.setCropBox(x, y, newWidth, newHeight);
      page.setMediaBox(x, y, newWidth, newHeight);
    });
    return pdf.save();
  };

  const dataUrlToBytes = (dataUrl: string) => {
    const base64 = dataUrl.split(',')[1] || '';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  const renderPdfPage = async (doc: any, pageNumber: number, scale = 1.5) => {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    return {
      dataUrl: canvas.toDataURL('image/png'),
      width: canvas.width,
      height: canvas.height,
    };
  };

  const comparePdf = async (leftFile: File, rightFile: File) => {
    const leftDoc = await getDocument({ data: await leftFile.arrayBuffer() })
      .promise;
    const rightDoc = await getDocument({ data: await rightFile.arrayBuffer() })
      .promise;
    const pageCount = Math.max(leftDoc.numPages, rightDoc.numPages);
    const out = await PDFDocument.create();

    for (let i = 1; i <= pageCount; i += 1) {
      const leftRender =
        i <= leftDoc.numPages ? await renderPdfPage(leftDoc, i, 1.2) : null;
      const rightRender =
        i <= rightDoc.numPages ? await renderPdfPage(rightDoc, i, 1.2) : null;
      const leftWidth = leftRender?.width || 0;
      const rightWidth = rightRender?.width || 0;
      const height = Math.max(
        leftRender?.height || 0,
        rightRender?.height || 0
      );
      const page = out.addPage([leftWidth + rightWidth, height || 1000]);

      if (leftRender) {
        const img = await out.embedPng(dataUrlToBytes(leftRender.dataUrl));
        page.drawImage(img, {
          x: 0,
          y: 0,
          width: leftWidth,
          height: leftRender.height,
        });
      }
      if (rightRender) {
        const img = await out.embedPng(dataUrlToBytes(rightRender.dataUrl));
        page.drawImage(img, {
          x: leftWidth,
          y: 0,
          width: rightWidth,
          height: rightRender.height,
        });
      }
    }

    return out.save();
  };

  const redactPdf = async (pdfFile: File) => {
    const doc = await getDocument({ data: await pdfFile.arrayBuffer() })
      .promise;
    const out = await PDFDocument.create();
    for (let i = 1; i <= doc.numPages; i += 1) {
      const render = await renderPdfPage(doc, i, 1.5);
      const img = await out.embedPng(dataUrlToBytes(render.dataUrl));
      const page = out.addPage([render.width, render.height]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: render.width,
        height: render.height,
      });
    }
    return out.save();
  };

  const translatePdf = async (pdfFile: File) => {
    const text = await extractTextFromPdf(pdfFile);
    const response = await apiFetch('/api/pdf/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang: translateLang }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error || 'Translation failed');
    }
    const payload = await response.json();
    const translated = payload?.translatedText || '';
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const lines = pdf.splitTextToSize(translated, 520);
    let y = 40;
    lines.forEach((line: string) => {
      if (y > 800) {
        pdf.addPage();
        y = 40;
      }
      pdf.text(line, 40, y);
      y += 16;
    });
    return pdf.output('blob');
  };

  const extractTextFromPdf = async (pdfFile: File) => {
    const data = await pdfFile.arrayBuffer();
    const doc = await getDocument({ data }).promise;
    let text = '';

    for (let i = 1; i <= doc.numPages; i += 1) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = (content.items as any[])
        .map((item) => item.str)
        .join(' ');
      const header = includePageHeaders ? `\n\nPage ${i}\n` : '\n\n';
      text += `${header}${pageText}`;
    }

    return text.trim();
  };

  const pdfToWord = async (pdfFile: File) => {
    return convertViaApi('/api/office/pdf-to-word', pdfFile);
  };

  const pdfToExcel = async (pdfFile: File) => {
    const text = await extractTextFromPdf(pdfFile);
    const rows = text.split('\n').map((line) => [line]);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'PDF');
    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([out], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  };

  const pdfToPpt = async (pdfFile: File) => {
    const data = await pdfFile.arrayBuffer();
    const doc = await getDocument({ data }).promise;
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    const slideW = 13.333;
    const slideH = 7.5;

    for (let i = 1; i <= doc.numPages; i += 1) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const slide = pptx.addSlide();

      const ratio =
        pptFitMode === 'cover'
          ? Math.max(slideW / canvas.width, slideH / canvas.height)
          : Math.min(slideW / canvas.width, slideH / canvas.height);
      const w = canvas.width * ratio;
      const h = canvas.height * ratio;
      const x = (slideW - w) / 2;
      const y = (slideH - h) / 2;

      slide.addImage({ data: dataUrl, x, y, w, h });
    }

    const blob = (await pptx.write('blob')) as Blob;
    return blob;
  };

  const editPdf = async (pdfFile: File) => {
    const bytes = await pdfFile.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const message = textInput.trim() || 'Edited with VinzaTools';
    const fontSize = Math.max(8, editFontSize);
    const lines = message.split('\n');
    const maxLine = lines.reduce((current, line) => {
      return Math.max(current, font.widthOfTextAtSize(line || ' ', fontSize));
    }, 0);
    const textHeight = fontSize;
    const parseHex = (hex: string) => {
      const safe = hex.replace('#', '');
      const normalized = safe.length === 3 ? safe.split('').map((c) => c + c).join('') : safe;
      const int = parseInt(normalized, 16);
      return rgb(((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255);
    };

    let embeddedEditImage: any = null;
    if (editImageFile) {
      const imgBytes = await editImageFile.arrayBuffer();
      if (editImageFile.type === 'image/png') {
        embeddedEditImage = await pdf.embedPng(imgBytes);
      } else if (
        editImageFile.type === 'image/jpeg' ||
        editImageFile.type === 'image/jpg'
      ) {
        embeddedEditImage = await pdf.embedJpg(imgBytes);
      } else {
        const img = new Image();
        const url = URL.createObjectURL(editImageFile);
        const bitmap = await new Promise<ImageBitmap>((resolve, reject) => {
          img.onload = async () => {
            try {
              const bmp = await createImageBitmap(img);
              resolve(bmp);
            } catch (err) {
              reject(err);
            } finally {
              URL.revokeObjectURL(url);
            }
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Unsupported edit image'));
          };
          img.src = url;
        });

        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        ctx.drawImage(bitmap, 0, 0);

        const pngBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to convert edit image'));
              return;
            }
            resolve(blob);
          }, 'image/png');
        });

        embeddedEditImage = await pdf.embedPng(await pngBlob.arrayBuffer());
      }
    }

    const targets = editApplyAllPages
      ? pdf.getPages()
      : [pdf.getPages()[Math.max(0, Math.min(pdf.getPageCount() - 1, editTargetPage - 1))]];

    targets.forEach((page) => {
      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();
      const x = (editXPercent / 100) * pageWidth;
      const y = (editYPercent / 100) * pageHeight;

      if (embeddedEditImage) {
        const imageWidth = embeddedEditImage.width * editImageScale;
        const imageHeight = embeddedEditImage.height * editImageScale;
        page.drawImage(embeddedEditImage, {
          x,
          y: Math.max(0, y - imageHeight),
          width: imageWidth,
          height: imageHeight,
        });
      }

      if (editUseBackground) {
        page.drawRectangle({
          x: Math.max(0, x - 10),
          y: Math.max(0, y - 10),
          width: Math.min(pageWidth - x + 10, maxLine + 20),
          height: textHeight * lines.length + 20,
          color: parseHex(editBackgroundHex),
          opacity: 0.92,
        });
      }

      lines.forEach((line, index) => {
        page.drawText(line, {
          x,
          y: y - index * (fontSize + 6),
          size: fontSize,
          font,
          color: parseHex(editColorHex),
        });
      });
    });
    return pdf.save();
  };

  const watermarkPdf = async (pdfFile: File) => {
    const bytes = await pdfFile.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const text = watermarkText.trim() || 'CONFIDENTIAL';

    for (const page of pdf.getPages()) {
      const { width, height } = page.getSize();
      if (watermarkImageFile) {
        const imgBytes = await watermarkImageFile.arrayBuffer();
        let embedded;
        if (watermarkImageFile.type === 'image/png') {
          embedded = await pdf.embedPng(imgBytes);
        } else if (
          watermarkImageFile.type === 'image/jpeg' ||
          watermarkImageFile.type === 'image/jpg'
        ) {
          embedded = await pdf.embedJpg(imgBytes);
        } else {
          const img = new Image();
          const url = URL.createObjectURL(watermarkImageFile);
          const bitmap = await new Promise<ImageBitmap>((resolve, reject) => {
            img.onload = async () => {
              try {
                const bmp = await createImageBitmap(img);
                resolve(bmp);
              } catch (err) {
                reject(err);
              } finally {
                URL.revokeObjectURL(url);
              }
            };
            img.onerror = () => {
              URL.revokeObjectURL(url);
              reject(new Error('Unsupported watermark image'));
            };
            img.src = url;
          });

          const canvas = document.createElement('canvas');
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas not supported');
          ctx.drawImage(bitmap, 0, 0);

          const pngBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => {
              if (!b) {
                reject(new Error('Failed to convert watermark image'));
                return;
              }
              resolve(b);
            }, 'image/png');
          });

          const pngBytes = await pngBlob.arrayBuffer();
          embedded = await pdf.embedPng(pngBytes);
        }
        const w = embedded.width * watermarkImageScale;
        const h = embedded.height * watermarkImageScale;
        const { x, y } = getPosition(width, height, w, h, watermarkPosition);
        page.drawImage(embedded, {
          x,
          y,
          width: w,
          height: h,
          opacity: watermarkOpacity,
        });
      } else {
        const size = Math.max(12, watermarkSize);
        const textWidth = font.widthOfTextAtSize(text, size);
        const textHeight = size;
        const { x, y } = getPosition(
          width,
          height,
          textWidth,
          textHeight,
          watermarkPosition
        );
        page.drawText(text, {
          x,
          y,
          size,
          font,
          color: rgb(0.75, 0.75, 0.75),
          opacity: watermarkOpacity,
          rotate: degrees(-30),
        });
      }
    }

    return pdf.save();
  };

  const signPdf = async (pdfFile: File) => {
    if (!signatureFile) {
      throw new Error('Signature image required');
    }

    const bytes = await pdfFile.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const page = pdf.getPages()[0];
    const sigBytes = await signatureFile.arrayBuffer();

    let embedded;
    if (signatureFile.type === 'image/png') {
      embedded = await pdf.embedPng(sigBytes);
    } else if (
      signatureFile.type === 'image/jpeg' ||
      signatureFile.type === 'image/jpg'
    ) {
      embedded = await pdf.embedJpg(sigBytes);
    } else {
      const img = new Image();
      const url = URL.createObjectURL(signatureFile);
      const bitmap = await new Promise<ImageBitmap>((resolve, reject) => {
        img.onload = async () => {
          try {
            const bmp = await createImageBitmap(img);
            resolve(bmp);
          } catch (err) {
            reject(err);
          } finally {
            URL.revokeObjectURL(url);
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Unsupported image'));
        };
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');
      ctx.drawImage(bitmap, 0, 0);

      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (!b) {
            reject(new Error('Failed to convert signature'));
            return;
          }
          resolve(b);
        }, 'image/png');
      });

      const pngBytes = await pngBlob.arrayBuffer();
      embedded = await pdf.embedPng(pngBytes);
    }

    const scale = signScale;
    const sigWidth = embedded.width * scale;
    const sigHeight = embedded.height * scale;
    const { x, y } = getPosition(
      page.getWidth(),
      page.getHeight(),
      sigWidth,
      sigHeight,
      signPosition === 'top-left'
        ? 'top-left'
        : signPosition === 'top-right'
          ? 'top-right'
          : signPosition === 'bottom-left'
            ? 'bottom-left'
            : 'bottom-right'
    );
    page.drawImage(embedded, {
      x,
      y,
      width: sigWidth,
      height: sigHeight,
    });

    return pdf.save();
  };

  const protectPdf = async (pdfFile: File) => {
    if (!password.trim()) throw new Error('Password is required');
    if (confirmPassword.trim() && password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    const form = new FormData();
    form.append('file', pdfFile);
    form.append('password', password);
    const response = await apiFetch('/api/pdf/protect', {
      method: 'POST',
      body: form,
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error || 'Failed to protect PDF');
    }
    return response.blob();
  };

  const unlockPdf = async (pdfFile: File) => {
    if (!password.trim()) throw new Error('Password is required');
    const form = new FormData();
    form.append('file', pdfFile);
    form.append('password', password);
    const response = await apiFetch('/api/pdf/unlock', {
      method: 'POST',
      body: form,
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error || 'Failed to unlock PDF');
    }
    return response.blob();
  };

  const ocrPdf = async (pdfFile: File) => {
    const data = await pdfFile.arrayBuffer();
    const doc = await getDocument({ data }).promise;
    let text = '';
    const selected = ocrRange.trim()
      ? parsePageRange(ocrRange, doc.numPages)
      : Array.from({ length: doc.numPages }, (_, i) => i);

    for (const index of selected) {
      const page = await doc.getPage(index + 1);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      const result = await Tesseract.recognize(canvas, ocrLang || 'eng');
      text += `\n\nPage ${index + 1}\n${result.data.text}`;
    }

    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const lines = pdf.splitTextToSize(text.trim(), 520);
    let y = margin;

    lines.forEach((line: string) => {
      if (y > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += 16;
    });

    return pdf.output('blob');
  };

  const processFiles = async () => {
    if (files.length === 0 && action !== 'html-to-pdf') {
      setErrorMessage('Please select the required file first.');
      return;
    }
    setProcessing(true);
    setErrorMessage(null);
    try {
      if (action === 'merge') {
        const bytes = await mergePdfs(files);
        setResultBlob(
          new Blob([bytes], { type: 'application/pdf' }),
          'merged.pdf'
        );
      } else if (action === 'split') {
        const { blob, name } = await splitPdf(files[0]);
        setResultBlob(blob, name);
      } else if (action === 'compress') {
        const bytes = await compressPdf(files[0]);
        setResultBlob(
          new Blob([bytes], { type: 'application/pdf' }),
          'compressed.pdf'
        );
      } else if (action === 'rotate') {
        const bytes = await rotatePdf(files[0]);
        setResultBlob(
          new Blob([bytes], { type: 'application/pdf' }),
          'rotated.pdf'
        );
      } else if (action === 'pdf-to-jpg') {
        const { blob, name } = await pdfToJpg(files[0]);
        setResultBlob(blob, name);
      } else if (action === 'jpg-to-pdf') {
        const bytes = await imagesToPdf(files);
        setResultBlob(
          new Blob([bytes], { type: 'application/pdf' }),
          'images.pdf'
        );
      } else if (action === 'scan-to-pdf') {
        const bytes = await imagesToPdf(files);
        setResultBlob(
          new Blob([bytes], { type: 'application/pdf' }),
          'scanned.pdf'
        );
      } else if (action === 'pdf-to-word') {
        const blob = await pdfToWord(files[0]);
        setResultBlob(blob, 'document.docx');
      } else if (action === 'pdf-to-excel') {
        const blob = await pdfToExcel(files[0]);
        setResultBlob(blob, 'sheet.xlsx');
      } else if (action === 'pdf-to-ppt') {
        const blob = await pdfToPpt(files[0]);
        setResultBlob(blob, 'slides.pptx');
      } else if (action === 'word-to-pdf') {
        const blob = await wordToPdf(files[0]);
        setResultBlob(blob, 'document.pdf');
      } else if (action === 'ppt-to-pdf') {
        const blob = await pptToPdf(files[0]);
        setResultBlob(blob, 'slides.pdf');
      } else if (action === 'excel-to-pdf') {
        const blob = await excelToPdf(files[0]);
        setResultBlob(blob, 'sheet.pdf');
      } else if (action === 'html-to-pdf') {
        const blob = await htmlToPdf(files[0]);
        setResultBlob(blob, 'page.pdf');
      } else if (action === 'pdf-to-pdfa') {
        const bytes = await pdfToPdfa(files[0]);
        setResultBlob(
          new Blob([bytes], { type: 'application/pdf' }),
          'archive.pdf'
        );
      } else if (action === 'edit-pdf') {
        const bytes = await editPdf(files[0]);
        setResultBlob(
          new Blob([bytes], { type: 'application/pdf' }),
          'edited.pdf'
        );
      } else if (action === 'watermark-pdf') {
        const bytes = await watermarkPdf(files[0]);
        setResultBlob(
          new Blob([bytes], { type: 'application/pdf' }),
          'watermarked.pdf'
        );
      } else if (action === 'sign-pdf') {
        const bytes = await signPdf(files[0]);
        setResultBlob(
          new Blob([bytes], { type: 'application/pdf' }),
          'signed.pdf'
        );
      } else if (action === 'protect-pdf') {
        const blob = await protectPdf(files[0]);
        setResultBlob(blob, 'protected.pdf');
      } else if (action === 'unlock-pdf') {
        const blob = await unlockPdf(files[0]);
        setResultBlob(blob, 'unlocked.pdf');
      } else if (action === 'ocr-pdf') {
        const blob = await ocrPdf(files[0]);
        setResultBlob(blob, 'ocr.pdf');
      } else if (action === 'page-numbers') {
        const bytes = await addPageNumbers(files[0]);
        setResultBlob(
          new Blob([bytes], { type: 'application/pdf' }),
          'page-numbers.pdf'
        );
      } else if (action === 'crop-pdf') {
        const bytes = await cropPdf(files[0]);
        setResultBlob(
          new Blob([bytes], { type: 'application/pdf' }),
          'cropped.pdf'
        );
      } else if (action === 'compare-pdf') {
        if (files.length < 2) throw new Error('Please upload two PDF files');
        const bytes = await comparePdf(files[0], files[1]);
        setResultBlob(
          new Blob([bytes], { type: 'application/pdf' }),
          'compare.pdf'
        );
      } else if (action === 'redact-pdf') {
        const bytes = await redactPdf(files[0]);
        setResultBlob(
          new Blob([bytes], { type: 'application/pdf' }),
          'redacted.pdf'
        );
      } else if (action === 'translate-pdf') {
        const blob = await translatePdf(files[0]);
        setResultBlob(blob, 'translated.pdf');
      }
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Processing failed. Please try again with another file.';
      setErrorMessage(message);
    } finally {
      setProcessing(false);
    }
  };

  const actions: { id: PdfAction; name: string; icon: any; desc: string }[] = [
    {
      id: 'merge',
      name: 'Merge PDF Files',
      icon: Layers,
      desc: 'Combine multiple PDFs into one file in the order you want.',
    },
    {
      id: 'split',
      name: 'Split PDF',
      icon: Scissors,
      desc: 'Split a PDF by page range or extract pages into new files.',
    },
    {
      id: 'compress',
      name: 'Compress PDF File',
      icon: FileArchive,
      desc: 'Reduce PDF size while keeping quality.',
    },
    {
      id: 'pdf-to-word',
      name: 'PDF to Word Converter',
      icon: FileType,
      desc: 'Convert PDF into an editable Word document.',
    },
    {
      id: 'pdf-to-ppt',
      name: 'PDF to PowerPoint Converter',
      icon: Presentation,
      desc: 'Turn PDF pages into PowerPoint slides.',
    },
    {
      id: 'pdf-to-excel',
      name: 'PDF to Excel Converter',
      icon: FileSpreadsheet,
      desc: 'Extract PDF text into an Excel spreadsheet.',
    },
    {
      id: 'word-to-pdf',
      name: 'Word to PDF Converter',
      icon: FileType,
      desc: 'Convert DOCX files into PDF.',
    },
    {
      id: 'ppt-to-pdf',
      name: 'PPT to PDF Converter',
      icon: Presentation,
      desc: 'Convert PowerPoint slides to PDF.',
    },
    {
      id: 'excel-to-pdf',
      name: 'Excel to PDF Converter',
      icon: FileSpreadsheet,
      desc: 'Convert Excel sheets into PDF.',
    },
    {
      id: 'html-to-pdf',
      name: 'HTML to PDF Converter',
      icon: FileText,
      desc: 'Turn HTML or text into a PDF file.',
    },
    {
      id: 'pdf-to-pdfa',
      name: 'PDF to PDF/A Converter',
      icon: FileArchive,
      desc: 'Create an archive-friendly PDF/A.',
    },
    {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG Converter',
      icon: ImageIcon,
      desc: 'Convert each PDF page to JPG images.',
    },
    {
      id: 'jpg-to-pdf',
      name: 'JPG to PDF Converter',
      icon: FileText,
      desc: 'Convert JPG, PNG, WEBP, and more into PDF.',
    },
    {
      id: 'scan-to-pdf',
      name: 'Scan to PDF',
      icon: ScanLine,
      desc: 'Create a PDF from scanned images or photos.',
    },
    {
      id: 'rotate',
      name: 'Rotate PDF Pages',
      icon: RotateCw,
      desc: 'Rotate PDF pages by 90 or 180 degrees.',
    },
    {
      id: 'page-numbers',
      name: 'Add Page Numbers to PDF',
      icon: FileText,
      desc: 'Add page numbers to PDF pages.',
    },
    {
      id: 'crop-pdf',
      name: 'Crop PDF Pages',
      icon: Scissors,
      desc: 'Crop PDF pages by margins.',
    },
    {
      id: 'compare-pdf',
      name: 'Compare PDF Files',
      icon: FileSearch,
      desc: 'Compare two PDFs side-by-side.',
    },
    {
      id: 'edit-pdf',
      name: 'Edit PDF Online',
      icon: PenLine,
      desc: 'Add quick text edits to your PDF file.',
    },
    {
      id: 'watermark-pdf',
      name: 'Watermark PDF',
      icon: Stamp,
      desc: 'Add watermark text or image across pages.',
    },
    {
      id: 'sign-pdf',
      name: 'Sign PDF Online',
      icon: PenLine,
      desc: 'Upload and place your signature on the PDF.',
    },
    {
      id: 'protect-pdf',
      name: 'Protect PDF with Password',
      icon: ShieldPlus,
      desc: 'Add a password to your PDF.',
    },
    {
      id: 'unlock-pdf',
      name: 'Unlock PDF Password',
      icon: Lock,
      desc: 'Remove a password from your PDF.',
    },
    {
      id: 'ocr-pdf',
      name: 'OCR PDF (Text from Scan)',
      icon: FileSearch,
      desc: 'Extract text from scanned PDFs.',
    },
    {
      id: 'redact-pdf',
      name: 'Redact PDF',
      icon: ShieldPlus,
      desc: 'Remove sensitive text from PDFs.',
    },
    {
      id: 'translate-pdf',
      name: 'Translate PDF',
      icon: FileSearch,
      desc: 'Translate extracted text to another language.',
    },
  ];
  if (showGrid) {
    return (
      <div className="h-full bg-[#0a0505] overflow-y-auto relative">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-red-900/10 pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-rose-500/20 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-1 h-1 bg-rose-400/30 rounded-full animate-ping" />
          <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-red-500/20 rounded-full animate-pulse delay-700" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-rose-500/40 rounded-full animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 p-8 md:p-16">
          <div className="max-w-7xl mx-auto space-y-16">
            
            {/* Hero Section */}
            <div className="text-center space-y-6 relative">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-400 text-sm font-bold uppercase tracking-wider mb-4"
              >
                <Sparkles size={16} className="animate-pulse" />
                100% Free Forever
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight"
              >
                Every tool you need to work with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-500 to-rose-600">
                  PDFs
                </span>{' '}
                in one place
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-rose-200/60 max-w-2xl mx-auto font-medium leading-relaxed"
              >
                All the tools you need to use PDFs, at your fingertips. 
                Completely free and incredibly easy to use!
              </motion.p>

              {/* Stats or Features bar */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-rose-400/70"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-rose-500" />
                  <span>No registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-rose-500" />
                  <span>No watermarks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-rose-500" />
                  <span>Secure processing</span>
                </div>
              </motion.div>
            </div>

            {/* Tools Grid */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {actions.map((a, index) => (
                <motion.button
                  key={a.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setAction(a.id);
                    setShowGrid(false);
                    setFiles([]);
                    setResult(null);
                    setResultName(null);
                  }}
                  className="group relative p-8 bg-[#151010]/80 backdrop-blur-md border border-rose-500/20 rounded-3xl hover:border-rose-500/50 transition-all duration-500 text-left overflow-hidden"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -inset-px bg-gradient-to-br from-rose-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-sm" />
                  
                  <div className="relative z-10 space-y-5">
                    {/* Icon Container */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-500/20 to-red-600/10 text-rose-400 rounded-2xl flex items-center justify-center border border-rose-500/30 group-hover:bg-gradient-to-br group-hover:from-rose-500 group-hover:to-red-600 group-hover:text-white group-hover:border-rose-500 group-hover:shadow-lg group-hover:shadow-rose-500/30 transition-all duration-300">
                        <a.icon size={32} className="group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      {/* Corner decoration */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white group-hover:text-rose-100 transition-colors flex items-center gap-2">
                        {a.name}
                        <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </h3>
                      <p className="text-sm text-rose-200/50 leading-relaxed group-hover:text-rose-200/70 transition-colors">
                        {a.desc}
                      </p>
                    </div>

                    {/* Action hint */}
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-500/0 group-hover:text-rose-400/80 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span>Click to use</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* Bottom CTA */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center pt-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#151010]/60 border border-rose-500/20 rounded-2xl text-rose-300/60 text-sm">
                <Shield size={16} />
                <span>Your files are processed securely and never stored on our servers</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const isImageAction = action === 'jpg-to-pdf' || action === 'scan-to-pdf';
  const allowMultiple =
    action === 'merge' ||
    action === 'jpg-to-pdf' ||
    action === 'scan-to-pdf' ||
    action === 'compare-pdf';
  const inputAccept = (() => {
    if (isImageAction) return 'image/*';
    if (action === 'word-to-pdf') return '.docx';
    if (action === 'ppt-to-pdf') return '.pptx';
    if (action === 'excel-to-pdf') return '.xlsx,.xls';
    if (action === 'html-to-pdf') return '.html,.htm,.txt';
    return '.pdf';
  })();
  const inputLabel = (() => {
    if (isImageAction) return 'Select image files';
    if (action === 'word-to-pdf') return 'Select DOCX file';
    if (action === 'ppt-to-pdf') return 'Select PPTX file';
    if (action === 'excel-to-pdf') return 'Select Excel file';
    if (action === 'html-to-pdf') return 'Select HTML file';
    if (action === 'compare-pdf') return 'Select two PDF files';
    return 'Select PDF file';
  })();
  const inputHint = isImageAction
    ? 'or drop images here'
    : 'or drop files here';

  return (
    <div className="h-full flex flex-col bg-[#0a0505] overflow-y-auto relative">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-red-900/10 pointer-events-none" />

      {/* Floating Particles Effect (CSS only) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-rose-500/20 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-rose-400/30 rounded-full animate-ping" />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-red-500/20 rounded-full animate-pulse delay-700" />
      </div>

      {/* Header */}
      <div className="relative bg-[#151010]/80 backdrop-blur-xl border-b border-rose-500/20 px-8 py-5 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <button
          onClick={() => setShowGrid(true)}
          className="group flex items-center gap-3 text-rose-400 hover:text-rose-300 font-bold transition-all duration-300 hover:translate-x-[-4px]"
        >
          <div className="p-2 bg-rose-500/10 rounded-xl group-hover:bg-rose-500/20 transition-colors border border-rose-500/20">
            <ChevronRight
              size={20}
              className="rotate-180 group-hover:rotate-[-180deg] transition-transform duration-300"
            />
          </div>
          <span className="tracking-wide">All PDF Tools</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-500/50" />
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500 tracking-tight">
            {actions.find((a) => a.id === action)?.name}
          </h2>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose-500/50" />
        </div>

        <div className="w-32" />
      </div>

      <div className="flex-1 p-8 md:p-12 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Zone - Glassmorphism Card */}
          <div
            className={`relative group rounded-[2rem] p-16 text-center transition-all duration-500 overflow-hidden ${
              files.length > 0
                ? 'bg-gradient-to-br from-rose-500/20 to-red-600/10 border-2 border-rose-500/50 shadow-2xl shadow-rose-500/20'
                : 'bg-[#1a1414]/60 border-2 border-rose-500/20 hover:border-rose-500/40 shadow-xl shadow-black/50 backdrop-blur-sm'
            }`}
          >
            {/* Inner Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <label className="cursor-pointer space-y-8 block relative z-10">
              <div className="relative">
                <div className="w-28 h-28 mx-auto relative">
                  {/* Pulsing Ring */}
                  <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping" />
                  <div className="absolute inset-2 bg-gradient-to-br from-rose-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-rose-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Upload size={44} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-3xl font-black text-white tracking-tight">
                  {inputLabel}
                </p>
                <p className="text-rose-400/80 text-lg font-medium">
                  {inputHint}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-300 font-semibold text-sm group-hover:bg-rose-500/20 transition-colors">
                <span>Click to browse</span>
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>

              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={inputAccept}
                multiple={allowMultiple}
              />
            </label>
          </div>

          {/* Files & Options Section */}
          {(files.length > 0 ||
            (action === 'html-to-pdf' && htmlInput.trim())) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Files List - Card */}
              {files.length > 0 && (
                <div className="bg-[#151010]/80 backdrop-blur-md border border-rose-500/20 rounded-3xl p-8 shadow-2xl shadow-black/40">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                      Files to process
                    </h4>
                    <span className="px-4 py-1.5 bg-rose-500/20 text-rose-300 rounded-full text-sm font-bold border border-rose-500/30">
                      {files.length} files
                    </span>
                  </div>

                  <div className="space-y-3">
                    {files.map((f, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex items-center justify-between p-4 bg-[#0f0a0a] rounded-2xl border border-rose-500/10 hover:border-rose-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-rose-500/20 to-red-600/10 text-rose-400 rounded-xl flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
                            {isImageAction ? (
                              <ImageIcon size={20} />
                            ) : (
                              <FileArchive size={20} />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block truncate max-w-xs">
                              {f.name}
                            </span>
                            <span className="text-xs text-rose-400/60">
                              Ready to process
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                            {(f.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Options Panel */}
              <div className="bg-[#151010]/80 backdrop-blur-md border border-rose-500/20 rounded-3xl p-8 shadow-2xl shadow-black/40 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                    <Settings size={20} className="text-rose-400" />
                  </div>
                  <h4 className="text-sm font-black text-rose-400 uppercase tracking-widest">
                    Configuration
                  </h4>
                </div>

                <div className="grid gap-6">
                  {/* All your existing action conditions here - styled consistently */}
                  {action === 'merge' && (
                    <label className="flex items-center gap-4 p-4 bg-[#0f0a0a] rounded-2xl border border-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={mergeSort}
                          onChange={(e) => setMergeSort(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-6 h-6 border-2 border-rose-500/50 rounded-lg peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all flex items-center justify-center">
                          <Check
                            size={14}
                            className="text-white opacity-0 peer-checked:opacity-100"
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-rose-100 group-hover:text-white transition-colors">
                        Sort files by name before merge
                      </span>
                    </label>
                  )}

                  {action === 'split' && (
                    <div className="space-y-3">
                      <label className="text-sm font-black text-rose-300 uppercase tracking-wider">
                        Split range (optional)
                      </label>
                      <div className="relative">
                        <input
                          value={splitRange}
                          onChange={(e) => setSplitRange(e.target.value)}
                          className="w-full px-5 py-4 bg-[#0f0a0a] border-2 border-rose-500/20 rounded-2xl text-white placeholder-rose-400/40 focus:border-rose-500 focus:shadow-lg focus:shadow-rose-500/10 outline-none transition-all font-medium"
                          placeholder="Example: 1-3,5"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-400/50">
                          <Scissors size={18} />
                        </div>
                      </div>
                      <p className="text-xs text-rose-400/60 flex items-center gap-1">
                        <Info size={12} /> Leave empty to split all pages
                      </p>
                    </div>
                  )}

                  {/* Continue with other actions... Same styling pattern */}

                  {action === 'rotate' && (
                    <div className="space-y-3">
                      <label className="text-sm font-black text-rose-300 uppercase tracking-wider">
                        Rotate direction
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { val: 90, label: '90° CW', icon: RotateCw },
                          { val: 180, label: '180°', icon: RefreshCw },
                          { val: 270, label: '90° CCW', icon: RotateCcw },
                        ].map((opt) => (
                          <button
                            key={opt.val}
                            onClick={() => setRotateDegrees(opt.val)}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                              rotateDegrees === opt.val
                                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/20'
                                : 'bg-[#0f0a0a] border-rose-500/20 text-rose-400/60 hover:border-rose-500/40'
                            }`}
                          >
                            <opt.icon size={24} />
                            <span className="text-xs font-bold">
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(action === 'jpg-to-pdf' || action === 'scan-to-pdf') && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="text-sm font-black text-rose-300 uppercase tracking-wider">
                            Page layout
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { value: 'auto', label: 'Original size' },
                              { value: 'a4', label: 'Fit to A4' },
                            ].map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setPageSize(option.value as 'auto' | 'a4')}
                                className={`rounded-2xl border-2 px-4 py-4 text-sm font-bold transition-all ${
                                  pageSize === option.value
                                    ? 'border-rose-500 bg-rose-500/15 text-rose-200'
                                    : 'border-rose-500/20 bg-[#0f0a0a] text-slate-300 hover:border-rose-500/40'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-black text-rose-300 uppercase tracking-wider">
                            Page margin
                          </label>
                          <div className="flex items-center gap-4 rounded-2xl border-2 border-rose-500/20 bg-[#0f0a0a] p-4">
                            <input
                              type="range"
                              min="0"
                              max="60"
                              step="2"
                              value={pageMargin}
                              onChange={(e) => setPageMargin(Number(e.target.value))}
                              className="flex-1 cursor-pointer accent-rose-500"
                            />
                            <span className="w-12 text-right text-rose-300 font-bold">{pageMargin}px</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-rose-500/15 bg-rose-500/5 p-4 text-sm leading-7 text-rose-100/75">
                        Tip: use <span className="font-bold text-rose-200">Original size</span> when you want the image to stay natural, and switch to <span className="font-bold text-rose-200">Fit to A4</span> when you need a cleaner printable PDF page.
                      </div>
                    </div>
                  )}

                  {/* Password Protection - Special Styling */}
                  {(action === 'protect-pdf' || action === 'unlock-pdf') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-rose-300 uppercase tracking-wider flex items-center gap-2">
                          <Lock size={14} /> Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-[#0f0a0a] border-2 border-rose-500/20 rounded-2xl text-white placeholder-rose-400/40 focus:border-rose-500 focus:shadow-lg focus:shadow-rose-500/10 outline-none transition-all font-medium"
                            placeholder="Enter secure password"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-400/30">
                            <Key size={18} />
                          </div>
                        </div>
                      </div>
                      {action === 'protect-pdf' && (
                        <div className="space-y-3">
                          <label className="text-sm font-black text-rose-300 uppercase tracking-wider flex items-center gap-2">
                            <Shield size={14} /> Confirm
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-[#0f0a0a] border-2 border-rose-500/20 rounded-2xl text-white placeholder-rose-400/40 focus:border-rose-500 focus:shadow-lg focus:shadow-rose-500/10 outline-none transition-all font-medium"
                            placeholder="Re-enter password"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Watermark - Enhanced */}
                  {action === 'watermark-pdf' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-3">
                          <label className="text-sm font-black text-rose-300 uppercase tracking-wider">
                            Watermark text
                          </label>
                          <input
                            value={watermarkText}
                            onChange={(e) => setWatermarkText(e.target.value)}
                            className="w-full px-5 py-4 bg-[#0f0a0a] border-2 border-rose-500/20 rounded-2xl text-white placeholder-rose-400/40 focus:border-rose-500 focus:shadow-lg focus:shadow-rose-500/10 outline-none transition-all font-bold text-lg tracking-widest uppercase"
                            placeholder="CONFIDENTIAL"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-black text-rose-300 uppercase tracking-wider">
                            Opacity
                          </label>
                          <div className="flex items-center gap-4 p-4 bg-[#0f0a0a] rounded-2xl border-2 border-rose-500/20">
                            <input
                              type="range"
                              min="0.05"
                              max="1"
                              step="0.05"
                              value={watermarkOpacity}
                              onChange={(e) =>
                                setWatermarkOpacity(Number(e.target.value))
                              }
                              className="flex-1 h-2 bg-rose-500/20 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                            <span className="text-rose-400 font-bold w-12 text-right">
                              {Math.round(watermarkOpacity * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Image Upload Zone */}
                      <div className="border-2 border-dashed border-rose-500/30 rounded-2xl p-6 bg-[#0f0a0a]/50 hover:border-rose-500/50 transition-colors">
                        <label className="flex flex-col items-center gap-3 cursor-pointer">
                          <ImageIcon size={32} className="text-rose-400/60" />
                          <span className="text-sm font-bold text-rose-300">
                            Upload watermark image (optional)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleWatermarkImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {action === 'edit-pdf' && (
                    <div className="space-y-5">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-rose-300 uppercase tracking-wider">
                          Edit text
                        </label>
                        <textarea
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          className="w-full min-h-32 px-5 py-4 bg-[#0f0a0a] border-2 border-rose-500/20 rounded-2xl text-white placeholder-rose-400/40 focus:border-rose-500 outline-none transition-all"
                          placeholder="Type the text you want to place on the PDF..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="text-sm font-black text-rose-300 uppercase tracking-wider">
                            Font size
                          </label>
                          <div className="flex items-center gap-4 p-4 bg-[#0f0a0a] rounded-2xl border-2 border-rose-500/20">
                            <input
                              type="range"
                              min="10"
                              max="72"
                              step="1"
                              value={editFontSize}
                              onChange={(e) => setEditFontSize(Number(e.target.value))}
                              className="flex-1 accent-rose-500 cursor-pointer"
                            />
                            <span className="text-rose-300 font-bold w-10 text-right">{editFontSize}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-black text-rose-300 uppercase tracking-wider">
                            Page target
                          </label>
                          <div className="grid grid-cols-[1fr,auto] gap-3">
                            <input
                              type="number"
                              min={1}
                              max={pdfPageCount}
                              value={editTargetPage}
                              onChange={(e) => setEditTargetPage(Math.max(1, Math.min(pdfPageCount, Number(e.target.value) || 1)))}
                              disabled={editApplyAllPages}
                              className="px-5 py-4 bg-[#0f0a0a] border-2 border-rose-500/20 rounded-2xl text-white outline-none disabled:opacity-50"
                            />
                            <button
                              onClick={() => setEditApplyAllPages((prev) => !prev)}
                              className={`cursor-pointer px-4 py-4 rounded-2xl font-bold transition-colors ${
                                editApplyAllPages ? 'bg-rose-500 text-white' : 'bg-[#0f0a0a] border border-rose-500/20 text-rose-300'
                              }`}
                            >
                              All pages
                            </button>
                          </div>
                          <p className="text-xs text-rose-400/60">Detected pages: {pdfPageCount}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="text-sm font-black text-rose-300 uppercase tracking-wider">
                            Horizontal position
                          </label>
                          <div className="flex items-center gap-4 p-4 bg-[#0f0a0a] rounded-2xl border-2 border-rose-500/20">
                            <input
                              type="range"
                              min="0"
                              max="90"
                              value={editXPercent}
                              onChange={(e) => setEditXPercent(Number(e.target.value))}
                              className="flex-1 accent-rose-500 cursor-pointer"
                            />
                            <span className="text-rose-300 font-bold w-12 text-right">{editXPercent}%</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-black text-rose-300 uppercase tracking-wider">
                            Vertical position
                          </label>
                          <div className="flex items-center gap-4 p-4 bg-[#0f0a0a] rounded-2xl border-2 border-rose-500/20">
                            <input
                              type="range"
                              min="10"
                              max="95"
                              value={editYPercent}
                              onChange={(e) => setEditYPercent(Number(e.target.value))}
                              className="flex-1 accent-rose-500 cursor-pointer"
                            />
                            <span className="text-rose-300 font-bold w-12 text-right">{editYPercent}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="space-y-3">
                          <span className="text-sm font-black text-rose-300 uppercase tracking-wider block">Text color</span>
                          <input type="color" value={editColorHex} onChange={(e) => setEditColorHex(e.target.value)} className="w-full h-14 rounded-2xl bg-transparent cursor-pointer" />
                        </label>
                        <label className="space-y-3">
                          <span className="text-sm font-black text-rose-300 uppercase tracking-wider block">Background box</span>
                          <button
                            onClick={() => setEditUseBackground((prev) => !prev)}
                            className={`cursor-pointer w-full h-14 rounded-2xl font-bold transition-colors ${
                              editUseBackground ? 'bg-rose-500 text-white' : 'bg-[#0f0a0a] border border-rose-500/20 text-rose-300'
                            }`}
                          >
                            {editUseBackground ? 'Enabled' : 'Disabled'}
                          </button>
                        </label>
                        <label className="space-y-3">
                          <span className="text-sm font-black text-rose-300 uppercase tracking-wider block">Box color</span>
                          <input type="color" value={editBackgroundHex} onChange={(e) => setEditBackgroundHex(e.target.value)} disabled={!editUseBackground} className="w-full h-14 rounded-2xl bg-transparent cursor-pointer disabled:opacity-40" />
                        </label>
                      </div>

                      <div className="rounded-[1.75rem] border border-rose-500/20 bg-[#120b0b] p-5 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.22em] text-rose-300">
                              Logo or image overlay
                            </h4>
                            <p className="text-sm text-rose-100/60">
                              Add a badge, logo, or sticker on the same page position as your text.
                            </p>
                          </div>
                          <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors">
                            <Upload size={16} />
                            Upload image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleEditImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-4">
                          <div className="rounded-3xl border border-white/10 bg-[#0f0a0a] p-4 min-h-[220px] flex items-center justify-center">
                            {editImagePreview ? (
                              <img
                                src={editImagePreview}
                                alt="Edit overlay preview"
                                className="max-h-44 max-w-full rounded-2xl object-contain"
                              />
                            ) : (
                              <div className="text-center text-sm text-rose-100/50 space-y-2">
                                <ImageIcon className="mx-auto text-rose-300/50" size={28} />
                                <p>No image selected yet.</p>
                                <p>PNG, JPG, WEBP and other browser-supported images work.</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-3">
                              <label className="text-sm font-black text-rose-300 uppercase tracking-wider">
                                Overlay scale
                              </label>
                              <div className="flex items-center gap-4 p-4 bg-[#0f0a0a] rounded-2xl border-2 border-rose-500/20">
                                <input
                                  type="range"
                                  min="0.1"
                                  max="1.5"
                                  step="0.05"
                                  value={editImageScale}
                                  onChange={(e) => setEditImageScale(Number(e.target.value))}
                                  disabled={!editImageFile}
                                  className="flex-1 accent-rose-500 cursor-pointer disabled:opacity-40"
                                />
                                <span className="text-rose-300 font-bold w-14 text-right">
                                  {editImageScale.toFixed(2)}x
                                </span>
                              </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-[#0f0a0a] px-4 py-3 text-sm text-rose-100/65">
                              Tip: use a transparent PNG logo for the cleanest PDF overlay result.
                            </div>

                            {editImageFile && (
                              <button
                                onClick={() => {
                                  setEditImageFile(null);
                                  setEditImagePreview(null);
                                  setEditImageScale(0.35);
                                }}
                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-200 font-bold hover:bg-rose-500/20 transition-colors"
                              >
                                <X size={16} />
                                Remove image
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={() => setFiles([])}
                  className="group px-8 py-4 bg-[#1a1414] border-2 border-rose-500/30 rounded-2xl font-bold text-rose-300 hover:border-rose-500/60 hover:bg-rose-500/10 transition-all duration-300 flex items-center gap-2"
                >
                  <X
                    size={20}
                    className="group-hover:rotate-90 transition-transform"
                  />
                  Cancel
                </button>
                <button
                  onClick={processFiles}
                  disabled={processing}
                  className="group relative px-12 py-4 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-rose-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {processing ? (
                    <RefreshCw className="animate-spin" size={22} />
                  ) : (
                    <Zap size={22} className="group-hover:animate-pulse" />
                  )}
                  <span className="relative z-10">
                    {processing ? 'Processing...' : 'Process Now'}
                  </span>
                </button>
              </div>
            </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[2rem] border border-red-400/30 bg-red-500/10 px-6 py-5 text-left shadow-lg shadow-red-900/20"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 rounded-xl border border-red-300/30 bg-red-500/15 p-2 text-red-200">
                    <Info size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-red-200/90">
                      Processing Issue
                    </h4>
                    <p className="text-sm font-medium leading-6 text-red-100/90">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success Card */}
            {result && resultName && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-rose-500/30 border border-rose-400/30"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
              </div>

              <div className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-xl">
                  <Sparkles size={40} className="text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-3xl font-black mb-1 tracking-tight">
                    All Done! 🎉
                  </h4>
                  <p className="text-rose-100 text-lg font-medium">
                    Your file is ready for download
                  </p>
                </div>
              </div>

              <a
                href={result}
                download={resultName}
                className="group relative w-full md:w-auto px-10 py-5 bg-white text-rose-600 rounded-2xl font-black text-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <Download
                  size={26}
                  className="relative z-10 group-hover:animate-bounce"
                />
                <span className="relative z-10">Download File</span>
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

