import React, { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { useAuth } from '../../context/AuthContext';
import useSeo from '../../seo/Seo';
import { useToast } from '../../context/ToastContext';
import { formatPrecio } from '../../utils/format';
import './Admin.css';

const Admin = () => {
  useSeo({ title: 'Administración | MR TECH', noindex: true });
  const navigate = useNavigate();
  const showToast = useToast();
  const {
    productos,
    loading,
    storageError,
    deleteProducto,
    togglePublicado,
    resetProductos,
    replaceProductos,
    readOnly,
  } = useProducts();
  const { signOut } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const importRef = useRef(null);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter(
      (p) => p.nombre.toLowerCase().includes(q) || String(p.id) === q
    );
  }, [productos, busqueda]);

  // Ejecuta una acción de escritura mostrando el resultado.
  const run = async (action, okMessage) => {
    try {
      await action();
      showToast(okMessage);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = (producto) => {
    if (window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) {
      run(() => deleteProducto(producto.id), 'Publicación eliminada');
    }
  };

  const handleReset = () => {
    if (window.confirm('Se reemplazará todo el catálogo por los productos originales. ¿Continuar?')) {
      run(resetProductos, 'Catálogo restaurado');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(productos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'catalogo-mrtech.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data) || data.some((p) => !p || typeof p.nombre !== 'string')) {
        throw new Error('formato');
      }
      if (window.confirm(`Se reemplazará el catálogo actual por ${data.length} publicaciones. ¿Continuar?`)) {
        run(() => replaceProductos(data), 'Catálogo importado');
      }
    } catch {
      showToast('El archivo no es un catálogo válido', 'error');
    }
  };

  const publicados = productos.filter((p) => p.publicado).length;

  return (
    <div className="admin">
      <div className="admin-container">
        <div className="admin-head">
          <div>
            <h1>Mantenedor de publicaciones</h1>
            <p className="admin-sub">
              {productos.length} publicaciones · {publicados} visibles en el catálogo
            </p>
          </div>
          <div className="admin-head-actions">
            <button className="admin-btn" onClick={handleLogout}>Cerrar sesión</button>
            <Link to="/admin/nuevo" className="admin-btn primary">
              + Nueva publicación
            </Link>
          </div>
        </div>

        {storageError && <div className="admin-alert">{storageError}</div>}

        <div className="admin-toolbar">
          <input
            type="search"
            className="admin-search"
            placeholder="Buscar por nombre o ID…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar publicaciones"
          />
          <div className="admin-toolbar-actions">
            <button className="admin-btn" onClick={handleExport}>Exportar</button>
            <button className="admin-btn" onClick={() => importRef.current?.click()}>Importar</button>
            <button className="admin-btn danger-outline" onClick={handleReset}>Restaurar originales</button>
            <input
              ref={importRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={handleImport}
            />
          </div>
        </div>

        {loading ? (
          <div className="admin-empty">Cargando…</div>
        ) : filtrados.length === 0 ? (
          <div className="admin-empty">
            {productos.length === 0 ? (
              <>
                <p>No hay publicaciones todavía.</p>
                {!readOnly && (
                  <button className="admin-btn primary" onClick={handleReset}>
                    Cargar catálogo inicial
                  </button>
                )}
              </>
            ) : (
              'Ninguna publicación coincide con la búsqueda.'
            )}
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th className="col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.imagen ? (
                        <img className="admin-thumb" src={p.imagen} alt="" />
                      ) : (
                        <div className="admin-thumb empty">—</div>
                      )}
                    </td>
                    <td className="col-name">
                      <strong>{p.nombre}</strong>
                      <span className="admin-id">ID {p.id}</span>
                    </td>
                    <td>${formatPrecio(p.precio)}</td>
                    <td>
                      <button
                        className={`status-pill ${p.publicado ? 'on' : 'off'}`}
                        onClick={() => run(() => togglePublicado(p.id), p.publicado ? 'Publicación oculta' : 'Publicación visible')}
                        title={p.publicado ? 'Clic para ocultar' : 'Clic para publicar'}
                      >
                        {p.publicado ? 'Publicado' : 'Borrador'}
                      </button>
                    </td>
                    <td className="col-actions">
                      <button className="admin-btn small" onClick={() => navigate(`/producto/${p.id}`)}>Ver</button>
                      <button className="admin-btn small" onClick={() => navigate(`/admin/editar/${p.id}`)}>Editar</button>
                      <button className="admin-btn small danger" onClick={() => handleDelete(p)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
