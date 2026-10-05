import { useEffect } from 'react';
import { SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_TITLE, absoluteUrl } from './schema.mjs';

// Dominio canónico: el que se fijó en el build (JSON-LD estático); si no existe, el actual.
export const getSiteOrigin = () => {
  try {
    const node = document.getElementById('seo-jsonld-site');
    const url = JSON.parse(node.textContent)['@graph'][0].url;
    return new URL(url).origin;
  } catch {
    return window.location.origin;
  }
};

const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const ROBOTS_NOINDEX = 'noindex, nofollow';

// Crea (o reutiliza) un <meta> o <link> del <head> y le asigna su valor.
const upsert = (selector, create, value, attr = 'content') => {
  let el = document.head.querySelector(selector);
  if (!value) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const meta = (key, name, value) =>
  upsert(
    `meta[${key}="${name}"]`,
    () => {
      const el = document.createElement('meta');
      el.setAttribute(key, name);
      return el;
    },
    value
  );

const setJsonLd = (id, data) => {
  let el = document.getElementById(id);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

/**
 * Mantiene sincronizada la metadata del <head> con la ruta actual de la SPA
 * (título, descripción, canonical, Open Graph, Twitter y JSON-LD).
 * No modifica nada visible de la página.
 *
 * @param {object} p
 * @param {string} [p.title]
 * @param {string} [p.description]
 * @param {string} [p.path]       ruta canónica (p. ej. "/producto/3")
 * @param {string} [p.image]      imagen para redes (relativa o absoluta)
 * @param {string} [p.imageAlt]
 * @param {string} [p.type]       og:type
 * @param {boolean} [p.noindex]   páginas privadas / sin contenido
 * @param {object} [p.jsonLd]     JSON-LD específico de la página
 */
const useSeo = ({ title, description, path, image, imageAlt, type = 'website', noindex = false, jsonLd = null }) => {
  const jsonKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const origin = getSiteOrigin();
    const pageTitle = title || SITE_TITLE;
    const pageDescription = description || SITE_DESCRIPTION;
    const url = noindex || !path ? '' : absoluteUrl(origin, path);
    const imageUrl = image ? absoluteUrl(origin, image) : '';

    document.title = pageTitle;
    meta('name', 'description', pageDescription);
    meta('name', 'robots', noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX);
    upsert(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement('link');
        el.rel = 'canonical';
        return el;
      },
      url,
      'href'
    );

    meta('property', 'og:site_name', SITE_NAME);
    meta('property', 'og:locale', SITE_LOCALE);
    meta('property', 'og:type', noindex ? '' : type);
    meta('property', 'og:title', noindex ? '' : pageTitle);
    meta('property', 'og:description', noindex ? '' : pageDescription);
    meta('property', 'og:url', url);
    meta('property', 'og:image', noindex ? '' : imageUrl);
    meta('property', 'og:image:alt', noindex || !imageUrl ? '' : imageAlt);
    meta('name', 'twitter:card', noindex || !imageUrl ? '' : type === 'product' ? 'summary_large_image' : 'summary');
    meta('name', 'twitter:title', noindex ? '' : pageTitle);
    meta('name', 'twitter:description', noindex ? '' : pageDescription);
    meta('name', 'twitter:image', noindex ? '' : imageUrl);

    setJsonLd('seo-jsonld-page', noindex ? null : jsonKey ? JSON.parse(jsonKey) : null);
  }, [title, description, path, image, imageAlt, type, noindex, jsonKey]);
};

export default useSeo;
