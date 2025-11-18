import React, { useState } from 'react';
import './QuoteForm.css';

const QuoteForm = ({ cartItems, onBack, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    ciudad: '',
    region: '',
    direccion: '',
    comentarios: ''
  });

  const [errors, setErrors] = useState({});

  const regiones = [
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
    'Magallanes'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    }

    if (!formData.region) {
      newErrors.region = 'La región es requerida';
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateWhatsAppMessage = () => {
    let message = `*COTIZACIÓN MR TECH* 🤖\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `*DATOS DEL CLIENTE*\n`;
    message += `👤 *Nombre:* ${formData.nombre}\n`;
    if (formData.empresa) {
      message += `🏢 *Empresa:* ${formData.empresa}\n`;
    }
    
    message += `\n*DIRECCIÓN DE ENVÍO*\n`;
    message += `📍 *Ciudad:* ${formData.ciudad}\n`;
    message += `🗺️ *Región:* ${formData.region}\n`;
    message += `🏠 *Dirección:* ${formData.direccion}\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `*PRODUCTOS SOLICITADOS*\n\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.nombre}*\n`;
      message += `   💰 Precio: $${item.precio}\n`;
      message += `   📦 Cantidad: ${item.cantidad}\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📋 *Total de productos:* ${cartItems.reduce((sum, item) => sum + item.cantidad, 0)} unidades\n\n`;
    
    if (formData.comentarios) {
      message += `💬 *Comentarios adicionales:*\n${formData.comentarios}\n\n`;
    }
    
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `✅ Solicito cotización formal con:\n`;
    message += `• Precios actualizados\n`;
    message += `• Costos de envío a mi región\n`;
    message += `• Tiempos de entrega\n`;
    message += `• Formas de pago disponibles\n`;
    message += `• Garantía y soporte técnico\n\n`;
    message += `Quedo atento a su respuesta. ¡Gracias! 🙌`;

    return encodeURIComponent(message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/56927294017?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="quote-form-container">
      <div className="quote-form-header">
        <button className="back-form-btn" onClick={onBack}>
          ← Volver al carrito
        </button>
        <h2>📋 Formulario de Cotización</h2>
      </div>

      <form className="quote-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Información Personal</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre Completo *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
                className={errors.nombre ? 'error' : ''}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label>Empresa (Opcional)</label>
              <input
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                placeholder="Mi Empresa S.A."
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Dirección de Envío</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Ciudad *</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                placeholder="Santiago"
                className={errors.ciudad ? 'error' : ''}
              />
              {errors.ciudad && <span className="error-message">{errors.ciudad}</span>}
            </div>

            <div className="form-group">
              <label>Región *</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={errors.region ? 'error' : ''}
              >
                <option value="">Seleccione una región</option>
                {regiones.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {errors.region && <span className="error-message">{errors.region}</span>}
            </div>

            <div className="form-group full-width">
              <label>Dirección Completa *</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Calle, Número, Depto/Casa"
                className={errors.direccion ? 'error' : ''}
              />
              {errors.direccion && <span className="error-message">{errors.direccion}</span>}
            </div>

            <div className="form-group full-width">
              <label>Comentarios Adicionales (Opcional)</label>
              <textarea
                name="comentarios"
                value={formData.comentarios}
                onChange={handleChange}
                placeholder="Información adicional sobre el pedido, horarios de entrega preferidos, etc."
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="form-summary">
          <h3>Resumen del Pedido</h3>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.cantidad}x {item.nombre}</span>
                <span className="summary-price">${item.precio}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total de productos:</span>
            <span>{cartItems.reduce((sum, item) => sum + item.cantidad, 0)} unidades</span>
          </div>
        </div>

        <button type="submit" className="submit-quote-btn">
          📱 Enviar Cotización por WhatsApp
        </button>
      </form>
    </div>
  );
};

export default QuoteForm;