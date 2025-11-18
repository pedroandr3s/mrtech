import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (producto, cantidad) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === producto.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      
      return [...prevItems, { ...producto, cantidad }];
    });
  };

  const removeFromCart = (productoId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productoId));
  };

  const updateQuantity = (productoId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(productoId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productoId ? { ...item, cantidad } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    isCartOpen,
    setIsCartOpen
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};