import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductsContext';

const Catalog = () => {
  const { publicados: productos, loading, storageError } = useProducts();

  return (
    <>
      <section className="wrap cat-head">
        <h1>Catálogo</h1>
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
