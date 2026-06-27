import { useMemo } from 'react'
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline'
import { useParametros } from '../../hooks/useParametros'
import { useCaso } from '../../context/CasoContext'
import { Card, SectionTitle } from '../shared/Card'
import Aviso from '../shared/Aviso'
import { fmtTiempo } from '../../utils/tiempo'
import { construirComputo } from '../../utils/computo'

export default function ImportExport() {
  const { parametros } = useParametros()
  const caso = useCaso()
  const computo = useMemo(() => construirComputo(caso, parametros), [caso, parametros])

  // jsPDF es pesado: se carga recién al exportar (code-splitting).
  const handleExport = async () => {
    const { exportarComputoPDF } = await import('../../utils/pdf')
    exportarComputoPDF(computo)
  }

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle sub="Revisá el cómputo en pantalla antes de exportar el PDF. Guardá o cargá datos desde la plantilla oficial.">
          📊 Importar / Exportar Datos
        </SectionTitle>
      </Card>

      {/* Cómputo Ilustrativo */}
      <Card>
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="flex items-center gap-2 font-exo font-600 text-ink text-sm">
            <DocumentArrowDownIcon className="h-5 w-5 text-cyan" />
            Cómputo Ilustrativo (espejo de ANSES)
          </h3>
          <button
            type="button"
            onClick={handleExport}
            className="shrink-0 inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-ocean/15 text-ocean border border-ocean/40 hover:bg-ocean/25"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Exportar PDF
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
          <Dato label="Fecha de solicitud" value={computo.fechaSolicitud || '—'} />
          <Dato label="Fecha de cese" value={computo.fechaCese || '—'} />
          <Dato label="Servicios totales" value={fmtTiempo(computo.total.serviciosFinal)} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-mute border-b border-line">
                <th className="py-2 pr-3 font-500">Cód.</th>
                <th className="py-2 pr-3 font-500">Concepto</th>
                <th className="py-2 pr-3 font-500">Desde</th>
                <th className="py-2 pr-3 font-500">Hasta</th>
                <th className="py-2 font-500 text-right">Meses</th>
              </tr>
            </thead>
            <tbody>
              {computo.filas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-mute">
                    Cargá datos en los módulos para ver el cómputo.
                  </td>
                </tr>
              ) : (
                computo.filas.map((f, i) => (
                  <tr key={i} className="border-b border-line-soft">
                    <td className="py-2 pr-3 text-ocean font-mono">{f.codigo}</td>
                    <td className="py-2 pr-3 text-ink-soft">{f.concepto}</td>
                    <td className="py-2 pr-3 text-mute">{f.desde || '—'}</td>
                    <td className="py-2 pr-3 text-mute">{f.hasta || '—'}</td>
                    <td className="py-2 text-right text-ink">{f.meses}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {computo.liq.hayBloqueante && (
          <div className="mt-3">
            <Aviso tono="alert">
              <strong className="text-alert">Atención:</strong> el cómputo incluye períodos impagos post-09/1993 sin renunciar. Resolvé
              la deuda bloqueante en Liquidación antes de presentar.
            </Aviso>
          </div>
        )}
      </Card>

      {/* Excel (pendiente) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <h3 className="flex items-center gap-2 font-exo font-600 text-cyan text-sm">
            <ArrowDownTrayIcon className="h-5 w-5" />
            Exportar datos actuales
          </h3>
          <p className="text-sm text-mute mt-2 mb-4">
            Descargá todo lo cargado en formato Excel/JSON para guardar, compartir o editar fuera de la herramienta.
          </p>
          <button type="button" disabled className="text-sm px-4 py-2 rounded-lg border border-cyan/40 text-cyan disabled:opacity-50">
            Descargar (pendiente)
          </button>
        </Card>

        <Card>
          <h3 className="flex items-center gap-2 font-exo font-600 text-ocean text-sm">
            <ArrowUpTrayIcon className="h-5 w-5" />
            Importar historia laboral
          </h3>
          <p className="text-sm text-mute mt-2 mb-4">
            Subí la plantilla oficial de carga masiva (padrón histórico) o un archivo .json de progreso guardado.
          </p>
          <button type="button" disabled className="text-sm px-4 py-2 rounded-lg border border-ocean/40 text-ocean disabled:opacity-50">
            Subir archivo (pendiente)
          </button>
        </Card>
      </div>
    </div>
  )
}

function Dato({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-line-soft px-3 py-2">
      <p className="text-mute">{label}</p>
      <p className="text-ink font-500 mt-0.5">{value}</p>
    </div>
  )
}
