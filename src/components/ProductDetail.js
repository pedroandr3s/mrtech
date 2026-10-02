import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrecio } from '../utils/format';
import { StockLabel } from './ProductCard';

const SECCIONES_LISTA = [
  ['caracteristicas', 'Características'],
  ['aplicaciones', 'Aplicaciones'],
  ['mantenimiento', 'Mantenimiento'],
  ['funciones', 'Funciones'],
  ['ventajas', 'Ventajas'],
];

// Secciones con subgrupos { Grupo: { clave: valor } } (datos técnicos / empaque).
const SECCIONES_GRUPOS = [
  ['especificacionesTecnicas', 'Especificaciones técnicas'],
  ['especificacionesEmpaque', 'Empaque'],
];

const PlayIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 2l10 6-10 6z" fill={color} />
  </svg>
);

const ProductDetail = ({ producto }) => {
  const [actual, setActual] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const { addToCart, setIsCartOpen } = useCart();
  const showToast = useToast();

  // Galería: todas las imágenes y, al final, el video (si hay).
  const medios = [
    ...producto.imagenes.map((src, i) => ({ tipo: 'img', src, label: `Imagen ${i + 1}` })),
    ...(producto.video ? [{ tipo: 'video', src: producto.video, label: 'Video demostración' }] : []),
  ];
  const medio = medios[Math.min(actual, medios.length - 1)];
  const especificaciones = Object.entries(producto.especificaciones || {});

  const handleAdd = () => {
    addToCart(producto, cantidad);
    showToast(`Agregado a tu cotización: ${cantidad} × ${producto.nombre}`);
  };

  const handleQuote = () => {
    addToCart(producto, cantidad);
    setIsCartOpen(true);
  };

  const listas = SECCIONES_LISTA.filter(([key]) => producto[key]?.length);
  const grupos = SECCIONES_GRUPOS.filter(([key]) => producto[key] && Object.keys(producto[key]).length);

  return (
    <>
      <div className="product">
        <div className="gallery">
          {medios.length > 1 && (
            <div className="thumbs">
              {medios.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  className="thumb cut-s"
                  aria-label={m.label}
                  aria-current={i === actual}
                  onClick={() => setActual(i)}
                >
                  {m.tipo === 'img' ? (
                    <img src={m.src} alt="" />
                  ) : (
                    <>
                      <video src={m.src} muted preload="metadata" />
                      <div className="playbadge">
                        <span>
                          <PlayIcon size={12} color="#1b1d37" />
                        </span>
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
          <div className="mainstage cut">
            {!medio ? (
              <div className="no-image">Sin imagen</div>
            ) : medio.tipo === 'img' ? (
              <img src={medio.src} alt={producto.nombre} />
            ) : (
              <video key={medio.src} src={medio.src} controls autoPlay muted loop playsInline />
            )}
            {medio && <span className="cap">{medio.label}</span>}
          </div>
        </div>

        <div className="info">
          <h1>{producto.nombre}</h1>
          <span className="price">${formatPrecio(producto.precio)}</span>
          <StockLabel producto={producto} />
          {producto.descripcion && <p className="desc">{producto.descripcion}</p>}

          {especificaciones.length > 0 && (
            <>
              <h2>Especificaciones</h2>
              <dl className="specs">
                {especificaciones.map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          <div className="buy">
            <div className="qty cut-s" role="group" aria-label="Cantidad">
              <button type="button" aria-label="Quitar uno" onClick={() => setCantidad((c) => Math.max(1, c - 1))}>
                −
              </button>
              <output aria-live="polite">{cantidad}</output>
              <button type="button" aria-label="Agregar uno" onClick={() => setCantidad((c) => Math.min(99, c + 1))}>
                +
              </button>
            </div>
            <button className="btn btn-soft cut-s" type="button" onClick={handleAdd}>
              Agregar
            </button>
            <button className="btn btn-primary cut-s" type="button" onClick={handleQuote}>
              Cotizar
            </button>
          </div>
        </div>
      </div>

      {(listas.length > 0 || grupos.length > 0) && (
        <section className="details">
          {listas.map(([key, titulo]) => (
            <div key={key}>
              <h2>{titulo}</h2>
              <ul>
                {producto[key].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
          {grupos.map(([key, titulo]) => (
            <div key={key} className="wide">
              <h2>{titulo}</h2>
              <div className="tech-groups">
                {Object.entries(producto[key]).map(([grupo, valor]) => (
                  <div key={grupo} className="tech-group">
                    {typeof valor === 'object' ? (
                      <>
                        <h3>{grupo}</h3>
                        <dl>
                          {Object.entries(valor).map(([k, v]) => (
                            <div key={k}>
                              <dt>{k}</dt>
                              <dd>{v}</dd>
                            </div>
                          ))}
                        </dl>
                      </>
                    ) : (
                      <dl>
                        <div>
                          <dt>{grupo}</dt>
                          <dd>{valor}</dd>
                        </div>
                      </dl>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
};

export default ProductDetail;
