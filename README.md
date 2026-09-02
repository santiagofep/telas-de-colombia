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
├── vite.config.js          # Config de Vite (base: / porque el sitio vive en telascolombia.com.co)
└── .github/workflows/deploy.yml  # CI: build y deploy automático a GitHub Pages
```

## Funcionalidades

- **Tracking de conversiones** (Meta Pixel y Google Ads): la config vive en `index.html` (`META_PIXEL_ID`, `GOOGLE_ADS_ID`, `GOOGLE_ADS_CONVERSION_LABEL`). Cada script solo se carga cuando su ID dejó de ser el placeholder. La conversión es el clic en cualquier enlace de WhatsApp (`data-track="whatsapp"`):
  - `data-track-label` identifica el botón (`header`, `hero`, `tela-satin`, `mayoristas`, `dotaciones`, `cta-final`…) y se envía como `content_name` a Meta y `event_label` a Google.
  - `data-track-event="Lead"` marca los botones B2B (mayoristas y dotaciones); el resto envía `Contact`.
  - Google Ads solo cuenta la conversión cuando `GOOGLE_ADS_CONVERSION_LABEL` tiene el label real; mientras tanto envía un evento `whatsapp_click` genérico.
  - Para verificar el cableado sin IDs reales, abre la página con `?track=1`: cada clic imprime `[track] <evento> <label>` en la consola.
- **Fotos**: las imágenes en `public/img/` son fotos de stock de Freepik (descargadas con la cuenta premium de Magnific, sin requisito de atribución). Para usar fotos reales del negocio, reemplaza los archivos en `public/img/` manteniendo los mismos nombres (`bodega.jpg`, `satin.jpg`, `uniforme.jpg`, etc.).
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

1. En el repo: **Settings → Pages → Source → GitHub Actions**.
2. **Settings → Pages → Custom domain**: `telascolombia.com.co` (también está en `public/CNAME`). El `base` de `vite.config.js` es `/` porque el sitio se sirve desde la raíz del dominio.
3. Hacer push a `main`. El sitio queda en `https://telascolombia.com.co/`.

## Notas

- Los tokens de diseño (colores, tipografías, espaciados) viven como variables CSS en `src/styles/main.css` (`:root`).
- Las imágenes y otros assets estáticos van en `public/` y se referencian con rutas relativas a la raíz (Vite les aplica el `base` automáticamente).
