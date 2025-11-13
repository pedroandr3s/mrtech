import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { productos } from '../data/productos';
import './Propuesta2.css';

const Propuesta2 = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="propuesta2">
      <div className="cyber-grid"></div>
      
      <div className="hero-section-p2">
        <motion.div 
          className="hero-content-p2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <span className="hero-badge">NUEVA ERA</span>
          <h1 className="hero-title-p2">
            <span className="glitch" data-text="ROBOTS">ROBOTS</span>
            <span className="sub-text">DEL MAÑANA</span>
          </h1>
          <p className="hero-subtitle-p2">Innovación que transforma el futuro</p>
        </motion.div>
      </div>

      <motion.div 
        className="products-container-p2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {productos.map((producto) => (
          <motion.div key={producto.id} variants={itemVariants}>
            <ProductCard producto={producto} theme="propuesta2" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Propuesta2;
