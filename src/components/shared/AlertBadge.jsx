/** Píldora de estado. status: 'ok' | 'warn' | 'alert' */
export default function AlertBadge({ status = 'ok', children }) {
  const styles = {
    ok: 'bg-cyan/10 text-cyan border-cyan/40',
    warn: 'bg-amber/10 text-amber border-amber/40',
    alert: 'bg-ocean/10 text-ocean border-ocean/40',
  }[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-500 ${styles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}
