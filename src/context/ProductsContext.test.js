import { normalizeProducto } from './ProductsContext';
import { productosIniciales } from '../data/productos';

test('normalizeProducto completa campos faltantes', () => {
  const p = normalizeProducto({ id: 9, nombre: ' Demo ', imagen: '/a.jpg' });
  expect(p.nombre).toBe('Demo');
  expect(p.imagenes).toEqual(['/a.jpg']);
  expect(p.publicado).toBe(true);
  expect(p.caracteristicas).toEqual([]);
});

test('normalizeProducto convierte video en arreglo a texto', () => {
  expect(normalizeProducto({ nombre: 'x', video: ['/v.mp4'] }).video).toBe('/v.mp4');
});

test('los productos iniciales quedan válidos y publicados', () => {
  const lista = productosIniciales.map(normalizeProducto);
  expect(lista).toHaveLength(5);
  lista.forEach((p) => {
    expect(typeof p.video).toBe('string');
    expect(p.imagenes.length).toBeGreaterThan(0);
    expect(p.publicado).toBe(true);
  });
});
