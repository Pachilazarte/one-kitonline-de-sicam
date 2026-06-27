import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { Card, SectionTitle } from './Card'

/**
 * Esqueleto de un módulo temático. La estructura (inputs + zona de resultado)
 * está lista; la lógica de cálculo se conecta en el próximo paso.
 */
export default function ModuloScaffold({ titulo, sub, campos = [], children }) {
  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle sub={sub}>{titulo}</SectionTitle>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-amber">
          <WrenchScrewdriverIcon className="h-3.5 w-3.5" />
          Estructura lista · cálculo pendiente de conectar
        </span>
      </Card>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {campos.map((c) => (
            <label key={c.label} className="block">
              <span className="text-xs text-mute">{c.label}</span>
              <input
                type={c.type ?? 'number'}
                placeholder={c.placeholder ?? ''}
                disabled
                className="mt-1 w-full rounded-lg bg-line-soft border border-line px-3 py-2 text-sm text-ink-soft outline-none disabled:opacity-60"
              />
            </label>
          ))}
        </div>
        {children && <div className="mt-5">{children}</div>}
      </Card>
    </div>
  )
}
