import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CarouselCard from './CarouselCard';
import { productos } from '../data/productos';
import './Propuesta2.css';

const Propuesta2 = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % productos.length);
    }, 10000); // Cambia cada 10 segundos

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: {
      x: 1000,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: {
      x: -1000,
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="propuesta2">
      <div className="cyber-grid"></div>
      
        <div className="carousel-container-p2">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="carousel-slide"
          >
            <CarouselCard producto={productos[currentIndex]} />
          </motion.div>
        </AnimatePresence>

        {/* Indicadores de posición */}
        <div className="carousel-indicators">
          {productos.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              <span className="indicator-number">{index + 1}</span>
            </button>
          ))}
        </div>

        {/* Botones de navegación */}
        <button 
          className="carousel-nav prev"
          onClick={() => setCurrentIndex((currentIndex - 1 + productos.length) % productos.length)}
        >
          ‹
        </button>
        <button 
          className="carousel-nav next"
          onClick={() => setCurrentIndex((currentIndex + 1) % productos.length)}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Propuesta2;