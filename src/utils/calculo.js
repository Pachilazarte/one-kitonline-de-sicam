import {
  parse,
  diffMeses,
  fechaCumpleEdad,
  mesesCubiertos,
  solapan,
  esAntesDeFinDeMes,
  dentroDeVentana,
} from './fechas'
import { MESES_REQUERIDOS } from './tiempo'
import { num } from './formato'

// Servicio doméstico pagado extemporáneo en este rango → ANSES lo desestima
const SD_DESDE = new Date(2000, 3, 1) // abril 2000
const SD_HASTA = new Date(2005, 11, 31) // diciembre 2005

/**
 * MÓDULO 1 — Derecho y Aportes.
 * Servicios netos por unión de meses (simultaneidad neteada) + exceso de edad.
 */
export function calcularDerecho(caso, params) {
  const edadJubAnios =
    caso.sexo === 'F' ? params.edad_jubilatoria_f : params.edad_jubilatoria_m

  const nac = parse(caso.fechaNac)
  const turno = parse(caso.fechaTurno) || new Date()

  const union = new Set()
  let domesticoExtemp = false
  caso.actividades.forEach((act) => {
    const d = parse(act.desde)
    const h = parse(act.hasta)
    if (!d || !h || h < d) return
    mesesCubiertos(d, h).forEach((m) => union.add(m))
    if (act.tipo === 'domestico' && solapan(d, h, SD_DESDE, SD_HASTA)) {
      domesticoExtemp = true
    }
  })
  const mesesServicio = union.size

  let bonifExcesoMeses = 0
  let cumpleEdad = false
  if (nac) {
    const cumple = fechaCumpleEdad(nac, edadJubAnios)
    cumpleEdad = turno >= cumple
    bonifExcesoMeses = diffMeses(cumple, turno) / 2 // la mitad del exceso
  }
  const excesoMesesEnteros = Math.floor(bonifExcesoMeses)
  const excesoDiasResiduales = Math.round((bonifExcesoMeses - excesoMesesEnteros) * 30)

  return {
    edadJubAnios,
    cumpleEdad,
    mesesServicio,
    bonifExcesoMeses,
    excesoMesesEnteros,
    excesoDiasResiduales,
    aportesRealesAnios: mesesServicio / 12,
    yaTiene30Reales: mesesServicio >= MESES_REQUERIDOS,
    hayExceso: bonifExcesoMeses > 0,
    turnoParcial: !!parse(caso.fechaTurno) && esAntesDeFinDeMes(turno),
    domesticoExtemp,
  }
}

/**
 * MÓDULO 3 — Análisis Socioeconómico (RG 5345).
 * Tres apartados TOTALMENTE EXCLUYENTES (falla uno → No Apto), más automotor
 * (evaluado aparte) y bienes de lujo de rechazo inmediato sin límite económico.
 * Los topes se calculan desde el tope de ingreso mensual (Asignación Familiar).
 */
export function calcularSocioeconomico(caso, params) {
  const s = caso.socio
  const topeMensual = params.tope_ingresos_mensual
  const topeAnual = topeMensual * 12
  const limConsumo = topeAnual * params.tope_consumo_porcentaje // 80%
  const limBienes = topeAnual * params.mult_bienes_personales // 2,4x
  const limAuto = topeAnual // el auto no puede superar el ingreso anualizado

  const ingresoMensual = num(s.ingresoMensualProm)
  const consumoAnual = num(s.consumoAnual)
  const bienes = num(s.bienesPersonales)

  // Automotor: solo computa si está dentro de la ventana de 12 meses; si es
  // ganancial se imputa el 50%.
  const autoEnVentana = num(s.valorAuto) > 0 && dentroDeVentana(s.fechaAuto, caso.fechaTurno, 12)
  let autoComputable = autoEnVentana ? num(s.valorAuto) : 0
  if (s.autoGanancial) autoComputable /= 2

  const fallaIngresos = ingresoMensual > topeMensual
  const fallaConsumo = consumoAnual > limConsumo
  const fallaBienes = bienes > limBienes
  const fallaAuto = autoComputable > limAuto
  const rechazoLujo = !!s.embarcacion || !!s.aeronave

  const apto = !(fallaIngresos || fallaConsumo || fallaBienes || fallaAuto || rechazoLujo)

  return {
    topeMensual, topeAnual, limConsumo, limBienes, limAuto,
    ingresoMensual, consumoAnual, bienes, autoComputable, autoEnVentana,
    fallaIngresos, fallaConsumo, fallaBienes, fallaAuto, rechazoLujo,
    apto,
  }
}

// La moratoria 24.476 cubre períodos hasta septiembre de 1993 (valores
// históricos sin intereses). Lo posterior acumula intereses → Art. 1 Ley 25.321.
const CORTE_MORATORIA = new Date(1993, 8, 30) // 30/09/1993

/**
 * MÓDULO 4 — Liquidación y Bagatela.
 * Clasifica cada período adeudado por régimen, calcula el costo de moratoria,
 * detecta los impagos post-93 sin renunciar (deuda bloqueante) y evalúa la
 * bagatela por período (interés residual ≤ 1 MOPRE).
 */
export function calcularLiquidacion(caso, params) {
  const mopre = params.valor_mopre
  const costoAnio = params.costo_anio_moratoria

  let costoMoratoria = 0
  let mesesMoratoria = 0
  let renunciados = 0
  const bloqueantes = []
  const bagatela = []

  caso.periodos.forEach((p) => {
    const d = parse(p.desde)
    const h = parse(p.hasta)
    if (!d || !h || h < d) return

    const meses = mesesCubiertos(d, h).size
    const esMoratoria = d <= CORTE_MORATORIA

    if (esMoratoria) {
      mesesMoratoria += meses
      costoMoratoria += (meses / 12) * costoAnio
    } else if (p.estado === 'impago') {
      if (p.renunciado) renunciados += 1
      else bloqueantes.push(p.id)
    }

    if (p.estado === 'pagado' && num(p.interesResidual) > 0) {
      const interes = num(p.interesResidual)
      bagatela.push({ id: p.id, interes, cancelado: interes <= mopre })
    }
  })

  return {
    mopre,
    costoMoratoria,
    mesesMoratoria,
    aniosMoratoria: mesesMoratoria / 12,
    renunciados,
    bloqueantes,
    hayBloqueante: bloqueantes.length > 0,
    bagatela,
  }
}

/** Clasifica un período por su fecha de inicio (para la UI). */
export function regimenPeriodo(desdeStr) {
  const d = parse(desdeStr)
  if (!d) return null
  return d <= CORTE_MORATORIA ? 'moratoria' : 'post93'
}

/** Años de servicio que aporta un hijo (acumulativo, Dec. 475/21). */
export function aniosPorHijo(hijo) {
  if (!hijo.nacidoVivo) return 0
  let a = 1 // nacido vivo
  if (hijo.adoptado) a += 1 // adoptado siendo menor
  if (hijo.discapacidad) a += 1
  if (hijo.auh12) a += 2 // AUH ≥ 12 meses por ese hijo
  return a
}

/**
 * MÓDULO 2 — Tareas de Cuidado. Solo aplica a mujeres/personas gestantes.
 * Neteo: a los meses por hijos se les RESTAN los días residuales del exceso de edad.
 */
export function calcularCuidado(caso, derecho) {
  if (caso.sexo !== 'F') {
    return { aplica: false, detalle: [], brutoMeses: 0, descuentoDias: 0, netoMeses: 0 }
  }
  const detalle = caso.hijos.map((h) => ({ ...h, anios: aniosPorHijo(h) }))
  const brutoMeses = detalle.reduce((s, h) => s + h.anios * 12, 0)
  const descuentoDias = brutoMeses > 0 ? derecho.excesoDiasResiduales : 0
  const netoMeses = Math.max(0, brutoMeses - descuentoDias / 30)
  return { aplica: true, detalle, brutoMeses, descuentoDias, netoMeses }
}

/**
 * Total integrado de servicios para el derecho a los 30 años.
 * Si hay beneficio por hijos, el exceso se computa SIN sus días residuales
 * (esos días se descuentan de los hijos → neteo ANSES). Si no hay hijos, el
 * exceso va completo.
 */
export function calcularTotal(caso, params) {
  const derecho = calcularDerecho(caso, params)
  const cuidado = calcularCuidado(caso, derecho)

  const hayHijos = cuidado.aplica && cuidado.brutoMeses > 0
  const excesoAplicado = hayHijos ? derecho.excesoMesesEnteros : derecho.bonifExcesoMeses
  const cuidadoAplicado = hayHijos ? cuidado.netoMeses : 0

  const serviciosFinal = derecho.mesesServicio + excesoAplicado + cuidadoAplicado
  const faltan = Math.max(0, MESES_REQUERIDOS - serviciosFinal)

  return {
    derecho,
    cuidado,
    excesoAplicado,
    cuidadoAplicado,
    serviciosFinal,
    faltan,
    tieneDerecho: serviciosFinal >= MESES_REQUERIDOS,
  }
}
