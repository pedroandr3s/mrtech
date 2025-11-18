import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import QuoteForm from './QuoteForm';
import './CartModal.css';

const CartModal = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showForm, setShowForm] = useState(false);

  if (!isCartOpen) return null;

  const handleContinue = () => {
    if (cartItems.length === 0) {
      alert('Agrega productos al carrito para cotizar');
      return;
    }
    setShowForm(true);
  };

  return (
    <div className="cart-modal-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-modal-container" onClick={(e) => e.stopPropagation()}>
        {!showForm ? (
          <>
            <div className="cart-header">
              <h2>🛒 Carrito de Cotización</h2>
              <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>

            <div className="cart-content">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>No hay productos en el carrito</p>
                  <button onClick={() => setIsCartOpen(false)} className="continue-shopping">
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map(item => (
                      <div key={item.id} className="cart-item">
                        <img src={item.imagen} alt={item.nombre} className="cart-item-image" />
                        <div className="cart-item-info">
                          <h3>{item.nombre}</h3>
                          <p className="cart-item-price">${item.precio}</p>
                        </div>
                        <div className="cart-item-quantity">
                          <button onClick={() => updateQuantity(item.id, item.cantidad - 1)}>−</button>
                          <span>{item.cantidad}</span>
                          <button onClick={() => updateQuantity(item.id, item.cantidad + 1)}>+</button>
                        </div>
                        <button 
                          className="remove-item-btn"
                          onClick={() => removeFromCart(item.id)}
                          title="Eliminar producto"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="cart-footer">
                    <button className="clear-cart-btn" onClick={clearCart}>
                      Limpiar Carrito
                    </button>
                    <button className="quote-btn" onClick={handleContinue}>
                      Continuar con Cotización →
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <QuoteForm 
            cartItems={cartItems} 
            onBack={() => setShowForm(false)}
            onClose={() => {
              setIsCartOpen(false);
              setShowForm(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CartModal;