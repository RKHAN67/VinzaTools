import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Link as LinkIcon,
  Loader2,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  Wand2,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { apiFetch } from '../api';

type ShopifyProduct = {
  title: string;
  price: string;
  compareAtPrice?: string;
  description: string;
  vendor?: string;
  tags?: string[];
  images: string[];
  handle: string;
  sourceUrl: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'shopify-product';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const extractJsonLdObjects = (doc: Document) => {
  const scripts = Array.from(
    doc.querySelectorAll('script[type="application/ld+json"]')
  );

  return scripts.flatMap((node) => {
    const raw = node.textContent?.trim();
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed['@graph'])) return parsed['@graph'];
      return [parsed];
    } catch {
      return [];
    }
  });
};

const pickFirstString = (...values: Array<unknown>) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

const parseProductHtml = (html: string, sourceUrl: string): ShopifyProduct => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const jsonLd = extractJsonLdObjects(doc);
  const productSchema =
    jsonLd.find(
      (item) =>
        item &&
        typeof item === 'object' &&
        String((item as Record<string, unknown>)['@type'] || '')
          .toLowerCase()
          .includes('product')
    ) || {};

  const product = productSchema as Record<string, any>;
  const offers = Array.isArray(product.offers)
    ? product.offers[0]
    : product.offers || {};

  const title = pickFirstString(
    doc.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    product.name,
    doc.querySelector('h1')?.textContent,
    doc.title
  );

  const description = pickFirstString(
    doc
      .querySelector('meta[name="description"]')
      ?.getAttribute('content'),
    product.description,
    doc.querySelector('[data-product-description]')?.textContent,
    doc.querySelector('main p')?.textContent,
    'Imported from product page'
  );

  const vendor = pickFirstString(
    product.brand?.name,
    product.manufacturer?.name,
    doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content'),
    new URL(sourceUrl).hostname.replace(/^www\./, '')
  );

  const rawPrice = pickFirstString(
    offers.price,
    doc
      .querySelector('meta[property="product:price:amount"]')
      ?.getAttribute('content'),
    doc.querySelector('[itemprop="price"]')?.getAttribute('content'),
    doc.body.textContent?.match(/(?:\$|Rs\.?|USD\s?)\s?(\d[\d,.]*)/)?.[1]
  );

  const rawCompare = pickFirstString(
    offers.highPrice,
    doc
      .querySelector('meta[property="product:original_price:amount"]')
      ?.getAttribute('content')
  );

  const imageCandidates = [
    doc.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    ...(Array.isArray(product.image) ? product.image : [product.image]),
    ...Array.from(doc.images).map((img) => img.currentSrc || img.src),
  ]
    .filter((value): value is string => Boolean(value && value.startsWith('http')))
    .slice(0, 8);

  const tags = Array.from(
    new Set(
      [
        vendor,
        title.split(' ').slice(0, 3).join(' '),
        ...(Array.isArray(product.category) ? product.category : [product.category]),
      ]
        .flat()
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    )
  );

  return {
    title,
    price: rawPrice ? String(rawPrice).replace(/[^0-9.]/g, '') : '0.00',
    compareAtPrice: rawCompare
      ? String(rawCompare).replace(/[^0-9.]/g, '')
      : undefined,
    description: `<p>${escapeHtml(description)}</p>`,
    vendor,
    tags,
    images: imageCandidates.length ? imageCandidates : [''],
    handle: slugify(title),
    sourceUrl,
  };
};

export const ShopifyHelper = () => {
  const [urlInput, setUrlInput] = useState('');
  const [products, setProducts] = useState<ShopifyProduct[]>(() => {
    const saved = localStorage.getItem('vinzatools_shopify_products');
    return saved ? JSON.parse(saved) : [];
  });
  const [markupPercent, setMarkupPercent] = useState('20');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('vinzatools_shopify_products', JSON.stringify(products));
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const term = search.toLowerCase();
    return products.filter((product) =>
      [product.title, product.vendor, product.handle, product.price]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [products, search]);

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + (Number(product.price) || 0),
    0
  );

  const handleTrySample = () => {
    setUrlInput(
      [
        'https://www.gymshark.com/products/gymshark-apex-seamless-leggings-black-aw23',
        'https://www.nike.com/t/air-max-270-mens-shoes-KkLcGR/AH8050-002',
      ].join('\n')
    );
    setMessage('Sample Shopify product links loaded.');
    setError('');
  };

  const handleExtract = async () => {
    const urls = urlInput
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!urls.length) {
      setError('Paste at least one product URL first.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    const extracted: ShopifyProduct[] = [];
    const failed: string[] = [];

    for (const rawUrl of urls) {
      try {
        const res = await apiFetch('/api/fetch-html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: rawUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Could not fetch product page');
        extracted.push(parseProductHtml(data.html, rawUrl));
      } catch (err: any) {
        failed.push(`${rawUrl}: ${err.message || 'Failed'}`);
      }
    }

    if (extracted.length) {
      setProducts((prev) => [...extracted, ...prev]);
      setUrlInput('');
      setMessage(`${extracted.length} Shopify-ready product(s) imported.`);
    }
    if (failed.length) {
      setError(failed.slice(0, 3).join(' | '));
    }
    setLoading(false);
  };

  const exportToExcel = () => {
    if (!products.length) return;
    const rows = products.map((product) => ({
      Handle: product.handle,
      Title: product.title,
      'Body (HTML)': product.description,
      Vendor: product.vendor || '',
      Tags: product.tags?.join(', ') || '',
      'Variant Price': product.price,
      'Variant Compare At Price': product.compareAtPrice || '',
      'Image Src': product.images[0] || '',
      'Source URL': product.sourceUrl,
    }));
    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Products');
    XLSX.writeFile(workbook, `vinzatools-shopify-products-${Date.now()}.xlsx`);
    setMessage('Excel export is ready.');
  };

  const applyMarkup = () => {
    const percent = Number(markupPercent);
    if (Number.isNaN(percent)) {
      setError('Markup percent must be a number.');
      return;
    }
    setProducts((prev) =>
      prev.map((product) => {
        const value = Number(product.price || 0);
        const updated = value * (1 + percent / 100);
        return { ...product, price: updated.toFixed(2) };
      })
    );
    setMessage(`Applied ${percent}% markup to all imported products.`);
  };

  const roundPrices = () => {
    setProducts((prev) =>
      prev.map((product) => {
        const value = Number(product.price || 0);
        if (!value) return product;
        const rounded = Math.ceil(value) - 0.01;
        return { ...product, price: rounded.toFixed(2) };
      })
    );
    setMessage('Rounded all prices to the .99 ending style.');
  };

  const copyHandle = async (handle: string) => {
    await navigator.clipboard.writeText(handle);
    setMessage(`Copied handle: ${handle}`);
  };

return (
    <div className="min-h-[680px] rounded-[28px] border border-rose-500/20 bg-[#0f0a0a] p-6 md:p-8 space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-500/20">
          <ShoppingBag className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">
            Shopify ProExtract Studio
          </h2>
          <p className="text-sm text-rose-400/60 max-w-3xl">
            Pull product data from public product links, clean pricing, generate Shopify handles, and export a polished import sheet made for Shopify stores.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-rose-500/10 bg-[#1a1414] p-5 hover:border-rose-500/30 transition-all">
          <div className="text-xs uppercase tracking-[0.25em] text-rose-400/60">Queue</div>
          <div className="mt-3 text-3xl font-black text-rose-400">{totalProducts}</div>
          <div className="mt-1 text-sm text-white/40">products ready for export</div>
        </div>
        <div className="rounded-3xl border border-rose-500/10 bg-[#1a1414] p-5 hover:border-rose-500/30 transition-all">
          <div className="text-xs uppercase tracking-[0.25em] text-rose-400/60">Store Value</div>
          <div className="mt-3 text-3xl font-black text-white">${totalValue.toFixed(2)}</div>
          <div className="mt-1 text-sm text-white/40">combined visible pricing</div>
        </div>
        <div className="rounded-3xl border border-rose-500/10 bg-[#1a1414] p-5 hover:border-rose-500/30 transition-all">
          <div className="text-xs uppercase tracking-[0.25em] text-rose-400/60">Platform</div>
          <div className="mt-3 flex items-center gap-3 text-white font-black text-lg">
            <BarChart3 size={20} className="text-rose-400" />
            Shopify workflow only
          </div>
          <div className="mt-1 text-sm text-white/40">made for product import prep</div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 flex items-center gap-3">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {/* Main Input Section */}
      <div className="rounded-3xl border border-rose-500/10 bg-[#1a1414] p-6 space-y-5">
        <div className="grid lg:grid-cols-[1.6fr,1fr] gap-5">
          {/* URL Input Area */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.25em] text-rose-400/60">
              Product URLs
            </label>
            <textarea
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste one product URL per line..."
              className="min-h-44 w-full rounded-3xl border border-rose-500/10 bg-[#151010] p-5 text-white outline-none focus:border-rose-500/40 focus:shadow-[0_0_20px_rgba(244,63,94,0.1)] transition-all placeholder:text-white/30"
            />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExtract}
                disabled={loading}
                className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-700 px-5 py-3 font-bold text-white transition-all hover:from-rose-600 hover:to-rose-800 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-rose-500/30"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <LinkIcon size={16} />}
                {loading ? 'Extracting...' : 'Extract Products'}
              </button>
              <button
                onClick={handleTrySample}
                className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-5 py-3 font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
              >
                <Sparkles size={16} />
                Load Sample
              </button>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="rounded-3xl border border-rose-500/10 bg-[#151010] p-5 space-y-4">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-rose-400/60">
                Shopify actions
              </div>
              <h3 className="mt-2 text-xl font-black text-white">
                Clean imports before export
              </h3>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-rose-400/80">Markup percent</label>
              <input
                value={markupPercent}
                onChange={(e) => setMarkupPercent(e.target.value)}
                className="w-full rounded-2xl border border-rose-500/10 bg-[#1a1414] px-4 py-3 text-white outline-none focus:border-rose-500/40 focus:shadow-[0_0_15px_rgba(244,63,94,0.1)] transition-all"
                placeholder="Enter %"
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={applyMarkup}
                className="cursor-pointer rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-left font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
              >
                Apply markup
              </button>
              <button
                onClick={roundPrices}
                className="cursor-pointer rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-left font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
              >
                Round prices to .99
              </button>
              <button
                onClick={exportToExcel}
                disabled={!products.length}
                className="cursor-pointer rounded-2xl bg-gradient-to-r from-rose-500 to-rose-700 px-4 py-3 text-left font-bold text-white hover:from-rose-600 hover:to-rose-800 disabled:cursor-not-allowed disabled:opacity-40 transition-all shadow-lg shadow-rose-500/30"
              >
                Export Excel
              </button>
              <button
                onClick={() => {
                  setProducts([]);
                  setMessage('Shopify queue cleared.');
                }}
                className="cursor-pointer rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-left font-bold text-rose-400 hover:bg-rose-500/20 transition-all"
              >
                Clear queue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products List Section */}
      <div className="rounded-3xl border border-rose-500/10 bg-[#1a1414] p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-white">Imported products</h3>
            <p className="text-sm text-white/40">
              {products.length} product(s) ready for Shopify cleanup and export.
            </p>
          </div>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400/50" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search imported products..."
              className="w-full rounded-2xl border border-rose-500/10 bg-[#151010] pl-11 pr-4 py-3 text-white outline-none focus:border-rose-500/40 focus:shadow-[0_0_15px_rgba(244,63,94,0.1)] transition-all placeholder:text-white/30"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredProducts.map((product, index) => (
            <div
              key={`${product.handle}-${index}`}
              className="rounded-3xl border border-rose-500/10 bg-[#151010] p-5 hover:border-rose-500/30 transition-all group"
            >
              <div className="grid lg:grid-cols-[120px,1fr,auto] gap-5 items-start">
                {/* Product Image */}
                <div className="rounded-2xl overflow-hidden border border-rose-500/10 bg-[#1a1414] aspect-square group-hover:border-rose-500/30 transition-all">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-rose-400/30 text-xs">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-lg font-black text-white group-hover:text-rose-400 transition-colors">{product.title}</h4>
                    <p className="text-sm text-white/40">
                      {product.vendor || 'Unknown vendor'} · Handle: <span className="text-rose-400/60">{product.handle}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-rose-400">
                      Price: {product.price || '0.00'}
                    </span>
                    {product.compareAtPrice && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/60">
                        Compare: {product.compareAtPrice}
                      </span>
                    )}
                    <a
                      href={product.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/5 px-3 py-1 text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      View source
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 min-w-[150px]">
                  <button
                    onClick={() => copyHandle(product.handle)}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                  >
                    <Copy size={16} />
                    Copy handle
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(product.sourceUrl);
                      setMessage('Source URL copied.');
                    }}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                  >
                    <LinkIcon size={16} />
                    Copy source
                  </button>
                  <button
                    onClick={() =>
                      setProducts((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
                    }
                    className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/20 transition-all"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!filteredProducts.length && (
            <div className="rounded-3xl border border-dashed border-rose-500/20 bg-[#151010] px-6 py-12 text-center text-white/30">
              <ShoppingBag className="mx-auto mb-4 text-rose-400/40" size={28} />
              <p className="text-sm">No products yet. Import product links to start building your Shopify sheet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

