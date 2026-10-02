import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';

const ProductPage = () => {
  const { id } = useParams();
  const { getById, publicados, loading } = useProducts();

  const producto = getById(id);

  if (loading) {
    return <div className="page-status">Cargando…</div>;
  }

  if (!producto) {
    return (
      <div className="page-status">
        <h1>Producto no encontrado</h1>
        <Link to="/">Volver al catálogo</Link>
      </div>
    );
  }

  const relacionados = publicados.filter((p) => p.id !== producto.id).slice(0, 3);

  return (
    <div className="wrap">
      <Link className="crumb" to="/">
        ← Volver al catálogo
      </Link>
      {!producto.publicado && (
        <div className="draft-banner">Borrador: esta publicación no es visible en el catálogo.</div>
      )}
      <ProductDetail key={producto.id} producto={producto} />
      {relacionados.length > 0 && (
        <section className="related">
          <h2>Productos relacionados</h2>
          <div className="grid">
            {relacionados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
