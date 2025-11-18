import React, { useState } from 'react';
import './PropuestaDetalle1.css';

const PropuestaDetalle1 = ({ producto }) => {
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  return (
    <div className="propuesta-detalle-1">
      {/* Columna izquierda: miniaturas */}
      <div className="thumbnails-column">
        {producto.imagenes.map((img, index) => (
          <div
            key={index}
            className={`thumbnail ${imagenActiva === index ? 'active' : ''}`}
            onClick={() => setImagenActiva(index)}
          >
            <img src={img} alt={`${producto.nombre} ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Centro: imagen grande */}
      <div className="main-image-container">
        <img 
          src={producto.imagenes[imagenActiva]} 
          alt={producto.nombre}
          className="main-image"
        />
        <div className="image-counter">
          {imagenActiva + 1} / {producto.imagenes.length}
        </div>
      </div>

      {/* Derecha: información */}
      <div className="product-info-detail">
        <h1 className="detail-title">{producto.nombre}</h1>
        
        <div className="detail-price-section">
          <span className="detail-price">${producto.precio}</span>
          <span className="detail-badge">Envío gratis</span>
        </div>

        <div className="detail-description">
          <p>{producto.descripcion}</p>
        </div>

        <div className="specifications-section">
          <h3>Especificaciones</h3>
          <div className="specs-list">
            {Object.entries(producto.especificaciones).map(([key, value]) => (
              <div key={key} className="spec-item">
                <span className="spec-key">{key}:</span>
                <span className="spec-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="quantity-section">
          <label>Cantidad:</label>
          <div className="quantity-controls">
            <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
            <input type="number" value={cantidad} readOnly />
            <button onClick={() => setCantidad(cantidad + 1)}>+</button>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-add-cart">Agregar al Carrito</button>
          <button className="btn-buy-now">Comprar Ahora</button>
        </div>
      </div>
    </div>
  );
};

export default PropuestaDetalle1;