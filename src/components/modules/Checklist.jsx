import { useState, useMemo } from 'react'
import { Card, SectionTitle } from '../shared/Card'
import ProgressBar from '../shared/ProgressBar'

const ITEMS = [
  'Validar PUC (Padrón Único de Contribuyentes) en AFIP',
  'Descargar historia laboral / padrón histórico',
  'Verificar edad jubilatoria vs. años de aportes (Art. 19)',
  'Computar tareas de cuidado (Dec. 475/21) si corresponde',
  'Validar topes socioeconómicos (RG 5345)',
  'Evaluar principio de Bagatela contra MOPRE',
  'Presentar F. 558/A si aplica moratoria',
  'Adaptar parámetros al caso del contribuyente',
]

export default function Checklist() {
  const [checked, setChecked] = useState(() => ITEMS.map(() => false))

  const done = useMemo(() => checked.filter(Boolean).length, [checked])
  const pct = (done / ITEMS.length) * 100

  const toggle = (i) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle sub="Verificá cada paso del proceso de liquidación previsional.">
          ✅ Checklist de Liquidación
        </SectionTitle>
        <p className="text-xs text-mute mb-2">
          Progreso: {done} / {ITEMS.length} ítems completados
        </p>
        <ProgressBar value={pct} />
      </Card>

      <Card>
        <div className="space-y-1">
          {ITEMS.map((item, i) => (
            <label
              key={item}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-line-soft cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                className="h-4 w-4 accent-cyan"
              />
              <span
                className={`text-sm ${checked[i] ? 'text-mute line-through' : 'text-ink-soft'}`}
              >
                {item}
              </span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  )
}
