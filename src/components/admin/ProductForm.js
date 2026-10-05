import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { useToast } from '../../context/ToastContext';
import useSeo from '../../seo/Seo';
import { uploadImage, uploadVideo } from '../../utils/media';
import { formatPrecio, parsePrecio } from '../../utils/format';
import { ListEditor, SpecsEditor } from './Editors';
import './Admin.css';

const LISTAS = [
  ['caracteristicas', 'Características', 'Ej. Control remoto de largo alcance'],
  ['funciones', 'Funciones', 'Ej. Cámara PTZ de 360°'],
  ['aplicaciones', 'Aplicaciones', 'Ej. Rescate marítimo'],
  ['ventajas', 'Ventajas', 'Ej. Diseño plegable'],
  ['mantenimiento', 'Mantenimiento', 'Ej. Revisar la batería cada mes'],
];

const toFormState = (p) => ({
  nombre: p?.nombre || '',
  descripcion: p?.descripcion || '',
  precio: p ? String(parsePrecio(p.precio) || '') : '',
  stock: p?.stock || 'En stock',
  imagenes: p?.imagenes ? [...p.imagenes] : [],
  video: p?.video || '',
  publicado: p ? p.publicado : true,
  especificaciones: Object.entries(p?.especificaciones || {}).map(([key, value]) => ({ key, value })),
  ...Object.fromEntries(LISTAS.map(([k]) => [k, p?.[k] ? [...p[k]] : []])),
});

const Formulario = ({ producto }) => {
  const navigate = useNavigate();
  const showToast = useToast();
  const { addProducto, updateProducto } = useProducts();
  const editando = Boolean(producto);

  const [form, setForm] = useState(() => toFormState(producto));
  const [errors, setErrors] = useState({});
  const [urlImagen, setUrlImagen] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = '';
    if (!files.length) return;
    setSubiendo(true);
    const nuevas = [];
    for (const file of files) {
      try {
        nuevas.push(await uploadImage(file));
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
    setSubiendo(false);
    if (nuevas.length) set('imagenes', [...form.imagenes, ...nuevas]);
  };

  const addImageUrl = () => {
    const url = urlImagen.trim();
    if (!url) return;
    set('imagenes', [...form.imagenes, url]);
    setUrlImagen('');
  };

  const handleVideo = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setSubiendo(true);
    try {
      set('video', await uploadVideo(file));
    } catch (err) {
      showToast(err.message, 'error');
    }
    setSubiendo(false);
  };

  const makeMain = (i) => {
    const copy = [...form.imagenes];
    const [img] = copy.splice(i, 1);
    set('imagenes', [img, ...copy]);
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!(parsePrecio(form.precio) > 0)) e.precio = 'Ingresa un precio mayor a 0';
    if (form.imagenes.length === 0) e.imagenes = 'Agrega al menos una imagen';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      showToast('Revisa los campos marcados', 'error');
      return;
    }
    const limpiar = (list) => list.map((s) => s.trim()).filter(Boolean);
    const especificaciones = Object.fromEntries(
      form.especificaciones
        .map(({ key, value }) => [key.trim(), value.trim()])
        .filter(([key, value]) => key && value)
    );
    const data = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: formatPrecio(form.precio),
      stock: form.stock,
      imagen: form.imagenes[0],
      imagenes: form.imagenes,
      video: form.video.trim(),
      publicado: form.publicado,
      especificaciones,
      ...Object.fromEntries(LISTAS.map(([k]) => [k, limpiar(form[k])])),
    };
    setGuardando(true);
    try {
      if (editando) {
        await updateProducto(producto.id, data);
        showToast('Publicación actualizada');
      } else {
        await addProducto(data);
        showToast('Publicación creada');
      }
      navigate('/admin');
    } catch (err) {
      showToast(err.message, 'error');
      setGuardando(false);
    }
  };

  return (
    <div className="admin">
      <form className="admin-container admin-form" onSubmit={handleSubmit} noValidate>
        <div className="admin-head">
          <div>
            <Link to="/admin" className="admin-back">← Volver al listado</Link>
            <h1>{editando ? `Editar: ${producto.nombre}` : 'Nueva publicación'}</h1>
          </div>
          <label className="switch-field">
            <input
              type="checkbox"
              checked={form.publicado}
              onChange={(e) => set('publicado', e.target.checked)}
            />
            <span>{form.publicado ? 'Publicado' : 'Borrador'}</span>
          </label>
        </div>

        <fieldset className="admin-card">
          <legend>Información general</legend>
          <div className="field">
            <label htmlFor="f-nombre">Nombre *</label>
            <input
              id="f-nombre"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              className={errors.nombre ? 'error' : ''}
              placeholder="Ej. Robot Cuadrúpedo Go2 Pro"
            />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>
          <div className="field">
            <label htmlFor="f-desc">Descripción</label>
            <textarea
              id="f-desc"
              rows="3"
              value={form.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
              placeholder="Resumen que se muestra en la tarjeta del catálogo"
            />
          </div>
          <div className="field field-narrow">
            <label htmlFor="f-precio">Precio (USD) *</label>
            <input
              id="f-precio"
              type="number"
              min="0"
              step="0.01"
              value={form.precio}
              onChange={(e) => set('precio', e.target.value)}
              className={errors.precio ? 'error' : ''}
              placeholder="0.00"
            />
            {errors.precio && <span className="field-error">{errors.precio}</span>}
          </div>
          <div className="field field-narrow">
            <label htmlFor="f-stock">Disponibilidad</label>
            <select id="f-stock" value={form.stock} onChange={(e) => set('stock', e.target.value)}>
              <option>En stock</option>
              <option>Bajo pedido</option>
              <option>Agotado</option>
            </select>
          </div>
        </fieldset>

        <fieldset className="admin-card">
          <legend>Imágenes y video</legend>
          <div className="field">
            <label>Galería * <small>(la primera es la imagen principal)</small></label>
            <div className="media-grid">
              {form.imagenes.map((src, i) => (
                <div key={i} className={`media-item ${i === 0 ? 'main' : ''}`}>
                  <img src={src} alt={`Imagen ${i + 1}`} />
                  {i === 0 && <span className="media-badge">Principal</span>}
                  <div className="media-actions">
                    {i > 0 && (
                      <button type="button" onClick={() => makeMain(i)}>Hacer principal</button>
                    )}
                    <button
                      type="button"
                      onClick={() => set('imagenes', form.imagenes.filter((_, idx) => idx !== i))}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
              <label className="media-add">
                <input type="file" accept="image/*" multiple hidden onChange={handleImages} />
                <span>{subiendo ? 'Procesando…' : '+ Subir imágenes'}</span>
              </label>
            </div>
            <div className="url-row">
              <input
                value={urlImagen}
                onChange={(e) => setUrlImagen(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addImageUrl();
                  }
                }}
                placeholder="…o pega la URL de una imagen"
                aria-label="URL de imagen"
              />
              <button type="button" className="admin-btn small" onClick={addImageUrl}>Agregar URL</button>
            </div>
            {errors.imagenes && <span className="field-error">{errors.imagenes}</span>}
          </div>

          <div className="field">
            <label htmlFor="f-video">Video <small>(se reproduce al pasar el cursor sobre la tarjeta)</small></label>
            <div className="url-row">
              <input
                id="f-video"
                value={form.video}
                onChange={(e) => set('video', e.target.value)}
                placeholder="URL del video (.mp4) o súbelo desde tu equipo (máx. 40 MB)"
              />
              <label className="admin-btn small file-btn">
                Subir video
                <input type="file" accept="video/*" hidden onChange={handleVideo} />
              </label>
              {form.video && (
                <button type="button" className="admin-btn small danger" onClick={() => set('video', '')}>Quitar</button>
              )}
            </div>
            {form.video && (
              <video className="video-preview" src={form.video} controls muted playsInline preload="metadata" />
            )}
          </div>
        </fieldset>

        <fieldset className="admin-card">
          <legend>Especificaciones</legend>
          <SpecsEditor rows={form.especificaciones} onChange={(rows) => set('especificaciones', rows)} />
        </fieldset>

        <fieldset className="admin-card">
          <legend>Detalle adicional</legend>
          {LISTAS.map(([key, label, placeholder]) => (
            <ListEditor
              key={key}
              label={label}
              placeholder={placeholder}
              items={form[key]}
              onChange={(items) => set(key, items)}
            />
          ))}
        </fieldset>

        <div className="admin-form-actions">
          <Link to="/admin" className="admin-btn">Cancelar</Link>
          <button type="submit" className="admin-btn primary" disabled={subiendo || guardando}>
            {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear publicación'}
          </button>
        </div>
      </form>
    </div>
  );
};

const ProductForm = () => {
  const { id } = useParams();
  useSeo({ title: 'Publicación | MR TECH', noindex: true });
  const { getById, loading } = useProducts();

  if (id === undefined) return <Formulario />;
  if (loading) return <div className="page-status">Cargando…</div>;

  const producto = getById(id);
  if (!producto) {
    return (
      <div className="page-status">
        <h1>Publicación no encontrada</h1>
        <Link to="/admin">Volver al listado</Link>
      </div>
    );
  }
  return <Formulario key={producto.id} producto={producto} />;
};

export default ProductForm;
