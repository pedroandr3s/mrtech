import React from 'react';
import './Header.css';

const Header = ({ propuestaActiva, setPropuestaActiva }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img 
            src="https://via.placeholder.com/50/00ff00/000000?text=MR" 
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
          <a href="#nosotros" className="header-link">Nosotros</a>
          <a href="#contacto" className="header-link contact-btn">Contáctame</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
