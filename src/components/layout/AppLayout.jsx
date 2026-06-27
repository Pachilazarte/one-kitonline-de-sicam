import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { TABS } from '../../config/tabs'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'
import MobileTabBar from './MobileTabBar'

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState('inicio')
  const [navOpen, setNavOpen] = useState(false)

  const ActivePanel = TABS.find((t) => t.id === activeTab)?.Component ?? (() => null)

  const select = (id) => {
    setActiveTab(id)
    setNavOpen(false)
  }

  return (
    <div className="flex h-screen w-full bg-bg text-ink font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} onSelect={select} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header activeTab={activeTab} onToggleMobileNav={() => setNavOpen(true)} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6">
          <div className="mx-auto max-w-5xl">
            <ActivePanel />
          </div>
        </div>

        <Footer />
      </main>

      <MobileTabBar activeTab={activeTab} onSelect={select} />

      {/* Drawer móvil con TODAS las secciones */}
      {navOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-panel border-l border-cyan/20 flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-cyan/20">
              <span className="font-exo font-600 text-ink">Secciones</span>
              <button type="button" onClick={() => setNavOpen(false)} aria-label="Cerrar">
                <XMarkIcon className="h-6 w-6 text-mute" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => select(tab.id)}
                    className={`w-full flex items-center px-5 py-3 text-sm ${
                      active ? 'text-ocean bg-ocean/10' : 'text-mute'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-exo">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
