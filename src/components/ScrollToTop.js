import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Al cambiar de ruta, vuelve al inicio de la página.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
