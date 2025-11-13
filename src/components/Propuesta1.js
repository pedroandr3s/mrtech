import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { productos } from '../data/productos';
import './Propuesta1.css';

const Propuesta1 = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="propuesta1">
      <div className="hero-section-p1">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">Tecnología Robótica del Futuro</h1>
          <p className="hero-subtitle">Descubre nuestra colección de robots innovadores</p>
        </motion.div>
      </div>

      <motion.div 
        className="products-container-p1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {productos.map((producto) => (
          <motion.div key={producto.id} variants={itemVariants}>
            <ProductCard producto={producto} theme="propuesta1" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Propuesta1;
