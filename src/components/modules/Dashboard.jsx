import { useMemo } from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useParametros } from '../../hooks/useParametros'
import { useCaso } from '../../context/CasoContext'
import { Card } from '../shared/Card'
import StatCard from '../shared/StatCard'
import { fmtTiempo, ANIOS_REQUERIDOS } from '../../utils/tiempo'
import { calcularTotal } from '../../utils/calculo'

export default function Dashboard() {
  const { parametros } = useParametros()
  const caso = useCaso()
  const t = useMemo(() => calcularTotal(caso, parametros), [caso, parametros])

  return (
    <div className="space-y-5">
      {/* Aviso de alcance (fijo del One-Kit) */}
      <div className="flex gap-3 items-start rounded-xl border border-cyan/35 bg-cyan/5 px-4 py-3 text-sm text-ink-soft">
        <InformationCircleIcon className="h-5 w-5 text-cyan shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-ink">Alcance:</strong> herramienta de uso{' '}
          <strong>educativo y orientativo</strong>, sujeta a{' '}
          <strong>revisión profesional</strong>. Los cálculos son indicativos
          según los datos cargados. Validá siempre contra el padrón de AFIP y la
          normativa previsional vigente.
        </p>
      </div>

      <Card>
        <h2 className="font-exo font-600 text-ink text-lg">Bienvenido a SICAM</h2>
        <p className="text-sm text-mute mt-1">
          Liquidación previsional para autónomos, monotributistas y servicio
          doméstico — paso a paso.
        </p>
        <hr className="my-4 border-line-soft" />
        <p className="text-sm text-ink-soft leading-relaxed">
          Todos los umbrales de interpretación (edad jubilatoria, topes
          socioeconómicos, MOPRE, costo de moratoria) son ajustables desde la
          pestaña <span className="text-ocean font-500">Parámetros</span>, lo que
          permite adaptar la herramienta a cada caso sin tocar el código.
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Servicios computables"
          value={fmtTiempo(t.serviciosFinal)}
          hint={`Requerido: ${ANIOS_REQUERIDOS} años`}
          accent="cyan"
        />
        <StatCard
          label="Estado del derecho"
          value={t.tieneDerecho ? 'Con derecho' : 'Sin derecho'}
          hint={t.tieneDerecho ? '30 años cubiertos' : `Faltan ${fmtTiempo(t.faltan)}`}
          accent="ocean"
        />
        <StatCard
          label="Deuda a regularizar"
          value={t.tieneDerecho ? '—' : fmtTiempo(t.faltan)}
          hint="A cubrir con moratoria"
          accent="amber"
        />
      </div>
    </div>
  )
}
