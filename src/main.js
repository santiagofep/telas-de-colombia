// Telas de Colombia — tracking de conversiones (Meta Pixel + Google Ads).

// --- Tracking -------------------------------------------------
// Los pixeles solo se cargan si los IDs placeholder fueron
// reemplazados por valores reales en index.html.

function pixelConfigured() {
  return window.META_PIXEL_ID && window.META_PIXEL_ID !== 'TU_PIXEL_ID'
}

function adsConfigured() {
  return window.GOOGLE_ADS_ID && window.GOOGLE_ADS_ID !== 'AW-XXXXXXXXX'
}

function adsLabelConfigured() {
  return window.GOOGLE_ADS_CONVERSION_LABEL && window.GOOGLE_ADS_CONVERSION_LABEL !== 'TU_LABEL'
}

// Con ?track=1 en la URL (o localStorage.track = "1") los eventos se
// imprimen en consola, útil para verificar el cableado sin IDs reales.
function debugEnabled() {
  try {
    return /[?&]track=1/.test(location.search) || localStorage.getItem('track') === '1'
  } catch (e) {
    return false
  }
}

function loadMetaPixel() {
  if (!pixelConfigured() || window.fbq) return
  const n = (window.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
  })
  if (!window._fbq) window._fbq = n
  n.push = n
  n.loaded = true
  n.version = '2.0'
  n.queue = []
  const t = document.createElement('script')
  t.async = true
  t.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(t)
  window.fbq('init', window.META_PIXEL_ID)
  window.fbq('track', 'PageView')
}

function loadGoogleAds() {
  if (!adsConfigured() || window.gtag) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer.push(arguments)
  }
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.GOOGLE_ADS_ID
  document.head.appendChild(s)
  window.gtag('js', new Date())
  window.gtag('config', window.GOOGLE_ADS_ID)
}

// name: "Contact" (detal) o "Lead" (mayoristas / dotaciones).
// label: identifica el botón (header, hero, tela-seda, mayoristas…).
function track(name, label) {
  const event = name === 'Lead' ? 'Lead' : 'Contact'
  if (debugEnabled()) {
    console.log('[track]', event, label, {
      meta: pixelConfigured(),
      ads: adsConfigured(),
      adsLabel: adsLabelConfigured(),
    })
  }
  if (typeof window.fbq === 'function') {
    window.fbq('track', event, { content_name: label, content_category: 'whatsapp' })
  }
  if (typeof window.gtag === 'function' && adsConfigured()) {
    if (adsLabelConfigured()) {
      window.gtag('event', 'conversion', {
        send_to: window.GOOGLE_ADS_ID + '/' + window.GOOGLE_ADS_CONVERSION_LABEL,
        value: 1.0,
        currency: 'COP',
        event_category: 'contacto',
        event_label: label,
      })
    } else {
      // Sin label de conversión solo queda el evento genérico (no cuenta
      // como conversión en Google Ads hasta configurar TU_LABEL).
      window.gtag('event', 'whatsapp_click', { event_category: 'contacto', event_label: label })
    }
  }
}

function initTracking() {
  loadMetaPixel()
  loadGoogleAds()
  document.querySelectorAll('[data-track="whatsapp"]').forEach((el) => {
    el.addEventListener('click', () => {
      track(el.dataset.trackEvent || 'Contact', el.dataset.trackLabel || 'whatsapp')
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initTracking()
})
