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

function track(name, params) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', name === 'Lead' ? 'Lead' : 'Contact', params)
  }
  if (typeof window.gtag === 'function' && adsConfigured()) {
    window.gtag('event', 'conversion', {
      send_to: window.GOOGLE_ADS_ID + '/' + window.GOOGLE_ADS_CONVERSION_LABEL,
      event_category: 'contacto',
      event_label: (params && params.content_name) || name,
    })
  }
}

function initTracking() {
  loadMetaPixel()
  loadGoogleAds()
  document.querySelectorAll('[data-track="whatsapp"]').forEach((el) => {
    el.addEventListener('click', () => track('Contact', { content_name: 'whatsapp' }))
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initTracking()
})
