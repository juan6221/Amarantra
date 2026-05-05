import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AmarantaLogo from '../../../shared/components/AmarantaLogo'

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-gold-400/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <AmarantaLogo size="sm" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#catalogo" className="text-dark-200 hover:text-gold-400 text-sm font-medium transition-colors">Catálogo</a>
            <a href="#nosotros" className="text-dark-200 hover:text-gold-400 text-sm font-medium transition-colors">Nosotros</a>
            <a href="#contacto" className="text-dark-200 hover:text-gold-400 text-sm font-medium transition-colors">Contacto</a>
            <button onClick={() => navigate('/login')} className="btn-gold text-sm px-5 py-2">
              Ingresar
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-dark-300 hover:text-white rounded-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-dark-700 space-y-3 animate-fade-in">
            <a href="#catalogo" className="block text-dark-200 hover:text-gold-400 py-2 text-sm" onClick={() => setMenuOpen(false)}>Catálogo</a>
            <a href="#nosotros" className="block text-dark-200 hover:text-gold-400 py-2 text-sm" onClick={() => setMenuOpen(false)}>Nosotros</a>
            <a href="#contacto" className="block text-dark-200 hover:text-gold-400 py-2 text-sm" onClick={() => setMenuOpen(false)}>Contacto</a>
            <button onClick={() => navigate('/login')} className="btn-gold text-sm px-5 py-2 w-full">
              Ingresar
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
