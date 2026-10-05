import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import TransparentVideo from './TransparentVideo';
import { useProducts } from '../context/ProductsContext';
import useSeo, { getSiteOrigin } from '../seo/Seo';
import { homeGraph, homeMeta } from '../seo/schema.mjs';
import {
  CATALOG_TEXT,
  CATALOG_TITLE,
  HERO_EYEBROW,
  HERO_TAGS,
  HERO_TEXT,
  HERO_TITLE,
} from '../seo/content.mjs';

const Hero = () => (
  <section className="wrap hero">
    <div className="hero-text">
      <span className="hero-eyebrow">{HERO_EYEBROW}</span>
      <h1>{HERO_TITLE}</h1>
      <p>{HERO_TEXT}</p>
      <ul className="hero-tags">
        {HERO_TAGS.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
    <TransparentVideo
      className="hero-media"
      src="/robothero.mp4"
      label="Robot cuadrúpedo de MR TECH en movimiento"
    />
  </section>
);

const Catalog = () => {
  const { publicados: productos, loading, storageError } = useProducts();

  const jsonLd = useMemo(
    () => homeGraph(getSiteOrigin(), productos),
    [productos]
  );
  useSeo({ ...homeMeta(), jsonLd });

  return (
    <>
      <Hero />
      <section className="wrap cat-head" id="catalogo">
        <h2>{CATALOG_TITLE}</h2>
        <p>{CATALOG_TEXT}</p>
      </section>
      <section className="wrap grid">
        {!loading && productos.length === 0 ? (
          <div className="empty">
            <p>{storageError || 'Aún no hay productos publicados.'}</p>
            {!storageError && <Link className="link-btn" to="/admin/nuevo">Crear la primera publicación</Link>}
          </div>
        ) : (
          productos.map((producto, i) => (
            <ProductCard key={producto.id} producto={producto} priority={i < 4} />
          ))
        )}
      </section>
    </>
  );
};

export default Catalog;
