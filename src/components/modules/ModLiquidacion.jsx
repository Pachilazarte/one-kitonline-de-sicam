import { useMemo } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useParametros } from '../../hooks/useParametros'
import { useCaso } from '../../context/CasoContext'
import { Card, SectionTitle } from '../shared/Card'
import StatCard from '../shared/StatCard'
import AlertBadge from '../shared/AlertBadge'
import Aviso from '../shared/Aviso'
import { fmtMoney } from '../../utils/formato'
import { calcularLiquidacion, regimenPeriodo } from '../../utils/calculo'

const inputCls =
  'w-full rounded-lg bg-line-soft border border-line px-3 py-2 text-sm text-ink outline-none focus:border-cyan/60'

export default function ModLiquidacion() {
  const { parametros } = useParametros()
  const caso = useCaso()
  const { periodos, addPeriodo, updatePeriodo, removePeriodo } = caso

  const r = useMemo(() => calcularLiquidacion(caso, parametros), [caso, parametros])
  const bagatelaCanceladas = r.bagatela.filter((b) => b.cancelado).length

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle sub="Cargá los períodos adeudados. La moratoria 24.476 cubre hasta sept/1993; lo posterior acumula intereses y exige renuncia (Art. 1, Ley 25.321).">
          Liquidación y Bagatela
        </SectionTitle>
      </Card>

      {/* Períodos */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-exo font-600 text-ocean text-sm">Períodos adeudados</h3>
          <button type="button" onClick={addPeriodo} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-cyan/40 text-cyan hover:bg-cyan/5">
            <PlusIcon className="h-4 w-4" />
            Agregar período
          </button>
        </div>

        {periodos.length === 0 ? (
          <p className="text-sm text-mute py-4 text-center">Cargá los períodos con “Agregar período”.</p>
        ) : (
          <div className="space-y-3">
            {periodos.map((p) => {
              const reg = regimenPeriodo(p.desde)
              const esBloqueante = r.bloqueantes.includes(p.id)
              return (
                <div key={p.id} className={`rounded-lg border p-3 ${esBloqueante ? 'border-alert/50' : 'border-line'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                    <label className="block">
                      <span className="text-[11px] text-mute">Desde</span>
                      <input type="date" value={p.desde} onChange={(e) => updatePeriodo(p.id, 'desde', e.target.value)} className={inputCls} />
                    </label>
                    <label className="block">
                      <span className="text-[11px] text-mute">Hasta</span>
                      <input type="date" value={p.hasta} onChange={(e) => updatePeriodo(p.id, 'hasta', e.target.value)} className={inputCls} />
                    </label>
                    <label className="block">
                      <span className="text-[11px] text-mute">Estado</span>
                      <select value={p.estado} onChange={(e) => updatePeriodo(p.id, 'estado', e.target.value)} className={inputCls}>
                        <option value="impago">Impago</option>
                        <option value="pagado">Pagado (con interés residual)</option>
                      </select>
                    </label>
                    <button type="button" onClick={() => removePeriodo(p.id)} className="p-2 text-mute hover:text-alert" aria-label="Quitar período">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {reg === 'moratoria' && <AlertBadge status="ok">Moratoria 24.476 (≤ sept/1993)</AlertBadge>}
                    {reg === 'post93' && <AlertBadge status="warn">Posterior a sept/1993</AlertBadge>}

                    {reg === 'post93' && p.estado === 'impago' && (
                      <label className="flex items-center gap-2 text-sm text-ink-soft">
                        <input type="checkbox" checked={p.renunciado} onChange={(e) => updatePeriodo(p.id, 'renunciado', e.target.checked)} className="h-4 w-4 accent-cyan" />
                        Renunciar Art. 1 (cód. 007)
                      </label>
                    )}
                    {p.estado === 'pagado' && (
                      <label className="flex items-center gap-2 text-sm text-ink-soft">
                        Interés residual:
                        <input type="number" min="0" value={p.interesResidual} onChange={(e) => updatePeriodo(p.id, 'interesResidual', e.target.value)} className={`${inputCls} w-32`} />
                      </label>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Resultado */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Costo moratoria 24.476" value={fmtMoney(r.costoMoratoria)} hint={`${r.aniosMoratoria.toFixed(1)} años comprables`} accent="cyan" />
        <StatCard label="Períodos renunciados" value={r.renunciados} hint="Art. 1 · cód. 007" accent="ocean" />
        <StatCard label="Deuda bloqueante" value={r.bloqueantes.length} hint="Impagos post-93 sin renunciar" accent="amber" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {r.hayBloqueante ? (
            <AlertBadge status="alert">Trámite bloqueado: {r.bloqueantes.length} período(s) sin renunciar</AlertBadge>
          ) : (
            <AlertBadge status="ok">Sin deuda bloqueante</AlertBadge>
          )}
          {bagatelaCanceladas > 0 && (
            <AlertBadge status="ok">{bagatelaCanceladas} período(s) cancelado(s) por bagatela</AlertBadge>
          )}
        </div>

        <div className="space-y-2">
          {r.hayBloqueante && (
            <Aviso tono="alert">
              <strong className="text-alert">Error más caro de la práctica:</strong> hay impagos posteriores a sept/1993 sin renunciar
              (Art. 1, Ley 25.321). El SICAM les calcula intereses diarios exorbitantes y arroja una deuda millonaria que bloquea el
              trámite. Marcá “Renunciar Art. 1” en esos períodos.
            </Aviso>
          )}
          {r.bagatela.length > 0 && (
            <Aviso tono="cyan">
              <strong>Bagatela (Circular DP 75/23):</strong> se evalúa por período. Si el capital fue pagado y el interés residual no
              supera <strong>1 MOPRE</strong> ({fmtMoney(r.mopre)}), se cancela automáticamente. Actualizá el MOPRE en Parámetros.
            </Aviso>
          )}
          <Aviso tono="amber">
            <strong className="text-amber">Planes nuevos (27.705):</strong> el primer VEP debe abonarse dentro de las 24 hs de generado;
            si no, el sistema cae todo el plan y hay que sacar turno nuevo.
          </Aviso>
          <Aviso tono="cyan">
            Códigos: <strong>192</strong> UPDP (períodos comprados por moratoria) · <strong>007</strong> renuncia Art. 1. La 1ª cuota de moratoria se paga con formulario <strong>799</strong>.
          </Aviso>
        </div>
      </Card>
    </div>
  )
}
