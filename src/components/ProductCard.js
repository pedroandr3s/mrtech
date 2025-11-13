import React, { useState, useRef } from 'react';
import './ProductCard.css';

const ProductCard = ({ producto, theme = 'default' }) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className={`product-card ${theme}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="product-media">
        <img 
          src={producto.imagen} 
          alt={producto.nombre}
          className={`product-image ${isHovering ? 'hidden' : ''}`}
        />
        <video
          ref={videoRef}
          src={producto.video}
          className={`product-video ${isHovering ? 'visible' : ''}`}
          loop
          muted
          playsInline
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{producto.nombre}</h3>
        <p className="product-description">{producto.descripcion}</p>
        <div className="product-footer">
          <span className="product-price">${producto.precio}</span>
          <button className="product-btn">Ver más</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
