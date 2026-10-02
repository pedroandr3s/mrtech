import React from 'react';

// Lista editable de textos (características, aplicaciones, etc.).
export const ListEditor = ({ label, items, onChange, placeholder }) => {
  const update = (i, value) => onChange(items.map((it, idx) => (idx === i ? value : it)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="editor">
      <div className="editor-head">
        <span className="editor-label">{label}</span>
        <button type="button" className="admin-btn small" onClick={() => onChange([...items, ''])}>
          + Agregar
        </button>
      </div>
      {items.length === 0 && <p className="editor-empty">Sin elementos.</p>}
      {items.map((item, i) => (
        <div key={i} className="editor-row">
          <input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            aria-label={`${label} ${i + 1}`}
          />
          <button type="button" className="icon-btn" onClick={() => remove(i)} aria-label="Quitar">✕</button>
        </div>
      ))}
    </div>
  );
};

// Pares clave/valor editables (especificaciones). Se maneja como arreglo de filas.
export const SpecsEditor = ({ rows, onChange }) => {
  const update = (i, field, value) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i));

  return (
    <div className="editor">
      <div className="editor-head">
        <span className="editor-label">Especificaciones</span>
        <button type="button" className="admin-btn small" onClick={() => onChange([...rows, { key: '', value: '' }])}>
          + Agregar
        </button>
      </div>
      {rows.length === 0 && <p className="editor-empty">Sin especificaciones.</p>}
      {rows.map((row, i) => (
        <div key={i} className="editor-row">
          <input
            value={row.key}
            onChange={(e) => update(i, 'key', e.target.value)}
            placeholder="Nombre (ej. Peso)"
            aria-label={`Especificación ${i + 1}: nombre`}
          />
          <input
            value={row.value}
            onChange={(e) => update(i, 'value', e.target.value)}
            placeholder="Valor (ej. 15 kg)"
            aria-label={`Especificación ${i + 1}: valor`}
          />
          <button type="button" className="icon-btn" onClick={() => remove(i)} aria-label="Quitar">✕</button>
        </div>
      ))}
    </div>
  );
};
