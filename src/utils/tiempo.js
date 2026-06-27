/**
 * Helpers de tiempo previsional. Convención: internamente trabajamos en MESES
 * (los previsionalistas piensan en años/meses/días). 1 año = 12 meses, y los
 * decimales de mes se pasan a días con ×30 (criterio del especialista).
 */

export const ANIOS_REQUERIDOS = 30
export const MESES_REQUERIDOS = ANIOS_REQUERIDOS * 12 // 360

/** años + meses → meses totales */
export function aMeses(anios = 0, meses = 0) {
  return (Number(anios) || 0) * 12 + (Number(meses) || 0)
}

/** meses (puede tener decimales) → { a, m, d } */
export function descomponer(mesesTotales) {
  const safe = Math.max(0, Number(mesesTotales) || 0)
  const a = Math.floor(safe / 12)
  const mesesResto = safe - a * 12
  const m = Math.floor(mesesResto)
  const d = Math.round((mesesResto - m) * 30) // decimal de mes → días
  return { a, m, d }
}

/** meses → "X a Y m Z d" (omite las partes en cero salvo que todo sea 0) */
export function fmtTiempo(mesesTotales) {
  const { a, m, d } = descomponer(mesesTotales)
  const partes = []
  if (a) partes.push(`${a} a`)
  if (m) partes.push(`${m} m`)
  if (d) partes.push(`${d} d`)
  return partes.length ? partes.join(' ') : '0 m'
}
