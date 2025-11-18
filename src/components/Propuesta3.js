import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import { productos } from '../data/productos';
import './Propuesta3.css';

const Propuesta3 = () => {
  const navigate = useNavigate();
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const handleProductClick = (producto) => {
    // Si es el producto 3, ir a página completa
    if (producto.id === 3) {
      navigate(`/producto/${producto.id}`);
    } else {
      // Para otros productos, abrir modal
      setProductoSeleccionado(producto);
    }
  };

  const handleCloseDetail = () => {
    setProductoSeleccionado(null);
  };

  return (
    <div className="propuesta3">
      {/* Fondo tecnológico animado */}
      <div className="tech-background">
        {/* Grid de fondo */}
        <div className="tech-grid"></div>
        
        {/* Líneas de circuito */}
        <div className="circuit-line"></div>
        <div className="circuit-line"></div>
        <div className="circuit-line"></div>
        <div className="circuit-line"></div>
        <div className="circuit-line"></div>
        
        {/* Puntos tecnológicos */}
        <div className="tech-dots">
          <div className="tech-dot"></div>
          <div className="tech-dot"></div>
          <div className="tech-dot"></div>
          <div className="tech-dot"></div>
          <div className="tech-dot"></div>
          <div className="tech-dot"></div>
        </div>
        
        {/* Hexágonos flotantes */}
        <div className="hexagon">
          <svg viewBox="0 0 100 100">
            <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
          </svg>
        </div>
        <div className="hexagon">
          <svg viewBox="0 0 100 100">
            <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
          </svg>
        </div>
        <div className="hexagon">
          <svg viewBox="0 0 100 100">
            <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
          </svg>
        </div>
        <div className="hexagon">
          <svg viewBox="0 0 100 100">
            <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
          </svg>
        </div>
        
        {/* Ondas de datos */}
        <div className="data-wave"></div>
        <div className="data-wave"></div>
        <div className="data-wave"></div>
      </div>

      <div className="hero-section-p3">
        <motion.div 
          className="hero-content-p3"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="hero-label">Premium Collection</div>
          <h1 className="hero-title-p3">
            Robótica
            <span className="accent-text">Inteligente</span>
          </h1>
          <p className="hero-subtitle-p3">
            Diseño elegante, tecnología avanzada.<br/>
            La perfecta combinación de forma y función.
          </p>
          <button className="cta-button">Explorar Catálogo</button>
        </motion.div>
        
        <motion.div 
          className="hero-decoration"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="circle-decoration"></div>
        </motion.div>
      </div>

      <motion.div 
        className="products-container-p3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {productos.map((producto) => (
          <motion.div key={producto.id} variants={itemVariants}>
            <ProductCard 
              producto={producto} 
              theme="propuesta3"
              onClick={handleProductClick}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Modal de detalle del producto (solo para productos que no sean el 3) */}
      {productoSeleccionado && (
        <ProductDetail 
          producto={productoSeleccionado} 
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default Propuesta3;