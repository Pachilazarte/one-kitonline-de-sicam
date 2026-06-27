import { Bars3Icon } from '@heroicons/react/24/outline'
import { TABS } from '../../config/tabs'

export default function Header({ activeTab, onToggleMobileNav }) {
  const current = TABS.find((t) => t.id === activeTab)

  return (
    <header className="flex items-center justify-between gap-4 px-5 py-3 bg-panel border-b border-cyan/20">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src="/img/one-iconocolor.png"
          alt="One"
          className="h-7 w-7 object-contain md:hidden"
        />
        <h1 className="font-exo font-600 text-ink truncate">
          {current?.label ?? 'SICAM'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <img
          src="/img/escencial-logoblanco.png"
          alt="Escencial"
          className="hidden sm:block h-5 object-contain opacity-80"
        />
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="md:hidden text-cyan"
          aria-label="Abrir navegación"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
    </header>
  )
}
