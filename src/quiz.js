// Telas de Colombia — test "¿Qué tela necesitas?".
// 4 preguntas que suman puntos a cada categoría de tela; al final se
// recomiendan las 3 con más puntos, con enlace a su página y un WhatsApp
// que ya lleva las respuestas.
//
// En el inicio se ofrece solo una vez: en computador se abre como ventana
// unos segundos después de entrar; en celular aparece primero una invitación
// pequeña (Google penaliza las ventanas que tapan la página en móvil).

const WHATSAPP = '573186262626'
const STORAGE_KEY = 'quizOfrecido'
const REOFFER_DAYS = 7
const OPEN_DELAY_MS = 4000

const TELAS = {
  dril: { nombre: 'Dril', url: '/dril.html', por: 'Resistente y durable, el clásico de la dotación. Rígido o licrado.' },
  indigo: { nombre: 'Índigo (denim)', url: '/indigo.html', por: 'La base de los jeans. Incluye Índigo No Wash, que no necesita lavandería.' },
  gabardina: { nombre: 'Gabardina', url: '/gabardina.html', por: 'Sarga resistente con buena caída para pantalones y uniformes.' },
  twill: { nombre: 'Twill', url: '/twill.html', por: 'Tejido diagonal resistente para pantalones y chaquetas.' },
  'rib-stop': { nombre: 'Rib stop', url: '/rib-stop.html', por: 'No se rasga fácil: ideal para trabajo pesado y outdoor.' },
  oxford: { nombre: 'Oxford', url: '/oxford.html', por: 'Camisas de dotación empresarial, de fácil cuidado.' },
  popelina: { nombre: 'Popelina', url: '/popelina.html', por: 'Fina y fresca, clásica de la camisería.' },
  pique: { nombre: 'Piqué', url: '/pique.html', por: 'Fresco y transpirable, el de las camisetas tipo polo.' },
  franela: { nombre: 'Franela y tela fría', url: '/franela.html', por: 'Suave y cómoda: pijamas, camisetas y ropa casual.' },
  rib: { nombre: 'Rib', url: '/rib.html', por: 'Punto elástico para cuellos, puños y ropa deportiva.' },
  antifluidos: { nombre: 'Antifluidos', url: '/antifluidos.html', por: 'Repele líquidos: uniformes médicos y de laboratorio.' },
  'no-tejido': { nombre: 'No tejido y guata', url: '/no-tejido.html', por: 'Para salud, empaques, relleno y refuerzos.' },
  entretela: { nombre: 'Entretela', url: '/entretela.html', por: 'Da estructura a cuellos, puños y bolsos.' },
  lona: { nombre: 'Lona', url: '/lona.html', por: 'Muy resistente: bolsos, carpas, toldos, tapicería y sublimación.' },
  peleteria: { nombre: 'Peletería', url: '/peleteria.html', por: 'Imitación de piel para gorras, zapatos, forros y abrigo.' },
  burda: { nombre: 'Burda', url: '/burda.html', por: 'Gruesa y rústica, con estilo artesanal.' },
  poncho: { nombre: 'Poncho', url: '/poncho.html', por: 'Gruesa y abrigada, para ponchos y ruanas.' },
  hogar: { nombre: 'Telas para hogar', url: '/hogar.html', por: 'Sábanas, toallas, cobijas y textiles para la casa.' },
  moda: { nombre: 'Moda', url: '/moda.html', por: 'Telas de tendencia para colecciones de temporada.' },
}

// Cada opción suma puntos a las categorías de TELAS.
const PREGUNTAS = [
  {
    id: 'uso',
    titulo: '¿Qué vas a confeccionar?',
    opciones: [
      { label: 'Uniformes o dotación de trabajo', puntos: { dril: 4, oxford: 2, gabardina: 2, 'rib-stop': 2, twill: 1 } },
      { label: 'Jeans o pantalones', puntos: { indigo: 4, gabardina: 2, twill: 2, dril: 1 } },
      { label: 'Camisetas, polos o ropa deportiva', puntos: { pique: 4, franela: 2, rib: 2 } },
      { label: 'Camisas o blusas', puntos: { popelina: 4, oxford: 3, moda: 1 } },
      { label: 'Ropa de abrigo o pijamas', puntos: { franela: 4, peleteria: 2, poncho: 2, burda: 1 } },
      { label: 'Uniformes médicos o de salud', puntos: { antifluidos: 5, 'no-tejido': 2 } },
      { label: 'Sábanas, toallas o cosas para el hogar', puntos: { hogar: 6 } },
      { label: 'Bolsos, gorras, carpas o tapicería', puntos: { lona: 4, peleteria: 2, burda: 1 } },
      { label: 'Rellenos, forros o refuerzos', puntos: { entretela: 3, 'no-tejido': 3, burda: 1 } },
    ],
  },
  {
    id: 'prioridad',
    titulo: '¿Qué es lo más importante en tu tela?',
    opciones: [
      { label: 'Que sea resistente y dure mucho', puntos: { dril: 2, lona: 2, 'rib-stop': 2, indigo: 1, twill: 1 } },
      { label: 'Que sea cómoda o elástica', puntos: { franela: 2, rib: 2, pique: 1, dril: 1 } },
      { label: 'Que sea fresca y liviana', puntos: { popelina: 2, pique: 2, antifluidos: 1 } },
      { label: 'Que abrigue y sea suave', puntos: { franela: 2, peleteria: 2, poncho: 2, burda: 1 } },
      { label: 'Que se vea elegante o de moda', puntos: { moda: 2, gabardina: 1, popelina: 1, oxford: 1 } },
    ],
  },
  {
    id: 'especial',
    titulo: '¿Necesitas alguna característica especial?',
    opciones: [
      { label: 'Que repela líquidos', puntos: { antifluidos: 4 } },
      { label: 'Que no necesite lavandería', puntos: { indigo: 4 } },
      { label: 'Que se pueda sublimar o estampar', puntos: { lona: 2, pique: 1 } },
      { label: 'Que sea económica', puntos: { 'no-tejido': 1, burda: 1, lona: 1 } },
      { label: 'Ninguna en especial', puntos: {} },
    ],
  },
  {
    id: 'cantidad',
    titulo: '¿Cuánta tela necesitas?',
    opciones: [
      { label: 'Poca: de 1 a 5 metros', puntos: {} },
      { label: 'Media: de 6 a 15 metros', puntos: {} },
      { label: 'Mucha: más de 15 metros o rollos', puntos: {} },
      { label: 'Un paquete completo de dotación', puntos: {} },
    ],
  },
]

function storageGet() {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0
  } catch (e) {
    return 0
  }
}

function storageMarkOffered() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch (e) {
    /* sin almacenamiento: el test se puede volver a ofrecer, no pasa nada */
  }
}

function recentlyOffered() {
  return Date.now() - storageGet() < REOFFER_DAYS * 24 * 60 * 60 * 1000
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v
    else if (k === 'text') node.textContent = v
    else node.setAttribute(k, v)
  }
  for (const child of [].concat(children)) if (child) node.appendChild(child)
  return node
}

function recomendar(respuestas) {
  const puntos = {}
  respuestas.forEach((opcion) => {
    for (const [tela, p] of Object.entries(opcion.puntos)) puntos[tela] = (puntos[tela] || 0) + p
  })
  return Object.entries(puntos)
    .filter(([, p]) => p > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => TELAS[key])
}

function whatsappUrl(respuestas, telas) {
  const [uso, prioridad, especial, cantidad] = respuestas.map((r) => r.label.toLowerCase())
  const lineas = [
    'Hola, hice el test de la página web.',
    `Voy a confeccionar: ${uso}.`,
    `Lo más importante: ${prioridad}.`,
    especial.startsWith('ninguna') ? null : `Necesito: ${especial}.`,
    `Cantidad: ${cantidad}.`,
    `Me recomendó: ${telas.map((t) => t.nombre).join(', ')}.`,
    '¿Me pueden asesorar?',
  ].filter(Boolean)
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`
}

function buildDialog() {
  const dialog = el('dialog', { class: 'quiz', 'aria-labelledby': 'quiz-title' })
  const close = el('button', { type: 'button', class: 'quiz-close', 'aria-label': 'Cerrar' })
  close.innerHTML = '&times;'
  close.addEventListener('click', () => dialog.close())
  const body = el('div', { class: 'quiz-body' })
  dialog.append(close, body)
  // Cerrar al hacer clic fuera de la ventana.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close()
  })
  document.body.appendChild(dialog)

  let paso = 0
  let respuestas = []

  function renderIntro() {
    body.replaceChildren(
      el('p', { class: 'quiz-eyebrow', text: 'Test de 4 preguntas' }),
      el('h2', { id: 'quiz-title', text: '¿Qué tela necesitas?' }),
      el('p', { class: 'quiz-lead', text: 'Responde 4 preguntas rápidas y te recomendamos las telas que mejor se ajustan a tu proyecto.' }),
      (() => {
        const start = el('button', { type: 'button', class: 'btn-primary quiz-start', text: 'Empezar el test →' })
        start.addEventListener('click', () => {
          paso = 0
          respuestas = []
          renderPregunta()
        })
        return start
      })()
    )
  }

  function renderPregunta() {
    const pregunta = PREGUNTAS[paso]
    const opciones = el('div', { class: 'quiz-options' })
    pregunta.opciones.forEach((opcion) => {
      const b = el('button', { type: 'button', class: 'quiz-option', text: opcion.label })
      b.addEventListener('click', () => {
        respuestas[paso] = opcion
        paso += 1
        if (paso < PREGUNTAS.length) renderPregunta()
        else renderResultado()
      })
      opciones.appendChild(b)
    })

    const nav = el('div', { class: 'quiz-nav' })
    if (paso > 0) {
      const back = el('button', { type: 'button', class: 'quiz-back', text: '← Atrás' })
      back.addEventListener('click', () => {
        paso -= 1
        renderPregunta()
      })
      nav.appendChild(back)
    }

    const progreso = el('div', { class: 'quiz-progress', 'aria-hidden': 'true' }, [
      el('span', { style: `width:${((paso + 1) / PREGUNTAS.length) * 100}%` }),
    ])

    body.replaceChildren(
      el('p', { class: 'quiz-eyebrow', text: `Pregunta ${paso + 1} de ${PREGUNTAS.length}` }),
      progreso,
      el('h2', { id: 'quiz-title', text: pregunta.titulo }),
      opciones,
      nav
    )
    opciones.querySelector('button').focus()
  }

  function renderResultado() {
    const telas = recomendar(respuestas)
    const cantidad = respuestas[3].label
    const lista = el('ol', { class: 'quiz-results' })
    telas.forEach((tela) => {
      lista.appendChild(
        el('li', {}, [
          el('div', {}, [el('strong', { text: tela.nombre }), el('p', { text: tela.por })]),
          el('a', { href: tela.url, class: 'quiz-result-link', text: 'Ver tela →' }),
        ])
      )
    })

    const nota = cantidad.startsWith('Un paquete')
      ? 'Para un paquete completo de dotación te asesoramos con la tela, la confección y las prendas.'
      : cantidad.startsWith('Mucha')
        ? 'Por más de 15 metros o rollos completos manejamos precio de mayorista.'
        : 'Te confirmamos precio, colores y disponibilidad por WhatsApp.'

    const wa = el('a', {
      class: 'btn-primary',
      href: whatsappUrl(respuestas, telas),
      target: '_blank',
      rel: 'noopener',
      'data-track': 'whatsapp',
      'data-track-label': 'quiz-resultado',
      text: 'Pedir asesoría por WhatsApp →',
    })
    if (cantidad.startsWith('Mucha') || cantidad.startsWith('Un paquete')) wa.setAttribute('data-track-event', 'Lead')

    const again = el('button', { type: 'button', class: 'quiz-back', text: 'Volver a hacer el test' })
    again.addEventListener('click', renderIntro)

    body.replaceChildren(
      el('p', { class: 'quiz-eyebrow', text: 'Tu recomendación' }),
      el('h2', { id: 'quiz-title', text: 'Estas telas te pueden servir' }),
      lista,
      el('p', { class: 'quiz-note', text: nota }),
      el('div', { class: 'quiz-actions' }, [wa, again])
    )
  }

  return {
    open() {
      storageMarkOffered()
      renderIntro()
      if (!dialog.open) dialog.showModal()
    },
  }
}

function showInvite(quiz) {
  storageMarkOffered()
  const invite = el('div', { class: 'quiz-invite', role: 'dialog', 'aria-label': 'Test para elegir tela' })
  const text = el('p', {}, [el('strong', { text: '¿No sabes qué tela elegir?' }), document.createTextNode(' Responde 4 preguntas y te recomendamos una.')])
  const go = el('button', { type: 'button', class: 'btn-primary', text: 'Hacer el test' })
  const dismiss = el('button', { type: 'button', class: 'quiz-close', 'aria-label': 'Cerrar' })
  dismiss.innerHTML = '&times;'
  go.addEventListener('click', () => {
    invite.remove()
    quiz.open()
  })
  dismiss.addEventListener('click', () => invite.remove())
  invite.append(dismiss, text, go)
  document.body.appendChild(invite)
}

export function wireQuiz() {
  if (typeof HTMLDialogElement === 'undefined') return
  const triggers = document.querySelectorAll('[data-quiz-open]')
  const isHome = location.pathname === '/' || location.pathname.endsWith('/index.html')
  if (!triggers.length && !isHome) return

  const quiz = buildDialog()
  triggers.forEach((t) => t.addEventListener('click', () => quiz.open()))

  if (!isHome || recentlyOffered()) return
  setTimeout(() => {
    if (document.querySelector('dialog[open]')) return
    if (window.matchMedia('(min-width: 768px)').matches) quiz.open()
    else showInvite(quiz)
  }, OPEN_DELAY_MS)
}
