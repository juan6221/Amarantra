import { useState, useMemo } from 'react'
import { useAppStore } from '../../../shared/store/useStore'
import Modal from '../../../shared/components/Modal'
import ConfirmDialog from '../../../shared/components/ConfirmDialog'

function CategoriaForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { nombre: '', descripcion: '', imagen: '', activo: true })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Nombre</label>
        <input className="input-dark" value={form.nombre} onChange={e => set('nombre', e.target.value)} required placeholder="Ej: Perfumes" />
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
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-outline-gold flex-1 text-sm py-2">Cancelar</button>
        <button type="submit" className="btn-gold flex-1 text-sm py-2">{initial ? 'Guardar' : 'Crear categoría'}</button>
      </div>
    </form>
  )
}

export default function CategoriasPage() {
  const { categorias, addCategoria, updateCategoria, deleteCategoria, productos } = useAppStore()
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [modalCreate, setModalCreate] = useState(false)
  const [modalEdit, setModalEdit] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)

  const filtered = useMemo(() => categorias.filter(c => {
    const matchSearch = c.nombre.toLowerCase().includes(search.toLowerCase())
    const matchEstado = filterEstado === '' || (filterEstado === 'activo' ? c.activo : !c.activo)
    return matchSearch && matchEstado
  }), [categorias, search, filterEstado])

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Categorías</h1>
          <p className="text-dark-300 text-sm mt-1">{categorias.filter(c => c.activo).length} activas</p>
        </div>
        <button onClick={() => setModalCreate(true)} className="btn-gold text-sm flex items-center gap-2 self-start">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva categoría
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-xl">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input className="input-dark pl-9" placeholder="Buscar categoría..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select-dark" value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="activo">Activa</option>
          <option value="inactivo">Inactiva</option>
        </select>
      </div>

      {/* Grid de categorías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(cat => {
          const numProductos = productos.filter(p => p.categoriaId === cat.id && p.activo).length
          return (
            <div key={cat.id} className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden hover:border-gold-400/40 transition-all group">
              <div className="relative h-36 bg-dark-700 overflow-hidden">
                {cat.imagen ? (
                  <img src={cat.imagen} alt={cat.nombre} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity group-hover:scale-105 duration-500" onError={e => { e.target.style.display = 'none' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-dark-500">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <span className={`absolute top-2 right-2 ${cat.activo ? 'badge-active' : 'badge-inactive'}`}>
                  {cat.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1">{cat.nombre}</h3>
                <p className="text-dark-400 text-xs mb-3 line-clamp-2">{cat.descripcion || 'Sin descripción'}</p>
                <p className="text-dark-400 text-xs mb-4">{numProductos} productos activos</p>
                <div className="flex gap-2">
                  <button onClick={() => setModalEdit(cat)} className="flex-1 border border-gold-400/30 text-gold-400 text-xs py-1.5 rounded-lg hover:bg-gold-400/10 transition-all">
                    Editar
                  </button>
                  <button onClick={() => setConfirmDel(cat)} className="flex-1 border border-red-500/30 text-red-400 text-xs py-1.5 rounded-lg hover:bg-red-500/10 transition-all">
                    {cat.activo ? 'Desactivar' : 'Activar'}
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

      <Modal isOpen={modalCreate} onClose={() => setModalCreate(false)} title="Nueva categoría">
        <CategoriaForm onSubmit={d => { addCategoria(d); setModalCreate(false) }} onCancel={() => setModalCreate(false)} />
      </Modal>
      <Modal isOpen={!!modalEdit} onClose={() => setModalEdit(null)} title="Editar categoría">
        {modalEdit && <CategoriaForm initial={modalEdit} onSubmit={d => { updateCategoria(modalEdit.id, d); setModalEdit(null) }} onCancel={() => setModalEdit(null)} />}
      </Modal>
      <ConfirmDialog
        isOpen={!!confirmDel} onClose={() => setConfirmDel(null)}
        onConfirm={() => confirmDel && (confirmDel.activo ? deleteCategoria(confirmDel.id) : updateCategoria(confirmDel.id, { activo: true }))}
        title={confirmDel?.activo ? 'Desactivar categoría' : 'Activar categoría'}
        message={`¿Deseas ${confirmDel?.activo ? 'desactivar' : 'activar'} la categoría "${confirmDel?.nombre}"?`}
        confirmText={confirmDel?.activo ? 'Desactivar' : 'Activar'}
        danger={confirmDel?.activo}
      />
    </div>
  )
}
