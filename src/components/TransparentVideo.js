import React, { useEffect, useRef } from 'react';

const W = 960;
const H = 540;

// Dominio del verde: g - max(r, b). Fondo ≈ 95; robot (gris/negro/cian) ≈ 0.
const D_START = 18; // desde aquí el píxel empieza a ser transparente
const D_FULL = 62; // desde aquí es totalmente transparente

// Chroma key: alfa según el verde que domina y supresión del reflejo verde en los bordes.
const chromaKey = (data) => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const rb = r > b ? r : b;
    const d = g - rb;
    if (d <= 0) continue; // sin verde dominante: pertenece al robot
    const t = (d - D_START) / (D_FULL - D_START);
    const a = t <= 0 ? 1 : t >= 1 ? 0 : 1 - t;
    if (a < 0.06) {
      data[i + 3] = 0;
    } else {
      data[i + 1] = rb; // despill: el verde sobrante se limita al nivel de rojo/azul
      data[i + 3] = Math.round(a * 255);
    }
  }
};

// El clip termina con un fundido a otro fondo (sin verde): ese tramo no se muestra.
const hasGreenBackground = (data) => {
  let hits = 0;
  for (const [x, y] of [[6, 6], [W - 7, 6], [6, H - 7], [W - 7, H - 7]]) {
    const i = (y * W + x) * 4;
    if (data[i + 1] - Math.max(data[i], data[i + 2]) > 50) hits++;
  }
  return hits >= 3;
};

// Video en bucle con fondo verde removido: se reproduce oculto y se dibuja en un canvas transparente.
const TransparentVideo = ({ src, label, className }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Los fotogramas se procesan en un lienzo oculto: nunca se muestra uno sin recortar.
    const work = document.createElement('canvas');
    work.width = W;
    work.height = H;
    const wctx = work.getContext('2d', { willReadFrequently: true });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stopped = false;
    let handle = 0;

    const draw = () => {
      if (video.readyState < 2) return;
      wctx.drawImage(video, 0, 0, W, H);
      const frame = wctx.getImageData(0, 0, W, H);
      if (!hasGreenBackground(frame.data)) {
        video.currentTime = 0; // fin del tramo útil: reinicia el bucle (queda el último fotograma bueno)
        return;
      }
      chromaKey(frame.data);
      ctx.putImageData(frame, 0, 0);
    };

    const cancelFrame = () => {
      if (video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
    };

    const loop = () => {
      if (stopped) return;
      draw();
      handle = video.requestVideoFrameCallback
        ? video.requestVideoFrameCallback(loop)
        : requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduced) {
        draw();
        return;
      }
      video.play().catch(() => {});
      cancelFrame();
      loop();
    };

    video.addEventListener('loadeddata', start);
    if (video.readyState >= 2) start();

    // Fuera de pantalla se detiene para no gastar batería ni CPU.
    const observer = new IntersectionObserver(([entry]) => {
      if (reduced) return;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    observer.observe(canvas);

    return () => {
      stopped = true;
      cancelFrame();
      observer.disconnect();
      video.removeEventListener('loadeddata', start);
      video.pause();
    };
  }, [src]);

  return (
    <div className={className}>
      <canvas ref={canvasRef} width={W} height={H} role="img" aria-label={label} />
      <video ref={videoRef} src={src} muted loop playsInline preload="auto" className="tv-source" />
    </div>
  );
};

export default TransparentVideo;
