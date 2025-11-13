import React, { useState, useEffect, useRef } from 'react';
import './CarouselCard.css';

const CarouselCard = ({ producto }) => {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Mostrar imagen por 2 segundos
    setShowVideo(false);
    
    timerRef.current = setTimeout(() => {
      // Cambiar a video después de 2 segundos
      setShowVideo(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }, 2000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [producto]);

  return (
    <div className="carousel-card">
      <div className="carousel-media">
        <img 
          src={producto.imagen} 
          alt={producto.nombre}
          className={`carousel-image ${showVideo ? 'hidden' : ''}`}
        />
        <video
          ref={videoRef}
          src={producto.video}
          className={`carousel-video ${showVideo ? 'visible' : ''}`}
          loop
          muted
          playsInline
        />
      </div>
      
      <div className="carousel-info">
        <h2 className="carousel-name">{producto.nombre}</h2>
        <p className="carousel-description">{producto.descripcion}</p>
        <div className="carousel-footer">
          <span className="carousel-price">${producto.precio}</span>
          <button className="carousel-btn-gold">Ver más</button>
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;