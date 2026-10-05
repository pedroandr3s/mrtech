// Se ejecuta automáticamente después de `npm run build`.
//
// La app es una SPA (React) que pinta todo en el navegador, así que el HTML que recibe
// un rastreador está vacío. Este script genera, SIN cambiar nada de lo que ve el usuario:
//   - build/index.html           inicio: metadata, canonical, JSON-LD y contenido en <noscript>
//   - build/producto/<id>.html   una página por producto publicado (metadata + JSON-LD + <noscript>)
//   - build/200.html             "cascarón" neutro para el resto de rutas de la SPA
//   - build/sitemap.xml y build/robots.txt
//
// Dominio: SITE_URL, REACT_APP_SITE_URL o, en Vercel, VERCEL_PROJECT_PRODUCTION_URL.
// Productos: tabla `productos` de Supabase (solo los publicados, con la clave pública).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = path.join(ROOT, 'build');

const schema = await import(pathToFileURL(path.join(ROOT, 'src/seo/schema.mjs')).href);
const content = await import(pathToFileURL(path.join(ROOT, 'src/seo/content.mjs')).href);
const {
  SITE_NAME, SITE_LOCALE, SITE_TITLE, SITE_DESCRIPTION, DEFAULT_IMAGE_PATH,
  absoluteUrl, formatPrice, homeGraph, homeMeta, normalizeForSeo,
  productGraph, productMeta, productPath, siteGraph,
} = schema;

// --- Entorno ---------------------------------------------------------------
const loadEnvFile = (file) => {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
};
['.env.production.local', '.env.local', '.env.production', '.env'].forEach((f) => loadEnvFile(path.join(ROOT, f)));

const rawSite =
  process.env.SITE_URL ||
  process.env.REACT_APP_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
const SITE = rawSite ? (/^https?:\/\//.test(rawSite) ? rawSite : `https://${rawSite}`).replace(/\/+$/, '') : '';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const log = (...a) => console.log('[seo]', ...a);
const warn = (...a) => console.warn('[seo] AVISO:', ...a);

if (!fs.existsSync(path.join(BUILD, 'index.html'))) {
  console.error('[seo] No existe build/index.html: ejecuta primero `react-scripts build`.');
  process.exit(1);
}

// --- Productos --------------------------------------------------------------
const loadSeedProducts = () => {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/productos.js'), 'utf8');
  return new Function(src.replace('export const productosIniciales =', 'return '))().map(normalizeForSeo);
};

const loadProducts = async () => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    warn('Supabase no está configurado en el build: se usa el catálogo inicial (src/data/productos.js).');
    return { products: loadSeedProducts(), source: 'seed' };
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/productos?select=id,publicado,data&publicado=eq.true&order=id`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    const products = rows
      .map((r) => normalizeForSeo({ ...r.data, id: r.id, publicado: r.publicado }))
      .filter((p) => p.nombre);
    return { products, source: 'supabase' };
  } catch (err) {
    warn(`No se pudieron leer los productos de Supabase (${err.message}). Se omiten las páginas de producto.`);
    return { products: [], source: 'error' };
  }
};

// --- HTML ----------------------------------------------------------------
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// JSON seguro para incrustar dentro de <script>.
const jsonScript = (id, data) =>
  `<script type="application/ld+json" id="${id}">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

const tag = (name, value, key = 'name') => (value ? `<meta ${key}="${name}" content="${esc(value)}"/>` : '');

const ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

const headBlock = ({ meta, page, pageGraph }) => {
  // Las páginas con URL propia son indexables; el cascarón neutro (page=false) no declara nada.
  const url = page && SITE ? absoluteUrl(SITE, meta.path) : '';
  const image = SITE ? absoluteUrl(SITE, meta.image || DEFAULT_IMAGE_PATH) : '';
  const parts = [
    `<title>${esc(meta.title)}</title>`,
    tag('description', meta.description),
    page && tag('robots', ROBOTS),
    url && `<link rel="canonical" href="${esc(url)}"/>`,
    tag('og:site_name', SITE_NAME, 'property'),
    tag('og:locale', SITE_LOCALE, 'property'),
    tag('og:type', meta.type, 'property'),
    tag('og:title', meta.title, 'property'),
    tag('og:description', meta.description, 'property'),
    url && tag('og:url', url, 'property'),
    image && tag('og:image', image, 'property'),
    image && tag('og:image:alt', meta.imageAlt, 'property'),
    image && tag('twitter:card', meta.type === 'product' ? 'summary_large_image' : 'summary'),
    tag('twitter:title', meta.title),
    tag('twitter:description', meta.description),
    image && tag('twitter:image', image),
    SITE && jsonScript('seo-jsonld-site', siteGraph(SITE)),
    SITE && pageGraph && jsonScript('seo-jsonld-page', pageGraph),
  ];
  return parts.filter(Boolean).join('');
};

const li = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

const homeNoscript = (products) =>
  `<noscript><p>Necesitas habilitar JavaScript para ejecutar esta aplicación.</p><main>` +
  `<h1>${esc(content.HERO_TITLE)}</h1><p>${esc(content.HERO_EYEBROW)}</p><p>${esc(content.HERO_TEXT)}</p>${li(content.HERO_TAGS)}` +
  `<h2>${esc(content.CATALOG_TITLE)}</h2><p>${esc(content.CATALOG_TEXT)}</p><ul>` +
  products
    .map(
      (p) =>
        `<li><a href="${esc(productPath(p))}">${esc(p.nombre)}</a>: ${esc(p.descripcion)} ` +
        `Precio referencial: $${formatPrice(p.precio)} USD. ${esc(p.stock)}.</li>`
    )
    .join('') +
  `</ul></main></noscript>`;

const productNoscript = (p) => {
  const specs = Object.entries(p.especificaciones);
  const lists = [
    ['Características', p.caracteristicas], ['Funciones', p.funciones], ['Aplicaciones', p.aplicaciones],
    ['Ventajas', p.ventajas], ['Mantenimiento', p.mantenimiento],
  ].filter(([, items]) => items.length);
  return (
    `<noscript><p>Necesitas habilitar JavaScript para ejecutar esta aplicación.</p><main>` +
    `<p><a href="/">Volver al catálogo</a></p><h1>${esc(p.nombre)}</h1>` +
    `<p>Precio referencial: $${formatPrice(p.precio)} USD. ${esc(p.stock)}.</p>` +
    (p.descripcion ? `<p>${esc(p.descripcion)}</p>` : '') +
    (specs.length
      ? `<h2>Especificaciones</h2><dl>${specs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`
      : '') +
    lists.map(([title, items]) => `<h2>${title}</h2>${li(items)}`).join('') +
    `</main></noscript>`
  );
};

const template = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');

const render = ({ meta, page, pageGraph, noscript }) => {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
  html = html.replace(/<meta\s+name="description"[\s\S]*?\/?>/i, '');
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, noscript);
  return html.replace('</head>', `${headBlock({ meta, page, pageGraph })}</head>`);
};

// --- Generación -----------------------------------------------------------
const { products, source } = await loadProducts();
log(`dominio: ${SITE || '(sin definir)'} | productos: ${products.length} (${source})`);

if (!SITE) {
  warn('No hay dominio (SITE_URL / VERCEL_PROJECT_PRODUCTION_URL): se omiten canonical, Open Graph con URL, JSON-LD y sitemap.xml.');
}

const generic = { title: SITE_TITLE, description: SITE_DESCRIPTION, type: 'website', image: DEFAULT_IMAGE_PATH, imageAlt: SITE_NAME };
const genericNoscript = '<noscript>Necesitas habilitar JavaScript para ejecutar esta aplicación.</noscript>';

// Cascarón neutro para rutas sin página estática (el navegador completa la metadata).
fs.writeFileSync(path.join(BUILD, '200.html'), render({ meta: generic, page: false, pageGraph: null, noscript: genericNoscript }));

// Inicio
fs.writeFileSync(
  path.join(BUILD, 'index.html'),
  render({ meta: homeMeta(), page: true, pageGraph: SITE ? homeGraph(SITE, products) : null, noscript: homeNoscript(products) })
);

// Productos
fs.mkdirSync(path.join(BUILD, 'producto'), { recursive: true });
for (const p of products) {
  fs.writeFileSync(
    path.join(BUILD, 'producto', `${p.id}.html`),
    render({ meta: productMeta(p), page: true, pageGraph: SITE ? productGraph(SITE, p) : null, noscript: productNoscript(p) })
  );
}

// sitemap.xml y robots.txt
let robots = fs.readFileSync(path.join(ROOT, 'public/robots.txt'), 'utf8').replace(/\r\n/g, '\n').trimEnd();
if (SITE) {
  const urls = ['/', ...products.map(productPath)];
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${esc(absoluteUrl(SITE, u))}</loc></url>`).join('\n') +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(BUILD, 'sitemap.xml'), xml);
  robots += `\n\nSitemap: ${SITE}/sitemap.xml`;
}
fs.writeFileSync(path.join(BUILD, 'robots.txt'), `${robots}\n`);

log(`generado: index.html, 200.html, ${products.length} páginas de producto${SITE ? ', sitemap.xml' : ''}, robots.txt`);
