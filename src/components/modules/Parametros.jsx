import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useParametros } from '../../hooks/useParametros'
import { Card, SectionTitle } from '../shared/Card'

export default function Parametros() {
  const { parametros, schema, updateParametro, resetToDefaults, isCustom } =
    useParametros()

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <SectionTitle sub="Ajustá los umbrales según el rubro y la normativa vigente. Se guardan solos en el navegador.">
            ⚙️ Parámetros del Sistema
          </SectionTitle>
          <button
            type="button"
            onClick={resetToDefaults}
            disabled={!isCustom}
            className="shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-line text-mute hover:text-cyan hover:border-cyan/40 disabled:opacity-40 disabled:hover:text-mute disabled:hover:border-line"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Restaurar base
          </button>
        </div>
        <p className="text-xs">
          {isCustom ? (
            <span className="text-amber">⚠ Usando valores personalizados</span>
          ) : (
            <span className="text-cyan">● Usando valores base</span>
          )}
        </p>
      </Card>

      <Card>
        <div className="space-y-6">
          {schema.map((group) => (
            <div key={group.section}>
              <h3 className="font-exo font-600 text-ocean text-sm mb-3">
                {group.section}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.fields.map((f) => (
                  <label key={f.key} className="block">
                    <span className="text-xs text-mute">{f.label}</span>
                    <input
                      type="number"
                      step={f.step}
                      value={parametros[f.key]}
                      onChange={(e) => updateParametro(f.key, e.target.value)}
                      className="mt-1 w-full rounded-lg bg-line-soft border border-line px-3 py-2 text-sm text-ink outline-none focus:border-cyan/60"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
