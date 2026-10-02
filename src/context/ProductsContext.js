import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { productosIniciales } from '../data/productos';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts debe usarse dentro de ProductsProvider');
  }
  return context;
};

const asList = (v) => (Array.isArray(v) ? v.filter(Boolean) : []);
const asText = (v) => (Array.isArray(v) ? v[0] || '' : v || '');

// Deja cada producto con una forma consistente, venga del catálogo inicial,
// de la base de datos o de un archivo importado.
export const normalizeProducto = (p) => {
  const imagenes = asList(p.imagenes);
  const imagen = p.imagen || imagenes[0] || '';
  return {
    ...p,
    nombre: String(p.nombre || '').trim(),
    descripcion: p.descripcion || '',
    precio: p.precio ?? '0.00',
    imagen,
    imagenes: imagenes.length ? imagenes : imagen ? [imagen] : [],
    video: asText(p.video),
    especificaciones: p.especificaciones && typeof p.especificaciones === 'object' ? p.especificaciones : {},
    caracteristicas: asList(p.caracteristicas),
    funciones: asList(p.funciones),
    aplicaciones: asList(p.aplicaciones),
    ventajas: asList(p.ventajas),
    mantenimiento: asList(p.mantenimiento),
    stock: p.stock || 'En stock',
    publicado: p.publicado !== false,
  };
};

const seed = () => productosIniciales.map(normalizeProducto);

// Fila de la tabla <-> producto de la app.
const fromRow = (row) => normalizeProducto({ ...row.data, id: row.id, publicado: row.publicado });
const toRow = (producto) => {
  const { id, publicado, ...data } = normalizeProducto(producto);
  return { publicado, data };
};

const NO_CONFIG = 'Supabase no está configurado: el catálogo es de solo lectura.';

export const ProductsProvider = ({ children }) => {
  const { session } = useAuth();
  const [productos, setProductos] = useState(supabase ? [] : seed);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState(supabase ? '' : NO_CONFIG);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data, error: err } = await supabase.from('productos').select('*').order('id');
    if (err) {
      setError('No se pudo cargar el catálogo. Intenta nuevamente.');
    } else {
      setError('');
      setProductos(data.map(fromRow));
    }
    setLoading(false);
  }, []);

  // Recarga al iniciar y al entrar/salir el admin (los borradores solo los ve él).
  const token = session?.access_token;
  useEffect(() => {
    refresh();
  }, [refresh, token]);

  const mutate = useCallback(
    async (query) => {
      if (!supabase) throw new Error(NO_CONFIG);
      const { error: err } = await query(supabase.from('productos'));
      if (err) throw new Error(err.message);
      await refresh();
    },
    [refresh]
  );

  const addProducto = useCallback((data) => mutate((t) => t.insert(toRow(data))), [mutate]);

  const updateProducto = useCallback(
    (id, data) => {
      const actual = productos.find((p) => p.id === id);
      return mutate((t) => t.update(toRow({ ...actual, ...data })).eq('id', id));
    },
    [mutate, productos]
  );

  const deleteProducto = useCallback((id) => mutate((t) => t.delete().eq('id', id)), [mutate]);

  const togglePublicado = useCallback(
    (id) => {
      const actual = productos.find((p) => p.id === id);
      return mutate((t) => t.update({ publicado: !actual.publicado }).eq('id', id));
    },
    [mutate, productos]
  );

  // Reemplaza todo el catálogo (importar / restaurar originales).
  const replaceProductos = useCallback(
    async (list) => {
      await mutate((t) => t.delete().gte('id', 0));
      const rows = list.map((p) => toRow(p));
      if (rows.length) await mutate((t) => t.insert(rows));
    },
    [mutate]
  );

  const resetProductos = useCallback(() => replaceProductos(seed()), [replaceProductos]);

  const value = useMemo(
    () => ({
      productos,
      publicados: productos.filter((p) => p.publicado),
      loading,
      storageError: error,
      readOnly: !supabase,
      getById: (id) => productos.find((p) => p.id === Number(id)),
      addProducto,
      updateProducto,
      deleteProducto,
      togglePublicado,
      resetProductos,
      replaceProductos,
    }),
    [productos, loading, error, addProducto, updateProducto, deleteProducto, togglePublicado, resetProductos, replaceProductos]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};
