import React, { useState, useRef } from 'react';
import './ProductCard.css';

const ProductCard = ({ producto, theme = 'default', onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef(null);
  const isMountedRef = useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current && isMountedRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (isMountedRef.current) {
            console.log('Error al reproducir video:', error);
          }
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current && isMountedRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(producto);
    }
  };

  return (
    <div 
      className={`product-card ${theme}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
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
          preload="metadata"
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{producto.nombre}</h3>
        <p className="product-description">{producto.descripcion}</p>
        <div className="product-footer">
          <span className="product-price">${producto.precio}</span>
          <button className="product-btn" onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}>Ver más</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;