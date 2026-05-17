import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INTERNAL_TOOLS } from '../src/data/toolCatalog';

const SITE = 'https://vinzatools.com';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const distDir = path.join(repoRoot, 'dist');

const indexHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html not found. Run build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const setOrReplace = (html: string, pattern: RegExp, replacement: string) => {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  // Insert near </head>
  return html.replace('</head>', `${replacement}\n</head>`);
};

const removeMeta = (html: string, pattern: RegExp) => html.replace(pattern, '');

const buildToolPage = (toolId: string, toolName: string, description: string) => {
  const title = `${toolName} | VinzaTools`;
  const canonical = `${SITE}/tools/${encodeURIComponent(toolId)}`;
  const metaDesc =
    description?.trim() ||
    `Use ${toolName} on VinzaTools to finish your task quickly with clean, downloadable results.`;

  let html = baseHtml;

  // Title
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`);

  // Canonical
  html = removeMeta(html, /<link\s+rel="canonical"[^>]*>\s*/gi);
  html = html.replace('</head>', `<link rel="canonical" href="${canonical}">\n</head>`);

  // Description
  html = removeMeta(html, /<meta\s+name="description"[^>]*>\s*/gi);
  html = html.replace(
    '</head>',
    `<meta name="description" content="${escapeHtml(metaDesc)}">\n</head>`
  );

  // OG/Twitter basics (safe override)
  const ogImg = `${SITE}/assets/images/toolora-logo.png`;
  html = removeMeta(html, /<meta\s+property="og:title"[^>]*>\s*/gi);
  html = removeMeta(html, /<meta\s+property="og:description"[^>]*>\s*/gi);
  html = removeMeta(html, /<meta\s+property="og:url"[^>]*>\s*/gi);
  html = removeMeta(html, /<meta\s+property="og:image"[^>]*>\s*/gi);
  html = removeMeta(html, /<meta\s+name="twitter:title"[^>]*>\s*/gi);
  html = removeMeta(html, /<meta\s+name="twitter:description"[^>]*>\s*/gi);
  html = removeMeta(html, /<meta\s+name="twitter:image"[^>]*>\s*/gi);

  const ogBlock = [
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(metaDesc)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${ogImg}">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(metaDesc)}">`,
    `<meta name="twitter:image" content="${ogImg}">`,
  ].join('\n');
  html = html.replace('</head>', `${ogBlock}\n</head>`);

  // Noscript content for crawlers/users without JS
  const noscript = `<noscript><main style="max-width:720px;margin:40px auto;font-family:Arial,sans-serif;line-height:1.6;"><h1>${escapeHtml(
    toolName
  )}</h1><p>${escapeHtml(metaDesc)}</p><p>Open: <a href="${canonical}">${canonical}</a></p></main></noscript>`;
  html = html.replace('<body>', `<body>\n${noscript}\n`);

  return html;
};

const toolsRoot = path.join(distDir, 'tools');
fs.mkdirSync(toolsRoot, { recursive: true });

for (const tool of INTERNAL_TOOLS) {
  const outDir = path.join(toolsRoot, tool.id);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'index.html');
  fs.writeFileSync(outPath, buildToolPage(tool.id, tool.name, tool.description), 'utf8');
}

console.log(`Generated ${INTERNAL_TOOLS.length} tool landing pages into dist/tools/<id>/index.html`);

