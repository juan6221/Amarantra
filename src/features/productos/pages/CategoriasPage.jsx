import { useState, useMemo } from 'react'
import { useCategorias } from '../hooks/useCategorias'
import { useProductos } from '../hooks/useProductos'
import Modal from '../../../components/Modal'
import ConfirmDialog from '../../../components/ConfirmDialog'
import LoadingSpinner from '../../../components/LoadingSpinner'

function CategoriaForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { nombre: '', descripcion: '', imagen: '', activo: true })
  const [err, setErr]   = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    const result = await onSubmit(form)
    if (result?.error) setErr(result.error.message || 'Error al guardar.')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Nombre *</label>
        <input className="input-dark" value={form.nombre} onChange={e => set('nombre', e.target.value)} required placeholder="Ej: Cigarros Premium" />
      </div>
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Descripción</label>
        <textarea className="input-dark resize-none" rows={2} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Descripción breve..." />
      </div>
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">URL de imagen</label>
        <input className="input-dark" value={form.imagen} onChange={e => set('imagen', e.target.value)} placeholder="https://..." />
        {form.imagen && (
          <img src={form.imagen} alt="" className="mt-2 h-24 w-full object-cover rounded-lg opacity-70" onError={e => { e.target.style.display = 'none' }} />
        )}
      </div>
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Estado</label>
        <select className="select-dark" value={form.activo ? 'activo' : 'inactivo'} onChange={e => set('activo', e.target.value === 'activo')}>
          <option value="activo">Activa</option>
          <option value="inactivo">Inactiva</option>
        </select>
      </div>
      {err && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">{err}</p>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-outline-gold flex-1 text-sm py-2">Cancelar</button>
        <button type="submit" className="btn-gold flex-1 text-sm py-2">{initial ? 'Guardar' : 'Crear categoría'}</button>
      </div>
    </form>
  )
}

export default function CategoriasPage() {
  const { categorias, loading, addCategoria, updateCategoria, deleteCategoria } = useCategorias()
  const { productos } = useProductos()
  const [search, setSearch]             = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [modalCreate, setModalCreate]   = useState(false)
  const [modalEdit, setModalEdit]       = useState(null)
  const [modalDetail, setModalDetail]   = useState(null)
  const [confirmToggle, setConfirmToggle] = useState(null)
  const [confirmDel, setConfirmDel]     = useState(null)
  const [actionError, setActionError]   = useState('')

  const filtered = useMemo(() => categorias.filter(c => {
    const matchSearch = c.nombre.toLowerCase().includes(search.toLowerCase())
    const matchEstado = filterEstado === '' || (filterEstado === 'activo' ? c.activo : !c.activo)
    return matchSearch && matchEstado
  }), [categorias, search, filterEstado])

  const handleAdd = async (data) => {
    const result = await addCategoria(data)
    if (result?.error) return result
    setModalCreate(false)
    return {}
  }

  const handleEdit = async (data) => {
    const result = await updateCategoria(modalEdit.id, data)
    if (result?.error) return result
    setModalEdit(null)
    return {}
  }

  const handleHardDelete = async () => {
    const result = await deleteCategoria(confirmDel.id, true)
    if (result?.error) { setActionError(result.error.message); setConfirmDel(null) }
  }

  if (loading) return <div className="page-container"><LoadingSpinner text="Cargando categorías..." /></div>

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Categorías</h1>
          <p className="text-dark-300 text-sm mt-1">
            {categorias.filter(c => c.activo).length} activas · {categorias.length} total
          </p>
        </div>
        <button onClick={() => setModalCreate(true)} className="btn-gold text-sm flex items-center gap-2 self-start">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nueva categoría
        </button>
      </div>

      {actionError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center justify-between">
          {actionError}
          <button onClick={() => setActionError('')} className="ml-2 text-lg leading-none">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-xl">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input className="input-dark pl-9" placeholder="Buscar categoría..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select-dark" value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="activo">Activa</option>
          <option value="inactivo">Inactiva</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(cat => {
          const numProductos = productos.filter(p => p.categoriaId === cat.id && p.activo).length
          return (
            <div key={cat.id} className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden hover:border-gold-400/40 transition-all group">
              {/* Imagen */}
              <div className="relative h-36 bg-dark-700 overflow-hidden cursor-pointer" onClick={() => setModalDetail(cat)}>
                {cat.imagen ? (
                  <img src={cat.imagen} alt={cat.nombre} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" onError={e => { e.target.style.display = 'none' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-dark-500">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <span className={`absolute top-2 right-2 ${cat.activo ? 'badge-active' : 'badge-inactive'}`}>
                  {cat.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1">{cat.nombre}</h3>
                <p className="text-dark-400 text-xs mb-2 line-clamp-2">{cat.descripcion || 'Sin descripción'}</p>
                <p className="text-dark-400 text-xs mb-4">
                  <span className="text-gold-400 font-medium">{numProductos}</span> productos activos
                </p>

                {/* Acciones */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setModalDetail(cat)}
                    className="flex-1 border border-dark-500 text-dark-300 text-xs py-1.5 rounded-lg hover:bg-dark-600 transition-all"
                    title="Ver detalle">
                    Ver
                  </button>
                  <button
                    onClick={() => setModalEdit(cat)}
                    className="flex-1 border border-gold-400/30 text-gold-400 text-xs py-1.5 rounded-lg hover:bg-gold-400/10 transition-all">
                    Editar
                  </button>
                  <button
                    onClick={() => setConfirmToggle(cat)}
                    className="flex-1 border border-amber-400/30 text-amber-400 text-xs py-1.5 rounded-lg hover:bg-amber-400/10 transition-all">
                    {cat.activo ? 'Desact.' : 'Activar'}
                  </button>
                  <button
                    onClick={() => setConfirmDel(cat)}
                    className="p-1.5 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                    title="Eliminar permanentemente">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-dark-400">No se encontraron categorías.</div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!modalDetail} onClose={() => setModalDetail(null)} title="Detalle de categoría" size="sm">
        {modalDetail && (() => {
          const total  = productos.filter(p => p.categoriaId === modalDetail.id).length
          const activos = productos.filter(p => p.categoriaId === modalDetail.id && p.activo).length
          return (
            <div className="space-y-4">
              {modalDetail.imagen && (
                <img src={modalDetail.imagen} alt={modalDetail.nombre}
                  className="w-full h-40 object-cover rounded-xl opacity-80"
                  onError={e => { e.target.style.display = 'none' }} />
              )}
              <div>
                <h3 className="text-white font-semibold text-lg">{modalDetail.nombre}</h3>
                <span className={modalDetail.activo ? 'badge-active' : 'badge-inactive'}>
                  {modalDetail.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              {modalDetail.descripcion && (
                <p className="text-dark-300 text-sm leading-relaxed">{modalDetail.descripcion}</p>
              )}
              <div className="bg-dark-800 rounded-lg p-4 space-y-2 text-sm">
                {[
                  ['Productos activos', activos],
                  ['Productos totales', total],
                  ['Creada', modalDetail.created_at || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-dark-400">{k}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setModalDetail(null); setModalEdit(modalDetail) }}
                  className="btn-outline-gold flex-1 text-sm py-2">Editar</button>
                <button onClick={() => setModalDetail(null)}
                  className="btn-gold flex-1 text-sm py-2">Cerrar</button>
              </div>
            </div>
          )
        })()}
      </Modal>

      {/* Create / Edit Modals */}
      <Modal isOpen={modalCreate} onClose={() => setModalCreate(false)} title="Nueva categoría">
        <CategoriaForm onSubmit={handleAdd} onCancel={() => setModalCreate(false)} />
      </Modal>
      <Modal isOpen={!!modalEdit} onClose={() => setModalEdit(null)} title="Editar categoría">
        {modalEdit && <CategoriaForm initial={modalEdit} onSubmit={handleEdit} onCancel={() => setModalEdit(null)} />}
      </Modal>

      {/* Toggle activo/inactivo */}
      <ConfirmDialog
        isOpen={!!confirmToggle} onClose={() => setConfirmToggle(null)}
        onConfirm={async () => { await updateCategoria(confirmToggle.id, { activo: !confirmToggle.activo }); setConfirmToggle(null) }}
        title={confirmToggle?.activo ? 'Desactivar categoría' : 'Activar categoría'}
        message={`¿Deseas ${confirmToggle?.activo ? 'desactivar' : 'activar'} la categoría "${confirmToggle?.nombre}"?`}
        confirmText={confirmToggle?.activo ? 'Desactivar' : 'Activar'}
        danger={confirmToggle?.activo}
      />

      {/* Eliminar permanentemente */}
      <ConfirmDialog
        isOpen={!!confirmDel} onClose={() => setConfirmDel(null)}
        onConfirm={handleHardDelete}
        title="Eliminar categoría"
        message={`¿Eliminar permanentemente la categoría "${confirmDel?.nombre}"? Solo es posible si no tiene productos asociados.`}
        confirmText="Eliminar"
        danger
      />
    </div>
  )
}


