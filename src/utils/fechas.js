/**
 * Helpers de fechas para el cómputo previsional.
 * El cómputo de DERECHO se hace a nivel MENSUAL: un mes (YYYY-MM) cuenta una
 * sola vez aunque haya varias actividades en simultáneo (regla ANSES: los
 * servicios simultáneos no se desdoblan).
 */

/** "YYYY-MM-DD" → Date local (o null si inválida) */
export function parse(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

/** Último día del mes de una fecha */
export function ultimoDiaMes(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

/** ¿La fecha cae antes de fin de su mes? (turno parcial) */
export function esAntesDeFinDeMes(date) {
  return date.getDate() < ultimoDiaMes(date)
}

/** Diferencia en meses decimales (días residuales / 30). 0 si hasta <= desde. */
export function diffMeses(desde, hasta) {
  if (!desde || !hasta || hasta <= desde) return 0
  let meses =
    (hasta.getFullYear() - desde.getFullYear()) * 12 +
    (hasta.getMonth() - desde.getMonth())
  let dias = hasta.getDate() - desde.getDate()
  if (dias < 0) {
    meses -= 1
    dias += new Date(hasta.getFullYear(), hasta.getMonth(), 0).getDate()
  }
  return meses + dias / 30
}

/** Fecha en que la persona cumple `anios` años */
export function fechaCumpleEdad(fechaNac, anios) {
  return new Date(fechaNac.getFullYear() + anios, fechaNac.getMonth(), fechaNac.getDate())
}

/** Set de claves "YYYY-MM" cubiertas por [desde, hasta] inclusive (mes completo) */
export function mesesCubiertos(desde, hasta) {
  const set = new Set()
  if (!desde || !hasta || hasta < desde) return set
  const cur = new Date(desde.getFullYear(), desde.getMonth(), 1)
  const fin = new Date(hasta.getFullYear(), hasta.getMonth(), 1)
  while (cur <= fin) {
    set.add(`${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}`)
    cur.setMonth(cur.getMonth() + 1)
  }
  return set
}

/** ¿Dos rangos [aDesde,aHasta] y [bDesde,bHasta] se solapan? */
export function solapan(aDesde, aHasta, bDesde, bHasta) {
  if (!aDesde || !aHasta || !bDesde || !bHasta) return false
  return aDesde <= bHasta && bDesde <= aHasta
}

/**
 * ¿La fecha cae dentro de la ventana de los últimos `meses` contados hacia
 * atrás desde `hastaStr` (default: hoy)? Usado para la ventana de 12 meses
 * del análisis socioeconómico. Si la fecha es vacía, se considera dentro.
 */
export function dentroDeVentana(fechaStr, hastaStr, meses = 12) {
  if (!fechaStr) return true
  const f = parse(fechaStr)
  const hasta = parse(hastaStr) || new Date()
  if (!f) return true
  const inicio = new Date(hasta.getFullYear(), hasta.getMonth() - meses, hasta.getDate())
  return f >= inicio && f <= hasta
}
