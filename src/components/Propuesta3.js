import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { productos } from '../data/productos';
import './Propuesta3.css';

const Propuesta3 = () => {
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

  return (
    <div className="propuesta3">
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
            <ProductCard producto={producto} theme="propuesta3" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Propuesta3;
