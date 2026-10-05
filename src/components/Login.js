import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useSeo from '../seo/Seo';
import './admin/Admin.css';

const Login = () => {
  const { isAdmin, authLoading, signIn } = useAuth();
  const location = useLocation();
  useSeo({ title: 'Acceso administrador | MR TECH', noindex: true });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  if (authLoading) return <div className="page-status">Cargando…</div>;
  if (isAdmin) return <Navigate to={location.state?.from || '/admin'} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      if (err.message === 'Supabase no está configurado') {
        setError('El sitio no está conectado a Supabase: faltan las variables de entorno en el despliegue.');
      } else if (err.code === 'invalid_credentials' || err.status === 400) {
        setError('Correo o contraseña incorrectos');
      } else {
        setError(`No se pudo iniciar sesión (${err.message}). Revisa tu conexión e inténtalo de nuevo.`);
      }
    }
    setSending(false);
  };

  return (
    <div className="admin">
      <form className="admin-card login-card" onSubmit={handleSubmit}>
        <h1>Acceso administrador</h1>
        <div className="field">
          <label htmlFor="l-email">Correo</label>
          <input
            id="l-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="l-pass">Contraseña</label>
          <input
            id="l-pass"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <span className="field-error">{error}</span>}
        <button type="submit" className="admin-btn primary" disabled={sending}>
          {sending ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
