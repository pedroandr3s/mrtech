import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrecio } from '../utils/format';

export const StockLabel = ({ producto }) => {
  const stock = producto.stock || 'En stock';
  return <span className={`stock${stock === 'En stock' ? '' : ' low'}`}>{stock}</span>;
};

const ProductCard = ({ producto, priority = false }) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef(null);

  // Al desmontar, detiene el video (se copia el nodo para la limpieza).
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) video.pause();
    };
  }, []);

  const handleEnter = () => {
    setIsHovering(true);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // La reproducción puede interrumpirse al salir el cursor; se ignora.
        });
      }
    }
  };

  const handleLeave = () => {
    setIsHovering(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <Link
      className="card cut"
      to={`/producto/${producto.id}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      <div className="card-media">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            loading={priority ? undefined : 'lazy'}
            decoding="async"
            className={isHovering && producto.video ? 'hidden' : ''}
          />
        ) : (
          <div className="no-image">Sin imagen</div>
        )}
        {producto.video && (
          <video
            ref={videoRef}
            src={producto.video}
            className={isHovering ? 'visible' : ''}
            loop
            muted
            playsInline
            preload="metadata"
          />
        )}
      </div>
      <div className="card-body">
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
        <div className="card-foot">
          <span className="price">${formatPrecio(producto.precio)}</span>
          <StockLabel producto={producto} />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
