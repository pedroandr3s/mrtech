import React, { useState } from 'react';
import PropuestaDetalle1 from './PropuestaDetalle1';
import PropuestaDetalle2 from './PropuestaDetalle2';
import PropuestaDetalle3 from './PropuestaDetalle3';
import './ProductDetail.css';

const ProductDetail = ({ producto, onClose }) => {
  const [propuestaActiva, setPropuestaActiva] = useState(1);

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-container" onClick={(e) => e.stopPropagation()}>
        {/* Header con navegación */}
        <div className="detail-header">
          <button className="close-btn" onClick={onClose}>✕</button>
          
          <div className="detail-nav">
            <button
              className={`detail-nav-btn ${propuestaActiva === 1 ? 'active' : ''}`}
              onClick={() => setPropuestaActiva(1)}
            >
              Vista Clásica
            </button>
            <button
              className={`detail-nav-btn ${propuestaActiva === 2 ? 'active' : ''}`}
              onClick={() => setPropuestaActiva(2)}
            >
              Vista Centrada
            </button>
            <button
              className={`detail-nav-btn ${propuestaActiva === 3 ? 'active' : ''}`}
              onClick={() => setPropuestaActiva(3)}
            >
              Vista Compacta
            </button>
          </div>
        </div>

        {/* Contenido según propuesta activa */}
        <div className="detail-content">
          {propuestaActiva === 1 && <PropuestaDetalle1 producto={producto} />}
          {propuestaActiva === 2 && <PropuestaDetalle2 producto={producto} />}
          {propuestaActiva === 3 && <PropuestaDetalle3 producto={producto} />}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;