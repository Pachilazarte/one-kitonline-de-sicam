import { createContext, useState, useEffect, useCallback } from 'react'

const LOCAL_STORAGE_KEY = 'esc_params_sicam_v1'

/**
 * Esquema único de parámetros (núcleo fijo del One-Kit).
 * De acá salen tanto los valores por defecto como el render del panel.
 * NOTA: los valores base son normativos y los valida Facundo (dominio).
 */
export const PARAM_SCHEMA = [
  {
    section: 'Edad jubilatoria (Ley 24.241)',
    fields: [
      { key: 'edad_jubilatoria_f', label: 'Edad mujer', value: 60, step: 1 },
      { key: 'edad_jubilatoria_m', label: 'Edad hombre', value: 65, step: 1 },
    ],
  },
  {
    section: 'Tareas de cuidado (Dec. 475/21)',
    fields: [
      { key: 'anios_por_hijo', label: 'Años x hijo (general)', value: 1, step: 1 },
      { key: 'anios_por_hijo_disc', label: 'Años x hijo (discap./AUH)', value: 2, step: 1 },
    ],
  },
  {
    section: 'Análisis socioeconómico (RG 5345)',
    fields: [
      { key: 'tope_ingresos_mensual', label: 'Tope ingresos mensual ($)', value: 2573047, step: 1000 },
      { key: 'mult_bienes_personales', label: 'Multiplicador bienes pers. (x)', value: 2.4, step: 0.1 },
      { key: 'tope_consumo_porcentaje', label: 'Tope consumo (% ingresos)', value: 0.8, step: 0.05 },
    ],
  },
  {
    section: 'Liquidación y Bagatela',
    fields: [
      { key: 'valor_mopre', label: 'Valor MOPRE ($)', value: 25000, step: 100 },
      { key: 'costo_anio_moratoria', label: 'Costo año moratoria 24.476 ($)', value: 750, step: 50 },
    ],
  },
]

/** Defaults derivados del esquema → { clave: valor } */
export const PARAM_DEFAULTS = PARAM_SCHEMA.reduce((acc, group) => {
  group.fields.forEach((f) => {
    acc[f.key] = f.value
  })
  return acc
}, {})

export const ParametrosContext = createContext(null)

export function ParametrosProvider({ children }) {
  const [parametros, setParametros] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    return saved ? { ...PARAM_DEFAULTS, ...JSON.parse(saved) } : { ...PARAM_DEFAULTS }
  })

  const [isCustom, setIsCustom] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_KEY) !== null,
  )

  useEffect(() => {
    if (isCustom) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parametros))
    }
  }, [parametros, isCustom])

  const updateParametro = useCallback((key, value) => {
    setParametros((prev) => ({ ...prev, [key]: Number(value) || 0 }))
    setIsCustom(true)
  }, [])

  const resetToDefaults = useCallback(() => {
    setParametros({ ...PARAM_DEFAULTS })
    setIsCustom(false)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }, [])

  return (
    <ParametrosContext.Provider
      value={{ parametros, schema: PARAM_SCHEMA, updateParametro, resetToDefaults, isCustom }}
    >
      {children}
    </ParametrosContext.Provider>
  )
}
