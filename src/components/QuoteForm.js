import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrecio } from '../utils/format';

const WHATSAPP_NUMBER = '56927294017';

const REGIONES = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana de Santiago',
  "O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes',
];

const VACIO = { nombre: '', empresa: '', ciudad: '', region: '', direccion: '', comentarios: '' };

const buildMessage = (form, items, total) => {
  const lineas = items
    .map((it, i) => `${i + 1}. *${it.nombre}*\n   Precio: $${formatPrecio(it.precio)} c/u\n   Cantidad: ${it.cantidad}`)
    .join('\n\n');
  const partes = ['*SOLICITUD DE COTIZACIÓN - MR TECH*', '', '*DATOS DEL CLIENTE*', `Nombre: ${form.nombre}`];
  if (form.empresa.trim()) partes.push(`Empresa: ${form.empresa}`);
  partes.push('', '*DIRECCIÓN DE ENVÍO*', `${form.direccion}, ${form.ciudad}, ${form.region}`);
  partes.push('', '*PRODUCTOS*', lineas, '', `Total referencial: $${formatPrecio(total)}`);
  if (form.comentarios.trim()) partes.push('', `Comentarios: ${form.comentarios}`);
  partes.push('', 'Solicito cotización formal con precios actualizados, costos de envío, tiempos de entrega y garantía.');
  return partes.join('\n');
};

const QuoteForm = ({ cartItems, total, onSent }) => {
  const { clearCart } = useCart();
  const [form, setForm] = useState(VACIO);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.ciudad.trim()) e.ciudad = 'La ciudad es requerida';
    if (!form.region) e.region = 'La región es requerida';
    if (!form.direccion.trim()) e.direccion = 'La dirección es requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const text = encodeURIComponent(buildMessage(form, cartItems, total));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
    clearCart();
    onSent();
  };

  const field = (name, label, props = {}) => (
    <label>
      {label}
      <input
        name={name}
        value={form[name]}
        onChange={handleChange}
        className={errors[name] ? 'error' : ''}
        {...props}
      />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </label>
  );

  return (
    <form className="f" onSubmit={handleSubmit} noValidate>
      {field('nombre', 'Nombre *', { autoComplete: 'name' })}
      {field('empresa', 'Empresa (opcional)', { autoComplete: 'organization' })}
      <h3 className="fh">Dirección de envío</h3>
      {field('ciudad', 'Ciudad *', { autoComplete: 'address-level2' })}
      <label>
        Región *
        <select name="region" value={form.region} onChange={handleChange} className={errors.region ? 'error' : ''}>
          <option value="">Seleccione una región</option>
          {REGIONES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        {errors.region && <span className="field-error">{errors.region}</span>}
      </label>
      {field('direccion', 'Dirección completa *', { autoComplete: 'street-address' })}
      <label>
        Comentarios adicionales (opcional)
        <textarea name="comentarios" value={form.comentarios} onChange={handleChange} />
      </label>
      <button className="btn btn-primary cut-s" type="submit">
        Enviar solicitud por WhatsApp
      </button>
      <p className="note">Los precios son referenciales y no incluyen impuestos ni envío.</p>
    </form>
  );
};

export default QuoteForm;
