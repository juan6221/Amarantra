import { useState, useMemo } from 'react'
import { useClientes } from '../hooks/useClientes'
import Modal from '../../../shared/components/Modal'
import ConfirmDialog from '../../../shared/components/ConfirmDialog'
import LoadingSpinner from '../../../shared/components/LoadingSpinner'

function ClienteForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { nombre: '', email: '', telefono: '', direccion: '', activo: true })
  const [err, setErr]   = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setErr('')
    const result = await onSubmit(form)
    if (result?.error) setErr(result.error.message)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Nombre completo *</label>
        <input className="input-dark" value={form.nombre} onChange={e => set('nombre', e.target.value)} required placeholder="Nombre del cliente" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-dark-200 text-sm font-medium mb-1">Correo electrónico</label>
          <input className="input-dark" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="correo@ejemplo.com" />
        </div>
        <div>
          <label className="block text-dark-200 text-sm font-medium mb-1">Teléfono</label>
          <input className="input-dark" value={form.telefono || ''} onChange={e => set('telefono', e.target.value)} placeholder="+57 300 000 0000" />
        </div>
      </div>
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Dirección</label>
        <input className="input-dark" value={form.direccion || ''} onChange={e => set('direccion', e.target.value)} placeholder="Calle, ciudad" />
      </div>
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Estado</label>
        <select className="select-dark" value={form.activo ? 'activo' : 'inactivo'} onChange={e => set('activo', e.target.value === 'activo')}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
      {err && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">{err}</p>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-outline-gold flex-1 text-sm py-2">Cancelar</button>
        <button type="submit" className="btn-gold flex-1 text-sm py-2">{initial ? 'Guardar' : 'Crear cliente'}</button>
      </div>
    </form>
  )
}

export default function ClientesPage() {
  const { clientes, loading, addCliente, updateCliente, deleteCliente, toggleActivo } = useClientes()
  const [search, setSearch]         = useState('')
  const [filterEstado, setFilter]   = useState('')
  const [modalCreate, setModalCreate] = useState(false)
  const [modalEdit, setModalEdit]     = useState(null)
  const [modalDetail, setModalDetail] = useState(null)
  const [confirmDel, setConfirmDel]   = useState(null)
  const [delError, setDelError]       = useState('')

  const filtered = useMemo(() => clientes.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = c.nombre.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.telefono?.includes(q)
    const matchEstado = filterEstado === '' || (filterEstado === 'activo' ? c.activo : !c.activo)
    return matchSearch && matchEstado
  }), [clientes, search, filterEstado])

  const handleDelete = async (c) => {
    const { error } = await deleteCliente(c.id)
    if (error) { setDelError(error.message); setConfirmDel(null) }
  }

  if (loading) return <div className="page-container"><LoadingSpinner text="Cargando clientes..." /></div>

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Clientes</h1>
          <p className="text-dark-300 text-sm mt-1">{clientes.filter(c => c.activo).length} clientes activos</p>
        </div>
        <button onClick={() => setModalCreate(true)} className="btn-gold text-sm flex items-center gap-2 self-start">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo cliente
        </button>
      </div>

      {delError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center justify-between">
          {delError}<button onClick={() => setDelError('')} className="ml-2">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-xl">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input className="input-dark pl-9" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select-dark" value={filterEstado} onChange={e => setFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700/50">
              <tr>
                <th className="table-header">Cliente</th>
                <th className="table-header">Teléfono</th>
                <th className="table-header">Dirección</th>
                <th className="table-header">Estado</th>
                <th className="table-header text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-dark-700/30 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400 font-bold text-xs flex-shrink-0">
                        {c.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{c.nombre}</p>
                        <p className="text-dark-400 text-xs">{c.email || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell text-dark-200 text-sm">{c.telefono || '—'}</td>
                  <td className="table-cell text-dark-300 text-xs max-w-[160px] truncate">{c.direccion || '—'}</td>
                  <td className="table-cell">
                    <span className={c.activo ? 'badge-active' : 'badge-inactive'}>{c.activo ? 'Activo' : 'Inactivo'}</span>
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setModalDetail(c)} className="p-2 text-dark-300 hover:text-white hover:bg-dark-600 rounded-lg transition-all" title="Ver detalle">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button onClick={() => setModalEdit(c)} className="p-2 text-dark-300 hover:text-gold-400 hover:bg-gold-400/10 rounded-lg transition-all" title="Editar">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => toggleActivo(c.id, !c.activo)} className="p-2 text-dark-300 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all" title={c.activo ? 'Desactivar' : 'Activar'}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                      </button>
                      <button onClick={() => setConfirmDel(c)} className="p-2 text-dark-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Eliminar">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-dark-400">No se encontraron clientes.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail */}
      <Modal isOpen={!!modalDetail} onClose={() => setModalDetail(null)} title="Detalle del cliente" size="sm">
        {modalDetail && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400 font-bold text-2xl">{modalDetail.nombre.charAt(0)}</div>
              <div>
                <h3 className="text-white font-semibold text-lg">{modalDetail.nombre}</h3>
                <span className={modalDetail.activo ? 'badge-active' : 'badge-inactive'}>{modalDetail.activo ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 space-y-3 text-sm">
              {[
                ['Correo', modalDetail.email || '—'],
                ['Teléfono', modalDetail.telefono || '—'],
                ['Dirección', modalDetail.direccion || '—'],
                ['Registrado', modalDetail.created_at],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="text-dark-400">{k}</span>
                  <span className="text-white text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={modalCreate} onClose={() => setModalCreate(false)} title="Nuevo cliente">
        <ClienteForm onSubmit={async d => { const r = await addCliente(d); if (!r?.error) setModalCreate(false); return r }} onCancel={() => setModalCreate(false)} />
      </Modal>

      <Modal isOpen={!!modalEdit} onClose={() => setModalEdit(null)} title="Editar cliente">
        {modalEdit && <ClienteForm initial={modalEdit} onSubmit={async d => { const r = await updateCliente(modalEdit.id, d); if (!r?.error) setModalEdit(null); return r }} onCancel={() => setModalEdit(null)} />}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDel} onClose={() => setConfirmDel(null)}
        onConfirm={() => handleDelete(confirmDel)}
        title="Eliminar cliente"
        message={`¿Eliminar a "${confirmDel?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar" danger
      />
    </div>
  )
}
