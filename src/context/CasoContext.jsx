import { createContext, useContext, useState, useCallback } from 'react'

const CasoContext = createContext(null)

let UID = 0
const nextId = () => ++UID

export const nuevaActividad = () => ({
  id: nextId(),
  tipo: 'autonomo',
  desde: '',
  hasta: '',
})

export const nuevoHijo = () => ({
  id: nextId(),
  nacidoVivo: true,
  adoptado: false,
  discapacidad: false,
  auh12: false,
})

export const nuevoPeriodo = () => ({
  id: nextId(),
  desde: '',
  hasta: '',
  estado: 'impago', // 'impago' | 'pagado'
  renunciado: false, // Art. 1 Ley 25.321 (post sept/1993)
  interesResidual: '', // para evaluar bagatela en períodos pagados
})

const SOCIO_INICIAL = {
  ingresoMensualProm: '',
  consumoAnual: '',
  bienesPersonales: '',
  valorAuto: '',
  fechaAuto: '',
  autoGanancial: false,
  embarcacion: false,
  aeronave: false,
}

/**
 * Estado compartido del caso del contribuyente. Lo consumen todos los módulos
 * (el sexo es condición global, y el neteo exige datos cruzados entre módulos).
 */
export function CasoProvider({ children }) {
  const [sexo, setSexo] = useState('F')
  const [fechaNac, setFechaNac] = useState('')
  const [fechaTurno, setFechaTurno] = useState('')
  const [actividades, setActividades] = useState(() => [nuevaActividad()])
  const [hijos, setHijos] = useState([])
  const [socio, setSocio] = useState(SOCIO_INICIAL)
  const [periodos, setPeriodos] = useState([])

  const updateSocio = useCallback(
    (campo, val) => setSocio((s) => ({ ...s, [campo]: val })),
    [],
  )

  // --- Períodos adeudados (liquidación) ---
  const addPeriodo = useCallback(() => setPeriodos((p) => [...p, nuevoPeriodo()]), [])
  const updatePeriodo = useCallback(
    (id, campo, val) =>
      setPeriodos((p) => p.map((x) => (x.id === id ? { ...x, [campo]: val } : x))),
    [],
  )
  const removePeriodo = useCallback(
    (id) => setPeriodos((p) => p.filter((x) => x.id !== id)),
    [],
  )

  // --- Actividades ---
  const addActividad = useCallback(
    () => setActividades((a) => [...a, nuevaActividad()]),
    [],
  )
  const updateActividad = useCallback(
    (id, campo, val) =>
      setActividades((a) => a.map((x) => (x.id === id ? { ...x, [campo]: val } : x))),
    [],
  )
  const removeActividad = useCallback(
    (id) => setActividades((a) => (a.length > 1 ? a.filter((x) => x.id !== id) : a)),
    [],
  )

  // --- Hijos ---
  const addHijo = useCallback(() => setHijos((h) => [...h, nuevoHijo()]), [])
  const updateHijo = useCallback(
    (id, campo, val) =>
      setHijos((h) => h.map((x) => (x.id === id ? { ...x, [campo]: val } : x))),
    [],
  )
  const removeHijo = useCallback(
    (id) => setHijos((h) => h.filter((x) => x.id !== id)),
    [],
  )

  const value = {
    sexo,
    setSexo,
    fechaNac,
    setFechaNac,
    fechaTurno,
    setFechaTurno,
    actividades,
    addActividad,
    updateActividad,
    removeActividad,
    hijos,
    addHijo,
    updateHijo,
    removeHijo,
    socio,
    updateSocio,
    periodos,
    addPeriodo,
    updatePeriodo,
    removePeriodo,
  }

  return <CasoContext.Provider value={value}>{children}</CasoContext.Provider>
}

export function useCaso() {
  const ctx = useContext(CasoContext)
  if (!ctx) throw new Error('useCaso debe usarse dentro de <CasoProvider>')
  return ctx
}
