import React from 'react';
import PropuestaDetalle3 from './PropuestaDetalle3';
import './ProductDetail.css';

const ProductDetail = ({ producto, onClose }) => {
  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-container" onClick={(e) => e.stopPropagation()}>
        {/* Header simple con botón cerrar */}
        <div className="detail-header">
          <h2 className="detail-product-title">{producto.nombre}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Contenido - solo Vista Compacta */}
        <div className="detail-content">
          <PropuestaDetalle3 producto={producto} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;