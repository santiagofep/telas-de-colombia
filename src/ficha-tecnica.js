// Telas de Colombia — generador de fichas técnicas en PDF.
// Reproduce el formato de la ficha oficial (logo, fecha automática, datos de la tela,
// enlaces reales de contacto) usando la misma tipografía del sitio (Instrument Sans + Inter).

import { jsPDF } from 'jspdf'

const BRAND_PURPLE = '#6b3fa0'
const INK = '#191527'
const MUTED = '#6b6483'

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

// Recorta el margen transparente alrededor del contenido real de un canvas.
function trimTransparent(canvas) {
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  const { data } = ctx.getImageData(0, 0, width, height)
  let top = null,
    bottom = null,
    left = null,
    right = null
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const alpha = data[(py * width + px) * 4 + 3]
      if (alpha > 8) {
        if (top === null) top = py
        bottom = py
        if (left === null || px < left) left = px
        if (right === null || px > right) right = px
      }
    }
  }
  if (top === null) return canvas // completamente transparente, no recortar.
  const w = right - left + 1
  const h = bottom - top + 1
  const trimmed = document.createElement('canvas')
  trimmed.width = w
  trimmed.height = h
  trimmed.getContext('2d').drawImage(canvas, left, top, w, h, 0, 0, w, h)
  return trimmed
}

// Recolorea un PNG (ícono en negro), recortando el margen transparente y con
// opacidad opcional ya "horneada" en el canal alfa (evita bugs de PDF).
// Devuelve { dataUrl, ratio } donde ratio = alto / ancho del contenido recortado.
async function tintIcon(url, color, opacity = 1) {
  const img = await loadImage(url)
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  ctx.globalCompositeOperation = 'source-in'
  ctx.fillStyle = color
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const trimmed = trimTransparent(canvas)
  const ratio = trimmed.height / trimmed.width

  if (opacity >= 1) return { dataUrl: trimmed.toDataURL('image/png'), ratio }

  const out = document.createElement('canvas')
  out.width = trimmed.width
  out.height = trimmed.height
  const octx = out.getContext('2d')
  octx.globalAlpha = opacity
  octx.drawImage(trimmed, 0, 0)
  return { dataUrl: out.toDataURL('image/png'), ratio }
}

async function fetchAsBase64(url) {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

let fontDataPromise = null
function getFontData() {
  if (!fontDataPromise) {
    fontDataPromise = Promise.all([
      fetchAsBase64('/fonts/Inter.ttf'),
      fetchAsBase64('/fonts/InstrumentSans.ttf'),
    ])
  }
  return fontDataPromise
}

async function registerFonts(doc) {
  const [interB64, instrumentB64] = await getFontData()
  doc.addFileToVFS('Inter.ttf', interB64)
  doc.addFont('Inter.ttf', 'Inter', 'normal')
  doc.addFileToVFS('InstrumentSans.ttf', instrumentB64)
  doc.addFont('InstrumentSans.ttf', 'InstrumentSans', 'normal')
}

function formatFechaHoy() {
  const hoy = new Date()
  const dd = String(hoy.getDate()).padStart(2, '0')
  const mm = String(hoy.getMonth() + 1).padStart(2, '0')
  const yyyy = hoy.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

// data: { tela, origen, tejido, acabado, composicion, peso, ancho }
export async function descargarFichaTecnica(data) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 22
  let y = 26

  const [isotipoPurple, isotipoWatermark] = await Promise.all([
    tintIcon('/img/isotipo.png', BRAND_PURPLE).catch(() => null),
    tintIcon('/img/isotipo.png', BRAND_PURPLE, 0.05).catch(() => null),
  ])
  await registerFonts(doc)

  // Marca de agua grande, centrada y dibujada de fondo primero (queda detrás
  // del resto del contenido, incluida la tabla de datos que va encima).
  if (isotipoWatermark) {
    const wmWidth = 150
    const wmHeight = wmWidth * isotipoWatermark.ratio
    doc.addImage(isotipoWatermark.dataUrl, 'PNG', (pageWidth - wmWidth) / 2, 115, wmWidth, wmHeight)
  }

  // Logotipo: centrado horizontalmente y más grande, ícono morado (recortado
  // a su proporción real) + wordmark nativo con la tipografía del sitio.
  const iconWidth = 20
  let iconHeight = iconWidth
  if (isotipoPurple) iconHeight = iconWidth * isotipoPurple.ratio

  doc.setFont('InstrumentSans', 'normal')
  doc.setFontSize(30)
  const wordmarkWidth = doc.getTextWidth('Telas de Colombia')
  const gap = 6
  const blockWidth = iconWidth + gap + wordmarkWidth
  const blockX = (pageWidth - blockWidth) / 2
  const iconMidY = y + iconHeight / 2

  if (isotipoPurple) {
    doc.addImage(isotipoPurple.dataUrl, 'PNG', blockX, y, iconWidth, iconHeight)
  }
  const textX = blockX + iconWidth + gap
  doc.setTextColor(BRAND_PURPLE)
  doc.text('Telas de Colombia', textX, iconMidY + 1)
  doc.setFont('Inter', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(MUTED)
  doc.text('By Grupo Macasi', textX, iconMidY + 6.5)
  y += Math.max(iconHeight, 14) + 22

  doc.setTextColor(INK)

  // Fecha.
  doc.setFont('Inter', 'normal')
  doc.setFontSize(11)
  doc.text(`Medellín ${formatFechaHoy()}`, marginX, y)
  y += 16

  // Párrafo introductorio.
  const intro =
    'Por medio de la presente estamos dando respuesta a su solicitud, sobre la información de esta ficha técnica.'
  const introLines = doc.splitTextToSize(intro, pageWidth - marginX * 2)
  doc.text(introLines, marginX, y)
  y += introLines.length * 6.5 + 20

  // Tabla de datos.
  const rows = [
    ['Tela:', data.tela],
    ['Origen:', data.origen],
    ['Tejido:', data.tejido],
    ['Acabado:', data.acabado],
    ['Composición:', data.composicion],
    ['Peso:', data.peso],
    ['Ancho:', data.ancho],
  ]

  doc.setFontSize(11)
  const labelX = marginX
  const valueX = marginX + 34
  for (const [label, value] of rows) {
    doc.setTextColor(MUTED)
    doc.text(label, labelX, y)
    doc.setTextColor(INK)
    doc.text(String(value), valueX, y)
    y += 11
  }
  y += 16

  doc.setTextColor(INK)
  doc.text('Quedamos a la espera de su requerimiento.', marginX, y)

  // Pie de página fijo, con enlaces reales.
  const footerY = 275
  doc.setDrawColor(BRAND_PURPLE)
  doc.setLineWidth(0.4)
  doc.line(marginX, footerY - 6, pageWidth - marginX, footerY - 6)

  doc.setFont('Inter', 'normal')
  doc.setFontSize(9)

  let fx = marginX
  const writeText = (text, color) => {
    doc.setTextColor(color)
    doc.text(text, fx, footerY)
    fx += doc.getTextWidth(text)
  }
  // Enlace de bajo nivel con el rectángulo calculado a mano: evita el bug
  // de textWithLink() en jsPDF 4.x, que a veces coloca la anotación en (0,0).
  const writeLink = (text, url) => {
    doc.setTextColor(BRAND_PURPLE)
    doc.text(text, fx, footerY)
    const width = doc.getTextWidth(text)
    doc.link(fx, footerY - 3.2, width, 4, { url })
    fx += width
  }

  writeText('Medellín: ', INK)
  writeLink('Calle 55#45-14', 'https://maps.google.com/?q=Calle+55+%2345-14+La+Candelaria+Medell%C3%ADn')
  writeText('   Celular: ', INK)
  writeLink('318-626-26-26', 'https://wa.me/573186262626')
  writeText('   Instagram: ', INK)
  writeLink('telascolombia_grupomacasi', 'https://www.instagram.com/telascolombia_grupomacasi/')

  const fileName = `Ficha-tecnica-${data.tela.replace(/\s+/g, '-')}.pdf`
  doc.save(fileName)
}

export function wireFichaTecnicaButtons() {
  document.querySelectorAll('[data-ficha-tecnica]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault()
      const data = JSON.parse(el.dataset.fichaTecnica)
      descargarFichaTecnica(data)
    })
  })
}
