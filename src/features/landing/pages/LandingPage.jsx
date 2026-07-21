import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductos } from '../../productos/hooks/useProductos'
import { useCategorias } from '../../productos/hooks/useCategorias'
import LandingNavbar from '../components/LandingNavbar'
import ProductCard from '../components/ProductCard'
import ProductDetailModal from '../components/ProductDetailModal'
import AmarantaLogo from '../../../components/AmarantaLogo'

const LANDING_PAGE_SIZE = 8

export default function LandingPage() {
  const { productos } = useProductos()
  const { categorias } = useCategorias()
  const navigate = useNavigate()
  const [selectedCat, setSelectedCat]     = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [modalOpen, setModalOpen]         = useState(false)
  const [page, setPage]                   = useState(1)

  const activeCats = categorias.filter(c => c.activo)

  const productosVisibles = useMemo(() => {
    setPage(1)
    return productos.filter(p => p.activo && (selectedCat === null || p.categoriaId === selectedCat))
  }, [productos, selectedCat])

  const totalPages = Math.max(1, Math.ceil(productosVisibles.length / LANDING_PAGE_SIZE))
  const paginated  = productosVisibles.slice((page - 1) * LANDING_PAGE_SIZE, page * LANDING_PAGE_SIZE)

  const openProduct = (p) => { setSelectedProduct(p); setModalOpen(true) }

  const handleCatChange = (catId) => {
    setSelectedCat(catId)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <LandingNavbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(ellipse at 30% 50%, #d4af3720 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, #b8960c15 0%, transparent 50%)' }}
        />
        <div className="absolute top-1/4 left-10 w-px h-40 bg-gradient-to-b from-transparent via-gold-400/30 to-transparent hidden lg:block" />
        <div className="absolute top-1/4 right-10 w-px h-40 bg-gradient-to-b from-transparent via-gold-400/30 to-transparent hidden lg:block" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <AmarantaLogo size="xl" />
          </div>
          <p className="text-gold-400/80 tracking-[0.4em] text-sm uppercase mb-6 font-light">
            Lujo · Exclusividad · Distinción
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            La esencia de lo
            <span className="block text-transparent bg-clip-text bg-gold-gradient">
              extraordinario
            </span>
          </h1>
          <p className="text-dark-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Descubre nuestra curaduría de puros premium, ediciones limitadas y accesorios de alta gama.
            Cada cigarro, una obra maestra de la tradición.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#catalogo" className="btn-gold text-base px-8 py-4">
              Explorar Catálogo
            </a>
            <button onClick={() => navigate('/login')} className="btn-outline-gold text-base px-8 py-4">
              Acceder al Sistema
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gold-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-gold-400/10 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '+200', label: 'Productos Exclusivos' },
            { value: '+500', label: 'Clientes Satisfechos' },
            { value: '8',    label: 'Años de Tradición' },
            { value: '100%', label: 'Artesanal & Premium' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="font-serif text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gold-gradient mb-2">
                {stat.value}
              </p>
              <p className="text-dark-300 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATÁLOGO */}
      <section id="catalogo" className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold-400 tracking-widest text-xs uppercase mb-3">Nuestra Selección</p>
          <h2 className="section-title mb-4">Catálogo Exclusivo</h2>
          <p className="text-dark-300 max-w-xl mx-auto">
            Cada producto es cuidadosamente seleccionado para ofrecerte la más alta calidad.
          </p>
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button
            onClick={() => handleCatChange(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCat === null
              ? 'bg-gold-gradient text-dark-900'
              : 'border border-dark-500 text-dark-300 hover:border-gold-400/50 hover:text-gold-400'}`}>
            Todos
          </button>
          {activeCats.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCatChange(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCat === cat.id
                ? 'bg-gold-gradient text-dark-900'
                : 'border border-dark-500 text-dark-300 hover:border-gold-400/50 hover:text-gold-400'}`}>
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Grid productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {paginated.map(p => (
            <ProductCard key={p.id} producto={p} categorias={categorias} onClick={openProduct} />
          ))}
          {productosVisibles.length === 0 && (
            <div className="col-span-full text-center py-16 text-dark-400">
              No hay productos disponibles en esta categoría.
            </div>
          )}
        </div>

        {/* Paginación landing */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-full border border-dark-500 text-dark-300 hover:border-gold-400/50 hover:text-gold-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm">
              ← Anterior
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce((acc, n, idx, arr) => {
                  if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...')
                  acc.push(n)
                  return acc
                }, [])
                .map((n, i) =>
                  n === '...'
                    ? <span key={`e${i}`} className="px-2 text-dark-500 self-center">…</span>
                    : (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${page === n
                          ? 'bg-gold-gradient text-dark-900'
                          : 'border border-dark-500 text-dark-300 hover:border-gold-400/50 hover:text-gold-400'}`}>
                        {n}
                      </button>
                    )
                )
              }
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-full border border-dark-500 text-dark-300 hover:border-gold-400/50 hover:text-gold-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm">
              Siguiente →
            </button>
          </div>
        )}

        {productosVisibles.length > 0 && (
          <p className="text-center text-dark-500 text-xs mt-3">
            {(page - 1) * LANDING_PAGE_SIZE + 1}–{Math.min(page * LANDING_PAGE_SIZE, productosVisibles.length)} de {productosVisibles.length} productos
          </p>
        )}
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="py-20 bg-dark-800/40 border-y border-gold-400/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-gold-400 tracking-widest text-xs uppercase mb-3">Nuestra Historia</p>
            <h2 className="section-title mb-6">El Arte de lo Excepcional</h2>
            <p className="text-dark-200 leading-relaxed mb-4">
              Amaranta nació de la pasión por el arte del tabaco y el placer de lo excepcional. Cada cigarro de nuestra cava es seleccionado meticulosamente, garantizando una experiencia sensorial única bajo los más altos estándares de añejamiento y calidad.
            </p>
            <p className="text-dark-300 leading-relaxed mb-8">
              Desde nuestras hojas de capa premium hasta nuestras ediciones limitadas, todo en Amaranta cuenta una historia de herencia, paciencia y sofisticación para el paladar más exigente.
            </p>
            <div className="flex flex-wrap gap-4">
              {['Calidad Premium', 'Origen Artesanal', 'Diseño Exclusivo'].map(tag => (
                <span key={tag} className="border border-gold-400/30 text-gold-400 text-xs px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=400" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden mt-8">
              <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20 max-w-7xl mx-auto px-4 text-center">
        <p className="text-gold-400 tracking-widest text-xs uppercase mb-3">Encuéntranos</p>
        <h2 className="section-title mb-4">Visítanos</h2>
        <p className="text-dark-300 mb-8 max-w-lg mx-auto">
          Estamos disponibles para atenderte de manera personalizada. Tu experiencia Amaranta empieza aquí.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {[
            { icon: '📍', label: 'Ubicación', value: 'Calle 80 #45-22, Medellín Ant' },
            { icon: '📞', label: 'Teléfono', value: '+57 300 123 4567' },
            { icon: '✉️', label: 'Email', value: 'contacto@amaranta.com' },
          ].map(c => (
            <div key={c.label} className="card-dark text-center flex-1 max-w-xs mx-auto">
              <div className="text-2xl mb-2">{c.icon}</div>
              <p className="text-dark-300 text-xs uppercase tracking-wider mb-1">{c.label}</p>
              <p className="text-white text-sm font-medium">{c.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gold-400/10 py-8 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <AmarantaLogo size="sm" />
          <p className="text-dark-400 text-sm">© 2026 Amaranta. Todos los derechos reservados.</p>
          <p className="text-dark-500 text-xs">Lujo · Exclusividad · Distinción</p>
        </div>
      </footer>

      <ProductDetailModal
        producto={selectedProduct}
        categorias={categorias}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}


