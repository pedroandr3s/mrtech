import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Sin credenciales la app sigue funcionando en modo solo lectura con el catálogo inicial.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const BUCKET = 'productos';
