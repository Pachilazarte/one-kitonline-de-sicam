import { useMemo } from 'react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useParametros } from '../../hooks/useParametros'
import { useCaso } from '../../context/CasoContext'
import { Card, SectionTitle } from '../shared/Card'
import StatCard from '../shared/StatCard'
import AlertBadge from '../shared/AlertBadge'
import Aviso from '../shared/Aviso'
import { fmtMoney } from '../../utils/formato'
import { calcularDerecho, calcularSocioeconomico } from '../../utils/calculo'

const inputCls =
  'w-full rounded-lg bg-line-soft border border-line px-3 py-2 text-sm text-ink outline-none focus:border-cyan/60'

function Apartado({ titulo, valor, limite, falla }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-line-soft last:border-0">
      {falla ? (
        <XCircleIcon className="h-5 w-5 text-alert shrink-0 mt-0.5" />
      ) : (
        <CheckCircleIcon className="h-5 w-5 text-cyan shrink-0 mt-0.5" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink">{titulo}</p>
        <p className="text-xs text-mute">
          Declarado: <strong className={falla ? 'text-alert' : 'text-ink-soft'}>{fmtMoney(valor)}</strong>
          {' · '}Tope: {fmtMoney(limite)}
        </p>
      </div>
      <span className={`text-xs font-500 shrink-0 ${falla ? 'text-alert' : 'text-cyan'}`}>
        {falla ? 'Supera' : 'OK'}
      </span>
    </div>
  )
}

export default function ModSocioeconomico() {
  const { parametros } = useParametros()
  const caso = useCaso()
  const { socio, updateSocio } = caso

  const r = useMemo(() => calcularSocioeconomico(caso, parametros), [caso, parametros])
  const d = useMemo(() => calcularDerecho(caso, parametros), [caso, parametros])

  const bloqueante = d.cumpleEdad && !r.apto // ya tiene edad y rebota → sin moratorias

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle sub="Tres apartados excluyentes (RG 5345): ingresos, consumos y bienes. Falla uno → No Apto. El mismo filtro rige para la PUAM.">
          Análisis Socioeconómico
        </SectionTitle>
      </Card>

      {/* Topes vigentes (derivados de Parámetros) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Tope ingreso mensual" value={fmtMoney(r.topeMensual)} hint="Límite Asignación Familiar" accent="cyan" />
        <StatCard label="Tope consumo anual" value={fmtMoney(r.limConsumo)} hint="80% del ingreso anualizado" accent="ocean" />
        <StatCard label="Tope bienes personales" value={fmtMoney(r.limBienes)} hint="2,4× ingreso anualizado" accent="amber" />
      </div>

      {/* Carga de datos */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs text-mute">Ingreso mensual promedio (últimos 12 meses)</span>
            <input type="number" min="0" value={socio.ingresoMensualProm} onChange={(e) => updateSocio('ingresoMensualProm', e.target.value)} className={`mt-1 ${inputCls}`} />
          </label>
          <label className="block">
            <span className="text-xs text-mute">Consumo anualizado en tarjetas (crédito, débito y billeteras virtuales)</span>
            <input type="number" min="0" value={socio.consumoAnual} onChange={(e) => updateSocio('consumoAnual', e.target.value)} className={`mt-1 ${inputCls}`} />
          </label>
          <label className="block">
            <span className="text-xs text-mute">Bienes personales declarados</span>
            <input type="number" min="0" value={socio.bienesPersonales} onChange={(e) => updateSocio('bienesPersonales', e.target.value)} className={`mt-1 ${inputCls}`} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-mute">Valor fiscal automotor (últimos 12m)</span>
              <input type="number" min="0" value={socio.valorAuto} onChange={(e) => updateSocio('valorAuto', e.target.value)} className={`mt-1 ${inputCls}`} />
            </label>
            <label className="block">
              <span className="text-xs text-mute">Fecha de adquisición</span>
              <input type="date" value={socio.fechaAuto} onChange={(e) => updateSocio('fechaAuto', e.target.value)} className={`mt-1 ${inputCls}`} />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-soft sm:col-span-2">
            <input type="checkbox" checked={socio.autoGanancial} onChange={(e) => updateSocio('autoGanancial', e.target.checked)} className="h-4 w-4 accent-cyan" />
            Vehículo ganancial (imputa 50% a cada cónyuge)
          </label>
        </div>

        <hr className="my-4 border-line-soft" />

        <p className="text-xs text-mute mb-2">Bienes de rechazo inmediato (sin límite económico):</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={socio.embarcacion} onChange={(e) => updateSocio('embarcacion', e.target.checked)} className="h-4 w-4 accent-cyan" />
            Embarcación &gt; 9 m de eslora
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={socio.aeronave} onChange={(e) => updateSocio('aeronave', e.target.checked)} className="h-4 w-4 accent-cyan" />
            Aeronave
          </label>
        </div>
      </Card>

      {/* Veredicto */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-exo font-600 text-ink text-sm">Veredicto</h3>
          {r.apto ? (
            <AlertBadge status="ok">Apto</AlertBadge>
          ) : (
            <AlertBadge status="alert">No Apto</AlertBadge>
          )}
        </div>

        {r.rechazoLujo && (
          <div className="mb-3">
            <Aviso tono="alert">
              <strong className="text-alert">Rechazo inmediato:</strong> la tenencia de embarcación &gt; 9 m o aeronave invalida el
              beneficio sin importar los ingresos.
            </Aviso>
          </div>
        )}

        <div className="rounded-lg border border-line p-3">
          <Apartado titulo="Ingresos brutos mensuales" valor={r.ingresoMensual} limite={r.topeMensual} falla={r.fallaIngresos} />
          <Apartado titulo="Consumos en tarjetas (anual)" valor={r.consumoAnual} limite={r.limConsumo} falla={r.fallaConsumo} />
          <Apartado titulo="Bienes personales" valor={r.bienes} limite={r.limBienes} falla={r.fallaBienes} />
          <Apartado titulo="Automotor (computable en ventana)" valor={r.autoComputable} limite={r.limAuto} falla={r.fallaAuto} />
        </div>

        <div className="mt-4 space-y-2">
          {bloqueante && (
            <Aviso tono="alert">
              <strong className="text-alert">Estado bloqueante:</strong> ya tiene la edad jubilatoria y rebota el socioeconómico. No
              puede usar la Moratoria 24.476 ni la 27.705 (su apartado para edad cumplida venció en marzo/2025).
            </Aviso>
          )}
          {!r.apto && (
            <Aviso tono="amber">
              <strong className="text-amber">PUAM también bloqueada:</strong> la Pensión Universal usa exactamente este mismo filtro.
              Si da No Apto, tampoco se puede tramitar la PUAM.
            </Aviso>
          )}
          <Aviso tono="cyan">
            <strong>Derivación:</strong> la 27.705 vigente es solo para trabajadores en actividad (UCAP) que aún NO tienen la edad
            jubilatoria; no exige socioeconómico, pero exige estar inscripto laboralmente (dependencia o monotributo).
          </Aviso>
          <Aviso tono="cyan">
            <strong>Ventana de 12 meses:</strong> los gastos se evalúan hacia atrás desde la fecha del turno. Un gasto excesivo sale
            del filtro recién cuando ese mes queda fuera de los últimos 12.
          </Aviso>
        </div>
      </Card>
    </div>
  )
}
