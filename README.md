# MrTech - Página de Productos Robóticos

Una página web moderna en React que muestra 6 productos robóticos con 3 propuestas de diseño diferentes.

## 🎨 Propuestas de Diseño

### Propuesta 1: Tech Moderno
- **Colores**: Cyan (#00d4ff) y Púrpura (#7b2ff7)
- **Estilo**: Moderno y minimalista con gradientes tech
- **Ambiente**: Oscuro con efectos de neón suaves

### Propuesta 2: Cyberpunk Neón
- **Colores**: Magenta (#ff00ff) y Cyan (#00ffff)
- **Estilo**: Futurista con efectos glitch y neón intenso
- **Ambiente**: Dark theme con grid cyberpunk

### Propuesta 3: Premium Minimalista
- **Colores**: Naranja (#ff6b35) y Blanco
- **Estilo**: Limpio, elegante y profesional
- **Ambiente**: Claro con acentos de color vibrantes

## 🚀 Características

- ✅ Header con logo y navegación entre propuestas
- ✅ 6 productos con imágenes de robots
- ✅ Videos que se reproducen al pasar el cursor sobre las imágenes
- ✅ Animaciones fluidas con Framer Motion
- ✅ Diseño responsivo
- ✅ 3 temas visuales completamente diferentes

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# La aplicación se abrirá en http://localhost:3000
```

## 🛠️ Tecnologías Utilizadas

- React 18
- Framer Motion (animaciones)
- CSS3 con gradientes y efectos avanzados
- Componentes modulares y reutilizables

## 📁 Estructura del Proyecto

```
mrtech/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Header.css
│   │   ├── ProductCard.js
│   │   ├── ProductCard.css
│   │   ├── Propuesta1.js
│   │   ├── Propuesta1.css
│   │   ├── Propuesta2.js
│   │   ├── Propuesta2.css
│   │   ├── Propuesta3.js
│   │   └── Propuesta3.css
│   ├── data/
│   │   └── productos.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## 🎯 Funcionalidades

- **Navegación**: Cambia entre las 3 propuestas desde el header
- **Hover Effect**: Los videos se reproducen automáticamente al pasar el cursor
- **Animaciones**: Transiciones suaves en la carga de productos
- **Responsive**: Se adapta a diferentes tamaños de pantalla

## 📝 Notas

- Las imágenes y videos son de ejemplo usando URLs de Unsplash y Google Storage
- Puedes reemplazar las URLs en `src/data/productos.js` con tus propios recursos
- Cada propuesta tiene su propio archivo CSS para facilitar la personalización

## 🎨 Personalización

Para cambiar los colores o estilos de cada propuesta, edita los archivos:
- `Propuesta1.css` para el tema Tech Moderno
- `Propuesta2.css` para el tema Cyberpunk
- `Propuesta3.css` para el tema Premium Minimalista
