import { useState, useMemo } from 'react'
import { useProductos } from '../hooks/useProductos'
import { useCategorias } from '../hooks/useCategorias'
import { useAuthStore } from '../../../shared/store/useStore'
import Modal from '../../../shared/components/Modal'
import ConfirmDialog from '../../../shared/components/ConfirmDialog'
import LoadingSpinner from '../../../shared/components/LoadingSpinner'

function ImagenesInput({ imagenes, onChange }) {
  const [url, setUrl] = useState('')
  return (
    <div>
      <label className="block text-dark-200 text-sm font-medium mb-1">Imágenes (URLs)</label>
      <div className="flex gap-2 mb-2">
        <input className="input-dark flex-1" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
        <button type="button"
          onClick={() => { if (url.trim()) { onChange([...imagenes, url.trim()]); setUrl('') } }}
          className="px-3 py-2 bg-gold-400/20 text-gold-400 border border-gold-400/30 rounded-lg text-sm hover:bg-gold-400/30 transition-all whitespace-nowrap">
          Agregar
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {imagenes.map((img, i) => (
          <div key={i} className="relative group">
            <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-dark-500" onError={e => { e.target.src = '' }} />
            <button type="button"
              onClick={() => onChange(imagenes.filter((_, j) => j !== i))}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductoForm({ initial, categorias, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || {
    nombre: '', descripcion: '', precio: '', stock: '', categoriaId: categorias[0]?.id || '', imagenes: [], activo: true
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ ...form, precio: +form.precio, stock: +form.stock, categoriaId: +form.categoriaId }) }} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-dark-200 text-sm font-medium mb-1">Nombre</label>
          <input className="input-dark" value={form.nombre} onChange={e => set('nombre', e.target.value)} required placeholder="Nombre del producto" />
        </div>
        <div>
          <label className="block text-dark-200 text-sm font-medium mb-1">Categoría</label>
          <select className="select-dark" value={form.categoriaId} onChange={e => set('categoriaId', +e.target.value)}>
            {categorias.filter(c => c.activo).map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Descripción</label>
        <textarea className="input-dark resize-none" rows={2} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Describe el producto..." />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-dark-200 text-sm font-medium mb-1">Precio (COP)</label>
          <input className="input-dark" type="number" min={0} value={form.precio} onChange={e => set('precio', e.target.value)} required placeholder="0" />
        </div>
        <div>
          <label className="block text-dark-200 text-sm font-medium mb-1">Stock</label>
          <input className="input-dark" type="number" min={0} value={form.stock} onChange={e => set('stock', e.target.value)} required placeholder="0" />
        </div>
      </div>
      <ImagenesInput imagenes={form.imagenes} onChange={v => set('imagenes', v)} />
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Estado</label>
        <select className="select-dark" value={form.activo ? 'activo' : 'inactivo'} onChange={e => set('activo', e.target.value === 'activo')}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-outline-gold flex-1 text-sm py-2">Cancelar</button>
        <button type="submit" className="btn-gold flex-1 text-sm py-2">{initial ? 'Guardar cambios' : 'Crear producto'}</button>
      </div>
    </form>
  )
}

export default function ProductosPage() {
  const { productos, loading, addProducto, updateProducto, deleteProducto } = useProductos()
  const { categorias } = useCategorias()
  const { user } = useAuthStore()
  const isAdmin = user?.rol === 'admin'

  const [search, setSearch]             = useState('')
  const [filterCat, setFilterCat]       = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [precioMin, setPrecioMin]       = useState('')
  const [precioMax, setPrecioMax]       = useState('')
  const [modalCreate, setModalCreate]   = useState(false)
  const [modalEdit, setModalEdit]       = useState(null)
  const [modalDetail, setModalDetail]   = useState(null)
  const [confirmDel, setConfirmDel]     = useState(null)
  const [activeImg, setActiveImg]       = useState(0)

  const filtered = useMemo(() => productos.filter(p => {
    const matchSearch  = p.nombre.toLowerCase().includes(search.toLowerCase())
    const matchCat     = !filterCat || p.categoriaId === +filterCat
    const matchEstado  = filterEstado === '' || (filterEstado === 'activo' ? p.activo : !p.activo)
    const matchMin     = !precioMin || p.precio >= +precioMin
    const matchMax     = !precioMax || p.precio <= +precioMax
    return matchSearch && matchCat && matchEstado && matchMin && matchMax
  }), [productos, search, filterCat, filterEstado, precioMin, precioMax])

  if (loading) return <div className="page-container"><LoadingSpinner text="Cargando productos..." /></div>

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Productos</h1>
          <p className="text-dark-300 text-sm mt-1">{productos.filter(p => p.activo).length} productos activos</p>
        </div>
        {isAdmin && (
          <button onClick={() => setModalCreate(true)} className="btn-gold text-sm flex items-center gap-2 self-start">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nuevo producto
          </button>
        )}
      </div>

      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input className="input-dark pl-9" placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="select-dark" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          <select className="select-dark" value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <div className="flex gap-2">
            <input className="input-dark flex-1 min-w-0" type="number" placeholder="Precio mín." value={precioMin} onChange={e => setPrecioMin(e.target.value)} />
            <input className="input-dark flex-1 min-w-0" type="number" placeholder="Precio máx." value={precioMax} onChange={e => setPrecioMax(e.target.value)} />
          </div>
        </div>
        {(search || filterCat || filterEstado || precioMin || precioMax) && (
          <button onClick={() => { setSearch(''); setFilterCat(''); setFilterEstado(''); setPrecioMin(''); setPrecioMax('') }}
            className="mt-3 text-gold-400/70 hover:text-gold-400 text-xs underline transition-colors">
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => {
          const cat = categorias.find(c => c.id === p.categoriaId)
          return (
            <div key={p.id}
              className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden hover:border-gold-400/40 transition-all group cursor-pointer"
              onClick={() => { setModalDetail(p); setActiveImg(0) }}>
              <div className="relative h-40 bg-dark-700 overflow-hidden">
                {p.imagenes?.[0] ? (
                  <img src={p.imagenes[0]} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" onError={e => { e.target.style.display = 'none' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-dark-600">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                  <span className={p.activo ? 'badge-active' : 'badge-inactive'}>{p.activo ? 'Activo' : 'Inactivo'}</span>
                  {p.stock === 0 && <span className="bg-red-600/80 text-white text-xs px-2 py-0.5 rounded-full">Agotado</span>}
                </div>
                {p.imagenes?.length > 1 && (
                  <span className="absolute bottom-2 right-2 bg-dark-900/70 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">{p.imagenes.length} fotos</span>
                )}
              </div>
              <div className="p-4">
                <p className="text-dark-400 text-xs mb-1">{cat?.nombre}</p>
                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1">{p.nombre}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gold-400 font-bold">${p.precio.toLocaleString('es-CO')}</span>
                  <span className="text-dark-400 text-xs">Stock: {p.stock}</span>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-dark-600" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setModalEdit(p)} className="flex-1 border border-gold-400/30 text-gold-400 text-xs py-1.5 rounded-lg hover:bg-gold-400/10 transition-all">Editar</button>
                    <button onClick={() => setConfirmDel(p)} className="flex-1 border border-red-500/30 text-red-400 text-xs py-1.5 rounded-lg hover:bg-red-500/10 transition-all">{p.activo ? 'Desactivar' : 'Activar'}</button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-dark-400">No se encontraron productos.</div>
        )}
      </div>

      <Modal isOpen={!!modalDetail} onClose={() => setModalDetail(null)} title={modalDetail?.nombre || ''} size="lg">
        {modalDetail && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="aspect-square rounded-xl overflow-hidden bg-dark-800 mb-3">
                {modalDetail.imagenes?.[activeImg] && (
                  <img src={modalDetail.imagenes[activeImg]} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = '' }} />
                )}
              </div>
              {modalDetail.imagenes?.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {modalDetail.imagenes.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-gold-400' : 'border-dark-600'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <span className="badge-admin">{categorias.find(c => c.id === modalDetail.categoriaId)?.nombre}</span>
              <p className="text-3xl font-bold text-gold-400">${modalDetail.precio.toLocaleString('es-CO')}</p>
              <p className="text-dark-200 text-sm leading-relaxed">{modalDetail.descripcion}</p>
              <div className="flex gap-2 flex-wrap">
                <span className={modalDetail.activo ? 'badge-active' : 'badge-inactive'}>{modalDetail.activo ? 'Activo' : 'Inactivo'}</span>
                <span className="bg-dark-600 text-dark-200 text-xs px-2 py-1 rounded-full">Stock: {modalDetail.stock}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {isAdmin && (
        <>
          <Modal isOpen={modalCreate} onClose={() => setModalCreate(false)} title="Nuevo producto" size="lg">
            <ProductoForm categorias={categorias} onSubmit={async d => { await addProducto(d); setModalCreate(false) }} onCancel={() => setModalCreate(false)} />
          </Modal>
          <Modal isOpen={!!modalEdit} onClose={() => setModalEdit(null)} title="Editar producto" size="lg">
            {modalEdit && <ProductoForm initial={modalEdit} categorias={categorias} onSubmit={async d => { await updateProducto(modalEdit.id, d); setModalEdit(null) }} onCancel={() => setModalEdit(null)} />}
          </Modal>
          <ConfirmDialog
            isOpen={!!confirmDel} onClose={() => setConfirmDel(null)}
            onConfirm={() => confirmDel && (confirmDel.activo ? deleteProducto(confirmDel.id) : updateProducto(confirmDel.id, { activo: true }))}
            title={`${confirmDel?.activo ? 'Desactivar' : 'Activar'} producto`}
            message={`¿Deseas ${confirmDel?.activo ? 'desactivar' : 'activar'} "${confirmDel?.nombre}"?`}
            confirmText={confirmDel?.activo ? 'Desactivar' : 'Activar'}
            danger={confirmDel?.activo}
          />
        </>
      )}
    </div>
  )
}
