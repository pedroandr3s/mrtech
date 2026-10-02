import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const WHATSAPP_URL = 'https://wa.me/56927294017';

const Header = () => {
  const { getTotalItems, setIsCartOpen } = useCart();
  const { isAdmin } = useAuth();
  const totalItems = getTotalItems();

  return (
    <header className="site-header">
      <div className="wrap header-in">
        <Link className="brand" to="/" aria-label="MR TECH, ir al catálogo">
          <img src="/mrtechLogo.png" alt="MR TECH - Machinery Robotic Technologies" />
        </Link>
        <nav className="nav" aria-label="Principal">
          <NavLink className="navlink" to="/" end>
            Catálogo
          </NavLink>
          {isAdmin && (
            <NavLink className="navlink" to="/admin">
              Administrar
            </NavLink>
          )}
          <a className="navlink" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            Contáctame
          </a>
          <button className="btn btn-primary cut-s" type="button" onClick={() => setIsCartOpen(true)}>
            Cotizar {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </button>
        </nav>
      </div>
      <div className="header-line" aria-hidden="true" />
    </header>
  );
};

export default Header;
