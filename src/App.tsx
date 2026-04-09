import React, { Suspense, useMemo, useState } from 'react';
import {
  FileText,
  Layout,
  Columns,
  FileArchive,
  Eraser,
  Search,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Image as ImageIcon,
  FileType,
  FileSpreadsheet,
  Presentation,
  Stamp,
  RotateCw,
  FileCode,
  Lock,
  ShieldPlus,
  FileSearch,
  ScanLine,
  PenLine,
  PenTool,
  FileText as FileTextIcon,
  FilePlus,
  Scissors,
  Hash,
  Eye,
  Layers,
  Smartphone,
  Users,
  Mail,
  Phone,
  MessageCircle,
  BookOpen,
  Shield,
  Newspaper,
  Link,
  QrCode,
  Palette,
  KeyRound,
  Database,
  BarChart3,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { PdfAction } from './components/PdfTools';
import type { DevAction } from './components/DevTools';
import type { ToolType as MediaToolType } from './components/MediaflowDownloader';
import { PasswordGenerator } from './components/PasswordGenerator';
import { UrlEncoderDecoder } from './components/UrlEncoderDecoder';
import { CaseConverter } from './components/CaseConverter';
import { SlugGenerator } from './components/SlugGenerator';
import { ImageCompressor } from './components/ImageCompressor';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { ColorPaletteGenerator } from './components/ColorPaletteGenerator';
import { DatabaseViewer } from './components/DatabaseViewer';
import { CsvViewer } from './components/CsvViewer';
import { KeywordDensityChecker } from './components/KeywordDensityChecker';
import { ShopifyHelper } from './components/ShopifyHelper';
import { TextCounter } from './components/TextCounter';
import { ParagraphGenerator } from './components/ParagraphGenerator';
import { GoogleAuthenticator } from './components/GoogleAuthenticator';
import { ImageToolkit, type ImageToolkitMode } from './components/ImageToolkit';
import { MediaTranscoder, type MediaTranscoderMode } from './components/MediaTranscoder';
import { PdfAdvancedTools, type PdfAdvancedMode } from './components/PdfAdvancedTools';
import { UtilityConverters, type UtilityMode } from './components/UtilityConverters';
import rizwanImage from './assets/images/team-images/rizwan.webp';
import type { ToolCategory, PageKey, ContactTab, ShowcaseTab, ToolContext, Tool } from './types/app';
import { SiteLayout } from './layouts/SiteLayout';
import { BrandMark } from './components/BrandMark';
import { apiFetch } from './api';

const ResumeBuilder = React.lazy(() => import('./components/ResumeBuilder').then((m) => ({ default: m.ResumeBuilder })));
const PosterMaker = React.lazy(() => import('./components/PosterMaker').then((m) => ({ default: m.PosterMaker })));
const ImageCompare = React.lazy(() => import('./components/ImageCompare').then((m) => ({ default: m.ImageCompare })));
const PdfTools = React.lazy(() => import('./components/PdfTools').then((m) => ({ default: m.PdfTools })));
const BackgroundRemover = React.lazy(() => import('./components/BackgroundRemover').then((m) => ({ default: m.BackgroundRemover })));
const DevTools = React.lazy(() => import('./components/DevTools').then((m) => ({ default: m.DevTools })));
const ImageConverter = React.lazy(() => import('./components/ImageConverter').then((m) => ({ default: m.ImageConverter })));
const MediaflowDownloader = React.lazy(() => import('./components/MediaflowDownloader').then((m) => ({ default: m.MediaflowDownloader })));
const YoutubeThumbnailDownloader = React.lazy(() => import('./components/YoutubeThumbnailDownloader').then((m) => ({ default: m.YoutubeThumbnailDownloader })));
const CorporatePosterStudio = React.lazy(() => import('./components/CorporatePosterStudio').then((m) => ({ default: m.CorporatePosterStudio })));
const HomePage = React.lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const ToolsPage = React.lazy(() => import('./pages/ToolsPage').then((m) => ({ default: m.ToolsPage })));
const TeamPage = React.lazy(() => import('./pages/TeamPage').then((m) => ({ default: m.TeamPage })));
const BlogPage = React.lazy(() => import('./pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const AdminPage = React.lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })));
const ThemesPage = React.lazy(() => import('./pages/ThemesPage').then((m) => ({ default: m.ThemesPage })));
const PolicyPage = React.lazy(() => import('./pages/PolicyPage').then((m) => ({ default: m.PolicyPage })));
const TermsPage = React.lazy(() => import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const CookiePolicyPage = React.lazy(() => import('./pages/CookiePolicyPage').then((m) => ({ default: m.CookiePolicyPage })));

const PageFallback = ({ label = 'Loading...' }: { label?: string }) => (
  <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.16),_transparent_35%),linear-gradient(180deg,#181011_0%,#0f090a_100%)] px-6 py-14 text-center shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.04)_35%,transparent_65%)] animate-[pulse_2.8s_ease-in-out_infinite]" />
    <div className="relative z-10 flex max-w-md flex-col items-center gap-6">
      <BrandMark subtitle="Tools Loading Securely" className="bg-white/8 px-5 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.28)]" />
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-rose-200/80">
          <span className="inline-flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-rose-300 [animation-delay:-0.2s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-rose-400 [animation-delay:-0.1s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-rose-500" />
          </span>
          Preparing Workspace
        </div>
        <div className="text-2xl font-black tracking-tight text-white">{label}</div>
        <div className="text-sm leading-7 text-slate-300/80">
          VinzaTools is setting up your files, tools, and preview area so everything opens cleanly.
        </div>
      </div>
    </div>
  </div>
);

const INTERNAL_TOOLS: Tool[] = [
  {
    id: 'resume-builder',
    name: 'Professional Resume Builder',
    description: 'Build ATS-ready resumes with modern templates and exports.',
    category: 'creative',
    icon: FileText
  },
  {
    id: 'poster-maker',
    name: 'Poster Maker & Flyer Designer',
    description: 'Design posters, flyers, and banners with clean layouts.',
    category: 'creative',
    icon: Layout
  },
  {
    id: 'corporate-poster-studio',
    name: 'Corporate Poster Studio (AI Style)',
    description: 'Corporate poster studio with smart layouts and exports.',
    category: 'creative',
    icon: Layout
  },
  {
    id: 'image-compare',
    name: 'Image Compare & Diff Tool',
    description: 'Compare images side-by-side or with a slider.',
    category: 'image',
    icon: Columns
  },
  {
    id: 'pdf-merge',
    name: 'Merge PDF Files',
    description: 'Combine multiple PDFs into one file in order.',
    category: 'pdf',
    icon: FilePlus,
    subAction: 'merge'
  },
  {
    id: 'pdf-split',
    name: 'Split PDF',
    description: 'Split one PDF into multiple files by pages.',
    category: 'pdf',
    icon: Scissors,
    subAction: 'split'
  },
  {
    id: 'pdf-compress',
    name: 'Compress PDF File',
    description: 'Reduce PDF size while keeping quality.',
    category: 'pdf',
    icon: FileArchive,
    subAction: 'compress'
  },
  {
    id: 'pdf-rotate',
    name: 'Rotate PDF Pages',
    description: 'Rotate PDF pages in seconds.',
    category: 'pdf',
    icon: RotateCw,
    subAction: 'rotate'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG Converter',
    description: 'Convert each PDF page to JPG images.',
    category: 'pdf',
    icon: ImageIcon,
    subAction: 'pdf-to-jpg'
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    description: 'Convert JPG images into a PDF document.',
    category: 'pdf',
    icon: ImageIcon,
    subAction: 'jpg-to-pdf'
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word Converter',
    description: 'Convert PDF into an editable Word document.',
    category: 'pdf',
    icon: FileType,
    subAction: 'pdf-to-word'
  },
  {
    id: 'pdf-to-ppt',
    name: 'PDF to PowerPoint Converter',
    description: 'Turn PDF pages into PowerPoint slides.',
    category: 'pdf',
    icon: Presentation,
    subAction: 'pdf-to-ppt'
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel Converter',
    description: 'Extract PDF text into an Excel spreadsheet.',
    category: 'pdf',
    icon: FileSpreadsheet,
    subAction: 'pdf-to-excel'
  },
  {
    id: 'edit-pdf',
    name: 'Edit PDF Online',
    description: 'Add quick text edits to your PDF.',
    category: 'pdf',
    icon: PenLine,
    subAction: 'edit-pdf'
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark PDF',
    description: 'Add watermark text or image across pages.',
    category: 'pdf',
    icon: Stamp,
    subAction: 'watermark-pdf'
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF Online',
    description: 'Upload and place a signature on PDFs.',
    category: 'pdf',
    icon: PenLine,
    subAction: 'sign-pdf'
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF with Password',
    description: 'Add a password to your PDF.',
    category: 'pdf',
    icon: ShieldPlus,
    subAction: 'protect-pdf'
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF Password',
    description: 'Remove a password from your PDF.',
    category: 'pdf',
    icon: Lock,
    subAction: 'unlock-pdf'
  },
  {
    id: 'ocr-pdf',
    name: 'OCR PDF (Text from Scan)',
    description: 'Extract text from scanned PDFs.',
    category: 'pdf',
    icon: FileSearch,
    subAction: 'ocr-pdf'
  },
  {
    id: 'scan-to-pdf',
    name: 'Scan to PDF',
    description: 'Create a PDF from scanned images.',
    category: 'pdf',
    icon: ScanLine,
    subAction: 'scan-to-pdf'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF Converter',
    description: 'Convert DOCX files into PDF.',
    category: 'pdf',
    icon: FileType,
    subAction: 'word-to-pdf'
  },
  {
    id: 'ppt-to-pdf',
    name: 'PPT to PDF Converter',
    description: 'Convert PowerPoint slides into PDF.',
    category: 'pdf',
    icon: Presentation,
    subAction: 'ppt-to-pdf'
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF Converter',
    description: 'Convert Excel sheets into PDF.',
    category: 'pdf',
    icon: FileSpreadsheet,
    subAction: 'excel-to-pdf'
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF Converter',
    description: 'Turn HTML into a PDF file.',
    category: 'pdf',
    icon: FileText,
    subAction: 'html-to-pdf'
  },
  {
    id: 'pdf-to-pdfa',
    name: 'PDF to PDF/A Converter',
    description: 'Create an archive-friendly PDF/A.',
    category: 'pdf',
    icon: FileArchive,
    subAction: 'pdf-to-pdfa'
  },
  {
    id: 'page-numbers',
    name: 'Add Page Numbers to PDF',
    description: 'Add page numbers to PDF pages.',
    category: 'pdf',
    icon: FileText,
    subAction: 'page-numbers'
  },
  {
    id: 'crop-pdf',
    name: 'Crop PDF Pages',
    description: 'Crop margins on PDF pages.',
    category: 'pdf',
    icon: Scissors,
    subAction: 'crop-pdf'
  },
  {
    id: 'compare-pdf',
    name: 'Compare PDF Files',
    description: 'Compare two PDFs side by side.',
    category: 'pdf',
    icon: Columns,
    subAction: 'compare-pdf'
  },
  {
    id: 'redact-pdf',
    name: 'Redact PDF',
    description: 'Redact or remove sensitive text from PDFs.',
    category: 'pdf',
    icon: ShieldPlus,
    subAction: 'redact-pdf'
  },
  {
    id: 'translate-pdf',
    name: 'Translate PDF',
    description: 'Translate PDF text to another language.',
    category: 'pdf',
    icon: FileSearch,
    subAction: 'translate-pdf'
  },
  {
    id: 'organize-pdf',
    name: 'Organize PDF Pages',
    description: 'Reorder PDF pages with a custom page sequence.',
    category: 'pdf',
    icon: FilePlus
  },
  {
    id: 'flatten-pdf',
    name: 'Flatten PDF',
    description: 'Flatten PDF pages for cleaner sharing and printing.',
    category: 'pdf',
    icon: Layers
  },
  {
    id: 'resize-pdf',
    name: 'Resize PDF Pages',
    description: 'Resize PDF pages to A4 or Letter layout.',
    category: 'pdf',
    icon: Layout
  },
  {
    id: 'extract-image-from-pdf',
    name: 'Extract Image from PDF',
    description: 'Export PDF pages as image files in one click.',
    category: 'pdf',
    icon: ImageIcon
  },
  {
    id: 'pdf-page-remover',
    name: 'PDF Page Remover',
    description: 'Remove selected PDF pages and download a clean file.',
    category: 'pdf',
    icon: Scissors
  },
  {
    id: 'extract-pages-from-pdf',
    name: 'Extract Pages from PDF',
    description: 'Extract selected PDF pages into a new PDF document.',
    category: 'pdf',
    icon: FilePlus
  },
  {
    id: 'bg-remover',
    name: 'AI Background Remover',
    description: 'Remove image backgrounds with smart cleanup.',
    category: 'image',
    icon: Eraser
  },
  {
    id: 'image-converter',
    name: 'Image Converter (JPG PNG WEBP)',
    description: 'Convert images between PNG, JPG, JPEG, and WEBP.',
    category: 'image',
    icon: ImageIcon
  },
  {
    id: 'youtube-thumbnail-downloader',
    name: 'YouTube Thumbnail Downloader',
    description: 'Download YouTube thumbnails in multiple sizes.',
    category: 'image',
    icon: ImageIcon
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images for faster websites and quick sharing.',
    category: 'image',
    icon: ImageIcon
  },
  {
    id: 'gif-maker',
    name: 'GIF Maker',
    description: 'Turn multiple images into an animated GIF.',
    category: 'image',
    icon: ImageIcon
  },
  {
    id: 'resize-image',
    name: 'Resize Image',
    description: 'Resize images with width and height controls.',
    category: 'image',
    icon: ImageIcon
  },
  {
    id: 'crop-image',
    name: 'Crop Image',
    description: 'Crop a selected image area and export fast.',
    category: 'image',
    icon: Scissors
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Pick exact colors from any uploaded image.',
    category: 'image',
    icon: Palette
  },
  {
    id: 'rotate-image',
    name: 'Rotate Image',
    description: 'Rotate an image to any angle and download it.',
    category: 'image',
    icon: RotateCw
  },
  {
    id: 'flip-image',
    name: 'Flip Image',
    description: 'Flip images horizontally or vertically.',
    category: 'image',
    icon: Columns
  },
  {
    id: 'image-enlarger',
    name: 'Image Enlarger',
    description: 'Enlarge images for quick previews and exports.',
    category: 'image',
    icon: Search
  },
  {
    id: 'webp-to-png',
    name: 'WEBP to PNG Converter',
    description: 'Convert WEBP images into PNG format.',
    category: 'image',
    icon: ImageIcon
  },
  {
    id: 'jfif-to-png',
    name: 'JFIF to PNG Converter',
    description: 'Convert JFIF images into PNG format.',
    category: 'image',
    icon: ImageIcon
  },
  {
    id: 'heic-to-jpg',
    name: 'HEIC to JPG Converter',
    description: 'Convert HEIC photos into JPG files.',
    category: 'image',
    icon: ImageIcon
  },
  {
    id: 'heic-to-png',
    name: 'HEIC to PNG Converter',
    description: 'Convert HEIC photos into PNG files.',
    category: 'image',
    icon: ImageIcon
  },
  {
    id: 'webp-to-jpg',
    name: 'WEBP to JPG Converter',
    description: 'Convert WEBP images into JPG files.',
    category: 'image',
    icon: ImageIcon
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Create branded QR codes for links, cards, and campaigns.',
    category: 'image',
    icon: QrCode
  },
  {
    id: 'color-palette-generator',
    name: 'Color Palette Generator',
    description: 'Generate brand color palettes for posters, apps, and websites.',
    category: 'creative',
    icon: Palette
  },
  {
    id: 'text-counter',
    name: 'Word & Character Counter',
    description: 'Count words, characters, and sentences instantly.',
    category: 'text',
    icon: FileTextIcon
  },
  {
    id: 'paragraph-generator',
    name: 'Paragraph Generator',
    description: 'Generate placeholder paragraphs for blogs and pages.',
    category: 'text',
    icon: PenTool
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text to uppercase, lowercase, title case, or sentence case.',
    category: 'text',
    icon: FileTextIcon
  },
  {
    id: 'slug-generator',
    name: 'SEO Slug Generator',
    description: 'Create clean, SEO-friendly slugs for pages, blogs, and landing URLs.',
    category: 'text',
    icon: Link
  },
  {
    id: 'keyword-density-checker',
    name: 'Keyword Density Checker',
    description: 'Check repeated keywords and SEO focus inside content drafts.',
    category: 'text',
    icon: BarChart3
  },
  {
    id: 'google-authenticator',
    name: 'Google Authenticator Codes',
    description: 'Generate TOTP 2FA codes from a base32 secret key.',
    category: 'developer',
    icon: KeyRound
  },
  {
    id: 'dev-json',
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, and beautify JSON output.',
    category: 'developer',
    icon: FileCode,
    subAction: 'json'
  },
  {
    id: 'dev-minify',
    name: 'Code Minifier (HTML CSS JS)',
    description: 'Minify code to a single-line output.',
    category: 'developer',
    icon: FileArchive,
    subAction: 'minify'
  },
  {
    id: 'dev-base64',
    name: 'Base64 Encoder',
    description: 'Encode plain text to Base64.',
    category: 'developer',
    icon: Hash,
    subAction: 'base64'
  },
  {
    id: 'dev-svg',
    name: 'SVG Viewer & Preview',
    description: 'Preview SVG markup instantly.',
    category: 'developer',
    icon: Eye,
    subAction: 'svg-viewer'
  },
  {
    id: 'password-generator',
    name: 'Secure Password Generator',
    description: 'Generate strong passwords with custom rules and length.',
    category: 'developer',
    icon: KeyRound
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder & Decoder',
    description: 'Encode or decode URL strings for APIs, links, and tracking.',
    category: 'developer',
    icon: Hash
  },
  {
    id: 'db-viewer',
    name: 'DB Viewer',
    description: 'Browse MySQL tables and records in a safe read-only viewer.',
    category: 'developer',
    icon: Database
  },
  {
    id: 'csv-viewer',
    name: 'CSV / XLSX Viewer',
    description: 'Open spreadsheet files and review rows directly in the browser.',
    category: 'developer',
    icon: FileSpreadsheet
  },
  {
    id: 'shopify-helper',
    name: 'Shopify ProExtract Studio',
    description: 'Extract product details, clean pricing, and export Shopify-ready product sheets with a premium workflow.',
    category: 'developer',
    icon: ShoppingBag
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert length, weight, and storage values quickly.',
    category: 'developer',
    icon: Hash
  },
  {
    id: 'time-converter',
    name: 'Time Converter',
    description: 'Convert seconds, minutes, hours, and days instantly.',
    category: 'developer',
    icon: Zap
  },
  {
    id: 'archive-converter',
    name: 'Archive Converter',
    description: 'Bundle files into a downloadable ZIP archive.',
    category: 'developer',
    icon: FileArchive
  },
  {
    id: 'crop-video',
    name: 'Crop Video',
    description: 'Crop a selected video area and export it again.',
    category: 'media',
    icon: Scissors
  },
  {
    id: 'trim-video',
    name: 'Trim Video',
    description: 'Trim the start and end of a video clip.',
    category: 'media',
    icon: Scissors
  },
  {
    id: 'video-converter',
    name: 'Video Converter',
    description: 'Convert videos into MP4, MOV, WEBM, or GIF.',
    category: 'media',
    icon: FileArchive
  },
  {
    id: 'audio-converter',
    name: 'Audio Converter',
    description: 'Convert audio files into MP3, WAV, OGG, or AAC.',
    category: 'media',
    icon: Phone
  },
  {
    id: 'mp3-converter',
    name: 'MP3 Converter',
    description: 'Convert supported files into MP3 audio.',
    category: 'media',
    icon: Phone
  },
  {
    id: 'mp4-to-mp3',
    name: 'MP4 to MP3 Converter',
    description: 'Extract MP3 audio from MP4 video files.',
    category: 'media',
    icon: Phone
  },
  {
    id: 'video-to-mp3',
    name: 'Video to MP3 Converter',
    description: 'Turn a video file into MP3 audio.',
    category: 'media',
    icon: Phone
  },
  {
    id: 'mp4-converter',
    name: 'MP4 Converter',
    description: 'Convert supported videos into MP4.',
    category: 'media',
    icon: FileArchive
  },
  {
    id: 'mov-to-mp4',
    name: 'MOV to MP4 Converter',
    description: 'Convert MOV clips into MP4 files.',
    category: 'media',
    icon: FileArchive
  },
  {
    id: 'mp3-to-ogg',
    name: 'MP3 to OGG Converter',
    description: 'Convert MP3 audio into OGG format.',
    category: 'media',
    icon: Phone
  },
  {
    id: 'video-to-gif',
    name: 'Video to GIF Converter',
    description: 'Convert a short video clip into a GIF.',
    category: 'media',
    icon: ImageIcon
  },
  {
    id: 'mp4-to-gif',
    name: 'MP4 to GIF Converter',
    description: 'Convert MP4 videos into animated GIFs.',
    category: 'media',
    icon: ImageIcon
  },
  {
    id: 'webm-to-gif',
    name: 'WEBM to GIF Converter',
    description: 'Convert WEBM videos into animated GIFs.',
    category: 'media',
    icon: ImageIcon
  },
  {
    id: 'gif-to-mp4',
    name: 'GIF to MP4 Converter',
    description: 'Convert GIF animations into MP4 video.',
    category: 'media',
    icon: FileArchive
  },
  {
    id: 'gif-to-apng',
    name: 'GIF to APNG Converter',
    description: 'Convert GIF animations into APNG files.',
    category: 'media',
    icon: ImageIcon
  },
  {
    id: 'apng-to-gif',
    name: 'APNG to GIF Converter',
    description: 'Convert APNG files into GIF animations.',
    category: 'media',
    icon: ImageIcon
  },
  {
    id: 'image-to-gif',
    name: 'Image to GIF Converter',
    description: 'Build a GIF animation from uploaded images.',
    category: 'media',
    icon: ImageIcon
  },
  {
    id: 'mov-to-gif',
    name: 'MOV to GIF Converter',
    description: 'Convert MOV clips into GIF animations.',
    category: 'media',
    icon: ImageIcon
  },
  {
    id: 'avi-to-gif',
    name: 'AVI to GIF Converter',
    description: 'Convert AVI videos into animated GIFs.',
    category: 'media',
    icon: ImageIcon
  },
  {
    id: 'media-youtube',
    name: 'YouTube Video Downloader',
    description: 'Download YouTube video or audio.',
    category: 'media',
    icon: FileArchive,
    subAction: 'youtube'
  },
  {
    id: 'media-tiktok',
    name: 'TikTok Video Downloader',
    description: 'Download TikTok videos without watermark.',
    category: 'media',
    icon: Smartphone,
    subAction: 'tiktok'
  },
  {
    id: 'media-instagram',
    name: 'Instagram Reels Downloader',
    description: 'Download Instagram reels, videos, and photos.',
    category: 'media',
    icon: ImageIcon,
    subAction: 'instagram'
  },
  {
    id: 'media-facebook',
    name: 'Facebook Video Downloader',
    description: 'Download Facebook videos quickly.',
    category: 'media',
    icon: FileArchive,
    subAction: 'facebook'
  }
];

const HOME_SPOTLIGHT_TOOL_IDS = [
  'shopify-helper',
  'qr-code-generator',
  'image-compressor',
  'db-viewer',
  'csv-viewer',
  'keyword-density-checker',
  'color-palette-generator',
  'resize-image',
  'crop-image',
  'color-picker',
  'rotate-image',
  'flip-image',
  'image-enlarger',
  'gif-maker',
  'organize-pdf',
  'flatten-pdf',
  'resize-pdf',
  'extract-image-from-pdf',
  'pdf-page-remover',
  'extract-pages-from-pdf',
  'crop-video',
  'trim-video',
  'video-converter',
  'audio-converter',
  'mp4-to-mp3',
  'video-to-gif',
  'gif-to-mp4',
  'unit-converter',
  'time-converter',
  'archive-converter',
] as const;

const PAGE_LABELS: { key: PageKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'tools', label: 'Tools' },
  { key: 'themes', label: 'Themes' },
  { key: 'team', label: 'Team' },
  { key: 'blog', label: 'Blog' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' }
];

const SHOWCASE_TABS: { id: ShowcaseTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'organize', label: 'Organize PDF' },
  { id: 'optimize', label: 'Optimize PDF' },
  { id: 'convert', label: 'Convert PDF' },
  { id: 'edit', label: 'Edit PDF' },
  { id: 'security', label: 'PDF Security' },
  { id: 'intelligence', label: 'PDF Intelligence' }
];

const SHOWCASE_TOOLS = [
  { id: 'merge-pdf', name: 'Merge PDF Files', desc: 'Combine multiple PDFs into one file.', tab: 'workflows', icon: FilePlus, status: 'live', action: 'merge' },
  { id: 'split-pdf', name: 'Split PDF', desc: 'Split a PDF by page range.', tab: 'workflows', icon: Scissors, status: 'live', action: 'split' },
  { id: 'compress-pdf', name: 'Compress PDF File', desc: 'Reduce PDF size while keeping quality.', tab: 'optimize', icon: FileArchive, status: 'live', action: 'compress' },
  { id: 'pdf-to-pdfa', name: 'PDF to PDF/A Converter', desc: 'Create archive-friendly PDF/A files.', tab: 'optimize', icon: FileArchive, status: 'live', action: 'pdf-to-pdfa' },
  { id: 'rotate-pdf', name: 'Rotate PDF Pages', desc: 'Rotate PDF pages in seconds.', tab: 'organize', icon: RotateCw, status: 'live', action: 'rotate' },
  { id: 'page-numbers', name: 'Add Page Numbers to PDF', desc: 'Add page numbers to PDF pages.', tab: 'organize', icon: FileTextIcon, status: 'live', action: 'page-numbers' },
  { id: 'crop-pdf', name: 'Crop PDF Pages', desc: 'Crop margins of PDF pages.', tab: 'organize', icon: Scissors, status: 'live', action: 'crop-pdf' },
  { id: 'compare-pdf', name: 'Compare PDF Files', desc: 'Compare two PDFs side by side.', tab: 'intelligence', icon: Columns, status: 'live', action: 'compare-pdf' },
  { id: 'pdf-to-word', name: 'PDF to Word Converter', desc: 'Convert PDF into editable Word.', tab: 'convert', icon: FileType, status: 'live', action: 'pdf-to-word' },
  { id: 'pdf-to-ppt', name: 'PDF to PowerPoint Converter', desc: 'Convert PDF pages to PPT slides.', tab: 'convert', icon: Presentation, status: 'live', action: 'pdf-to-ppt' },
  { id: 'pdf-to-excel', name: 'PDF to Excel Converter', desc: 'Extract PDF text into Excel.', tab: 'convert', icon: FileSpreadsheet, status: 'live', action: 'pdf-to-excel' },
  { id: 'word-to-pdf', name: 'Word to PDF Converter', desc: 'Convert DOCX to PDF.', tab: 'convert', icon: FileType, status: 'live', action: 'word-to-pdf' },
  { id: 'ppt-to-pdf', name: 'PPT to PDF Converter', desc: 'Convert PPTX to PDF.', tab: 'convert', icon: Presentation, status: 'live', action: 'ppt-to-pdf' },
  { id: 'excel-to-pdf', name: 'Excel to PDF Converter', desc: 'Convert Excel to PDF.', tab: 'convert', icon: FileSpreadsheet, status: 'live', action: 'excel-to-pdf' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG Converter', desc: 'Convert each page to JPG.', tab: 'convert', icon: ImageIcon, status: 'live', action: 'pdf-to-jpg' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF Converter', desc: 'Convert images to PDF.', tab: 'convert', icon: ImageIcon, status: 'live', action: 'jpg-to-pdf' },
  { id: 'scan-to-pdf', name: 'Scan to PDF', desc: 'Turn photos into a PDF.', tab: 'convert', icon: ScanLine, status: 'live', action: 'scan-to-pdf' },
  { id: 'html-to-pdf', name: 'HTML to PDF Converter', desc: 'Convert HTML to PDF.', tab: 'convert', icon: FileTextIcon, status: 'live', action: 'html-to-pdf' },
  { id: 'edit-pdf', name: 'Edit PDF Online', desc: 'Add quick edits to PDFs.', tab: 'edit', icon: PenLine, status: 'live', action: 'edit-pdf' },
  { id: 'watermark-pdf', name: 'Watermark PDF', desc: 'Stamp pages with watermark text.', tab: 'edit', icon: Stamp, status: 'live', action: 'watermark-pdf' },
  { id: 'sign-pdf', name: 'Sign PDF Online', desc: 'Upload and place a signature.', tab: 'edit', icon: PenLine, status: 'live', action: 'sign-pdf' },
  { id: 'protect-pdf', name: 'Protect PDF with Password', desc: 'Add a password to your PDF.', tab: 'security', icon: ShieldPlus, status: 'live', action: 'protect-pdf' },
  { id: 'unlock-pdf', name: 'Unlock PDF Password', desc: 'Remove PDF password.', tab: 'security', icon: Lock, status: 'live', action: 'unlock-pdf' },
  { id: 'redact-pdf', name: 'Redact PDF', desc: 'Remove sensitive text from PDFs.', tab: 'security', icon: ShieldPlus, status: 'live', action: 'redact-pdf' },
  { id: 'ocr-pdf', name: 'OCR PDF (Text from Scan)', desc: 'Extract text from scans.', tab: 'intelligence', icon: FileSearch, status: 'live', action: 'ocr-pdf' },
  { id: 'translate-pdf', name: 'Translate PDF', desc: 'Translate extracted text.', tab: 'intelligence', icon: FileSearch, status: 'live', action: 'translate-pdf' }
] as const;

const PDF_ACTION_TO_ID: Record<PdfAction, string> = {
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
  'translate-pdf': 'translate-pdf'
};

const PDF_ID_TO_ACTION: Record<string, PdfAction> = Object.entries(PDF_ACTION_TO_ID).reduce(
  (acc, [action, id]) => {
    acc[id] = action as PdfAction;
    return acc;
  },
  {} as Record<string, PdfAction>
);

const DEV_ACTION_TO_ID: Record<DevAction, string> = {
  json: 'dev-json',
  minify: 'dev-minify',
  base64: 'dev-base64',
  'svg-viewer': 'dev-svg'
};

const DEV_ID_TO_ACTION: Record<string, DevAction> = Object.entries(DEV_ACTION_TO_ID).reduce(
  (acc, [action, id]) => {
    acc[id] = action as DevAction;
    return acc;
  },
  {} as Record<string, DevAction>
);

const MEDIA_ACTION_TO_ID: Record<MediaToolType, string> = {
  youtube: 'media-youtube',
  tiktok: 'media-tiktok',
  instagram: 'media-instagram',
  facebook: 'media-facebook'
};

const MEDIA_ID_TO_ACTION: Record<string, MediaToolType> = Object.entries(MEDIA_ACTION_TO_ID).reduce(
  (acc, [action, id]) => {
    acc[id] = action as MediaToolType;
    return acc;
  },
  {} as Record<string, MediaToolType>
);

const IMAGE_TOOLKIT_CONFIG: Record<
  string,
  { mode: ImageToolkitMode; title: string; description: string }
> = {
  'resize-image': {
    mode: 'resize',
    title: 'Resize Image',
    description: 'Resize images with width and height controls.',
  },
  'crop-image': {
    mode: 'crop',
    title: 'Crop Image',
    description: 'Crop your image with percentage-based controls.',
  },
  'color-picker': {
    mode: 'color-picker',
    title: 'Color Picker',
    description: 'Sample exact colors from any uploaded image.',
  },
  'rotate-image': {
    mode: 'rotate',
    title: 'Rotate Image',
    description: 'Rotate an image and export it instantly.',
  },
  'flip-image': {
    mode: 'flip',
    title: 'Flip Image',
    description: 'Flip images horizontally or vertically with one click.',
  },
  'image-enlarger': {
    mode: 'enlarge',
    title: 'Image Enlarger',
    description: 'Enlarge images smoothly for previews and quick exports.',
  },
};

const PDF_ADVANCED_CONFIG: Record<
  string,
  { mode: PdfAdvancedMode; title: string; description: string }
> = {
  'organize-pdf': {
    mode: 'organize',
    title: 'Organize PDF Pages',
    description: 'Reorder PDF pages with a custom sequence like 3,1,2.',
  },
  'flatten-pdf': {
    mode: 'flatten',
    title: 'Flatten PDF',
    description: 'Flatten PDF pages into a safer shared file.',
  },
  'resize-pdf': {
    mode: 'resize',
    title: 'Resize PDF Pages',
    description: 'Resize PDF pages for A4 or Letter output.',
  },
  'extract-image-from-pdf': {
    mode: 'extract-images',
    title: 'Extract Image from PDF',
    description: 'Export PDF pages as image files in one zip.',
  },
  'pdf-page-remover': {
    mode: 'page-remover',
    title: 'PDF Page Remover',
    description: 'Remove selected pages from a PDF and download the result.',
  },
  'extract-pages-from-pdf': {
    mode: 'extract-pages',
    title: 'Extract Pages from PDF',
    description: 'Extract selected pages into a fresh PDF document.',
  },
};

const MEDIA_TRANSCODER_CONFIG: Record<
  string,
  { mode: MediaTranscoderMode; title: string; description: string }
> = {
  'crop-video': {
    mode: 'crop-video',
    title: 'Crop Video',
    description: 'Crop the visible area of your video and export a clean file.',
  },
  'trim-video': {
    mode: 'trim-video',
    title: 'Trim Video',
    description: 'Trim a video by setting the start and end time.',
  },
  'video-converter': {
    mode: 'video-converter',
    title: 'Video Converter',
    description: 'Convert videos to MP4, MOV, WEBM, or GIF.',
  },
  'audio-converter': {
    mode: 'audio-converter',
    title: 'Audio Converter',
    description: 'Convert audio files into MP3, WAV, AAC, or OGG.',
  },
  'mp3-converter': {
    mode: 'mp3-converter',
    title: 'MP3 Converter',
    description: 'Convert supported media into MP3.',
  },
  'mp4-to-mp3': {
    mode: 'mp4-to-mp3',
    title: 'MP4 to MP3 Converter',
    description: 'Extract MP3 audio from MP4 video.',
  },
  'video-to-mp3': {
    mode: 'video-to-mp3',
    title: 'Video to MP3 Converter',
    description: 'Turn video clips into MP3 audio.',
  },
  'mp4-converter': {
    mode: 'mp4-converter',
    title: 'MP4 Converter',
    description: 'Convert supported video files into MP4.',
  },
  'mov-to-mp4': {
    mode: 'mov-to-mp4',
    title: 'MOV to MP4 Converter',
    description: 'Convert MOV clips into MP4 format.',
  },
  'mp3-to-ogg': {
    mode: 'mp3-to-ogg',
    title: 'MP3 to OGG Converter',
    description: 'Convert MP3 audio into OGG format.',
  },
  'video-to-gif': {
    mode: 'video-to-gif',
    title: 'Video to GIF Converter',
    description: 'Convert a video clip into an animated GIF.',
  },
  'mp4-to-gif': {
    mode: 'mp4-to-gif',
    title: 'MP4 to GIF Converter',
    description: 'Convert MP4 files into GIF animations.',
  },
  'webm-to-gif': {
    mode: 'webm-to-gif',
    title: 'WEBM to GIF Converter',
    description: 'Convert WEBM videos into GIF animations.',
  },
  'gif-to-mp4': {
    mode: 'gif-to-mp4',
    title: 'GIF to MP4 Converter',
    description: 'Convert GIF animations into MP4 video.',
  },
  'gif-to-apng': {
    mode: 'gif-to-apng',
    title: 'GIF to APNG Converter',
    description: 'Convert GIF animations into APNG.',
  },
  'apng-to-gif': {
    mode: 'apng-to-gif',
    title: 'APNG to GIF Converter',
    description: 'Convert APNG animations into GIF format.',
  },
  'gif-maker': {
    mode: 'gif-maker',
    title: 'GIF Maker',
    description: 'Create an animated GIF from uploaded images.',
  },
  'image-to-gif': {
    mode: 'image-to-gif',
    title: 'Image to GIF Converter',
    description: 'Turn multiple still images into a GIF.',
  },
  'mov-to-gif': {
    mode: 'mov-to-gif',
    title: 'MOV to GIF Converter',
    description: 'Convert MOV clips into GIF animations.',
  },
  'avi-to-gif': {
    mode: 'avi-to-gif',
    title: 'AVI to GIF Converter',
    description: 'Convert AVI video files into GIF animations.',
  },
};

const UTILITY_TOOL_CONFIG: Record<string, UtilityMode> = {
  'unit-converter': 'unit-converter',
  'time-converter': 'time-converter',
  'archive-converter': 'archive-converter',
};

const DEV_SUBTOOLS: { id: DevAction; name: string; desc: string; icon: any }[] = [
  { id: 'json', name: 'JSON Formatter & Validator', desc: 'Format and validate JSON output.', icon: FileCode },
  { id: 'minify', name: 'Code Minifier (HTML CSS JS)', desc: 'Minify HTML, CSS, or JS into one line.', icon: FileArchive },
  { id: 'base64', name: 'Base64 Encoder', desc: 'Encode plain text to Base64.', icon: Hash },
  { id: 'svg-viewer', name: 'SVG Viewer & Preview', desc: 'Preview SVG markup instantly.', icon: Eye }
];

const MEDIA_SUBTOOLS: { id: MediaToolType; name: string; desc: string; icon: any }[] = [
  { id: 'youtube', name: 'YouTube Video Downloader', desc: 'Download YouTube video or audio.', icon: FileArchive },
  { id: 'tiktok', name: 'TikTok Video Downloader', desc: 'Download TikTok videos without watermark.', icon: Smartphone },
  { id: 'instagram', name: 'Instagram Reels Downloader', desc: 'Download reels, videos, photos.', icon: ImageIcon },
  { id: 'facebook', name: 'Facebook Video Downloader', desc: 'Download Facebook videos quickly.', icon: FileArchive }
];

export default function App() {
  const adminRoute =
    (import.meta?.env?.VITE_ADMIN_ROUTE as string | undefined)?.trim().toLowerCase() || 'admin';
  const envGaId = (import.meta?.env?.VITE_GA_ID as string | undefined)?.trim() || '';
  const fallbackGaId =
    typeof window !== 'undefined' && window.location.hostname.endsWith('vinzatools.com')
      ? 'G-L07YYMBBL7'
      : '';
  const gaId = envGaId || fallbackGaId;
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [page, setPage] = useState<PageKey>('home');
  const [contactTab, setContactTab] = useState<ContactTab>('general');
  const [showcaseTab, setShowcaseTab] = useState<ShowcaseTab>('all');
  const [toolContext, setToolContext] = useState<ToolContext | null>(null);
  const allTools = useMemo(() => [...INTERNAL_TOOLS], []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const validPages = new Set<PageKey>([
      'home',
      'tools',
      'themes',
      'team',
      'blog',
      'about',
      'contact',
      'policy',
      'terms',
      'cookies',
      'admin',
    ]);
    const handleHash = () => {
      const raw = window.location.hash.replace('#', '').toLowerCase();
      const slug = raw.startsWith('/') ? raw.slice(1) : raw;
      const path = window.location.pathname.toLowerCase();
      if (slug === adminRoute || path.endsWith(`/${adminRoute}`)) {
        setPage('admin');
      } else if (validPages.has(slug as PageKey)) {
        setPage(slug as PageKey);
      } else if (!slug) {
        setPage('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [adminRoute]);

  React.useEffect(() => {
    if (!gaId || typeof document === 'undefined') return;
    const existing = document.querySelector(`script[data-ga-id="${gaId}"]`);
    if (existing) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.setAttribute('data-ga-id', gaId);
    document.head.appendChild(script);

    const inline = document.createElement('script');
    inline.setAttribute('data-ga-inline', gaId);
    inline.innerHTML =
      "window.dataLayer = window.dataLayer || [];" +
      "function gtag(){dataLayer.push(arguments);} window.gtag=gtag;" +
      `gtag('js', new Date()); gtag('config', '${gaId}', { send_page_view: false });`;
    document.head.appendChild(inline);
  }, [gaId]);

  React.useEffect(() => {
    if (!gaId || typeof window === 'undefined') return;
    if (typeof window.gtag !== 'function') return;
    const path = page === 'home' ? '/' : `/${page}`;
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
    });
  }, [gaId, page]);

  const filteredTools = useMemo(() => {
    return allTools.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allTools, searchQuery, activeCategory]);

  const showcaseFiltered = useMemo(() => {
    if (showcaseTab === 'all') return SHOWCASE_TOOLS;
    return SHOWCASE_TOOLS.filter(tool => tool.tab === showcaseTab);
  }, [showcaseTab]);

  const showcaseTabsVisible = useMemo(() => {
    const tabsWithTools = new Set(SHOWCASE_TOOLS.map(t => t.tab));
    return SHOWCASE_TABS.filter(tab => tab.id === 'all' || tabsWithTools.has(tab.id as any));
  }, []);

  const featuredTools = useMemo(() => {
    const order = new Map(HOME_SPOTLIGHT_TOOL_IDS.map((id, index) => [id, index]));
    return allTools
      .filter((tool) => order.has(tool.id as (typeof HOME_SPOTLIGHT_TOOL_IDS)[number]))
      .sort((a, b) => (order.get(a.id as (typeof HOME_SPOTLIGHT_TOOL_IDS)[number]) ?? 0) - (order.get(b.id as (typeof HOME_SPOTLIGHT_TOOL_IDS)[number]) ?? 0));
  }, [allTools]);

  const renderTool = () => {
    const pdfAction = activeToolId ? PDF_ID_TO_ACTION[activeToolId] : undefined;
    if (pdfAction) {
      return <PdfTools initialAction={pdfAction} startInTool />;
    }

    const devAction = activeToolId ? DEV_ID_TO_ACTION[activeToolId] : undefined;
    if (devAction) {
      return <DevTools initialAction={devAction} singleView />;
    }

    const mediaAction = activeToolId ? MEDIA_ID_TO_ACTION[activeToolId] : undefined;
    if (mediaAction) {
      return <MediaflowDownloader initialTool={mediaAction} singleView />;
    }

    const imageToolkitConfig = activeToolId ? IMAGE_TOOLKIT_CONFIG[activeToolId] : undefined;
    if (imageToolkitConfig) {
      return (
        <ImageToolkit
          mode={imageToolkitConfig.mode}
          title={imageToolkitConfig.title}
          description={imageToolkitConfig.description}
        />
      );
    }

    const pdfAdvancedConfig = activeToolId ? PDF_ADVANCED_CONFIG[activeToolId] : undefined;
    if (pdfAdvancedConfig) {
      return (
        <PdfAdvancedTools
          mode={pdfAdvancedConfig.mode}
          title={pdfAdvancedConfig.title}
          description={pdfAdvancedConfig.description}
        />
      );
    }

    const mediaTranscoderConfig = activeToolId ? MEDIA_TRANSCODER_CONFIG[activeToolId] : undefined;
    if (mediaTranscoderConfig) {
      return (
        <MediaTranscoder
          mode={mediaTranscoderConfig.mode}
          title={mediaTranscoderConfig.title}
          description={mediaTranscoderConfig.description}
        />
      );
    }

    const utilityMode = activeToolId ? UTILITY_TOOL_CONFIG[activeToolId] : undefined;
    if (utilityMode) {
      return <UtilityConverters mode={utilityMode} />;
    }

    switch (activeToolId) {
      case 'resume-builder': return <ResumeBuilder />;
      case 'poster-maker': return <PosterMaker />;
      case 'corporate-poster-studio': return <CorporatePosterStudio />;
      case 'image-compare': return <ImageCompare />;
      case 'pdf-tools': return (
        <PdfTools
          initialAction={toolContext?.toolId === 'pdf-tools' ? (toolContext.subAction as PdfAction) : undefined}
          startInTool={toolContext?.toolId === 'pdf-tools'}
        />
      );
      case 'bg-remover': return <BackgroundRemover />;
      case 'image-converter': return <ImageConverter />;
      case 'webp-to-png':
      case 'jfif-to-png':
      case 'heic-to-jpg':
      case 'heic-to-png':
      case 'webp-to-jpg':
        return <ImageConverter />;
      case 'youtube-thumbnail-downloader': return <YoutubeThumbnailDownloader />;
      case 'image-compressor': return <ImageCompressor />;
      case 'qr-code-generator': return <QRCodeGenerator />;
      case 'color-palette-generator': return <ColorPaletteGenerator />;
      case 'text-counter': return <TextCounter />;
      case 'paragraph-generator': return <ParagraphGenerator />;
      case 'case-converter': return <CaseConverter />;
      case 'slug-generator': return <SlugGenerator />;
      case 'keyword-density-checker': return <KeywordDensityChecker />;
      case 'google-authenticator': return <GoogleAuthenticator />;
      case 'password-generator': return <PasswordGenerator />;
      case 'url-encoder': return <UrlEncoderDecoder />;
      case 'db-viewer': return <DatabaseViewer />;
      case 'csv-viewer': return <CsvViewer />;
      case 'shopify-helper': return <ShopifyHelper />;
      case 'mediaflow-downloader': return (
        <MediaflowDownloader
          initialTool={toolContext?.toolId === 'mediaflow-downloader' ? (toolContext.subAction as MediaToolType) : undefined}
        />
      );
      case 'dev-tools': return (
        <DevTools initialAction={toolContext?.toolId === 'dev-tools' ? (toolContext.subAction as DevAction) : undefined} />
      );
      default: return null;
    }
  };

  const setPageWithRoute = (next: PageKey) => {
    setPage(next);
    if (typeof window === 'undefined') return;
    const scrollHome = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    if (next === 'admin') {
      history.pushState(null, '', `/${adminRoute}`);
      window.location.hash = `#/${adminRoute}`;
      scrollHome();
      return;
    }
    const hasAdminHash = window.location.hash.toLowerCase().includes(adminRoute);
    const isAdminPath = window.location.pathname.toLowerCase().endsWith(`/${adminRoute}`);
    if (hasAdminHash || isAdminPath) {
      const cleanPath = window.location.pathname.replace(new RegExp(`/${adminRoute}$`, 'i'), '');
      history.replaceState(null, '', cleanPath || '/');
    }
    window.location.hash = next === 'home' ? '' : `#/${next}`;
    scrollHome();
  };

  const goTools = () => {
    setPageWithRoute('tools');
    setActiveToolId(null);
  };

  const getClientId = () => {
    const key = 'vinzatools_client_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
      localStorage.setItem(key, id);
    }
    return id;
  };

  const trackToolUsage = async (toolId: string, subAction?: string) => {
    try {
      const clientId = getClientId();
      await apiFetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, subAction, clientId })
      });
    } catch {
      // silent
    }
  };

  const scrollToTop = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToolClick = (tool: Tool) => {
    trackToolUsage(tool.id, tool.subAction);
    setToolContext(null);
    setActiveToolId(tool.id);
    setPageWithRoute('tools');
    scrollToTop();
  };

  const openSubTool = (toolId: string, subAction: string) => {
    if (toolId === 'pdf-tools') {
      const mappedId = PDF_ACTION_TO_ID[subAction as PdfAction];
      if (mappedId) {
        trackToolUsage(mappedId, subAction);
        setToolContext(null);
        setActiveToolId(mappedId);
        setPageWithRoute('tools');
        scrollToTop();
        return;
      }
    }

    if (toolId === 'dev-tools') {
      const mappedId = DEV_ACTION_TO_ID[subAction as DevAction];
      if (mappedId) {
        trackToolUsage(mappedId, subAction);
        setToolContext(null);
        setActiveToolId(mappedId);
        setPageWithRoute('tools');
        scrollToTop();
        return;
      }
    }

    if (toolId === 'mediaflow-downloader') {
      const mappedId = MEDIA_ACTION_TO_ID[subAction as MediaToolType];
      if (mappedId) {
        trackToolUsage(mappedId, subAction);
        setToolContext(null);
        setActiveToolId(mappedId);
        setPageWithRoute('tools');
        scrollToTop();
        return;
      }
    }

    trackToolUsage(toolId, subAction);
    setToolContext({ toolId, subAction });
    setActiveToolId(toolId);
    setPageWithRoute('tools');
    scrollToTop();
  };

  const activeToolName = INTERNAL_TOOLS.find(t => t.id === activeToolId)?.name;

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const baseTitle = 'VinzaTools';
    const baseDesc =
      'VinzaTools is an all-in-one toolkit for PDFs, images, media, Shopify themes, resumes, and developer utilities with a fast, friendly workflow.';
    const baseKeywords =
      'vinzatools, pdf tools, media downloader, image tools, shopify themes, resume builder, poster maker, background remover, image converter, word counter, paragraph generator, developer tools';

    let title = baseTitle;
    let description = baseDesc;
    let keywords = baseKeywords;
    let robots = 'index,follow';

    const toolKeywordsByGroup: Record<string, string> = {
      pdf: 'pdf tools, pdf converter, merge pdf, split pdf, compress pdf, pdf to word, pdf to powerpoint, pdf to excel, word to pdf, ppt to pdf, excel to pdf, jpg to pdf',
      image: 'image tools, image converter, background remover, compare images, youtube thumbnail downloader',
      media: 'youtube downloader, tiktok downloader, instagram downloader, facebook downloader, video downloader',
      developer: 'json formatter, code minifier, base64 encoder, svg viewer, google authenticator, totp generator, 2fa codes',
      creative: 'resume builder, poster maker, corporate poster studio',
      text: 'word counter, character counter, paragraph generator, word count'
    };

    if (page === 'home') {
      title = 'VinzaTools | Background Remover, PDF Tools, and Video Downloaders';
      description = 'Use VinzaTools for background remover, PDF tools, PDF to Word, YouTube video downloads, and Instagram, TikTok, and Facebook media workflows.';
      keywords = `${baseKeywords}, background remover, youtube downloader, instagram downloader, tiktok downloader, facebook downloader, pdf to word, pdf merge, pdf split, jpg to pdf`;
    } else if (page === 'tools') {
      if (activeToolName) {
        const activeTool = INTERNAL_TOOLS.find(t => t.id === activeToolId);
        title = `${activeToolName} | VinzaTools`;
        description = `Use ${activeToolName} on VinzaTools to finish your task quickly with clean, downloadable results.`;
        const groupKeywords = activeTool ? toolKeywordsByGroup[activeTool.category] : '';
        keywords = `${baseKeywords}, ${activeToolName.toLowerCase()}, ${groupKeywords}`.trim();
      } else {
        title = 'All Tools | VinzaTools';
        description = 'Browse all available tools for PDF, image, and text tasks in one place.';
        keywords = `${baseKeywords}, all tools`;
      }
    } else if (page === 'team') {
      title = 'Team | VinzaTools';
      description = 'Meet the team behind VinzaTools and our mission to simplify file tasks.';
    } else if (page === 'themes') {
      title = 'Themes | VinzaTools';
      description = 'Browse downloadable Shopify themes and preview theme files before using them on your store.';
    } else if (page === 'about') {
      title = 'About VinzaTools';
      description = 'Learn why VinzaTools exists and how we build friendly, fast tools for everyone.';
    } else if (page === 'blog') {
      title = 'Blog | VinzaTools';
      description = 'Tips, guides, and product updates from the VinzaTools team.';
    } else if (page === 'contact') {
      title = 'Contact VinzaTools';
      description = 'Reach out for support, request new tools, or share feedback with VinzaTools.';
    } else if (page === 'policy') {
      title = 'Privacy Policy | VinzaTools';
      description = 'Read how VinzaTools handles privacy, contact data, logs, and file processing.';
      keywords = `${baseKeywords}, privacy policy, data handling, platform privacy`;
    } else if (page === 'terms') {
      title = 'Terms & Conditions | VinzaTools';
      description = 'Review the VinzaTools terms for uploads, downloads, themes, and platform usage.';
      keywords = `${baseKeywords}, terms and conditions, usage policy, file tools terms`;
    } else if (page === 'cookies') {
      title = 'Cookie Policy | VinzaTools';
      description = 'Learn how VinzaTools uses cookies and local browser storage for performance and interface preferences.';
      keywords = `${baseKeywords}, cookie policy, browser storage, website cookies`;
    } else if (page === 'admin') {
      robots = 'noindex,nofollow';
    }

    document.title = title;

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const setOg = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('author', 'VinzaTools');
    const routePath = page === 'home' ? '' : `/${page}`;
    const canonicalUrl = `https://vinzatools.com${routePath}`;
    setMeta('robots', robots);
    setMeta('viewport', 'width=device-width, initial-scale=1');
    setMeta('theme-color', '#0f0a0a');
    setOg('og:title', title);
    setOg('og:description', description);
    setOg('og:type', 'website');
    setOg('og:url', canonicalUrl);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [page, activeToolId, activeToolName]);

  if (page === 'admin') {
    return (
      <Suspense fallback={<PageFallback label="Loading admin dashboard..." />}>
        <AdminPage />
      </Suspense>
    );
  }

  return (
    <SiteLayout
      page={page}
      setPage={setPageWithRoute}
      pageLabels={PAGE_LABELS}
      allTools={allTools}
      onToolSelect={handleToolClick}
    >
      <Suspense fallback={<PageFallback label="Loading VinzaTools..." />}>
        {page === 'home' && (
          <HomePage
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            filteredTools={filteredTools}
            featuredTools={featuredTools}
            handleToolClick={handleToolClick}
            showcaseTab={showcaseTab}
            setShowcaseTab={setShowcaseTab}
            showcaseTabsVisible={showcaseTabsVisible}
            showcaseFiltered={showcaseFiltered as any}
            openSubTool={openSubTool}
            devSubtools={DEV_SUBTOOLS}
            mediaSubtools={MEDIA_SUBTOOLS}
            goTools={goTools}
          />
        )}
        {page === 'tools' && (
          <ToolsPage
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            filteredTools={filteredTools}
            handleToolClick={handleToolClick}
            activeToolId={activeToolId}
            setActiveToolId={setActiveToolId}
            renderTool={renderTool}
            activeToolName={activeToolName}
          />
        )}
        {page === 'themes' && <ThemesPage />}
        {page === 'team' && <TeamPage imageSrc={rizwanImage} />}
        {page === 'blog' && <BlogPage />}
        {page === 'about' && <AboutPage />}
        {page === 'contact' && <ContactPage contactTab={contactTab} setContactTab={setContactTab} />}
        {page === 'policy' && <PolicyPage />}
        {page === 'terms' && <TermsPage />}
        {page === 'cookies' && <CookiePolicyPage />}
      </Suspense>
    </SiteLayout>
  );
}



