import { useState, useMemo } from 'react'
import { useVentas } from '../hooks/useVentas'
import { useProductos } from '../../productos/hooks/useProductos'
import { useCategorias } from '../../productos/hooks/useCategorias'
import { useAuthStore } from '../../../shared/store/useStore'
import Modal from '../../../shared/components/Modal'
import LoadingSpinner from '../../../shared/components/LoadingSpinner'

function CarritoItem({ item, producto, onUpdate, onRemove }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-dark-600 last:border-0">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
        {producto?.imagenes?.[0] && (
          <img src={producto.imagenes[0]} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{producto?.nombre}</p>
        <p className="text-gold-400 text-xs">${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onUpdate(Math.max(1, item.cantidad - 1))}
          className="w-7 h-7 rounded-full bg-dark-600 hover:bg-dark-500 text-white flex items-center justify-center transition-colors">−</button>
        <span className="text-white text-sm w-5 text-center">{item.cantidad}</span>
        <button onClick={() => onUpdate(Math.min(producto?.stock || 99, item.cantidad + 1))}
          className="w-7 h-7 rounded-full bg-dark-600 hover:bg-dark-500 text-white flex items-center justify-center transition-colors">+</button>
        <button onClick={onRemove} className="p-1 text-red-400/60 hover:text-red-400 transition-colors ml-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  )
}

export default function VentasPage() {
  const { user } = useAuthStore()
  const { productos, loading: loadProd, refetch: refetchProd } = useProductos()
  const { categorias } = useCategorias()
  const { ventas, loading: loadVentas, addVenta } = useVentas(user?.id, user?.rol)

  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [carrito, setCarrito]     = useState([])
  const [tab, setTab]             = useState('nueva')
  const [modalSuccess, setModalSuccess] = useState(false)
  const [lastVenta, setLastVenta]       = useState(null)
  const [processing, setProcessing]     = useState(false)

  const productosDisponibles = useMemo(() =>
    productos.filter(p => p.activo && p.stock > 0 &&
      p.nombre.toLowerCase().includes(search.toLowerCase()) &&
      (!filterCat || p.categoriaId === +filterCat)
    ), [productos, search, filterCat])

  const total = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0)

  const addToCart = (producto) => {
    setCarrito(prev => {
      const exists = prev.find(i => i.productoId === producto.id)
      if (exists) return prev.map(i => i.productoId === producto.id ? { ...i, cantidad: Math.min(producto.stock, i.cantidad + 1) } : i)
      return [...prev, { productoId: producto.id, cantidad: 1, precio: producto.precio }]
    })
  }

  const procesarVenta = async () => {
    if (!carrito.length || processing) return
    setProcessing(true)
    const { error, venta } = await addVenta({ usuarioId: user.id, productos: carrito, total })
    setProcessing(false)
    if (!error) {
      setLastVenta({ ...venta, total, productos: carrito })
      setCarrito([])
      await refetchProd()
      setModalSuccess(true)
    }
  }

  if (loadProd) return <div className="page-container"><LoadingSpinner text="Cargando catálogo..." /></div>

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-white">Ventas</h1>
        <p className="text-dark-300 text-sm mt-1">Gestiona y procesa transacciones</p>
      </div>

      <div className="flex gap-1 bg-dark-800 border border-dark-600 rounded-xl p-1 mb-6 w-fit">
        {[{ id: 'nueva', label: 'Nueva Venta' }, { id: 'historial', label: 'Historial' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-gold-gradient text-dark-900' : 'text-dark-300 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'nueva' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Catálogo */}
          <div className="xl:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input className="input-dark pl-9" placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="select-dark" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="">Todas las categorías</option>
                {categorias.filter(c => c.activo).map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {productosDisponibles.map(p => {
                const inCart = carrito.find(i => i.productoId === p.id)
                return (
                  <div key={p.id}
                    className={`flex gap-3 bg-dark-800 border rounded-xl p-3 cursor-pointer transition-all ${inCart ? 'border-gold-400/50 bg-gold-400/5' : 'border-dark-600 hover:border-gold-400/30'}`}
                    onClick={() => addToCart(p)}>
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
                      {p.imagenes?.[0] && <img src={p.imagenes[0]} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium line-clamp-1">{p.nombre}</p>
                      <p className="text-dark-400 text-xs mt-0.5">{categorias.find(c => c.id === p.categoriaId)?.nombre}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gold-400 font-bold text-sm">${p.precio.toLocaleString('es-CO')}</span>
                        <span className="text-dark-400 text-xs">Stock: {p.stock}</span>
                      </div>
                    </div>
                    {inCart && (
                      <span className="w-5 h-5 bg-gold-gradient text-dark-900 rounded-full text-xs font-bold flex items-center justify-center self-start mt-1">
                        {inCart.cantidad}
                      </span>
                    )}
                  </div>
                )
              })}
              {productosDisponibles.length === 0 && (
                <div className="col-span-full text-center py-12 text-dark-400">No hay productos disponibles.</div>
              )}
            </div>
          </div>

          {/* Carrito */}
          <div>
            <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 sticky top-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Carrito ({carrito.length})
              </h3>
              {carrito.length === 0 ? (
                <p className="text-dark-400 text-sm text-center py-8">Selecciona productos del catálogo</p>
              ) : (
                <>
                  <div className="mb-4 max-h-80 overflow-y-auto scrollbar-thin pr-1">
                    {carrito.map(item => (
                      <CarritoItem key={item.productoId} item={item}
                        producto={productos.find(p => p.id === item.productoId)}
                        onUpdate={v => setCarrito(prev => prev.map(i => i.productoId === item.productoId ? { ...i, cantidad: v } : i))}
                        onRemove={() => setCarrito(prev => prev.filter(i => i.productoId !== item.productoId))} />
                    ))}
                  </div>
                  <div className="border-t border-dark-600 pt-4 mb-5">
                    <div className="flex justify-between mb-1">
                      <span className="text-dark-300 text-sm">Subtotal</span>
                      <span className="text-white text-sm">${total.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-gold-400 font-bold text-lg">${total.toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                  <button onClick={procesarVenta} disabled={processing} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-70">
                    {processing ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Procesando...</> : 'Procesar venta'}
                  </button>
                  <button onClick={() => setCarrito([])} className="w-full mt-2 text-dark-400 hover:text-dark-200 text-xs py-1 transition-colors">
                    Vaciar carrito
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'historial' && (
        loadVentas ? <LoadingSpinner text="Cargando historial..." /> : (
          <div className="space-y-3">
            {ventas.length === 0 && <div className="text-center py-16 text-dark-400">No hay ventas registradas.</div>}
            {ventas.map(v => (
              <div key={v.id} className="bg-dark-800 border border-dark-600 rounded-xl p-5 hover:border-gold-400/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="text-dark-400 text-xs">Venta #{v.id}</span>
                    <p className="text-white font-medium">{v.fecha}</p>
                  </div>
                  <div className="text-right">
                    <span className="badge-active">Completada</span>
                    <p className="text-gold-400 font-bold text-lg mt-1">${v.total.toLocaleString('es-CO')}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {v.productos.map((item, i) => {
                    const prod = productos.find(p => p.id === item.productoId)
                    return (
                      <span key={i} className="bg-dark-700 text-dark-200 text-xs px-3 py-1 rounded-full">
                        {prod?.nombre || `Producto #${item.productoId}`} ×{item.cantidad}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <Modal isOpen={modalSuccess} onClose={() => setModalSuccess(false)} title="¡Venta procesada!" size="sm">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="text-white font-semibold mb-1">Venta completada</p>
          {lastVenta && <p className="text-gold-400 font-bold text-2xl">${lastVenta.total?.toLocaleString('es-CO')}</p>}
          <p className="text-dark-400 text-sm mt-2">{lastVenta?.productos?.length} producto(s) procesado(s)</p>
          <button onClick={() => setModalSuccess(false)} className="btn-gold mt-6 w-full">Continuar</button>
        </div>
      </Modal>
    </div>
  )
}
