import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import TransparentVideo from './TransparentVideo';
import { useProducts } from '../context/ProductsContext';

const Hero = () => (
  <section className="wrap hero">
    <div className="hero-text">
      <span className="hero-eyebrow">Machinery Robotic Technologies</span>
      <h1>Robótica y maquinaria para operaciones exigentes</h1>
      <p>
        En MR TECH reunimos robots y equipos de última generación para logística, seguridad y rescate.
        Soluciones pensadas para trabajar donde la precisión, la resistencia y la seguridad de las
        personas marcan la diferencia.
      </p>
      <ul className="hero-tags">
        <li>Logística industrial</li>
        <li>Seguridad y emergencias</li>
        <li>Rescate acuático</li>
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

  return (
    <>
      <Hero />
      <section className="wrap cat-head" id="catalogo">
        <h2>Catálogo</h2>
        <p>Maquinaria y robótica para logística, seguridad y rescate.</p>
      </section>
      <section className="wrap grid">
        {!loading && productos.length === 0 ? (
          <div className="empty">
            <p>{storageError || 'Aún no hay productos publicados.'}</p>
            {!storageError && <Link className="link-btn" to="/admin/nuevo">Crear la primera publicación</Link>}
          </div>
        ) : (
          productos.map((producto) => <ProductCard key={producto.id} producto={producto} />)
        )}
      </section>
    </>
  );
};

export default Catalog;
