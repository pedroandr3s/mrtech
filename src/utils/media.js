import { supabase, BUCKET } from './supabase';

const MAX_SIDE = 1600;
const MAX_VIDEO_MB = 40; // el plan gratuito de Supabase admite hasta 50 MB por archivo

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`"${file.name}" no es una imagen válida`));
    };
    img.src = url;
  });

// Redimensiona (máx. 1600px) y convierte a WebP para ahorrar espacio.
const resizeToBlob = async (file) => {
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/webp', 0.88));
};

const upload = async (blob, ext, contentType) => {
  if (!supabase) throw new Error('Supabase no está configurado');
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType, cacheControl: '31536000' });
  if (error) throw new Error(`No se pudo subir el archivo: ${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
};

export const uploadImage = async (file) => {
  if (!file.type.startsWith('image/')) {
    throw new Error(`"${file.name}" no es una imagen`);
  }
  const blob = await resizeToBlob(file);
  if (!blob) throw new Error(`No se pudo procesar "${file.name}"`);
  return upload(blob, 'webp', 'image/webp');
};

export const uploadVideo = async (file) => {
  if (!file.type.startsWith('video/')) {
    throw new Error(`"${file.name}" no es un video`);
  }
  if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
    throw new Error(`El video supera ${MAX_VIDEO_MB} MB. Comprímelo o usa una URL`);
  }
  const ext = (file.name.split('.').pop() || 'mp4').toLowerCase();
  return upload(file, ext, file.type);
};
