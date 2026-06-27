import { TABS } from '../../config/tabs'

const MOBILE_TABS = TABS.filter((t) => t.mobile)

export default function MobileTabBar({ activeTab, onSelect }) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 flex justify-around bg-panel border-t border-cyan/20 px-1 py-1.5">
      {MOBILE_TABS.map((tab) => {
        const Icon = tab.icon
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] transition-colors ${
              active ? 'text-ocean' : 'text-mute'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-exo">{tab.short}</span>
          </button>
        )
      })}
    </nav>
  )
}
