import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const [seccionActiva, setSeccionActiva] = useState('nosotros');
  const { getTotalItems, setIsCartOpen } = useCart();
  const totalItems = getTotalItems();

  const handleSeccionClick = (seccion) => {
    setSeccionActiva(seccion);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img 
            src="https://via.placeholder.com/50/ffd700/000000?text=MR" 
            alt="MrTech Logo" 
          />
          <div className="logo-text-container">
            <span className="logo-text">MR Tech</span>
            <span className="logo-subtitle">Machinery Robotic Technologies</span>
          </div>
        </div>

        <div className="header-right">
          <div className="switch-container">
            <div 
              className={`switch-slider ${seccionActiva === 'contacto' ? 'right' : 'left'}`}
            ></div>
            <button
              className={`switch-btn ${seccionActiva === 'nosotros' ? 'active' : ''}`}
              onClick={() => handleSeccionClick('nosotros')}
            >
              Nosotros
            </button>
            <button
              className={`switch-btn ${seccionActiva === 'contacto' ? 'active' : ''}`}
              onClick={() => handleSeccionClick('contacto')}
            >
              Contáctame
            </button>
          </div>

          <button 
            className="cart-button"
            onClick={() => setIsCartOpen(true)}
          >
            <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 2L7 6H21L19 2H9Z"/>
              <path d="M7 6L5 20H19L17 6"/>
              <circle cx="9" cy="21" r="1"/>
              <circle cx="17" cy="21" r="1"/>
            </svg>
            <span>Cotizar</span>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;