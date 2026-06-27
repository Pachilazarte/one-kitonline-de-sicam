export default function ProgressBar({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="h-2 w-full rounded-full bg-line-soft overflow-hidden">
      <div
        className="h-full bg-cyan transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
