# Telas de Colombia

Landing page estática de **Telas de Colombia By Grupo Macasi** (telas al detal y al por mayor en Medellín), construida con [Vite](https://vitejs.dev/) (HTML, CSS y JavaScript vanilla) y desplegada en GitHub Pages. Replica el diseño original de Claude Design que vive en `design/`.

## Estructura

```
.
├── index.html              # Página principal (SEO, JSON-LD y todas las secciones)
├── src/
│   ├── main.js             # Tracking de conversiones
│   └── styles/
│       └── main.css        # Tokens de diseño, componentes y responsive
├── design/                 # Archivo de diseño original (referencia, no entra al build)
├── public/                 # Assets estáticos (imágenes, favicon…) copiados tal cual al build
├── vite.config.js          # Config de Vite (base: /telas-de-colombia/ para GitHub Pages)
└── .github/workflows/deploy.yml  # CI: build y deploy automático a GitHub Pages
```

## Funcionalidades

- **Tracking de conversiones** (Meta Pixel y Google Ads): en `index.html` reemplaza `TU_PIXEL_ID`, `AW-XXXXXXXXX` y `TU_LABEL` por los IDs reales. Los scripts solo se cargan cuando los placeholders fueron reemplazados. Todos los enlaces de WhatsApp (`data-track="whatsapp"`) disparan el evento de contacto.
- **Fotos**: las imágenes en `public/img/` son fotos de stock de Freepik (descargadas con la cuenta premium de Magnific, sin requisito de atribución). Para usar fotos reales del negocio, reemplaza los archivos en `public/img/` manteniendo los mismos nombres (`bodega.jpg`, `seda.jpg`, `uniforme.jpg`, etc.).
- **Responsive**: el diseño original es de escritorio; se agregaron breakpoints en 960px y 640px.

## Desarrollo

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo en http://localhost:5173
npm run build   # build de producción en dist/
npm run preview # previsualizar el build localmente
```

## Deploy a GitHub Pages

El deploy es automático: cada push a la rama `main` ejecuta el workflow de GitHub Actions, que hace el build con Vite y publica `dist/` en GitHub Pages.

Configuración inicial (una sola vez):

1. Crear el repositorio en GitHub con el nombre `telas-de-colombia` (el `base` de `vite.config.js` debe coincidir con el nombre del repo).
2. En el repo: **Settings → Pages → Source → GitHub Actions**.
3. Hacer push a `main`. El sitio quedará en `https://<usuario>.github.io/telas-de-colombia/`.

## Notas

- Los tokens de diseño (colores, tipografías, espaciados) viven como variables CSS en `src/styles/main.css` (`:root`).
- Las imágenes y otros assets estáticos van en `public/` y se referencian con rutas relativas a la raíz (Vite les aplica el `base` automáticamente).
# telas-de-colombia
