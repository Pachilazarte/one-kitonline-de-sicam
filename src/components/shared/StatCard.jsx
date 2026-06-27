/** KPI del dashboard. accent: 'cyan' | 'ocean' | 'amber' */
export default function StatCard({ label, value, hint, accent = 'cyan' }) {
  const accentColor = {
    cyan: 'text-cyan',
    ocean: 'text-ocean',
    amber: 'text-amber',
  }[accent]

  return (
    <div className="bg-card border border-line rounded-xl p-4">
      <p className="text-xs text-mute uppercase tracking-wide">{label}</p>
      <p className={`font-exo font-700 text-2xl mt-1 ${accentColor}`}>{value}</p>
      {hint && <p className="text-[11px] text-mute mt-1">{hint}</p>}
    </div>
  )
}
