import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productos } from '../data/productos';
import PropuestaDetalle1 from './PropuestaDetalle1';
import PropuestaDetalle2 from './PropuestaDetalle2';
import PropuestaDetalle3 from './PropuestaDetalle3';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [propuestaActiva, setPropuestaActiva] = useState(1);
  
  const producto = productos.find(p => p.id === parseInt(id));

  if (!producto) {
    return (
      <div className="product-page-error">
        <h1>Producto no encontrado</h1>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="product-page">
      {/* Breadcrumb y navegación */}
      <div className="product-page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Volver a productos
        </button>

        <div className="product-nav-tabs">
          <button
            className={`tab-btn ${propuestaActiva === 1 ? 'active' : ''}`}
            onClick={() => setPropuestaActiva(1)}
          >
            Vista Clásica
          </button>
          <button
            className={`tab-btn ${propuestaActiva === 2 ? 'active' : ''}`}
            onClick={() => setPropuestaActiva(2)}
          >
            Vista Centrada
          </button>
          <button
            className={`tab-btn ${propuestaActiva === 3 ? 'active' : ''}`}
            onClick={() => setPropuestaActiva(3)}
          >
            Vista Compacta
          </button>
        </div>
      </div>

      {/* Contenido del producto */}
      <div className="product-page-content">
        {propuestaActiva === 1 && <PropuestaDetalle1 producto={producto} />}
        {propuestaActiva === 2 && <PropuestaDetalle2 producto={producto} />}
        {propuestaActiva === 3 && <PropuestaDetalle3 producto={producto} />}
      </div>

      {/* Sección adicional: Productos relacionados */}
      <div className="related-products">
        <h2>Productos Relacionados</h2>
        <div className="related-grid">
          {productos
            .filter(p => p.id !== producto.id)
            .slice(0, 3)
            .map(prod => (
              <div 
                key={prod.id} 
                className="related-card"
                onClick={() => navigate(`/producto/${prod.id}`)}
              >
                <img src={prod.imagen} alt={prod.nombre} />
                <h3>{prod.nombre}</h3>
                <p className="related-price">${prod.precio}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default ProductPage;