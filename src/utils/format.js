// Los precios se guardan como texto "2,499.99" (formato histórico del catálogo).
export const parsePrecio = (valor) => {
  const n = parseFloat(String(valor ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export const formatPrecio = (valor) =>
  parsePrecio(valor).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
