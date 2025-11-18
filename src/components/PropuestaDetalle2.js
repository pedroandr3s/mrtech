import React, { useState } from 'react';
import './PropuestaDetalle2.css';

const PropuestaDetalle2 = ({ producto }) => {
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  return (
    <div className="propuesta-detalle-2">
      {/* Imagen grande centrada arriba */}
      <div className="centered-image-section">
        <div className="main-image-wrapper">
          <img 
            src={producto.imagenes[imagenActiva]} 
            alt={producto.nombre}
            className="centered-main-image"
          />
        </div>

        {/* Miniaturas debajo de la imagen */}
        <div className="thumbnails-row">
          {producto.imagenes.map((img, index) => (
            <div
              key={index}
              className={`thumbnail-item ${imagenActiva === index ? 'active' : ''}`}
              onClick={() => setImagenActiva(index)}
            >
              <img src={img} alt={`${producto.nombre} ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Información completa abajo */}
      <div className="info-section-bottom">
        <div className="info-grid">
          {/* Columna izquierda: Info principal */}
          <div className="info-main">
            <h1 className="centered-title">{producto.nombre}</h1>
            
            <div className="centered-price-section">
              <span className="centered-price">${producto.precio}</span>
              <span className="centered-badge">Stock disponible</span>
            </div>

            <div className="centered-description">
              <p>{producto.descripcion}</p>
            </div>

            <div className="centered-actions">
              <div className="quantity-section-centered">
                <label>Cantidad:</label>
                <div className="quantity-controls-centered">
                  <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
                  <input type="number" value={cantidad} readOnly />
                  <button onClick={() => setCantidad(cantidad + 1)}>+</button>
                </div>
              </div>

              <div className="action-buttons-centered">
                <button className="btn-cart-centered">Agregar al Carrito</button>
                <button className="btn-buy-centered">Comprar Ahora</button>
              </div>
            </div>
          </div>

          {/* Columna derecha: Especificaciones */}
          <div className="specs-column">
            <h3>Especificaciones Técnicas</h3>
            <div className="specs-grid">
              {Object.entries(producto.especificaciones).map(([key, value]) => (
                <div key={key} className="spec-card">
                  <div className="spec-icon">🔧</div>
                  <div className="spec-content">
                    <span className="spec-label">{key}</span>
                    <span className="spec-data">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropuestaDetalle2;