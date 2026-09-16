# BeopenSound

Sitio web estático de [BeopenSound](https://beopensound.cl), una clínica de cuidado auditivo en Viña del Mar, Chile.

## Stack

Sitio multipágina en HTML/CSS/JS puro, sin build system ni framework, desplegado tal cual en Vercel.

- `index.html`, `audifonos.html`, `audiometria.html`, `lavado-de-oidos.html`, `calibracion-de-audifonos.html`, `nosotros.html`, `preguntas-frecuentes.html`, `contacto.html`, `politica-de-privacidad.html` — cada página es un archivo `.html` independiente (no hay motor de templates; el nav/footer se duplica en cada archivo).
- `style.css` / `script.js` — hojas de estilo y JS compartidos, enlazados desde todas las páginas.
- `images/` — assets del sitio.
- `vercel.json` — `cleanUrls` y redirects.
- `robots.txt` / `sitemap.xml` — deben mantenerse sincronizados con las páginas existentes.

## Desarrollo local

No hay build ni gestor de paquetes. Para previsualizar el sitio:

```bash
python3 -m http.server 4173
```

Luego abre `http://127.0.0.1:4173`.

## Mantenimiento del repo

Los cambios que afectan a todas las páginas (nav, footer, tracking, etc.) se aplican con pequeños scripts Python de un solo uso (`fix_*.py`, `update_navs.py`, `check_*.py`) que recorren `*.html` con `glob` y aplican reemplazos. Para un cambio estructural que toque todas las páginas, se recomienda escribir un script similar en vez de editar cada archivo a mano.

Ver [CLAUDE.md](CLAUDE.md) para más detalles de arquitectura y convenciones.
