import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { PageKey, Tool } from '../types/app';
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Mail,
  Sparkles,
} from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { trackGaEvent } from '../lib/analytics';

type PageLabel = { key: PageKey; label: string };

type MegaMenuColumn = {
  title: string;
  items: Tool[];
};

type MegaMenu = {
  id: string;
  label: string;
  hint: string;
  columns: MegaMenuColumn[];
};

interface SiteLayoutProps {
  page: PageKey;
  setPage: (page: PageKey) => void;
  pageLabels: PageLabel[];
  allTools: Tool[];
  onToolSelect: (tool: Tool) => void;
  children: React.ReactNode;
}

export const SiteLayout = ({
  page,
  setPage,
  pageLabels,
  allTools,
  onToolSelect,
  children,
}: SiteLayoutProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openFooterSection, setOpenFooterSection] = useState<string | null>('tools');
  const menuShellRef = useRef<HTMLDivElement | null>(null);

  const toolMap = useMemo(
    () => new Map(allTools.map((tool) => [tool.id, tool])),
    [allTools]
  );

  const pickTools = (...ids: string[]) =>
    ids
      .map((id) => toolMap.get(id))
      .filter((tool): tool is Tool => Boolean(tool));

  const megaMenus = useMemo<MegaMenu[]>(
    () => [
      {
        id: 'convert',
        label: 'Convert',
        hint: 'PDF, image, and media converters',
        columns: [
          {
            title: 'PDF & Documents',
            items: pickTools(
              'pdf-to-word',
              'pdf-to-ppt',
              'pdf-to-excel',
              'word-to-pdf',
              'ppt-to-pdf',
              'excel-to-pdf',
              'html-to-pdf',
              'jpg-to-pdf',
              'pdf-to-jpg',
              'extract-pages-from-pdf'
            ),
          },
          {
            title: 'Image & Design',
            items: pickTools(
              'image-converter',
              'resize-image',
              'crop-image',
              'rotate-image',
              'flip-image',
              'image-enlarger',
              'color-picker',
              'image-compressor',
              'bg-remover',
              'qr-code-generator',
              'youtube-thumbnail-downloader',
              'gif-maker'
            ),
          },
          {
            title: 'Video & Audio',
            items: pickTools(
              'video-converter',
              'audio-converter',
              'mp4-to-mp3',
              'video-to-gif',
              'crop-video',
              'trim-video',
              'media-youtube',
              'media-tiktok',
              'media-instagram',
              'media-facebook'
            ),
          },
        ],
      },
      {
        id: 'compress',
        label: 'Compress',
        hint: 'Optimize files without leaving the site',
        columns: [
          {
            title: 'PDF Workflow',
            items: pickTools(
              'pdf-compress',
              'pdf-merge',
              'pdf-split',
              'pdf-rotate',
              'crop-pdf',
              'organize-pdf',
              'flatten-pdf',
              'resize-pdf',
              'pdf-page-remover',
              'page-numbers',
              'compare-pdf',
              'extract-image-from-pdf'
            ),
          },
          {
            title: 'Secure & Edit',
            items: pickTools(
              'edit-pdf',
              'watermark-pdf',
              'sign-pdf',
              'protect-pdf',
              'unlock-pdf',
              'redact-pdf'
            ),
          },
          {
            title: 'Content Cleanup',
            items: pickTools(
              'image-compressor',
              'image-compare',
              'resize-image',
              'crop-image',
              'color-picker',
              'text-counter',
              'case-converter',
              'slug-generator',
              'keyword-density-checker'
            ),
          },
        ],
      },
    ],
    [toolMap]
  );

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuShellRef.current) return;
      if (!menuShellRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const directLinks: PageLabel[] = [
    { key: 'home', label: 'Home' },
    { key: 'tools', label: 'Tools' },
    { key: 'themes', label: 'Themes' },
    { key: 'contact', label: 'Contact' },
  ];
  const primaryLink = directLinks[0];
  const secondaryLinks = directLinks.slice(1);

  const activeMenu = megaMenus.find((menu) => menu.id === openMenu) || null;

  const handleMenuToolClick = (tool: Tool) => {
    setOpenMenu(null);
    onToolSelect(tool);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0f0a0a] text-white selection:bg-rose-500/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a0a] via-transparent to-[#0f0a0a]" />
      </div>

      <div className="fixed top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[100px] pointer-events-none z-0" />

      <div
        ref={menuShellRef}
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0f0a0a]/92 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <button
            type="button"
            onClick={() => {
              setOpenMenu(null);
              setPage('home');
            }}
            className="vinza-button cursor-pointer rounded-2xl"
          >
            <BrandMark compact subtitle="Fast File Toolkit" />
          </button>

          <div className="hidden xl:flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setOpenMenu(null);
                setPage(primaryLink.key);
              }}
              className={`vinza-button cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                page === primaryLink.key
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {primaryLink.label}
            </button>

            {megaMenus.map((menu) => (
              <button
                key={menu.id}
                type="button"
                onClick={() =>
                  setOpenMenu((current) =>
                    current === menu.id ? null : menu.id
                  )
                }
                className={`vinza-button cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  openMenu === menu.id
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {menu.label}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    openMenu === menu.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
            ))}

            {secondaryLinks.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setOpenMenu(null);
                  setPage(item.key);
                }}
                className={`vinza-button cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  page === item.key
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setOpenMenu(null);
                setPage('tools');
              }}
              className="vinza-button cursor-pointer inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-rose-400/25 hover:bg-white/10 hover:shadow-lg hover:shadow-rose-500/10"
            >
              <Sparkles size={15} className="text-rose-300" />
              Browse All Tools
            </button>
            <button
              type="button"
              onClick={() => {
                setOpenMenu(null);
                setPage('contact');
                trackGaEvent('request_tool_click', { location: 'header' });
              }}
              className="vinza-button cursor-pointer rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-500/30"
            >
              Request Tool
            </button>
          </div>
        </div>

        {activeMenu && (
          <div className="hidden xl:block border-t border-white/5 bg-[#120d0d]/98">
            <div className="mx-auto max-w-7xl px-4 py-5">
              <div className="max-h-[calc(100vh-150px)] overflow-hidden rounded-[2rem] border border-white/10 bg-[#171111] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.38)]">
                <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.24em] text-rose-400">
                      {activeMenu.label}
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      {activeMenu.hint}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(null);
                      setPage('tools');
                    }}
                    className="vinza-button cursor-pointer rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/20"
                  >
                    Open full tools page
                  </button>
                </div>

                <div className="grid max-h-[calc(100vh-240px)] grid-cols-3 gap-5 overflow-y-auto pr-2 app-scrollbar">
                  {activeMenu.columns.map((column) => (
                    <div
                      key={column.title}
                      className="min-w-0 border-r border-white/5 pr-5 last:border-r-0 last:pr-0"
                    >
                      <div className="mb-4 text-sm font-black text-white">
                        {column.title}
                      </div>
                      <div className="max-h-[calc(100vh-300px)] space-y-2 overflow-y-auto pr-1 app-scrollbar">
                        {column.items.map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <button
                              key={tool.id}
                              type="button"
                              onClick={() => handleMenuToolClick(tool)}
                              className="vinza-button cursor-pointer group flex w-full items-start gap-3 rounded-2xl border border-transparent bg-white/[0.03] px-3 py-3 text-left transition-all hover:border-rose-500/20 hover:bg-rose-500/10"
                            >
                              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300">
                                <Icon size={16} />
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-white group-hover:text-rose-200">
                                  {tool.name}
                                </div>
                                <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                  {tool.description}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-white/5 bg-[#0f0a0a]/85 px-4 py-3 xl:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto app-scrollbar">
            {[primaryLink, ...secondaryLinks].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setPage(item.key)}
                className={`vinza-button cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  page === item.key
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-36 pb-16 xl:pt-28">
        {children}
      </div>

      <footer className="relative z-10 border-t border-white/10 bg-[#0f0a0a]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <BrandMark />
              </div>
              <p className="max-w-sm text-sm text-slate-400">
                A friendly toolbox for PDFs, media, images, resumes, themes,
                and developer utilities. Designed to feel fast and easy.
              </p>
              <p className="max-w-md text-xs leading-relaxed text-slate-500">
                Popular tools include PDF to Word Converter, PDF to PowerPoint
                Converter, PDF to Excel Converter, Word to PDF Converter, JPG to
                PDF Converter, Image Converter, AI Background Remover, Shopify
                ProExtract Studio, and the theme library.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPage('contact');
                    trackGaEvent('request_tool_click', { location: 'footer' });
                  }}
                  className="vinza-button cursor-pointer flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-500/20"
                >
                  Request Tool
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPage('tools')}
                  className="vinza-button cursor-pointer rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-semibold text-white transition-colors hover:border-rose-400/25 hover:bg-white/10 hover:text-rose-100"
                >
                  Browse
                </button>
              </div>
            </div>

            {[
              {
                id: 'tools',
                title: 'Tools',
                items: [
                  { label: 'All Tools', page: 'tools' as PageKey },
                  { label: 'Theme Library', page: 'themes' as PageKey },
                  { label: 'PDF Tools', page: 'tools' as PageKey },
                  { label: 'Media Tools', page: 'tools' as PageKey },
                  { label: 'Shopify ProExtract Studio', page: 'tools' as PageKey },
                ],
              },
              {
                id: 'company',
                title: 'Company',
                items: [
                  { label: 'About', page: 'about' as PageKey },
                  { label: 'Team', page: 'team' as PageKey },
                  { label: 'Blog', page: 'blog' as PageKey },
                  { label: 'Contact', page: 'contact' as PageKey },
                  { label: 'Privacy Policy', page: 'policy' as PageKey },
                  { label: 'Terms & Conditions', page: 'terms' as PageKey },
                  { label: 'Cookie Policy', page: 'cookies' as PageKey },
                ],
              },
            ].map((section) => {
              const isOpen = openFooterSection === section.id;
              return (
                <div key={section.id} className="space-y-3">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFooterSection((current) =>
                        current === section.id ? null : section.id
                      )
                    }
                    className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left md:cursor-default md:border-0 md:bg-transparent md:px-0 md:py-0"
                  >
                    <span className="text-sm font-bold text-white">{section.title}</span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform md:hidden ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div className={`${isOpen ? 'flex' : 'hidden'} flex-col gap-3 md:flex`}>
                    {section.items.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setPage(item.page)}
                        className="vinza-button cursor-pointer block text-left text-sm text-slate-400 transition-colors hover:text-rose-400"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-slate-500 md:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span>© 2026 VinzaTools.</span>
              <span className="flex items-center gap-1 text-rose-400">
                <Heart size={12} className="fill-rose-400" />
                Made with care
              </span>
              <span className="text-slate-600">|</span>
              <span>Powered by</span>
              <a
                href="https://bluevinza.com"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-rose-400 transition-colors hover:text-rose-300"
              >
                BlueVinza
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Mail size={12} />
                info@bluevinza.com
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

