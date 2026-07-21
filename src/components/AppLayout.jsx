import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar móvil */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-dark-600">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-dark-300 hover:text-white rounded-lg hover:bg-dark-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-serif font-bold text-gold-400 tracking-widest text-lg">AMARANTA</span>
          <div className="w-9" />
        </header>

        {/* Contenido principal */}
        <main className="flex-1 overflow-auto bg-dark-900 scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


