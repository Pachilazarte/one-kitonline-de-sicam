import { useMemo } from 'react'
import {
  PlusIcon,
  TrashIcon,
  NoSymbolIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { useParametros } from '../../hooks/useParametros'
import { useCaso } from '../../context/CasoContext'
import { Card, SectionTitle } from '../shared/Card'
import StatCard from '../shared/StatCard'
import AlertBadge from '../shared/AlertBadge'
import Aviso from '../shared/Aviso'
import { fmtTiempo, ANIOS_REQUERIDOS } from '../../utils/tiempo'
import { calcularTotal, aniosPorHijo } from '../../utils/calculo'

const DOCUMENTACION = [
  'Actas / partidas de nacimiento de todos los hijos declarados',
  'Comprobantes de percepción de AUH (libreta que constate los 12 meses)',
  'Certificado Único de Discapacidad (CUD) vigente',
  'Sentencia o testimonio de adopción (si corresponde)',
]

export default function ModTareasCuidado() {
  const { parametros } = useParametros()
  const caso = useCaso()
  const { sexo, hijos, addHijo, updateHijo, removeHijo } = caso

  const t = useMemo(() => calcularTotal(caso, parametros), [caso, parametros])
  const c = t.cuidado
  const d = t.derecho

  // Condición excluyente: solo mujeres / personas gestantes
  if (sexo !== 'F') {
    return (
      <div className="space-y-5">
        <Card>
          <SectionTitle sub="Bonificación de años de servicio por hijos (Dec. 475/21).">
            Tareas de Cuidado
          </SectionTitle>
        </Card>
        <Card>
          <div className="flex flex-col items-center text-center py-8 gap-3">
            <NoSymbolIcon className="h-10 w-10 text-mute" />
            <p className="font-exo font-600 text-ink">Beneficio no aplicable para varones</p>
            <p className="text-sm text-mute max-w-md">
              Las Tareas de Cuidado son exclusivas de mujeres y personas gestantes. Cambiá el sexo en{' '}
              <span className="text-ocean">Derecho y Aportes</span> si corresponde.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle sub="1 año por hijo nacido vivo; +1 adopción, +1 discapacidad, +2 si percibió AUH ≥ 12 meses. Acumulativo por hijo.">
          Tareas de Cuidado (Dec. 475/21)
        </SectionTitle>
      </Card>

      {d.yaTiene30Reales && (
        <Aviso tono="amber">
          <strong className="text-amber">Beneficio innecesario:</strong> ya posee 30 años de aportes reales. Los hijos no aumentan
          el monto a cobrar (son “años de servicio”, no de aporte). Cargalos solo si necesita llegar al derecho.
        </Aviso>
      )}

      {/* Carga de hijos */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-exo font-600 text-ocean text-sm">Hijos declarados</h3>
          <button type="button" onClick={addHijo} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-cyan/40 text-cyan hover:bg-cyan/5">
            <PlusIcon className="h-4 w-4" />
            Agregar hijo
          </button>
        </div>

        {hijos.length === 0 ? (
          <p className="text-sm text-mute py-4 text-center">Todavía no cargaste hijos. Usá “Agregar hijo”.</p>
        ) : (
          <div className="space-y-3">
            {hijos.map((h, i) => (
              <div key={h.id} className="rounded-lg border border-line p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-exo text-ink-soft">Hijo {i + 1}</span>
                  <div className="flex items-center gap-3">
                    <AlertBadge status="ok">{aniosPorHijo(h)} año(s)</AlertBadge>
                    <button type="button" onClick={() => removeHijo(h.id)} className="text-mute hover:text-alert" aria-label="Quitar hijo">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <Check label="Nacido vivo" checked={h.nacidoVivo} onChange={(v) => updateHijo(h.id, 'nacidoVivo', v)} />
                  <Check label="Adoptado (menor)" checked={h.adoptado} onChange={(v) => updateHijo(h.id, 'adoptado', v)} disabled={!h.nacidoVivo} />
                  <Check label="Con discapacidad" checked={h.discapacidad} onChange={(v) => updateHijo(h.id, 'discapacidad', v)} disabled={!h.nacidoVivo} />
                  <Check label="AUH ≥ 12 meses" checked={h.auh12} onChange={(v) => updateHijo(h.id, 'auh12', v)} disabled={!h.nacidoVivo} />
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-[11px] text-mute mt-3">
          “Nacido vivo” alcanza para computar 1 año, aunque haya fallecido luego, si existe acta que lo pruebe.
        </p>
      </Card>

      {/* Resultado */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Bruto por hijos" value={fmtTiempo(c.brutoMeses)} hint={`${hijos.length} hijo(s) declarados`} accent="cyan" />
        <StatCard label="Neto computable" value={fmtTiempo(c.netoMeses)} hint={`Menos ${c.descuentoDias} días de neteo`} accent="ocean" />
        <StatCard
          label={t.tieneDerecho ? 'Derecho' : 'Faltante total'}
          value={t.tieneDerecho ? 'Acreditado' : fmtTiempo(t.faltan)}
          hint={`Servicios: ${fmtTiempo(t.serviciosFinal)} / ${ANIOS_REQUERIDOS} años`}
          accent="amber"
        />
      </div>

      <Card>
        <div className="space-y-2">
          {c.descuentoDias > 0 && (
            <Aviso tono="amber">
              <strong className="text-amber">Neteo con exceso de edad:</strong> ANSES descuenta {c.descuentoDias} días (residuales del
              exceso) al beneficio por hijos, para que no se usen esos días para llegar “justo” a los 30 años.
            </Aviso>
          )}
          <Aviso tono="cyan">
            <strong>Solo diagnóstico:</strong> las Tareas de Cuidado NO se cargan en la web del SICAM. Las ingresa el computista de
            ANSES el día del turno. Código de cómputo: <strong>040</strong> (hijos).
          </Aviso>
        </div>
      </Card>

      {/* Documentación requerida */}
      <Card>
        <h3 className="flex items-center gap-2 font-exo font-600 text-ink text-sm mb-3">
          <DocumentTextIcon className="h-5 w-5 text-cyan" />
          Documentación a presentar en ANSES
        </h3>
        <ul className="space-y-2 text-sm text-ink-soft">
          {DOCUMENTACION.map((doc) => (
            <li key={doc} className="flex gap-2">
              <span className="text-cyan">•</span>
              {doc}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Check({ label, checked, onChange, disabled }) {
  return (
    <label className={`inline-flex items-center gap-2 ${disabled ? 'opacity-40' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-cyan"
      />
      <span className="text-ink-soft">{label}</span>
    </label>
  )
}
