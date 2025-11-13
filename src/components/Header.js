import React, { useState } from 'react';
import './Header.css';

const Header = ({ propuestaActiva, setPropuestaActiva }) => {
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
          <span className="logo-text">MrTech</span>
        </div>

        <nav className="nav-propuestas">
          <button
            className={`nav-btn ${propuestaActiva === 1 ? 'active' : ''}`}
            onClick={() => setPropuestaActiva(1)}
          >
            Propuesta 1
          </button>
          <button
            className={`nav-btn ${propuestaActiva === 2 ? 'active' : ''}`}
            onClick={() => setPropuestaActiva(2)}
          >
            Propuesta 2
          </button>
          <button
            className={`nav-btn ${propuestaActiva === 3 ? 'active' : ''}`}
            onClick={() => setPropuestaActiva(3)}
          >
            Propuesta 3
          </button>
        </nav>

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