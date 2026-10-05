import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import Catalog from './components/Catalog';
import ProductPage from './components/ProductPage';
import CartModal from './components/CartModal';
import Admin from './components/admin/Admin';
import ProductForm from './components/admin/ProductForm';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import useSeo from './seo/Seo';

const NotFound = () => {
  useSeo({ title: 'Página no encontrada | MR TECH', noindex: true });
  return (
    <div className="page-status">
      <h1>Página no encontrada</h1>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <div className="App">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Catalog />} />
                  <Route path="/producto/:id" element={<ProductPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                  <Route path="/admin/nuevo" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
                  <Route path="/admin/editar/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <footer className="site-footer">
                <div className="wrap foot-in">
                  <img src="/mrtechLogo.png" alt="MR TECH" />
                  <span>© {new Date().getFullYear()} MR TECH. Precios referenciales en USD.</span>
                </div>
              </footer>
              <CartModal />
            </div>
          </Router>
        </CartProvider>
      </ProductsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
