// Telas de Colombia — buscador de telas por palabra clave / uso.
// Filtra las tarjetas de #telas-grid comparando el texto visible de cada una
// (nombre + descripción) más una lista de usos típicos que no siempre están
// escritos en la tarjeta (ej. "jean" para Índigo, "carpa" para Lona).

const EXTRA_KEYWORDS = {
  Antifluidos: 'salud hospital clinica enfermero medico laboratorio aseo',
  Burda: 'forro empaque economica base perchada abrigo invierno frio peluche',
  Dril: 'uniforme dotacion trabajo pesado industrial pantalon overol vulcano galeon orion camila jean licrado elastano licra comodo movimiento everest balsato santana monserrat',
  Entretela: 'cuello puño refuerzo camisa estructura',
  Franela: 'pijama camiseta abrigo suave invierno',
  Gabardina: 'pantalon chaqueta uniforme formal saco',
  Hogar: 'sabana cortina mantel decoracion cojin funda genero linea cobija paño lency toalla algodon siliconado almohada dulceabrigo pañal microfibra limpion camiseta punto jardin azafran satin rayas clavel estampado quirurgico comertex poliester',
  Índigo: 'jean denim mezclilla moda urbana',
  Lona: 'carpa toldo bolso tapiceria impermeable industrial lienzo sublimar calima sheeting coraza cruda blanco',
  Moda: 'tendencia coleccion temporada diseño',
  'No tejido': 'empaque filtro tecnico mascarilla desechable',
  Oxford: 'camisa dotacion empresarial formal oficina',
  Peletería: 'piel pelo invierno abrigo sintetico peluche',
  Piqué: 'polo deportivo uniforme camiseta',
  Poncho: 'ruana abrigo frio capa',
  Popelina: 'camisa formal fina plana',
  Rib: 'cuello puño deportivo elastico',
  'Rib stop': 'outdoor trabajo rasgado resistente militar',
  Twill: 'pantalon chaqueta uniforme sarga',
}

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

export function wireTelaSearch() {
  const input = document.getElementById('tela-search-input')
  const grid = document.getElementById('telas-grid')
  const emptyMsg = document.getElementById('tela-search-empty')
  if (!input || !grid) return

  const cards = Array.from(grid.querySelectorAll('.tela-card')).map((card) => {
    const name = card.querySelector('h3')?.textContent.trim() || ''
    const desc = card.querySelector('.tela-body p')?.textContent.trim() || ''
    const extra = EXTRA_KEYWORDS[name] || ''
    return { card, haystack: normalize(`${name} ${desc} ${extra}`) }
  })

  input.addEventListener('input', () => {
    const query = normalize(input.value.trim())
    const words = query.split(/\s+/).filter(Boolean)
    let visibleCount = 0

    for (const { card, haystack } of cards) {
      const matches = words.length === 0 || words.every((w) => haystack.includes(w))
      card.style.display = matches ? '' : 'none'
      if (matches) visibleCount++
    }

    if (words.length > 0 && visibleCount === 0) {
      emptyMsg.hidden = false
      emptyMsg.querySelector('span').textContent = input.value.trim()
    } else {
      emptyMsg.hidden = true
    }
  })
}
