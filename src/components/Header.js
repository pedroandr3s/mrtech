import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [seccionActiva, setSeccionActiva] = useState('nosotros'); // 'nosotros' o 'contacto'

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
        </div>
      </div>
    </header>
  );
};

export default Header;