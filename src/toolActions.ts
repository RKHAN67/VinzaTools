import type { PdfAction } from './components/PdfTools';
import type { DevAction } from './components/DevTools';
import type { ToolType as MediaToolType } from './components/MediaflowDownloader';

export const PDF_ACTION_TO_ID: Record<PdfAction, string> = {
  merge: 'pdf-merge',
  split: 'pdf-split',
  compress: 'pdf-compress',
  rotate: 'pdf-rotate',
  'pdf-to-jpg': 'pdf-to-jpg',
  'jpg-to-pdf': 'jpg-to-pdf',
  'pdf-to-word': 'pdf-to-word',
  'pdf-to-ppt': 'pdf-to-ppt',
  'pdf-to-excel': 'pdf-to-excel',
  'edit-pdf': 'edit-pdf',
  'watermark-pdf': 'watermark-pdf',
  'sign-pdf': 'sign-pdf',
  'protect-pdf': 'protect-pdf',
  'unlock-pdf': 'unlock-pdf',
  'ocr-pdf': 'ocr-pdf',
  'scan-to-pdf': 'scan-to-pdf',
  'word-to-pdf': 'word-to-pdf',
  'ppt-to-pdf': 'ppt-to-pdf',
  'excel-to-pdf': 'excel-to-pdf',
  'html-to-pdf': 'html-to-pdf',
  'pdf-to-pdfa': 'pdf-to-pdfa',
  'page-numbers': 'page-numbers',
  'crop-pdf': 'crop-pdf',
  'compare-pdf': 'compare-pdf',
  'redact-pdf': 'redact-pdf',
  'translate-pdf': 'translate-pdf',
};

export const PDF_ID_TO_ACTION: Record<string, PdfAction> = Object.entries(PDF_ACTION_TO_ID).reduce(
  (acc, [action, id]) => {
    acc[id] = action as PdfAction;
    return acc;
  },
  {} as Record<string, PdfAction>
);

export const DEV_ACTION_TO_ID: Record<DevAction, string> = {
  json: 'dev-json',
  minify: 'dev-minify',
  base64: 'dev-base64',
  'svg-viewer': 'dev-svg',
};

export const DEV_ID_TO_ACTION: Record<string, DevAction> = Object.entries(DEV_ACTION_TO_ID).reduce(
  (acc, [action, id]) => {
    acc[id] = action as DevAction;
    return acc;
  },
  {} as Record<string, DevAction>
);

export const MEDIA_ACTION_TO_ID: Record<MediaToolType, string> = {
  youtube: 'media-youtube',
  tiktok: 'media-tiktok',
  instagram: 'media-instagram',
  facebook: 'media-facebook',
};

export const MEDIA_ID_TO_ACTION: Record<string, MediaToolType> = Object.entries(MEDIA_ACTION_TO_ID).reduce(
  (acc, [action, id]) => {
    acc[id] = action as MediaToolType;
    return acc;
  },
  {} as Record<string, MediaToolType>
);
