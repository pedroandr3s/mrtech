import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productos } from '../data/productos';
import PropuestaDetalle3 from './PropuestaDetalle3';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
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
      {/* Contenido del producto con botón volver integrado */}
      <div className="product-page-content">
        <button className="back-btn-corner" onClick={() => navigate('/')}>
          Volver
        </button>
        <PropuestaDetalle3 producto={producto} />
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