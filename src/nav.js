// Telas de Colombia — menú móvil (hamburguesa) del header y header fijo
// que se compacta al bajar.

function wireStickyHeader() {
  const header = document.querySelector('.site-header')
  if (!header) return
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8)
  update()
  window.addEventListener('scroll', update, { passive: true })
}

export function wireMobileNav() {
  wireStickyHeader()
  const toggle = document.querySelector('.nav-toggle')
  const nav = document.getElementById('site-nav')
  if (!toggle || !nav) return

  const closeNav = () => {
    nav.classList.remove('is-open')
    toggle.setAttribute('aria-expanded', 'false')
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open')
    toggle.setAttribute('aria-expanded', String(isOpen))
  })

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav)
  })

  document.addEventListener('click', (event) => {
    if (!nav.classList.contains('is-open')) return
    if (nav.contains(event.target) || toggle.contains(event.target)) return
    closeNav()
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) closeNav()
  })
}
