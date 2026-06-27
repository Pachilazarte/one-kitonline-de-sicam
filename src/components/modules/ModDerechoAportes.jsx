import { useMemo } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useParametros } from '../../hooks/useParametros'
import { useCaso } from '../../context/CasoContext'
import { Card, SectionTitle } from '../shared/Card'
import StatCard from '../shared/StatCard'
import AlertBadge from '../shared/AlertBadge'
import Aviso from '../shared/Aviso'
import { fmtTiempo, MESES_REQUERIDOS, ANIOS_REQUERIDOS } from '../../utils/tiempo'
import { calcularTotal } from '../../utils/calculo'

const TIPOS = [
  { v: 'autonomo', label: 'Autónomo' },
  { v: 'monotributo', label: 'Monotributo' },
  { v: 'dependencia', label: 'Relación de dependencia' },
  { v: 'domestico', label: 'Servicio doméstico' },
]

const inputCls =
  'w-full rounded-lg bg-line-soft border border-line px-3 py-2 text-sm text-ink outline-none focus:border-cyan/60'

export default function ModDerechoAportes() {
  const { parametros } = useParametros()
  const caso = useCaso()
  const {
    sexo, setSexo, fechaNac, setFechaNac, fechaTurno, setFechaTurno,
    actividades, addActividad, updateActividad, removeActividad,
  } = caso

  const t = useMemo(() => calcularTotal(caso, parametros), [caso, parametros])
  const d = t.derecho

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle sub="Edad jubilatoria vs. servicios (Art. 19, Ley 24.241). Cargá cada actividad con fechas: el sistema netea los meses simultáneos automáticamente.">
          Determinación de Derecho y Exceso de Edad
        </SectionTitle>
      </Card>

      {/* Datos de la persona */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-xs text-mute">Sexo (edad jubilatoria)</span>
            <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={`mt-1 ${inputCls}`}>
              <option value="F">Mujer — {parametros.edad_jubilatoria_f} años</option>
              <option value="M">Hombre — {parametros.edad_jubilatoria_m} años</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-mute">Fecha de nacimiento</span>
            <input type="date" value={fechaNac} onChange={(e) => setFechaNac(e.target.value)} className={`mt-1 ${inputCls}`} />
          </label>
          <label className="block">
            <span className="text-xs text-mute">Fecha de liquidación / turno</span>
            <input type="date" value={fechaTurno} onChange={(e) => setFechaTurno(e.target.value)} className={`mt-1 ${inputCls}`} />
          </label>
        </div>
      </Card>

      {/* Actividades */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-exo font-600 text-ocean text-sm">Historia laboral (actividades)</h3>
          <button type="button" onClick={addActividad} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-cyan/40 text-cyan hover:bg-cyan/5">
            <PlusIcon className="h-4 w-4" />
            Agregar
          </button>
        </div>

        <div className="space-y-2">
          {actividades.map((act) => (
            <div key={act.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
              <select value={act.tipo} onChange={(e) => updateActividad(act.id, 'tipo', e.target.value)} className={inputCls}>
                {TIPOS.map((tp) => (
                  <option key={tp.v} value={tp.v}>{tp.label}</option>
                ))}
              </select>
              <input type="date" value={act.desde} onChange={(e) => updateActividad(act.id, 'desde', e.target.value)} className={inputCls} />
              <input type="date" value={act.hasta} onChange={(e) => updateActividad(act.id, 'hasta', e.target.value)} className={inputCls} />
              <button type="button" onClick={() => removeActividad(act.id)} disabled={actividades.length === 1} className="p-2 text-mute hover:text-alert disabled:opacity-30" aria-label="Quitar actividad">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-mute mt-3">Cómputo a nivel mensual (criterio de derecho). Los meses solapados cuentan una sola vez.</p>
      </Card>

      {/* Resultado */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Servicios netos" value={fmtTiempo(d.mesesServicio)} hint="Aportes reales (sin simultaneidad)" accent="cyan" />
        <StatCard label="Bonif. exceso de edad" value={fmtTiempo(d.bonifExcesoMeses)} hint="Mitad del exceso · solo para el derecho" accent="ocean" />
        <StatCard
          label={t.tieneDerecho ? 'Excedente' : 'Faltante para el derecho'}
          value={t.tieneDerecho ? fmtTiempo(t.serviciosFinal - MESES_REQUERIDOS) : fmtTiempo(t.faltan)}
          hint={`Requerido: ${ANIOS_REQUERIDOS} años`}
          accent="amber"
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {t.tieneDerecho ? (
            <AlertBadge status="ok">Derecho acreditado — 30 años cubiertos</AlertBadge>
          ) : (
            <AlertBadge status="warn">Faltan {fmtTiempo(t.faltan)}</AlertBadge>
          )}
          {d.yaTiene30Reales && d.hayExceso && (
            <AlertBadge status="ok">Ya llega con aportes reales: no necesita el exceso</AlertBadge>
          )}
        </div>

        <div className="space-y-2">
          {d.hayExceso && (
            <Aviso tono="amber">
              <strong className="text-amber">Exceso de edad:</strong> son “años de servicio” (regalo) que sirven{' '}
              <strong>solo para llegar a los 30 años del derecho</strong>; no son aportes y no aumentan el haber.
              No se cargan en la web del SICAM (ANSES los computa desde el formulario físico).
            </Aviso>
          )}
          {d.hayExceso && t.cuidado.brutoMeses > 0 && (
            <Aviso tono="amber">
              <strong className="text-amber">Neteo aplicado:</strong> hay {d.excesoDiasResiduales} días residuales de exceso que ANSES
              descuenta del beneficio por hijos (ver Tareas de Cuidado). El exceso se computa sin esos días.
            </Aviso>
          )}
          {d.turnoParcial && (
            <Aviso tono="amber">
              <strong className="text-amber">Turno previo a fin de mes:</strong> ANSES corta el cómputo ese día — no computará el mes completo.
            </Aviso>
          )}
          {d.domesticoExtemp && (
            <Aviso tono="alert">
              <strong className="text-alert">Servicio doméstico (abr/2000–dic/2005):</strong> si los pagos fueron extemporáneos, ANSES los
              desestima y deniega la prestación. Exige integrar la diferencia ($35/mes) con el formulario <strong>F. 575</strong>.
            </Aviso>
          )}
          <Aviso tono="cyan">
            Códigos de cómputo: <strong>103</strong> autónomo · <strong>105</strong> monotributo · <strong>102</strong> dependencia · <strong>089</strong> servicio doméstico · <strong>001</strong> Art. 19 (exceso).
          </Aviso>
        </div>
      </Card>
    </div>
  )
}
