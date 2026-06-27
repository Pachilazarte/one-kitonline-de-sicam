import { TABS, SEPARATORS_AFTER } from '../../config/tabs'
import { useParametros } from '../../hooks/useParametros'

export default function Sidebar({ activeTab, onSelect }) {
  const { isCustom } = useParametros()

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-panel border-r border-cyan/20">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-cyan/20">
        <img src="/img/one-iconocolor.png" alt="One" className="h-9 w-9 object-contain" />
        <div className="leading-tight">
          <p className="font-exo font-700 text-ink text-sm">SICAM</p>
          <p className="text-[11px] text-mute">One-Kit · Escencial</p>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <div key={tab.id}>
              <button
                type="button"
                onClick={() => onSelect(tab.id)}
                className={`w-full flex items-center px-6 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-ocean/10 text-ocean border-r-2 border-ocean'
                    : 'text-mute hover:text-cyan hover:bg-cyan/5'
                }`}
              >
                <Icon className="h-5 w-5 mr-3 shrink-0" />
                <span className="font-exo font-500">{tab.label}</span>
              </button>
              {SEPARATORS_AFTER.has(tab.id) && (
                <hr className="my-2 mx-6 border-line-soft" />
              )}
            </div>
          )
        })}
      </nav>

      <div className="px-4 py-3 text-[11px] text-center border-t border-cyan/20">
        {isCustom ? (
          <span className="text-amber">⚠ Usando valores personalizados</span>
        ) : (
          <span className="text-cyan">● Usando valores base</span>
        )}
      </div>
    </aside>
  )
}
