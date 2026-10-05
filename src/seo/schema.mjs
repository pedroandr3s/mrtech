// Datos SEO compartidos entre el navegador (src/seo/Seo.js) y el build (scripts/postbuild.mjs).
// Solo usa información real del proyecto: nada de datos inventados.
import { HERO_TAGS } from './content.mjs';

export const SITE_NAME = 'MR TECH';
export const SITE_ALT_NAMES = ['MR Tech', 'Machinery Robotic Technologies'];
export const SITE_TITLE = 'MR TECH | Robots y maquinaria para logística, seguridad y rescate';
export const SITE_DESCRIPTION =
  'Robots y maquinaria robótica para logística industrial, seguridad y emergencias y rescate acuático. Catálogo y cotizaciones en MR TECH.';
export const SITE_LOCALE = 'es_CL';
// Número de WhatsApp al que hoy se envían las cotizaciones (QuoteForm.js).
export const CONTACT_PHONE = '+56927294017';
export const CURRENCY = 'USD'; // el footer indica "Precios referenciales en USD"
export const LOGO_PATH = '/logo512.png';
export const DEFAULT_IMAGE_PATH = '/logo512.png';

const trimSlash = (s) => String(s || '').replace(/\/+$/, '');

export const absoluteUrl = (site, url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${trimSlash(site)}${url.startsWith('/') ? '' : '/'}${url}`;
};

// "2,499.99" -> 2499.99
export const parsePrice = (value) => {
  const n = parseFloat(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export const formatPrice = (value) =>
  parsePrice(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Misma forma que normalizeProducto() de ProductsContext, solo con lo que necesita el SEO.
export const normalizeForSeo = (p) => {
  const list = (v) => (Array.isArray(v) ? v.filter(Boolean) : []);
  const imagenes = list(p.imagenes);
  const imagen = p.imagen || imagenes[0] || '';
  return {
    id: p.id,
    nombre: String(p.nombre || '').trim(),
    descripcion: String(p.descripcion || '').trim(),
    precio: p.precio ?? '0.00',
    imagen,
    imagenes: imagenes.length ? imagenes : imagen ? [imagen] : [],
    especificaciones: p.especificaciones && typeof p.especificaciones === 'object' ? p.especificaciones : {},
    caracteristicas: list(p.caracteristicas),
    funciones: list(p.funciones),
    aplicaciones: list(p.aplicaciones),
    ventajas: list(p.ventajas),
    mantenimiento: list(p.mantenimiento),
    stock: p.stock || 'En stock',
    publicado: p.publicado !== false,
  };
};

const AVAILABILITY = {
  'En stock': 'https://schema.org/InStock',
  'Bajo pedido': 'https://schema.org/PreOrder',
  Agotado: 'https://schema.org/OutOfStock',
};

// Recorta a ~155 caracteres sin cortar palabras.
export const truncate = (text, max = 155) => {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > 80 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[,;:.\s]+$/, '')}…`;
};

export const productPath = (p) => `/producto/${p.id}`;

// Metadata por página -----------------------------------------------------

export const homeMeta = () => ({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: '/',
  type: 'website',
  image: DEFAULT_IMAGE_PATH,
  imageAlt: `${SITE_NAME} - ${SITE_ALT_NAMES[1]}`,
});

export const productMeta = (p) => ({
  title: `${p.nombre} | ${SITE_NAME}`,
  description: truncate(p.descripcion) || SITE_DESCRIPTION,
  path: productPath(p),
  type: 'product',
  image: p.imagen || DEFAULT_IMAGE_PATH,
  imageAlt: p.nombre,
});

// JSON-LD ------------------------------------------------------------------

const ids = (site) => ({
  org: `${trimSlash(site)}/#organization`,
  website: `${trimSlash(site)}/#website`,
});

// Nodos presentes en todas las páginas (Organization + WebSite).
export const siteGraph = (site) => {
  const base = trimSlash(site);
  const { org, website } = ids(base);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': org,
        name: SITE_NAME,
        alternateName: SITE_ALT_NAMES,
        url: `${base}/`,
        logo: { '@type': 'ImageObject', url: absoluteUrl(base, LOGO_PATH), width: 512, height: 512 },
        description: SITE_DESCRIPTION,
        knowsAbout: HERO_TAGS,
        areaServed: { '@type': 'Country', name: 'Chile' },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: CONTACT_PHONE,
            contactType: 'sales',
            availableLanguage: 'es',
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': website,
        url: `${base}/`,
        name: SITE_NAME,
        alternateName: SITE_ALT_NAMES[1],
        inLanguage: 'es',
        publisher: { '@id': org },
      },
    ],
  };
};

// Página de inicio: colección con la lista de productos del catálogo.
export const homeGraph = (site, products) => {
  const base = trimSlash(site);
  const { org, website } = ids(base);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${base}/#webpage`,
        url: `${base}/`,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: 'es',
        isPartOf: { '@id': website },
        about: { '@id': org },
        mainEntity: { '@id': `${base}/#catalogo` },
      },
      {
        '@type': 'ItemList',
        '@id': `${base}/#catalogo`,
        name: 'Catálogo MR TECH',
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: absoluteUrl(base, productPath(p)),
          name: p.nombre,
        })),
      },
    ],
  };
};

// Ficha de producto: Product (con oferta y especificaciones) + migas de pan.
export const productGraph = (site, p) => {
  const base = trimSlash(site);
  const { org, website } = ids(base);
  const url = absoluteUrl(base, productPath(p));
  const product = {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: p.nombre,
    url,
    sku: String(p.id),
    description: p.descripcion || SITE_DESCRIPTION,
    offers: {
      '@type': 'Offer',
      url,
      price: parsePrice(p.precio).toFixed(2),
      priceCurrency: CURRENCY,
      availability: AVAILABILITY[p.stock] || AVAILABILITY['En stock'],
      seller: { '@id': org },
    },
  };
  if (p.imagenes.length) product.image = p.imagenes.map((src) => absoluteUrl(base, src));
  const props = Object.entries(p.especificaciones || {}).map(([name, value]) => ({
    '@type': 'PropertyValue',
    name,
    value: String(value),
  }));
  if (props.length) product.additionalProperty = props;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemPage',
        '@id': `${url}#webpage`,
        url,
        name: `${p.nombre} | ${SITE_NAME}`,
        inLanguage: 'es',
        isPartOf: { '@id': website },
        mainEntity: { '@id': `${url}#product` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      product,
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Catálogo', item: `${base}/` },
          { '@type': 'ListItem', position: 2, name: p.nombre, item: url },
        ],
      },
    ],
  };
};
