import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrecio, parsePrecio } from '../utils/format';
import QuoteForm from './QuoteForm';

const CartModal = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();

  useEffect(() => {
    if (!isCartOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setIsCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const close = () => setIsCartOpen(false);
  const total = cartItems.reduce((sum, it) => sum + parsePrecio(it.precio) * it.cantidad, 0);

  return (
    <div className="overlay" onClick={close}>
      <div
        className="dialog cut"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dlg-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dlg-in">
          <div className="dlg-top">
            <h2 id="dlg-title">Tu cotización</h2>
            <button className="x" type="button" aria-label="Cerrar" onClick={close}>
              ×
            </button>
          </div>

          {cartItems.length === 0 ? (
            <>
              <p className="lead">
                Todavía no agregaste productos. Elige uno en el catálogo y usa Agregar o Cotizar.
              </p>
              <div className="f">
                <button className="btn btn-primary cut-s" type="button" onClick={close}>
                  Ver catálogo
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="lead">Revisa los productos y déjanos tus datos para enviarte la cotización.</p>
              <ul className="qitems">
                {cartItems.map((it) => (
                  <li key={it.id} className="qitem">
                    <div>
                      <b>{it.nombre}</b>
                      <small>${formatPrecio(it.precio)} c/u</small>
                    </div>
                    <div className="qctl">
                      <button type="button" aria-label="Quitar uno" onClick={() => updateQuantity(it.id, it.cantidad - 1)}>
                        −
                      </button>
                      <span>{it.cantidad}</span>
                      <button type="button" aria-label="Agregar uno" onClick={() => updateQuantity(it.id, it.cantidad + 1)}>
                        +
                      </button>
                      <button className="rm" type="button" onClick={() => removeFromCart(it.id)}>
                        Quitar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="qtotal">
                <span>Total referencial</span>
                <span>${formatPrecio(total)}</span>
              </div>
              <QuoteForm cartItems={cartItems} total={total} onSent={close} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
