import { formatPrecio, parsePrecio } from './format';

test('parsePrecio entiende el formato con coma de miles', () => {
  expect(parsePrecio('2,499.99')).toBe(2499.99);
  expect(parsePrecio('abc')).toBe(0);
  expect(parsePrecio(undefined)).toBe(0);
});

test('formatPrecio devuelve siempre dos decimales', () => {
  expect(formatPrecio('2499.9')).toBe('2,499.90');
  expect(formatPrecio(45999.99)).toBe('45,999.99');
});
