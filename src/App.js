import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Propuesta3 from './components/Propuesta3';
import ProductPage from './components/ProductPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Propuesta3 />} />
          <Route path="/producto/:id" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;