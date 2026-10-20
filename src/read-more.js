// Telas de Colombia — "Mostrar más" para las introducciones largas.
// En cada página de tela, el texto de la primera sección (debajo del H1) se
// recorta a unas 3 líneas con un botón para desplegarlo. El texto completo
// sigue en el HTML, así que Google lo lee igual.

const COLLAPSED_HEIGHT = 82 // ~3 líneas de .section-intro (16px × 1.7)
const MIN_OVERFLOW = 50 // si solo sobra una línea, no vale la pena recortar

export function wireReadMore() {
  document.querySelectorAll('.page-hero + .section').forEach((section, i) => {
    const head = section.querySelector('.section-head')
    const content = [...section.children].filter((el) => el !== head)
    if (!content.length) return

    const box = document.createElement('div')
    box.className = 'read-more'
    box.id = `read-more-${i}`
    content.forEach((el) => box.appendChild(el))
    section.appendChild(box)

    if (box.scrollHeight <= COLLAPSED_HEIGHT + MIN_OVERFLOW) return

    box.classList.add('is-collapsed')
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'read-more-toggle'
    button.setAttribute('aria-controls', box.id)
    button.setAttribute('aria-expanded', 'false')
    button.textContent = 'Mostrar más'
    button.addEventListener('click', () => {
      const collapsed = box.classList.toggle('is-collapsed')
      button.textContent = collapsed ? 'Mostrar más' : 'Mostrar menos'
      button.setAttribute('aria-expanded', String(!collapsed))
    })
    section.appendChild(button)
  })
}
