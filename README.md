# Odontolab - Clínica Dental con Integración API Rick and Morty

**Versión:** 1.0.0  
**Fecha de lanzamiento:** 16 de agosto de 2025

## 🚀 API Utilizada
Este proyecto utiliza la **Rick and Morty API** (https://rickandmortyapi.com/) para demostrar el consumo de APIs REST y la renderización dinámica de contenido. La API proporciona información sobre personajes, episodios y ubicaciones de la serie Rick and Morty.

## 🏃‍♂️ Cómo correr el proyecto
1. Clona este repositorio:
   ```bash
   git clone https://github.com/sebasjv534/odontolab-ingenieria-web.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd odontolab-ingenieria-web
   ```
3. Abre `index.html` en tu navegador web preferido
4. Para ver la integración de la API, navega a `personajes.html`

**No requiere instalación de dependencias ni servidor local.**

## ♿ Principios de Accesibilidad Aplicados
- **Navegación por teclado**: Todos los elementos interactivos son accesibles via teclado
- **ARIA Labels**: Uso de `aria-label`, `aria-live`, `aria-labelledby` para tecnologías asistivas
- **Estructura semántica**: HTML5 semántico con elementos `header`, `nav`, `main`, `section`, `article`, `footer`
- **Contraste de colores**: Paleta de colores que cumple con WCAG 2.1 AA
- **Textos alternativos**: Imágenes con atributos `alt` descriptivos
- **Estados de carga**: Mensajes informativos durante la carga de datos de la API
- **Skip links**: Enlaces para saltar al contenido principal
- **Responsive design**: Adaptable a diferentes tamaños de pantalla y dispositivos

---

# Web API Taller — Maquetación base (HTML5 + CSS Responsivo)

Este proyecto contiene una maqueta base con HTML semántico y CSS responsivo (mobile‑first) empleando Flexbox, Grid y media queries. También incluye un script mínimo para el menú móvil.

## Objetivo

- Practicar estructura semántica (header, nav, main, section, article, footer).
- Construir una barra de navegación accesible y responsiva.
- Aplicar Flexbox y media queries para adaptar el layout a distintos anchos.
- Usar buenas prácticas de accesibilidad y rendimiento (skip link, aria, preconnect, defer).

## Cómo ver el proyecto

Abre `index.html` en tu navegador. No requiere build ni servidor.

---

## Estructura HTML y explicación de etiquetas

Archivo: `index.html`

- `<!doctype html>`: Declara HTML5. Evita “quirks mode” y habilita características estándar modernas.
- `<html lang="es">`: Idioma del documento. Mejora accesibilidad y SEO.
- `<head>`: Metadatos del documento.
  - `<meta charset="utf-8">`: Codificación de caracteres UTF‑8.
  - `<meta name="viewport" content="width=device-width, initial-scale=1">`: Responsive: adapta el ancho del layout al dispositivo.
  - `<title>`: Título mostrado en la pestaña y consumido por motores de búsqueda.
  - `<link rel="preconnect" href="https://fonts.googleapis.com">` y `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`: Optimización para cargar fuentes más rápido (reduce el tiempo de conexión TLS/DNS).
  - `<link href="https://fonts.googleapis.com/...">`: Carga la fuente “Inter”.
  - `<link rel="stylesheet" href="assets/css/styles.css">`: Hoja de estilos principal.
- `<body>`: Contenido visible.
  - `<a class="skip-link" href="#contenido">Saltar al contenido</a>`: Enlace de salto para teclado/lectores de pantalla; permite saltar el menú e ir directo al `<main>`.
  - `<header class="site-header">`: Encabezado global.
    - `<div class="container header-inner">`: Contenedor centrado y wrapper flexible del header.
    - `<h1 class="site-title">`: Título principal del sitio.
    - `<button class="nav-toggle" aria-controls="menu" aria-expanded="false" aria-label="Abrir menú">`: Botón de menú móvil (hamburguesa).
      - `aria-controls="menu"`: Asocia el botón al elemento controlado (`#menu`).
      - `aria-expanded`: Indica estado del panel (true/false) y se actualiza con JS.
      - `aria-label`: Describe la acción (abrir/cerrar) para tecnologías asistivas.
    - `<nav class="site-nav" aria-label="Navegación principal">`: Región de navegación principal.
      - `<ul id="menu" class="menu">` + `<li><a href>...</a></li>`: Lista de enlaces de navegación.
  - `<main id="contenido" class="container">`: Contenido principal único de la página. `id` coincide con el “skip link”.
    - `<section class="hero" aria-labelledby="hero-title">`: Sección destacada (hero) con CTA.
      - `<h2 id="hero-title">`, `<p>`, `<a class="btn">`: Jerarquía de títulos correcta y llamada a la acción.
    - `<section id="acerca" class="content" aria-labelledby="acerca-title">`: Sección informativa.
      - `<h2 id="acerca-title">`, `<p>`: Título de sección y párrafo.
    - `<section id="recursos" class="cards-section" aria-labelledby="recursos-title">`: Listado de recursos.
      - `<h2 id="recursos-title">`.
      - `<div class="cards">`: Contenedor de tarjetas.
        - `<article class="card">`: Cada tarjeta es un contenido independiente.
          - `<h3>`, `<p>`, `<a class="card-link" href target rel>`: Título, texto y enlace.
          - `target="_blank"` abre en nueva pestaña; `rel="noopener"` evita que la nueva pestaña acceda a `window.opener` (seguridad y rendimiento).
  - `<footer class="site-footer">`: Pie de página (información legal, derechos, etc.).
  - `<script src="js/app.js" defer></script>`: Carga el JS sin bloquear el render inicial.

Notas semánticas y de accesibilidad:

- Landmarks (header, nav, main, footer) mejoran navegación asistiva por regiones.
- `aria-labelledby` vincula secciones con su título correspondiente.
- Encabezados en orden (`h1` para el sitio, `h2` para secciones, `h3` para tarjetas) ayudan a la jerarquía de lectura y SEO.

---

## CSS: selectores, clases y conceptos

Archivo: `assets/css/styles.css`

### Variables y reset mínimo

- `:root { --bg, --text, --brand, ... }`: Variables CSS para paleta. Beneficios: consistencia, theming y mantenimiento.
- `* { box-sizing: border-box; }`: Facilita el cálculo de tamaños al incluir padding y borde.
- `html, body { height: 100%; }`: Útil para layouts que requieren altura completa.
- `body { margin: 0; font-family: 'Inter', ...; background: linear-gradient(...); color: var(--text); line-height: 1.6; }`: Reset de margen, tipografía, color y fondo.

### Utilidades de layout

- `.container { width: min(100% - 2rem, 1100px); margin-inline: auto; }`: Contenedor centrado, fluido y con ancho máximo.

### Accesibilidad: Skip link

- `.skip-link` posicionado fuera de la vista y visible con `:focus`. Permite navegación por teclado eficiente.

### Header + Nav (Flexbox + sticky)

- `.site-header { position: sticky; top: 0; background: rgba(..., 0.7); backdrop-filter: saturate(180%) blur(8px); border-bottom: 1px solid var(--border); }`: Header pegajoso con apariencia translúcida.
- `.header-inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .75rem 0; }`: Distribuye título, toggle y nav.
- `.site-title { margin: 0; font-size: 1.25rem; }`: Estilo de título.
- `.nav-toggle { background: none; border: 1px solid var(--border); color: var(--text); border-radius: .5rem; padding: .5rem .6rem; cursor: pointer; }`: Botón accesible y visible en móvil.
- `.site-nav { display: none; } .site-nav.open { display: block; }`: Menú colapsable en móvil.
- `.menu { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .25rem; }`: Lista vertical con Flexbox (móvil). Cambia a horizontal en media query.
- `.menu a { color: var(--text); text-decoration: none; padding: .5rem .75rem; border-radius: .375rem; display: block; }`: Área clicable grande para accesibilidad.
- `.menu a:hover, .menu a:focus { background: var(--card); }`: Feedback visual al interactuar.

### Hero y botones

- `.hero { padding: 3rem 0 2rem; }`
- `.hero h2 { font-size: clamp(1.5rem, 2.8vw + .5rem, 2.25rem); margin: 0 0 .5rem; }`: Tipografía fluida con límites.
- `.hero p { color: var(--muted); max-width: 65ch; }`: Mejora lectura controlando el ancho en caracteres.
- `.btn { display: inline-block; margin-top: 1rem; background: linear-gradient(90deg, var(--brand), #7dd3fc); color: #002b36; text-decoration: none; padding: .6rem .9rem; border-radius: .5rem; font-weight: 600; }`: Botón con alto contraste y área táctil adecuada.
- `.btn:hover { filter: brightness(1.05); }`: Sutil realce al pasar el mouse.

### Contenido y cards

- `.content { padding: 2rem 0; }`
- `.cards-section { padding: 1rem 0 3rem; }`
- `.cards { display: grid; grid-template-columns: 1fr; gap: 1rem; }`: Rejilla de una columna en móvil.
- `.card { background: linear-gradient(180deg, var(--card), #111827); border: 1px solid var(--border); border-radius: .75rem; padding: 1rem; }`: Tarjeta con contraste y borde sutil.
- `.card h3 { margin-top: 0; }`
- `.card p { color: var(--muted); }`
- `.card-link { display: inline-block; margin-top: .5rem; color: var(--brand); }`
- `.card-link:hover { color: var(--brand-600); }`

Por qué Grid aquí: Las rejillas de tarjetas son bidimensionales; Grid facilita definir número de columnas por breakpoint. Flexbox se usa para el header y el menú (distribución unidimensional). Ambos se complementan.

### Footer

- `.site-footer { border-top: 1px solid var(--border); background: #0b1220; }`
- `.site-footer .container { padding: 1rem 0; }`
- `.site-footer p { margin: 0; color: var(--muted); }`

### Media queries (mobile‑first)

- `@media (min-width: 640px)`:
  - `.menu { flex-direction: row; gap: .5rem; }`: Menú horizontal en pantallas medianas.
  - `.site-nav { display: block; } .nav-toggle { display: none; }`: En escritorio no se necesita el botón.
- `@media (min-width: 768px)`:
  - `.header-inner { padding: 1rem 0; }`
  - `.cards { grid-template-columns: repeat(2, 1fr); }`: 2 columnas de tarjetas.
- `@media (min-width: 1024px)`:
  - `.hero { padding: 4rem 0 3rem; }`
  - `.cards { grid-template-columns: repeat(3, 1fr); }`: 3 columnas de tarjetas.

Por qué mobile‑first: Primero se cubren las necesidades de pantallas pequeñas (más comunes y con recursos limitados), luego se mejora progresivamente. Beneficios: mejor rendimiento, menos overrides, UX consistente.

---

## JavaScript (contexto)

Archivo: `js/app.js`

- Añade el toggle del menú móvil.
- Alterna la clase `.open` en `.site-nav` y sincroniza `aria-expanded` y `aria-label` del botón para accesibilidad.
- Patrón de mejora progresiva: el sitio funciona sin JS en desktop; JS añade comodidad en móvil.

---

## Ajustes rápidos

- Cambiar paleta: edita variables en `:root`.
- Cambiar puntos de quiebre: ajusta los `@media (min-width: …)`.
- Añadir secciones: usa los patrones `section.content` o `cards-section`.
- Convertir cards a Flexbox: reemplaza `.cards { display: grid; ... }` por Flexbox (`display: flex; flex-wrap: wrap; }` + anchos con `%` o `flex-basis`).

## Glosario rápido

- Semántica: uso de etiquetas que describen el rol del contenido (header, nav, main, section, article, footer).
- Flexbox: layout unidimensional (filas o columnas), ideal para barras y menús.
- Grid: layout bidimensional, ideal para rejillas.
- Media query: regla condicional según características del dispositivo.
- ARIA: atributos para mejorar accesibilidad con tecnologías asistivas.

## Licencia

Uso académico y libre adaptación para prácticas.
