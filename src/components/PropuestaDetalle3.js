import React, { useState } from 'react';
import './PropuestaDetalle3.css';

const PropuestaDetalle3 = ({ producto }) => {
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  const nextImage = () => {
    setImagenActiva((prev) => (prev + 1) % producto.imagenes.length);
  };

  const prevImage = () => {
    setImagenActiva((prev) => 
      prev === 0 ? producto.imagenes.length - 1 : prev - 1
    );
  };

  return (
    <div className="propuesta-detalle-3">
      <div className="compact-container">
        {/* Sección izquierda: Imagen con controles */}
        <div className="compact-image-section">
          <div className="compact-image-wrapper">
            <button className="nav-arrow left" onClick={prevImage}>‹</button>
            <img 
              src={producto.imagenes[imagenActiva]} 
              alt={producto.nombre}
              className="compact-image"
            />
            <button className="nav-arrow right" onClick={nextImage}>›</button>
            
            <div className="compact-image-indicator">
              {producto.imagenes.map((_, index) => (
                <span 
                  key={index}
                  className={`indicator-dot ${imagenActiva === index ? 'active' : ''}`}
                  onClick={() => setImagenActiva(index)}
                />
              ))}
            </div>
          </div>

          {/* Galería de miniaturas horizontal */}
          <div className="compact-thumbnails">
            {producto.imagenes.map((img, index) => (
              <div
                key={index}
                className={`compact-thumb ${imagenActiva === index ? 'active' : ''}`}
                onClick={() => setImagenActiva(index)}
              >
                <img src={img} alt={`Vista ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Sección derecha: Info compacta en dos columnas */}
        <div className="compact-info-section">
          <div className="compact-header">
            <h2 className="compact-title">{producto.nombre}</h2>
            <div className="compact-price-box">
              <span className="compact-price">${producto.precio}</span>
              <span className="compact-stock">✓ En stock</span>
            </div>
          </div>

          <div className="compact-description">
            {producto.descripcion}
          </div>

          {/* Grid de especificaciones compacto */}
          <div className="compact-specs">
            <h4>Especificaciones</h4>
            <div className="specs-compact-grid">
              {Object.entries(producto.especificaciones).map(([key, value]) => (
                <div key={key} className="compact-spec-item">
                  <span className="compact-spec-key">{key}</span>
                  <span className="compact-spec-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones compactas */}
          <div className="compact-actions">
            <div className="compact-quantity">
              <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</button>
              <span>{cantidad}</span>
              <button onClick={() => setCantidad(cantidad + 1)}>+</button>
            </div>
            
            <button className="compact-btn-cart">
              🛒 Agregar
            </button>
            
            <button className="compact-btn-buy">
              Comprar
            </button>
          </div>

          {/* Badges informativos */}
          <div className="compact-badges">
            <span className="info-badge">🚚 Envío gratis</span>
            <span className="info-badge">↩️ 30 días devolución</span>
            <span className="info-badge">🛡️ Garantía oficial</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropuestaDetalle3;