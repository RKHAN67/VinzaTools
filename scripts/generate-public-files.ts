import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INTERNAL_TOOLS } from '../src/data/toolCatalog';

const SITE = 'https://vinzatools.com';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const publicDir = path.join(repoRoot, 'public');

const nowIso = new Date().toISOString();

const staticPages = [
  '/',
  '/tools',
  '/themes',
  '/blog',
  '/team',
  '/about',
  '/contact',
  '/policy',
  '/terms',
  '/cookies',
];

const toolPages = INTERNAL_TOOLS.map((t) => `/tools/${encodeURIComponent(t.id)}`);

const urls = [...staticPages, ...toolPages];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map((u) => {
      const priority =
        u === '/' ? '1.0' :
        u === '/tools' ? '0.9' :
        u.startsWith('/tools/') ? '0.8' :
        '0.6';
      const changefreq =
        u === '/' ? 'daily' :
        u === '/tools' ? 'daily' :
        u.startsWith('/tools/') ? 'weekly' :
        'monthly';
      return [
        '  <url>',
        `    <loc>${SITE}${u}</loc>`,
        `    <lastmod>${nowIso}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n') +
  `\n</urlset>\n`;

const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  `Sitemap: ${SITE}/sitemap.xml`,
  '',
].join('\n');

const llms = [
  '# VinzaTools',
  '',
  `Website: ${SITE}`,
  'Owner: BlueVinza',
  'Email: info@bluevinza.com',
  'Phone: +92-341-2890356',
  '',
  '## What This Site Offers',
  '- File utilities: PDF, images, media download workflows, text and developer helpers.',
  '- No-login, direct tools designed for fast completion and clean downloads.',
  '',
  '## Important Pages',
  `${SITE}/tools`,
  `${SITE}/themes`,
  `${SITE}/blog`,
  `${SITE}/policy`,
  `${SITE}/terms`,
  `${SITE}/cookies`,
  '',
  '## Tool Catalog (IDs)',
  ...INTERNAL_TOOLS.map((t) => `- ${t.id}: ${t.name}`),
  '',
].join('\n');

const humans = [
  'VinzaTools',
  'Site: https://vinzatools.com',
  'Company: BlueVinza',
  'Contact: info@bluevinza.com',
  'Phone: +92-341-2890356',
  '',
  'Thanks for using VinzaTools.',
  '',
].join('\n');

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8');
fs.writeFileSync(path.join(publicDir, 'llms.txt'), llms, 'utf8');
fs.writeFileSync(path.join(publicDir, 'humans.txt'), humans, 'utf8');

console.log(`Generated public files: sitemap.xml (${urls.length} URLs), robots.txt, llms.txt, humans.txt`);
