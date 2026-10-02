import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext();
const STORAGE_KEY = 'mrtech-cart';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Sin almacenamiento disponible: el carrito sigue funcionando en memoria.
    }
  }, [cartItems]);

  const addToCart = useCallback((producto, cantidad) => {
    // Se guarda solo lo que el carrito necesita (no videos ni galerías pesadas).
    const { id, nombre, precio, imagen } = producto;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      }
      return [...prevItems, { id, nombre, precio, imagen, cantidad }];
    });
  }, []);

  const removeFromCart = useCallback((productoId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productoId));
  }, []);

  const updateQuantity = useCallback(
    (productoId, cantidad) => {
      if (cantidad <= 0) {
        removeFromCart(productoId);
        return;
      }
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === productoId ? { ...item, cantidad } : item))
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setCartItems([]), []);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems: () => cartItems.reduce((total, item) => total + item.cantidad, 0),
      isCartOpen,
      setIsCartOpen,
    }),
    [cartItems, isCartOpen, addToCart, removeFromCart, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
