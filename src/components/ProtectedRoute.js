import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Solo deja pasar a quien tiene sesión; el resto va al login.
const ProtectedRoute = ({ children }) => {
  const { isAdmin, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <div className="page-status">Cargando…</div>;
  if (!isAdmin) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
};

export default ProtectedRoute;
