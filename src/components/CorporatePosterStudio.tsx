/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, ChangeEvent } from 'react';
import {
  Download,
  Layout,
  Type,
  Clock,
  Mail,
  MousePointer2,
  Sparkles,
  Palette,
  Layers,
  Check,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Upload,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  FileImage,
  FileText,
  RefreshCw,
  Trash2,
  Copy,
  Lock,
  Unlock,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  Undo,
  Redo,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Rnd } from 'react-rnd';
import { apiFetch } from '../api';

type PosterStyle =
  | 'minimalist'
  | 'modern'
  | 'abstract'
  | 'glassmorphism'
  | 'gradient-mesh'
  | 'retro'
  | 'dark-minimal'
  | 'vibrant-pop'
  | 'custom-canvas'
  | 'brutalist'
  | 'editorial'
  | 'geometric'
  | 'cyberpunk'
  | 'canvas-editor';
type LayoutPreset =
  | 'centered'
  | 'split-vertical'
  | 'split-horizontal'
  | 'bottom-heavy'
  | 'top-heavy';

interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'logo';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  fontFamily?: string;
  opacity?: number;
  rotation?: number;
  zIndex: number;
  locked?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
}

interface PosterData {
  heading: string;
  body: string;
  highlight: string;
  contact: string;
  buttonText: string;
  logoText: string;
  logoImage: string | null;
  bgImage: string | null;
  bgSize: 'cover' | 'contain' | 'auto' | 'fill';
  fontWeight: 'font-normal' | 'font-bold' | 'font-black';
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  posterHeight: number;
  posterWidth: number;
  elementGap: number;
  logoSize: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  textAlign: 'text-left' | 'text-center' | 'text-right';
  padding: number;
  fontFamily: string;
  borderWidth: number;
  borderColor: string;
  bgOpacity: number;
  overlayOpacity: number;
  bgBlur: number;
  textShadow: boolean;
  showShapes: boolean;
  layoutPreset: LayoutPreset;
  elements: CanvasElement[];
}

const COLOR_PALETTES = [
  {
    name: 'Corporate Blue',
    primary: '#4f46e5',
    secondary: '#1e1b4b',
    accent: '#f97316',
    bg: '#ffffff',
    text: '#0f172a',
  },
  {
    name: 'Midnight Neon',
    primary: '#00ffcc',
    secondary: '#050505',
    accent: '#ff00ff',
    bg: '#0a0a0a',
    text: '#ffffff',
  },
  {
    name: 'Sunset Gold',
    primary: '#ea580c',
    secondary: '#451a03',
    accent: '#facc15',
    bg: '#fff7ed',
    text: '#431407',
  },
  {
    name: 'Emerald Forest',
    primary: '#059669',
    secondary: '#064e3b',
    accent: '#fbbf24',
    bg: '#f0fdf4',
    text: '#064e3b',
  },
  {
    name: 'Royal Velvet',
    primary: '#7c3aed',
    secondary: '#2e1065',
    accent: '#f472b6',
    bg: '#faf5ff',
    text: '#2e1065',
  },
  {
    name: 'Minimal Slate',
    primary: '#334155',
    secondary: '#0f172a',
    accent: '#64748b',
    bg: '#f8fafc',
    text: '#0f172a',
  },
];

export const CorporatePosterStudio = () => {
  const [style, setStyle] = useState<PosterStyle>('modern');
  const [data, setData] = useState<PosterData>({
    heading: 'Annual Leadership Summit 2026',
    body: 'Join us for an exclusive gathering of industry pioneers and visionaries as we shape the future of global innovation and strategic growth.',
    highlight: 'MARCH 15 • 9:00 AM',
    contact: 'events@corporate.com | +1 (555) 0123',
    buttonText: 'Register Now',
    logoText: 'CORP CORE',
    logoImage: null,
    bgImage: null,
    bgSize: 'cover',
    fontWeight: 'font-black',
    headingLevel: 'h1',
    posterHeight: 842,
    posterWidth: 595,
    elementGap: 32,
    logoSize: 48,
    primaryColor: '#4f46e5',
    secondaryColor: '#1e1b4b',
    accentColor: '#f97316',
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    textAlign: 'text-center',
    padding: 64,
    fontFamily: 'font-sans',
    borderWidth: 0,
    borderColor: '#000000',
    bgOpacity: 100,
    overlayOpacity: 40,
    bgBlur: 0,
    textShadow: false,
    showShapes: true,
    layoutPreset: 'centered',
    elements: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'a4' | 'social' | 'custom'>(
    'a4'
  );
  const [exporting, setExporting] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [zoom, setZoom] = useState(0.8);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [history, setHistory] = useState<PosterData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const posterRef = useRef<HTMLDivElement>(null);

  // Initialize history and load from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('poster-studio-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
        setHistory([parsed]);
        setHistoryIndex(0);
      } catch (e) {
        console.error('Failed to load saved data', e);
        setHistory([JSON.parse(JSON.stringify(data))]);
        setHistoryIndex(0);
      }
    } else if (history.length === 0) {
      setHistory([JSON.parse(JSON.stringify(data))]);
      setHistoryIndex(0);
    }
  }, []);

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem('poster-studio-data', JSON.stringify(data));
  }, [data]);

  const getBgSizeClass = (size: string) => {
    switch (size) {
      case 'contain':
        return 'object-contain';
      case 'fill':
        return 'object-fill';
      case 'auto':
        return 'object-none';
      default:
        return 'object-cover';
    }
  };

  const saveToHistory = (newData: PosterData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newData)));
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setData(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setData(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  const debouncedSaveToHistory = (newData: PosterData) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      saveToHistory(newData);
    }, 800);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only delete if not typing in an input/textarea
        if (
          selectedElementId &&
          !(
            document.activeElement instanceof HTMLInputElement ||
            document.activeElement instanceof HTMLTextAreaElement
          )
        ) {
          removeElement(selectedElementId);
        }
      }

      // Undo/Redo shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, historyIndex, history]);

  const addElement = (type: CanvasElement['type'], content?: string) => {
    const newElement: CanvasElement = {
      id: Math.random().toString(36).slice(2, 11),
      type,
      content:
        content ||
        (type === 'text' ? 'New Text' : type === 'shape' ? 'rectangle' : ''),
      x: 50,
      y: 50,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 50 : 100,
      fontSize: 24,
      color: data.textColor,
      fontWeight: 'font-bold',
      fontFamily: data.fontFamily,
      zIndex: data.elements.length + 1,
    };
    const newData = { ...data, elements: [...data.elements, newElement] };
    setData(newData);
    saveToHistory(newData);
    setSelectedElementId(newElement.id);
    setStyle('canvas-editor');
  };

  const handleCanvasImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addElement('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setData((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    }));
  };

  const removeElement = (id: string) => {
    const newData = {
      ...data,
      elements: data.elements.filter((el) => el.id !== id),
    };
    setData(newData);
    saveToHistory(newData);
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const duplicateElement = (id: string) => {
    const el = data.elements.find((e) => e.id === id);
    if (!el) return;
    const newElement: CanvasElement = {
      ...el,
      id: Math.random().toString(36).substr(2, 9),
      x: el.x + 20,
      y: el.y + 20,
      zIndex: data.elements.length + 1,
    };
    const newData = { ...data, elements: [...data.elements, newElement] };
    setData(newData);
    saveToHistory(newData);
    setSelectedElementId(newElement.id);
  };

  const alignElement = (
    id: string,
    alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
  ) => {
    const el = data.elements.find((e) => e.id === id);
    if (!el || el.locked) return;

    let updates: Partial<CanvasElement> = {};
    const canvasWidth = data.posterWidth;
    const canvasHeight = data.posterHeight;

    switch (alignment) {
      case 'left':
        updates = { x: 0 };
        break;
      case 'center':
        updates = { x: (canvasWidth - el.width) / 2 };
        break;
      case 'right':
        updates = { x: canvasWidth - el.width };
        break;
      case 'top':
        updates = { y: 0 };
        break;
      case 'middle':
        updates = { y: (canvasHeight - el.height) / 2 };
        break;
      case 'bottom':
        updates = { y: canvasHeight - el.height };
        break;
    }

    updateElement(id, updates);
  };

  const moveLayer = (id: string, direction: 'up' | 'down') => {
    const elements = [...data.elements];
    const idx = elements.findIndex((e) => e.id === id);
    if (idx === -1) return;

    const newElements = [...elements];
    if (direction === 'up' && idx < elements.length - 1) {
      [newElements[idx], newElements[idx + 1]] = [
        newElements[idx + 1],
        newElements[idx],
      ];
    } else if (direction === 'down' && idx > 0) {
      [newElements[idx], newElements[idx - 1]] = [
        newElements[idx - 1],
        newElements[idx],
      ];
    }

    const newData = {
      ...data,
      elements: newElements.map((el, i) => ({ ...el, zIndex: i + 1 })),
    };
    setData(newData);
    saveToHistory(newData);
  };

  const convertToCanvas = () => {
    const newElements: CanvasElement[] = [
      {
        id: 'h1',
        type: 'text',
        content: data.heading,
        x: 50,
        y: 150,
        width: data.posterWidth - 100,
        height: 100,
        fontSize: 48,
        color: data.textColor,
        fontWeight: 'font-black',
        fontFamily: data.fontFamily,
        zIndex: 1,
      },
      {
        id: 'body',
        type: 'text',
        content: data.body,
        x: 50,
        y: 300,
        width: data.posterWidth - 100,
        height: 150,
        fontSize: 18,
        color: data.textColor,
        fontWeight: 'font-normal',
        fontFamily: data.fontFamily,
        zIndex: 2,
      },
      {
        id: 'highlight',
        type: 'text',
        content: data.highlight,
        x: 50,
        y: 500,
        width: data.posterWidth - 100,
        height: 50,
        fontSize: 24,
        color: data.accentColor,
        fontWeight: 'font-bold',
        fontFamily: data.fontFamily,
        zIndex: 3,
      },
    ];
    const newData = { ...data, elements: newElements };
    setData(newData);
    saveToHistory(newData);
    setStyle('canvas-editor');
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const val = e.target.type === 'number' ? parseInt(value) : value;
    const newData = { ...data, [name]: val };
    setData(newData);
    debouncedSaveToHistory(newData);
  };

  const setPreset = (mode: 'a4' | 'social' | 'custom') => {
    setPreviewMode(mode);
    let newData;
    if (mode === 'a4') {
      newData = { ...data, posterWidth: 595, posterHeight: 842 };
    } else if (mode === 'social') {
      newData = { ...data, posterWidth: 600, posterHeight: 600 };
    } else {
      newData = {
        ...data,
        posterWidth: Math.max(320, Number(data.posterWidth) || 1200),
        posterHeight: Math.max(320, Number(data.posterHeight) || 1600),
      };
    }
    setData(newData);
    saveToHistory(newData);
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prev) => ({ ...prev, logoImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prev) => ({ ...prev, bgImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateWithAI = async () => {
    setIsGenerating(true);
    try {
      const response = await apiFetch('/api/poster/generate', {
        method: 'POST',
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'AI generation failed');
      }
      setData((prev) => ({ ...prev, ...result }));
    } catch (err) {
      console.error('AI Generation failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportAs = async (format: 'png' | 'jpg' | 'pdf') => {
    if (!posterRef.current) return;
    setExporting(true);
    try {
      const node = posterRef.current;
      const scale = 2; // Higher resolution
      const style = {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: node.offsetWidth + 'px',
        height: node.offsetHeight + 'px',
      };

      const options = {
        width: node.offsetWidth * scale,
        height: node.offsetHeight * scale,
        style,
      };

      if (format === 'png') {
        const dataUrl = await htmlToImage.toPng(node, options);
        const link = document.createElement('a');
        link.download = `poster-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'jpg') {
        const dataUrl = await htmlToImage.toJpeg(node, {
          ...options,
          quality: 0.95,
        });
        const link = document.createElement('a');
        link.download = `poster-${Date.now()}.jpg`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'pdf') {
        const dataUrl = await htmlToImage.toPng(node, options);
        const pdf = new jsPDF({
          orientation: previewMode === 'a4' ? 'portrait' : 'landscape',
          unit: 'px',
          format:
            previewMode === 'a4'
              ? [node.offsetWidth, node.offsetHeight]
              : [node.offsetWidth, node.offsetHeight],
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, node.offsetWidth, node.offsetHeight);
        pdf.save(`poster-${Date.now()}.pdf`);
      }
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setExporting(false);
    }
  };

  const getHeadingSize = () => {
    switch (data.headingLevel) {
      case 'h1':
        return 'text-6xl';
      case 'h2':
        return 'text-5xl';
      case 'h3':
        return 'text-4xl';
      case 'h4':
        return 'text-3xl';
      case 'h5':
        return 'text-2xl';
      case 'h6':
        return 'text-xl';
      default:
        return 'text-6xl';
    }
  };

  const getLayoutClasses = () => {
    switch (data.layoutPreset) {
      case 'centered':
        return 'justify-center items-center text-center';
      case 'split-vertical':
        return 'flex-row items-center justify-between text-left';
      case 'split-horizontal':
        return 'justify-between text-center';
      case 'bottom-heavy':
        return 'justify-end text-left';
      case 'top-heavy':
        return 'justify-start text-left';
      default:
        return 'justify-center items-center text-center';
    }
  };

  return (
    <div className="h-screen w-full bg-[#0a0505] text-[#f0e6e6] font-sans flex overflow-hidden">
      {/* Floating Sidebar - Glassmorphism Style */}
      <aside className="w-[400px] flex flex-col h-screen z-30 m-4">
        {/* Header Card */}
        <div className="flex-shrink-0 p-5 rounded-3xl bg-gradient-to-br from-rose-600/90 via-rose-700/90 to-pink-800/90 backdrop-blur-xl border border-rose-400/30 shadow-[0_25px_50px_-12px_rgba(244,63,94,0.4)] mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 shadow-inner">
                <Palette size={22} className="text-white drop-shadow-md" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight drop-shadow-md">
                  POSTER STUDIO
                </h1>
                <p className="text-[9px] font-bold opacity-80 uppercase tracking-[0.25em]">
                  Pro Design Suite
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-black/25 rounded-xl p-1 border border-white/10 shadow-inner">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-2 hover:bg-white/20 text-white rounded-lg disabled:opacity-30 transition-all shadow-sm"
                  title="Undo"
                >
                  <Undo size={14} />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-2 hover:bg-white/20 text-white rounded-lg disabled:opacity-30 transition-all shadow-sm"
                  title="Redo"
                >
                  <Redo size={14} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex bg-black/20 p-1 rounded-xl border border-white/10 shadow-inner">
            <button
              onClick={() => setStyle('modern')}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${style !== 'canvas-editor' ? 'bg-white text-rose-600 shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              Templates
            </button>
            <button
              onClick={() => setStyle('canvas-editor')}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${style === 'canvas-editor' ? 'bg-white text-rose-600 shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              Canvas
            </button>
          </div>
        </div>

        {/* Scrollable Controls */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          {/* Quick Actions */}
          {style === 'canvas-editor' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/15 to-pink-600/10 backdrop-blur-md border border-rose-500/25 shadow-[0_10px_30px_-10px_rgba(244,63,94,0.3)]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-rose-400" />
                <span className="text-[10px] font-black text-rose-300 uppercase tracking-widest">
                  Canvas Mode
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportAs('pdf')}
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all hover:scale-[1.02]"
                >
                  <FileText size={12} className="inline mr-1" /> PDF
                </button>
                <button
                  onClick={() => exportAs('png')}
                  className="flex-1 py-2.5 bg-[#1a1111] text-rose-400 border border-rose-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-rose-500/10 transition-all"
                >
                  <FileImage size={12} className="inline mr-1" /> PNG
                </button>
              </div>
            </div>
          )}

          {/* Brand Section */}
          <div className="p-4 rounded-2xl bg-[#141010] border border-rose-500/15 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <label className="text-[10px] font-black text-rose-400/70 uppercase tracking-[0.2em] block mb-3 flex items-center gap-2">
              <Sparkles size={10} /> Brand Identity
            </label>
            <div className="flex gap-3 items-center">
              <div className="relative w-14 h-14 bg-gradient-to-br from-[#1f1616] to-[#141010] border-2 border-dashed border-rose-500/30 rounded-xl flex items-center justify-center overflow-hidden group hover:border-rose-500/60 transition-all shadow-inner">
                {data.logoImage ? (
                  <img
                    src={data.logoImage}
                    alt="Logo"
                    className="w-full h-full object-contain p-1.5"
                  />
                ) : (
                  <ImageIcon className="text-rose-500/40" size={20} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <input
                  name="logoText"
                  placeholder="Logo Text"
                  value={data.logoText}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1f1616] border border-rose-500/20 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none transition-all font-bold text-[#f0e6e6] placeholder:text-rose-400/30 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Style Grid */}
          <div className="p-4 rounded-2xl bg-[#141010] border border-rose-500/15 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <label className="text-[10px] font-black text-rose-400/70 uppercase tracking-[0.2em] block mb-3">
              Design Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  'minimalist',
                  'modern',
                  'abstract',
                  'glassmorphism',
                  'gradient-mesh',
                  'retro',
                  'dark-minimal',
                  'vibrant-pop',
                  'brutalist',
                  'editorial',
                  'geometric',
                  'cyberpunk',
                ] as PosterStyle[]
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`py-2.5 px-2 rounded-xl border transition-all text-[9px] font-bold capitalize ${style === s ? 'bg-gradient-to-br from-rose-600 to-rose-700 border-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-[#1f1616] border-rose-500/15 text-rose-200/60 hover:border-rose-500/40 hover:bg-[#251a1a]'}`}
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Tools */}
          {style === 'canvas-editor' && (
            <div className="p-4 rounded-2xl bg-[#141010] border border-rose-500/15 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <label className="text-[10px] font-black text-rose-400/70 uppercase tracking-[0.2em] block mb-3">
                Canvas Tools
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  {
                    icon: Type,
                    label: 'Text',
                    action: () => addElement('text'),
                  },
                  {
                    icon: Layout,
                    label: 'Shape',
                    action: () => addElement('shape'),
                  },
                  {
                    icon: Sparkles,
                    label: 'Logo',
                    action: () => addElement('logo'),
                  },
                  {
                    icon: ImageIcon,
                    label: 'Image',
                    action: handleCanvasImageUpload,
                    isFile: true,
                  },
                ].map((tool, i) => (
                  <button
                    key={i}
                    onClick={tool.isFile ? undefined : () => (tool.action as () => void)()}
                    className="relative flex flex-col items-center gap-1.5 p-2.5 bg-[#1f1616] border border-rose-500/15 rounded-xl hover:bg-rose-500/10 hover:border-rose-500/40 transition-all group shadow-sm"
                  >
                    <tool.icon
                      size={16}
                      className="text-rose-400/60 group-hover:text-rose-400 transition-colors"
                    />
                    <span className="text-[8px] font-bold text-rose-300/60 group-hover:text-rose-300">
                      {tool.label}
                    </span>
                    {tool.isFile && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={tool.action as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setData((prev) => ({ ...prev, elements: [] }))}
                  className="flex-1 py-2 bg-red-500/10 text-red-400 border border-red-500/25 rounded-lg text-[10px] font-bold uppercase hover:bg-red-500/20 transition-all shadow-sm"
                >
                  <Trash2 size={12} className="inline mr-1" /> Clear
                </button>
                <button
                  onClick={convertToCanvas}
                  className="flex-1 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/25 rounded-lg text-[10px] font-bold uppercase hover:bg-rose-500/20 transition-all shadow-sm"
                >
                  <Layers size={12} className="inline mr-1" /> Template
                </button>
              </div>
            </div>
          )}

          {/* Colors */}
          <div className="p-4 rounded-2xl bg-[#141010] border border-rose-500/15 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <label className="text-[10px] font-black text-rose-400/70 uppercase tracking-[0.2em] block mb-3">
              Colors
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'primaryColor', label: 'Primary' },
                { name: 'accentColor', label: 'Accent' },
                { name: 'backgroundColor', label: 'Background' },
                { name: 'textColor', label: 'Text' },
              ].map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-2 p-2 bg-[#1f1616] rounded-lg border border-rose-500/10"
                >
                  <input
                    type="color"
                    name={c.name}
                    value={data[c.name as keyof PosterData] as string}
                    onChange={handleInputChange}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent"
                  />
                  <span className="text-[9px] font-bold text-rose-300/60">
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 rounded-2xl bg-[#141010] border border-rose-500/15 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <label className="text-[10px] font-black text-rose-400/70 uppercase tracking-[0.2em] block mb-3">
              Content
            </label>
            <div className="space-y-3">
              <input
                name="heading"
                placeholder="Heading"
                value={data.heading}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-[#1f1616] border border-rose-500/20 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none text-[#f0e6e6] placeholder:text-rose-400/30 shadow-inner"
              />
              <textarea
                name="body"
                placeholder="Body text..."
                rows={2}
                value={data.body}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-[#1f1616] border border-rose-500/20 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none resize-none text-[#f0e6e6] placeholder:text-rose-400/30 shadow-inner"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="highlight"
                  placeholder="Highlight"
                  value={data.highlight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1f1616] border border-rose-500/20 rounded-lg text-xs focus:ring-2 focus:ring-rose-500/30 outline-none text-[#f0e6e6] placeholder:text-rose-400/30 shadow-inner"
                />
                <input
                  name="buttonText"
                  placeholder="Button"
                  value={data.buttonText}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1f1616] border border-rose-500/20 rounded-lg text-xs focus:ring-2 focus:ring-rose-500/30 outline-none text-[#f0e6e6] placeholder:text-rose-400/30 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="p-4 rounded-2xl bg-[#141010] border border-rose-500/15 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <label className="text-[10px] font-black text-rose-400/70 uppercase tracking-[0.2em] block mb-3">
              Settings
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-300/60">
                  Width
                </span>
                <input
                  type="number"
                  name="posterWidth"
                  value={data.posterWidth}
                  onChange={handleInputChange}
                  className="w-20 px-2 py-1.5 bg-[#1f1616] border border-rose-500/20 rounded-lg text-xs text-right text-[#f0e6e6] shadow-inner"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-300/60">
                  Height
                </span>
                <input
                  type="number"
                  name="posterHeight"
                  value={data.posterHeight}
                  onChange={handleInputChange}
                  className="w-20 px-2 py-1.5 bg-[#1f1616] border border-rose-500/20 rounded-lg text-xs text-right text-[#f0e6e6] shadow-inner"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-300/60">
                  Padding
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={data.padding}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      padding: parseInt(e.target.value),
                    }))
                  }
                  className="w-24 h-1 bg-rose-500/20 rounded-lg accent-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex-shrink-0 mt-4 p-4 rounded-2xl bg-[#141010] border border-rose-500/15 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => exportAs('png')}
              disabled={exporting}
              className="py-2.5 bg-[#1f1616] border border-rose-500/20 rounded-xl text-[10px] font-bold text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all shadow-sm"
            >
              <FileImage size={14} className="mx-auto mb-1" /> PNG
            </button>
            <button
              onClick={() => exportAs('jpg')}
              disabled={exporting}
              className="py-2.5 bg-[#1f1616] border border-rose-500/20 rounded-xl text-[10px] font-bold text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all shadow-sm"
            >
              <ImageIcon size={14} className="mx-auto mb-1" /> JPG
            </button>
            <button
              onClick={() => exportAs('pdf')}
              disabled={exporting}
              className="py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 rounded-xl text-[10px] font-bold text-white hover:from-rose-700 hover:to-rose-800 transition-all shadow-lg shadow-rose-500/30"
            >
              <FileText size={14} className="mx-auto mb-1" /> PDF
            </button>
          </div>
        </div>
      </aside>

      {/* Main Preview Area - Floating Design */}
      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Floating Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 bg-[#141010]/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-rose-500/15 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            {(['a4', 'social', 'custom'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setPreset(m)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${previewMode === m ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg' : 'text-rose-300/60 hover:text-rose-300 hover:bg-rose-500/10'}`}
              >
                {m === 'a4' ? 'A4' : m === 'social' ? 'Social' : 'Custom'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 bg-[#141010]/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-rose-500/15 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <span className="text-[10px] font-bold text-rose-400/60">Zoom</span>
            <input
              type="range"
              min="0.3"
              max="1.2"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-28 h-1.5 bg-rose-500/20 rounded-lg accent-rose-500"
            />
            <span className="text-[10px] font-mono font-bold text-rose-400 w-10">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        </div>

        {/* Canvas Container with 3D Shadow */}
        <div className="flex-1 flex items-center justify-center overflow-auto rounded-3xl bg-gradient-to-br from-[#0f0a0a] to-[#1a1010] border border-rose-500/10 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]">
          <div
            ref={posterRef}
            style={{
              width: `${data.posterWidth}px`,
              height: `${data.posterHeight}px`,
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
            className="relative transition-all duration-500"
          >
            {/* 3D Shadow Layer */}
            <div className="absolute -inset-4 bg-gradient-to-br from-rose-600/20 via-transparent to-pink-600/20 rounded-3xl blur-2xl -z-10" />
            <div className="absolute -inset-2 bg-black/40 rounded-2xl blur-xl -z-5" />

            {/* Main Canvas */}
            <div
              className="w-full h-full rounded-xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(244,63,94,0.1)]"
              style={{
                backgroundColor: data.backgroundColor,
                border: `${data.borderWidth}px solid ${data.borderColor}`,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={style}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full h-full"
                >
                  {/* Grid overlay for canvas mode */}
                  {style === 'canvas-editor' && snapToGrid && (
                    <div
                      className="absolute inset-0 pointer-events-none z-50 opacity-30"
                      style={{
                        backgroundImage:
                          'linear-gradient(rgba(244,63,94,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,94,0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    />
                  )}

                  {/* Minimalist Style */}
                  {style === 'minimalist' && (
                    <div
                      className="h-full flex flex-col p-16 text-center relative"
                      style={{
                        gap: `${data.elementGap}px`,
                        background: `linear-gradient(135deg, ${data.backgroundColor} 0%, ${data.secondaryColor}20 100%)`,
                      }}
                    >
                      {data.bgImage && (
                        <img
                          src={data.bgImage}
                          alt="BG"
                          className={`absolute inset-0 w-full h-full ${getBgSizeClass(data.bgSize)}`}
                          style={{
                            opacity: data.bgOpacity / 100,
                            filter: `blur(${data.bgBlur}px)`,
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                      <div className="relative z-10 flex justify-center drop-shadow-lg">
                        {data.logoImage ? (
                          <img
                            src={data.logoImage}
                            alt="Logo"
                            style={{ height: `${data.logoSize}px` }}
                            className="object-contain"
                          />
                        ) : (
                          <div className="px-5 py-2 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-black text-xs tracking-[0.3em] uppercase rounded-full shadow-lg shadow-rose-500/30">
                            {data.logoText}
                          </div>
                        )}
                      </div>
                      <div
                        className="relative z-10 flex-1 flex flex-col justify-center"
                        style={{ gap: `${data.elementGap}px` }}
                      >
                        <h1
                          className={`${getHeadingSize()} ${data.fontWeight} leading-tight tracking-tight drop-shadow-lg`}
                          style={{ color: data.textColor }}
                        >
                          {data.heading}
                        </h1>
                        <div className="w-16 h-1 bg-gradient-to-r from-rose-600 to-rose-400 mx-auto rounded-full shadow-lg shadow-rose-500/30" />
                        <p
                          className="text-rose-200/70 text-base leading-relaxed max-w-md mx-auto"
                          style={{ color: data.textColor, opacity: 0.7 }}
                        >
                          {data.body}
                        </p>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 font-black text-3xl tracking-tighter drop-shadow-lg">
                          {data.highlight}
                        </div>
                        {data.buttonText && (
                          <button className="mx-auto px-10 py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-xl shadow-rose-500/40 hover:shadow-rose-500/60 hover:scale-105 transition-all">
                            {data.buttonText}
                          </button>
                        )}
                      </div>
                      <div
                        className="relative z-10 text-[10px] font-bold uppercase tracking-[0.4em]"
                        style={{ color: data.textColor, opacity: 0.4 }}
                      >
                        {data.contact}
                      </div>
                    </div>
                  )}

                  {/* Modern Style */}
                  {style === 'modern' && (
                    <div className="h-full flex flex-col relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-rose-800 to-pink-900">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/30 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl" />
                      </div>
                      {data.bgImage && (
                        <img
                          src={data.bgImage}
                          alt="BG"
                          className={`absolute inset-0 w-full h-full ${getBgSizeClass(data.bgSize)} opacity-30`}
                          style={{ filter: `blur(${data.bgBlur}px)` }}
                        />
                      )}
                      <div
                        className="relative z-10 p-12 flex-1 flex flex-col"
                        style={{ gap: `${data.elementGap}px` }}
                      >
                        <div className="flex justify-between items-center">
                          {data.logoImage ? (
                            <img
                              src={data.logoImage}
                              alt="Logo"
                              style={{ height: `${data.logoSize}px` }}
                              className="object-contain brightness-0 invert"
                            />
                          ) : (
                            <div className="font-black text-sm tracking-widest uppercase text-white/90">
                              {data.logoText}
                            </div>
                          )}
                          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full shadow-lg shadow-rose-500/40" />
                        </div>
                        <div
                          className="flex-1 flex flex-col justify-center"
                          style={{ gap: `${data.elementGap}px` }}
                        >
                          <h1
                            className={`${getHeadingSize()} ${data.fontWeight} text-white leading-[0.9] tracking-tighter uppercase drop-shadow-2xl`}
                          >
                            {data.heading}
                          </h1>
                          <p className="text-white/70 text-lg font-medium leading-relaxed max-w-lg drop-shadow-lg">
                            {data.body}
                          </p>
                          <div className="flex items-center gap-6 mt-4">
                            <div className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-300 font-black text-4xl tracking-tighter drop-shadow-lg">
                              {data.highlight}
                            </div>
                            {data.buttonText && (
                              <button className="px-8 py-3.5 bg-white text-rose-700 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                                {data.buttonText}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-[0.4em]">
                          {data.contact}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Abstract Style */}
                  {style === 'abstract' && (
                    <div
                      className="h-full flex flex-col relative overflow-hidden"
                      style={{ background: data.backgroundColor }}
                    >
                      <div className="absolute top-[-30%] right-[-20%] w-[80%] h-[80%] bg-gradient-to-br from-rose-600/40 to-pink-600/20 rounded-full blur-3xl" />
                      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-rose-500/30 to-transparent rounded-full blur-3xl" />
                      {data.bgImage && (
                        <img
                          src={data.bgImage}
                          alt="BG"
                          className={`absolute inset-0 w-full h-full ${getBgSizeClass(data.bgSize)}`}
                          style={{
                            opacity: data.bgOpacity / 100,
                            filter: `blur(${data.bgBlur}px)`,
                          }}
                        />
                      )}
                      <div
                        className="relative z-10 flex-1 flex flex-col p-16 text-center items-center justify-center"
                        style={{ gap: `${data.elementGap}px` }}
                      >
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
                          {data.logoImage ? (
                            <img
                              src={data.logoImage}
                              alt="Logo"
                              style={{ height: `${data.logoSize * 0.6}px` }}
                              className="object-contain"
                            />
                          ) : (
                            <>
                              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg">
                                {data.logoText.charAt(0)}
                              </div>
                              <span className="font-black text-xs tracking-widest text-white/90">
                                {data.logoText}
                              </span>
                            </>
                          )}
                        </div>
                        <h1
                          className={`${getHeadingSize()} ${data.fontWeight} leading-[0.85] tracking-tighter uppercase drop-shadow-2xl`}
                          style={{ color: data.textColor }}
                        >
                          {data.heading}
                        </h1>
                        <div className="bg-gradient-to-r from-rose-600 to-pink-500 text-white px-8 py-3 rounded-full font-black text-2xl tracking-tighter shadow-xl shadow-rose-500/40">
                          {data.highlight}
                        </div>
                        <p
                          className="text-base leading-relaxed max-w-md font-medium"
                          style={{ color: data.textColor, opacity: 0.7 }}
                        >
                          {data.body}
                        </p>
                        {data.buttonText && (
                          <button className="px-12 py-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-500/40 hover:shadow-rose-500/60 hover:scale-105 transition-all">
                            {data.buttonText}
                          </button>
                        )}
                      </div>
                      <div
                        className="relative z-10 p-8 text-center text-[10px] font-bold uppercase tracking-[0.4em]"
                        style={{ color: data.textColor, opacity: 0.4 }}
                      >
                        {data.contact}
                      </div>
                    </div>
                  )}

                  {/* Glassmorphism Style */}
                  {style === 'glassmorphism' && (
                    <div
                      className="h-full flex flex-col relative overflow-hidden"
                      style={{
                        background:
                          'linear-gradient(135deg, #1a0f0f 0%, #0f0808 100%)',
                      }}
                    >
                      <div className="absolute top-[-30%] left-[-20%] w-[100%] h-[100%] bg-rose-600/20 rounded-full blur-[100px]" />
                      <div className="absolute bottom-[-30%] right-[-20%] w-[100%] h-[100%] bg-pink-600/15 rounded-full blur-[100px]" />
                      {data.bgImage && (
                        <img
                          src={data.bgImage}
                          alt="BG"
                          className={`absolute inset-0 w-full h-full ${getBgSizeClass(data.bgSize)}`}
                          style={{
                            opacity: data.bgOpacity / 100,
                            filter: `blur(${data.bgBlur}px)`,
                          }}
                        />
                      )}
                      <div className="relative z-10 flex-1 flex items-center justify-center p-12">
                        <div
                          className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[3rem] p-12 shadow-[0_50px_100px_-20px_rgba(244,63,94,0.3)]"
                          style={{ gap: `${data.elementGap}px` }}
                        >
                          <div className="text-center">
                            {data.logoImage ? (
                              <img
                                src={data.logoImage}
                                alt="Logo"
                                style={{ height: `${data.logoSize}px` }}
                                className="object-contain mx-auto mb-6 brightness-0 invert"
                              />
                            ) : (
                              <div className="text-white/90 font-black text-sm tracking-[0.4em] uppercase border-b-2 border-rose-500/50 pb-3 mb-6 inline-block">
                                {data.logoText}
                              </div>
                            )}
                          </div>
                          <h1
                            className={`${getHeadingSize()} ${data.fontWeight} text-white leading-none tracking-tighter uppercase text-center drop-shadow-lg`}
                          >
                            {data.heading}
                          </h1>
                          <div className="text-rose-400 font-black text-3xl tracking-tighter text-center mt-4 drop-shadow-lg">
                            {data.highlight}
                          </div>
                          <p className="text-white/60 text-base leading-relaxed max-w-md text-center mt-4 font-medium">
                            {data.body}
                          </p>
                          {data.buttonText && (
                            <button className="block mx-auto mt-6 px-10 py-4 bg-white text-rose-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                              {data.buttonText}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="relative z-10 text-center pb-8 text-[10px] text-white/30 font-bold uppercase tracking-[0.4em]">
                        {data.contact}
                      </div>
                    </div>
                  )}

                  {/* Gradient Mesh Style */}
                  {style === 'gradient-mesh' && (
                    <div className="h-full flex flex-col relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-rose-600 via-rose-700 via-pink-600 to-rose-800 animate-gradient-xy"
                        style={{ backgroundSize: '400% 400%' }}
                      />
                      {data.bgImage && (
                        <img
                          src={data.bgImage}
                          alt="BG"
                          className={`absolute inset-0 w-full h-full ${getBgSizeClass(data.bgSize)}`}
                          style={{
                            opacity: data.bgOpacity / 100,
                            filter: `blur(${data.bgBlur}px)`,
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
                      <div
                        className="relative z-10 h-full flex flex-col p-14"
                        style={{ gap: `${data.elementGap}px` }}
                      >
                        <div className="flex justify-between items-start">
                          {data.logoImage ? (
                            <img
                              src={data.logoImage}
                              alt="Logo"
                              style={{ height: `${data.logoSize}px` }}
                              className="object-contain brightness-0 invert drop-shadow-lg"
                            />
                          ) : (
                            <div className="text-white font-black text-sm tracking-widest uppercase drop-shadow-lg">
                              {data.logoText}
                            </div>
                          )}
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Sparkles size={22} />
                          </div>
                        </div>
                        <div
                          className="flex-1 flex flex-col justify-end"
                          style={{ gap: `${data.elementGap}px` }}
                        >
                          <h1
                            className={`${getHeadingSize()} ${data.fontWeight} text-white leading-[0.85] tracking-tighter uppercase drop-shadow-2xl`}
                          >
                            {data.heading}
                          </h1>
                          <div className="flex items-end justify-between gap-8">
                            <div style={{ gap: `${data.elementGap / 2}px` }}>
                              <div className="text-white font-black text-4xl tracking-tighter drop-shadow-lg">
                                {data.highlight}
                              </div>
                              <p className="text-white/80 text-base leading-relaxed font-medium max-w-sm drop-shadow-md">
                                {data.body}
                              </p>
                            </div>
                            {data.buttonText && (
                              <button className="px-10 py-5 bg-white text-rose-600 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:shadow-3xl hover:scale-105 transition-all">
                                {data.buttonText}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="pt-6 border-t border-white/20 text-[10px] text-white/60 font-bold uppercase tracking-[0.3em]">
                          {data.contact}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cyberpunk Style */}
                  {style === 'cyberpunk' && (
                    <div
                      className="h-full flex flex-col bg-[#050305] p-12 relative overflow-hidden"
                      style={{ gap: `${data.elementGap}px` }}
                    >
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(0deg, transparent, transparent 2px, #f43f5e 2px, #f43f5e 3px)',
                          backgroundSize: '100% 4px',
                        }}
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-rose-900/10 via-transparent to-rose-900/10" />
                      {data.bgImage && (
                        <img
                          src={data.bgImage}
                          alt="BG"
                          className={`absolute inset-0 w-full h-full ${getBgSizeClass(data.bgSize)}`}
                          style={{
                            opacity: data.bgOpacity / 100,
                            filter: `blur(${data.bgBlur}px)`,
                          }}
                        />
                      )}
                      <div className="relative z-10 flex justify-between items-center border-b border-rose-500/40 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]" />
                          {data.logoImage ? (
                            <img
                              src={data.logoImage}
                              alt="Logo"
                              style={{ height: '26px' }}
                              className="object-contain brightness-0 invert"
                            />
                          ) : (
                            <div className="font-mono text-xs font-bold tracking-widest uppercase text-rose-400">
                              {data.logoText}
                            </div>
                          )}
                        </div>
                        <div className="font-mono text-[8px] text-rose-500/70">
                          SYS.OPTIMAL
                        </div>
                      </div>
                      <div className="relative z-10 flex-1 flex flex-col justify-center">
                        <div className="text-rose-500 font-mono text-xs mb-2 tracking-[0.5em] uppercase">
                          // TRANSMISSION
                        </div>
                        <h1
                          className={`${getHeadingSize()} font-black leading-[0.85] tracking-tighter uppercase mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]`}
                        >
                          {data.heading}
                        </h1>
                        <div className="bg-rose-500/10 border border-rose-500/40 p-6 mb-6 relative backdrop-blur-sm">
                          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-rose-500" />
                          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-rose-500" />
                          <p className="font-mono text-sm leading-relaxed text-rose-300/80">
                            {data.body}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-rose-400 font-black text-4xl tracking-tighter drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">
                            {data.highlight}
                          </div>
                          <div className="flex-1 h-[2px] bg-gradient-to-r from-rose-500/50 to-transparent" />
                        </div>
                      </div>
                      <div className="relative z-10 flex justify-between items-end">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-rose-500/50">
                          {data.contact}
                        </div>
                        {data.buttonText && (
                          <button className="px-8 py-3 bg-transparent border-2 border-rose-500 text-rose-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-black transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                            {data.buttonText}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Geometric Style */}
                  {style === 'geometric' && (
                    <div
                      className="h-full flex flex-col bg-[#0a0808] p-12 relative overflow-hidden text-white"
                      style={{ gap: `${data.elementGap}px` }}
                    >
                      <div
                        className="absolute top-0 left-0 w-full h-full opacity-10"
                        style={{
                          backgroundImage:
                            'linear-gradient(45deg, #f43f5e 25%, transparent 25%), linear-gradient(-45deg, #f43f5e 25%, transparent 25%)',
                          backgroundSize: '30px 30px',
                        }}
                      />
                      {data.bgImage && (
                        <img
                          src={data.bgImage}
                          alt="BG"
                          className={`absolute inset-0 w-full h-full ${getBgSizeClass(data.bgSize)}`}
                          style={{
                            opacity: data.bgOpacity / 100,
                            filter: `blur(${data.bgBlur}px)`,
                          }}
                        />
                      )}
                      <div className="relative z-10 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rotate-45 shadow-lg shadow-rose-500/30" />
                          {data.logoImage ? (
                            <img
                              src={data.logoImage}
                              alt="Logo"
                              style={{ height: '32px' }}
                              className="object-contain brightness-0 invert"
                            />
                          ) : (
                            <div className="font-black text-sm tracking-widest uppercase">
                              {data.logoText}
                            </div>
                          )}
                        </div>
                        <div className="text-xs font-mono text-rose-400/50">
                          REF_2026
                        </div>
                      </div>
                      <div className="relative z-10 flex-1 flex flex-col justify-center">
                        <div className="w-24 h-2 bg-gradient-to-r from-rose-500 to-rose-400 mb-8 shadow-lg shadow-rose-500/30" />
                        <h1
                          className={`${getHeadingSize()} font-black leading-[0.9] tracking-tighter uppercase mb-6 drop-shadow-lg`}
                        >
                          {data.heading}
                        </h1>
                        <div className="grid grid-cols-2 gap-8 items-start">
                          <p className="text-rose-200/70 text-base font-medium leading-relaxed border-l-4 border-rose-500 pl-5">
                            {data.body}
                          </p>
                          <div className="space-y-4">
                            <div className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 font-black text-3xl tracking-tighter">
                              {data.highlight}
                            </div>
                            <div className="text-[10px] text-rose-400/40 font-bold uppercase tracking-widest">
                              {data.contact}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative z-10">
                        {data.buttonText && (
                          <button className="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-black text-xs uppercase tracking-[0.3em] shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all">
                            {data.buttonText}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Canvas Editor */}
                  {style === 'canvas-editor' && (
                    <div
                      className="h-full w-full relative"
                      style={{ backgroundColor: data.backgroundColor }}
                      onClick={() => setSelectedElementId(null)}
                    >
                      {data.bgImage && (
                        <img
                          src={data.bgImage}
                          alt="BG"
                          className={`absolute inset-0 w-full h-full ${getBgSizeClass(data.bgSize)}`}
                          style={{
                            opacity: data.bgOpacity / 100,
                            filter: `blur(${data.bgBlur}px)`,
                          }}
                        />
                      )}
                      {data.elements.map((el) => (
                        <Rnd
                          key={el.id}
                          size={{ width: el.width, height: el.height }}
                          position={{ x: el.x, y: el.y }}
                          dragGrid={snapToGrid ? [20, 20] : [1, 1]}
                          resizeGrid={snapToGrid ? [20, 20] : [1, 1]}
                          disableDragging={el.locked}
                          enableResizing={!el.locked}
                          onDragStop={(_e, d) => {
                            const newData = {
                              ...data,
                              elements: data.elements.map((item) =>
                                item.id === el.id
                                  ? { ...item, x: d.x, y: d.y }
                                  : item
                              ),
                            };
                            setData(newData);
                            saveToHistory(newData);
                          }}
                          onResizeStop={(
                            _e,
                            _direction,
                            ref,
                            _delta,
                            position
                          ) => {
                            const newData = {
                              ...data,
                              elements: data.elements.map((item) =>
                                item.id === el.id
                                  ? {
                                      ...item,
                                      width: parseInt(ref.style.width),
                                      height: parseInt(ref.style.height),
                                      ...position,
                                    }
                                  : item
                              ),
                            };
                            setData(newData);
                            saveToHistory(newData);
                          }}
                          bounds="parent"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedElementId(el.id);
                          }}
                          style={{
                            zIndex: el.zIndex,
                            boxShadow:
                              selectedElementId === el.id
                                ? '0 0 0 2px #f43f5e, 0 10px 40px rgba(244,63,94,0.3)'
                                : 'none',
                            cursor: el.locked ? 'default' : 'move',
                            transform: `rotate(${el.rotation || 0}deg)`,
                          }}
                        >
                          {selectedElementId === el.id && !el.locked && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeElement(el.id);
                              }}
                              className="absolute -top-3 -right-3 w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-[100]"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                          {selectedElementId === el.id && el.locked && (
                            <div className="absolute -top-3 -right-3 w-7 h-7 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-full flex items-center justify-center shadow-lg z-[100]">
                              <Lock size={14} />
                            </div>
                          )}
                          {el.type === 'text' && (
                            <div
                              style={{
                                fontSize: `${el.fontSize}px`,
                                color: el.color,
                                fontWeight:
                                  el.fontWeight === 'font-black'
                                    ? 900
                                    : el.fontWeight === 'font-bold'
                                      ? 700
                                      : 400,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent:
                                  el.textAlign === 'left'
                                    ? 'flex-start'
                                    : el.textAlign === 'right'
                                      ? 'flex-end'
                                      : 'center',
                                textAlign: el.textAlign || 'center',
                                textShadow: data.textShadow
                                  ? '2px 2px 8px rgba(0,0,0,0.5)'
                                  : 'none',
                                lineHeight: el.lineHeight || 1.2,
                                letterSpacing: `${el.letterSpacing || 0}px`,
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {el.content}
                            </div>
                          )}
                          {el.type === 'shape' && (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(135deg, ${el.color}, ${el.color}80)`,
                                borderRadius:
                                  el.content === 'circle'
                                    ? '50%'
                                    : el.content === 'rounded'
                                      ? '16px'
                                      : '0',
                                clipPath:
                                  el.content === 'triangle'
                                    ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                                    : 'none',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                              }}
                            />
                          )}
                          {el.type === 'logo' && (
                            <div className="w-full h-full flex items-center justify-center drop-shadow-lg">
                              {data.logoImage ? (
                                <img
                                  src={data.logoImage}
                                  alt="Logo"
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div
                                  className="font-black text-sm tracking-widest uppercase"
                                  style={{
                                    color: el.color || data.primaryColor,
                                  }}
                                >
                                  {data.logoText}
                                </div>
                              )}
                            </div>
                          )}
                          {el.type === 'image' && (
                            <img
                              src={el.content}
                              alt="Canvas Item"
                              className="w-full h-full object-cover shadow-lg"
                            />
                          )}
                        </Rnd>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <style>{`
      @keyframes gradient-xy {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      .animate-gradient-xy { animation: gradient-xy 8s ease infinite; background-size: 400% 400%; }
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(244,63,94,0.3); border-radius: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(244,63,94,0.5); }
    `}</style>
    </div>
  );
};
