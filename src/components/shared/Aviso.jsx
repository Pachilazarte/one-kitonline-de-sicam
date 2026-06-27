import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

/** Caja de aviso. tono: 'cyan' (info) | 'amber' (advertencia) | 'alert' (bloqueante) */
export default function Aviso({ tono = 'cyan', children }) {
  const Icon = tono === 'cyan' ? InformationCircleIcon : ExclamationTriangleIcon
  const box = {
    amber: 'border-amber/35 bg-amber/5',
    alert: 'border-alert/40 bg-alert/5',
    cyan: 'border-cyan/35 bg-cyan/5',
  }[tono]
  const iconColor = { amber: 'text-amber', alert: 'text-alert', cyan: 'text-cyan' }[tono]
  return (
    <div className={`flex gap-2 items-start rounded-lg border px-3 py-2 text-xs text-ink-soft ${box}`}>
      <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${iconColor}`} />
      <p>{children}</p>
    </div>
  )
}
