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
import type { Tool } from '../types/app';

export const INTERNAL_TOOLS: Tool[] = [
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

