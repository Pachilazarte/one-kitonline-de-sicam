export function Card({ children, className = '' }) {
  return (
    <div className={`bg-card border border-line rounded-xl p-5 ${className}`}>
      {children}
    </div>
  )
}

export function SectionTitle({ children, sub }) {
  return (
    <div className="mb-4">
      <h2 className="font-exo font-600 text-ink text-lg">{children}</h2>
      {sub && <p className="text-sm text-mute mt-1">{sub}</p>}
    </div>
  )
}
