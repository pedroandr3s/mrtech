import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Propuesta3 from './components/Propuesta3';
import ProductPage from './components/ProductPage';
import CartModal from './components/CartModal';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Propuesta3 />} />
            <Route path="/producto/:id" element={<ProductPage />} />
          </Routes>
          <CartModal />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;