import { parse, mesesCubiertos } from './fechas'
import { calcularTotal, calcularLiquidacion, regimenPeriodo } from './calculo'

const COD_ACTIVIDAD = {
  autonomo: { codigo: '103', concepto: 'Autónomo' },
  monotributo: { codigo: '105', concepto: 'Monotributo' },
  dependencia: { codigo: '102', concepto: 'Relación de dependencia' },
  domestico: { codigo: '089', concepto: 'Servicio doméstico' },
}

const mesesDe = (desde, hasta) => {
  const d = parse(desde)
  const h = parse(hasta)
  if (!d || !h || h < d) return 0
  return mesesCubiertos(d, h).size
}

/**
 * Arma el "Cómputo Ilustrativo" espejo del de ANSES: cabecera (fecha de
 * solicitud = turno; fecha de cese = último aporte) y filas mapeadas a los
 * códigos oficiales. Orden: servicios aportados → beneficios → moratoria/renuncia.
 */
export function construirComputo(caso, params) {
  const total = calcularTotal(caso, params)
  const liq = calcularLiquidacion(caso, params)
  const filas = []

  // 1) Servicios aportados (historia laboral)
  caso.actividades.forEach((a) => {
    const meses = mesesDe(a.desde, a.hasta)
    if (!meses) return
    const map = COD_ACTIVIDAD[a.tipo]
    filas.push({ desde: a.desde, hasta: a.hasta, codigo: map.codigo, concepto: map.concepto, meses })
  })

  // 2) Exceso de edad (001) — ya neteado en el total
  if (total.derecho.hayExceso && total.excesoAplicado > 0) {
    filas.push({ desde: '', hasta: '', codigo: '001', concepto: 'Exceso de edad (Art. 19)', meses: Math.round(total.excesoAplicado) })
  }

  // 3) Tareas de cuidado (040) — neto del neteo con exceso
  if (total.cuidado.aplica && total.cuidadoAplicado > 0) {
    filas.push({ desde: '', hasta: '', codigo: '040', concepto: 'Tareas de cuidado (hijos)', meses: Math.round(total.cuidadoAplicado) })
  }

  // 4) Períodos adeudados: moratoria (192) o renuncia Art. 1 (007)
  caso.periodos.forEach((p) => {
    const meses = mesesDe(p.desde, p.hasta)
    if (!meses) return
    if (regimenPeriodo(p.desde) === 'moratoria') {
      filas.push({ desde: p.desde, hasta: p.hasta, codigo: '192', concepto: 'UPDP (moratoria 24.476)', meses })
    } else if (p.estado === 'impago' && p.renunciado) {
      filas.push({ desde: p.desde, hasta: p.hasta, codigo: '007', concepto: 'Renuncia Art. 1 (Ley 25.321)', meses })
    }
  })

  // Fecha de cese = mayor "hasta" de las actividades (ISO compara lexicográfico)
  let fechaCese = ''
  caso.actividades.forEach((a) => {
    if (a.hasta && (!fechaCese || a.hasta > fechaCese)) fechaCese = a.hasta
  })

  return {
    fechaSolicitud: caso.fechaTurno,
    fechaCese,
    sexo: caso.sexo,
    filas,
    total,
    liq,
  }
}
