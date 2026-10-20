// Telas de Colombia — test "¿Qué tela necesitas?".
// 4 preguntas: qué producto vas a hacer, qué priorizas, si necesitas algo
// especial y cuántas unidades. Las respuestas suman puntos a cada categoría
// de tela; se recomiendan las 3 con más puntos y, con el consumo promedio del
// producto y el ancho típico de cada tela, se estiman los metros necesarios.
//
// En el inicio se ofrece solo una vez: en computador se abre como ventana
// unos segundos después de entrar; en celular aparece primero una invitación
// pequeña (Google penaliza las ventanas que tapan la página en móvil).

const WHATSAPP = '573186262626'
const STORAGE_KEY = 'quizOfrecido'
const REOFFER_DAYS = 7
const OPEN_DELAY_MS = 4000
const ANCHO_REFERENCIA = 150 // cm: los consumos de PRODUCTOS están medidos a este ancho
const METROS_MAYORISTA = 15

// ancho: ancho típico (cm) de las referencias de cada categoría.
const TELAS = {
  dril: { nombre: 'Dril', url: '/dril.html', ancho: 160, por: 'Resistente y durable, el clásico de la dotación. Rígido o licrado.' },
  indigo: { nombre: 'Índigo (denim)', url: '/indigo.html', ancho: 170, por: 'La base de los jeans. Incluye Índigo No Wash, que no necesita lavandería.' },
  gabardina: { nombre: 'Gabardina', url: '/gabardina.html', ancho: 150, por: 'Sarga resistente con buena caída para pantalones y uniformes.' },
  twill: { nombre: 'Twill', url: '/twill.html', ancho: 150, por: 'Tejido diagonal resistente para pantalones y chaquetas.' },
  'rib-stop': { nombre: 'Rib stop', url: '/rib-stop.html', ancho: 150, por: 'No se rasga fácil: ideal para trabajo pesado y outdoor.' },
  oxford: { nombre: 'Oxford', url: '/oxford.html', ancho: 150, por: 'Camisas de dotación empresarial, de fácil cuidado.' },
  popelina: { nombre: 'Popelina', url: '/popelina.html', ancho: 150, por: 'Fina y fresca, clásica de la camisería.' },
  pique: { nombre: 'Piqué', url: '/pique.html', ancho: 180, por: 'Fresco y transpirable, el de las camisetas tipo polo.' },
  franela: { nombre: 'Franela y tela fría', url: '/franela.html', ancho: 160, por: 'Suave y cómoda: pijamas, camisetas y ropa casual.' },
  rib: { nombre: 'Rib', url: '/rib.html', ancho: 150, por: 'Punto elástico para cuellos, puños y ropa deportiva.' },
  antifluidos: { nombre: 'Antifluidos', url: '/antifluidos.html', ancho: 150, por: 'Repele líquidos: uniformes médicos y de laboratorio.' },
  'no-tejido': { nombre: 'No tejido y guata', url: '/no-tejido.html', ancho: 150, por: 'Para salud, empaques, relleno y refuerzos.' },
  entretela: { nombre: 'Entretela', url: '/entretela.html', ancho: 150, por: 'Da estructura a cuellos, puños y bolsos.' },
  lona: { nombre: 'Lona', url: '/lona.html', ancho: 160, por: 'Muy resistente: bolsos, gorras, carpas, tapicería y sublimación.' },
  peleteria: { nombre: 'Peletería', url: '/peleteria.html', ancho: 140, por: 'Imitación de piel (Lince) para gorras, zapatos, forros y abrigo.' },
  burda: { nombre: 'Burda', url: '/burda.html', ancho: 150, por: 'Gruesa y rústica, con estilo artesanal.' },
  poncho: { nombre: 'Poncho', url: '/poncho.html', ancho: 120, por: 'Gruesa y abrigada, para ponchos y ruanas.' },
  hogar: { nombre: 'Telas para hogar', url: '/hogar.html', ancho: 150, por: 'Sábanas, toallas, cobijas y textiles para la casa.' },
  moda: { nombre: 'Moda', url: '/moda.html', ancho: 150, por: 'Telas de tendencia para colecciones de temporada.' },
}

// consumo: metros por unidad en tela de ANCHO_REFERENCIA (talla M adulto,
// promedio de confección). fijo: el consumo no depende del ancho de la tela
// recomendada (ya está medido en la tela que se usa para ese producto).
const PRODUCTOS = [
  { label: 'Camisetas', unidad: 'camisetas', consumo: 0.7, puntos: { franela: 3, pique: 2, rib: 1 } },
  { label: 'Camisetas tipo polo', unidad: 'polos', consumo: 0.8, puntos: { pique: 4, rib: 1 } },
  { label: 'Camisas o blusas', unidad: 'camisas', consumo: 1.5, puntos: { popelina: 4, oxford: 3, moda: 1 } },
  { label: 'Pantalones o jeans', unidad: 'pantalones', consumo: 1.5, puntos: { indigo: 4, gabardina: 2, twill: 2, dril: 2 } },
  { label: 'Uniformes de trabajo (camisa + pantalón)', unidad: 'uniformes', consumo: 3.0, puntos: { dril: 4, oxford: 2, 'rib-stop': 2, gabardina: 1 } },
  { label: 'Uniformes médicos (blusa + pantalón)', unidad: 'uniformes', consumo: 2.6, puntos: { antifluidos: 5, 'no-tejido': 1 } },
  { label: 'Pijamas o sudaderas (conjunto)', unidad: 'conjuntos', consumo: 2.2, puntos: { franela: 4, rib: 1 } },
  { label: 'Chaquetas o ropa de abrigo', unidad: 'chaquetas', consumo: 2.0, puntos: { peleteria: 2, poncho: 2, burda: 2, gabardina: 1, franela: 1 } },
  { label: 'Gorras', unidad: 'gorras', consumo: 0.15, puntos: { peleteria: 3, lona: 2, dril: 2, gabardina: 1 } },
  { label: 'Bolsos o morrales', unidad: 'bolsos', consumo: 0.5, puntos: { lona: 4, burda: 1 } },
  { label: 'Juegos de sábanas (doble)', unidad: 'juegos de sábanas', consumo: 5.5, fijo: 'en género de 2,60 m de ancho', puntos: { hogar: 6 } },
  { label: 'Toallas de cuerpo', unidad: 'toallas', consumo: 0.7, fijo: 'en toalla de 1,50 m de ancho', puntos: { hogar: 6 } },
  { label: 'Cojines (funda de 45 × 45 cm)', unidad: 'cojines', consumo: 0.25, puntos: { lona: 2, peleteria: 2, burda: 2 } },
  { label: 'Rellenos o refuerzos para prendas', unidad: 'prendas', consumo: 0.3, puntos: { entretela: 3, 'no-tejido': 3 } },
]

const PREGUNTAS = [
  { id: 'producto', titulo: '¿Qué vas a hacer?', opciones: PRODUCTOS, columnas: true },
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
  { id: 'unidades', titulo: '¿Cuántas unidades vas a hacer?', tipo: 'numero' },
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

const formatoMetros = (m) => (m < 10 ? m.toFixed(1).replace('.', ',') : String(Math.ceil(m)))

function recomendar(opciones) {
  const puntos = {}
  opciones.forEach((opcion) => {
    for (const [tela, p] of Object.entries(opcion.puntos)) puntos[tela] = (puntos[tela] || 0) + p
  })
  return Object.entries(puntos)
    .filter(([, p]) => p > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => TELAS[key])
}

// Metros estimados de una tela para N unidades del producto.
function metros(producto, tela, unidades) {
  if (!unidades) return null
  const factor = producto.fijo ? 1 : ANCHO_REFERENCIA / tela.ancho
  return unidades * producto.consumo * factor
}

function whatsappUrl({ producto, prioridad, especial, unidades }, telas) {
  const lineas = [
    'Hola, hice el test de la página web.',
    unidades ? `Voy a hacer ${unidades} ${producto.unidad}.` : `Voy a hacer: ${producto.label.toLowerCase()}.`,
    `Lo más importante: ${prioridad.label.toLowerCase()}.`,
    especial.label.startsWith('Ninguna') ? null : `Necesito: ${especial.label.toLowerCase()}.`,
    `Me recomendó: ${telas
      .map((t) => {
        const m = metros(producto, t, unidades)
        return m ? `${t.nombre} (aprox. ${formatoMetros(m)} m)` : t.nombre
      })
      .join(', ')}.`,
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
  let respuestas = {}

  function avanzar() {
    paso += 1
    if (paso < PREGUNTAS.length) renderPregunta()
    else renderResultado()
  }

  function renderIntro() {
    const start = el('button', { type: 'button', class: 'btn-primary quiz-start', text: 'Empezar el test →' })
    start.addEventListener('click', () => {
      paso = 0
      respuestas = {}
      renderPregunta()
    })
    body.replaceChildren(
      el('p', { class: 'quiz-eyebrow', text: 'Test de 4 preguntas' }),
      el('h2', { id: 'quiz-title', text: '¿Qué tela necesitas?' }),
      el('p', { class: 'quiz-lead', text: 'Cuéntanos qué vas a hacer y cuántas unidades: te recomendamos las telas que mejor se ajustan y cuántos metros vas a necesitar.' }),
      start
    )
  }

  function renderOpciones(pregunta) {
    const opciones = el('div', { class: pregunta.columnas ? 'quiz-options quiz-options--cols' : 'quiz-options' })
    pregunta.opciones.forEach((opcion) => {
      const b = el('button', { type: 'button', class: 'quiz-option', text: opcion.label })
      b.addEventListener('click', () => {
        respuestas[pregunta.id] = opcion
        avanzar()
      })
      opciones.appendChild(b)
    })
    return opciones
  }

  function renderNumero() {
    const producto = respuestas.producto
    const input = el('input', {
      type: 'number',
      class: 'quiz-input',
      min: '1',
      step: '1',
      inputmode: 'numeric',
      placeholder: 'Ej: 50',
      'aria-label': `Número de ${producto.unidad}`,
    })
    if (respuestas.unidades) input.value = respuestas.unidades
    const submit = el('button', { type: 'submit', class: 'btn-primary', text: 'Ver mi recomendación →' })
    const form = el('form', { class: 'quiz-number' }, [
      el('div', { class: 'quiz-number-row' }, [input, el('span', { text: producto.unidad })]),
      submit,
    ])
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const n = Math.floor(Number(input.value))
      if (!n || n < 1) {
        input.focus()
        input.setCustomValidity('Escribe cuántas unidades vas a hacer')
        input.reportValidity()
        return
      }
      respuestas.unidades = n
      avanzar()
    })
    input.addEventListener('input', () => input.setCustomValidity(''))

    const skip = el('button', { type: 'button', class: 'quiz-back', text: 'Todavía no sé cuántas' })
    skip.addEventListener('click', () => {
      respuestas.unidades = null
      avanzar()
    })
    const hint = el('p', {
      class: 'quiz-hint',
      text: 'Con esto te damos un cálculo aproximado de metros; siempre conviene confirmarlo con tu muestra o tu cortador.',
    })
    return [form, hint, el('div', { class: 'quiz-skip' }, [skip])]
  }

  function renderPregunta() {
    const pregunta = PREGUNTAS[paso]
    const contenido = pregunta.tipo === 'numero' ? renderNumero() : [renderOpciones(pregunta)]

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
      ...contenido,
      nav
    )
    body.querySelector('input, .quiz-option')?.focus()
  }

  function renderResultado() {
    const { producto, prioridad, especial, unidades } = respuestas
    const telas = recomendar([producto, prioridad, especial])

    const lista = el('ol', { class: 'quiz-results' })
    let maxMetros = 0
    telas.forEach((tela) => {
      const m = metros(producto, tela, unidades)
      if (m) maxMetros = Math.max(maxMetros, m)
      const info = el('div', {}, [el('strong', { text: tela.nombre }), el('p', { text: tela.por })])
      if (m) {
        const ancho = producto.fijo ? producto.fijo : `en tela de ${tela.ancho} cm de ancho`
        info.appendChild(el('p', { class: 'quiz-metros', text: `≈ ${formatoMetros(m)} m ${ancho}` }))
      }
      lista.appendChild(el('li', {}, [info, el('a', { href: tela.url, class: 'quiz-result-link', text: 'Ver tela →' })]))
    })

    const resumen = unidades
      ? `Para ${unidades} ${producto.unidad}, estos serían los metros aproximados:`
      : 'Cuando sepas cuántas unidades vas a hacer, te calculamos los metros por WhatsApp.'

    const aviso = unidades
      ? el('div', { class: 'quiz-disclaimer', role: 'note' }, [
          el('strong', { text: 'Cálculo aproximado' }),
          el('p', {
            text: 'Estos metros salen de consumos promedio por prenda (talla M) y son solo una guía. Antes de comprar, verifícalos siempre con el consumo real de tu muestra o con tu cortador de confianza: cambian según las tallas, el molde, el trazo y si la tela tiene dirección o estampado. Te recomendamos sumar un margen de 5 a 10 %.',
          }),
        ])
      : null

    const notas = []
    if (maxMetros > METROS_MAYORISTA) notas.push('Por más de 15 metros o rollos completos manejamos precio de mayorista.')
    if (/uniformes/.test(producto.unidad) && unidades >= 20) notas.push('Para dotaciones también te ofrecemos el paquete completo: tela, confección y prendas listas.')

    const wa = el('a', {
      class: 'btn-primary',
      href: whatsappUrl(respuestas, telas),
      target: '_blank',
      rel: 'noopener',
      'data-track': 'whatsapp',
      'data-track-label': 'quiz-resultado',
      text: 'Pedir asesoría por WhatsApp →',
    })
    if (maxMetros > METROS_MAYORISTA) wa.setAttribute('data-track-event', 'Lead')

    const again = el('button', { type: 'button', class: 'quiz-back', text: 'Volver a hacer el test' })
    again.addEventListener('click', renderIntro)

    body.replaceChildren(
      el('p', { class: 'quiz-eyebrow', text: 'Tu recomendación' }),
      el('h2', { id: 'quiz-title', text: 'Estas telas te pueden servir' }),
      el('p', { class: 'quiz-summary', text: resumen }),
      lista,
      ...(aviso ? [aviso] : []),
      ...notas.map((t) => el('p', { class: 'quiz-note', text: t })),
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
  const text = el('p', {}, [el('strong', { text: '¿No sabes qué tela elegir?' }), document.createTextNode(' Responde 4 preguntas y te decimos cuál y cuántos metros necesitas.')])
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
