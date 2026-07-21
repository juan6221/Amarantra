import { useState } from 'react'
import { useRoles } from '../hooks/useRoles'
import Modal from '../../../components/Modal'
import ConfirmDialog from '../../../components/ConfirmDialog'
import LoadingSpinner from '../../../components/LoadingSpinner'

function RolForm({ initial, onSubmit, onCancel }) {
  const [form, setForm]   = useState(initial || { nombre: '', descripcion: '', activo: true })
  const [err, setErr]     = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    const result = await onSubmit(form)
    if (result?.error) setErr(result.error.message)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Nombre del rol</label>
        <input className="input-dark" value={form.nombre} onChange={e => set('nombre', e.target.value)} required placeholder="Ej: supervisor" />
      </div>
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Descripción</label>
        <textarea className="input-dark resize-none" rows={2} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="¿Qué puede hacer este rol?" />
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
        <button type="submit" className="btn-gold flex-1 text-sm py-2">{initial ? 'Guardar' : 'Crear rol'}</button>
      </div>
    </form>
  )
}

export default function RolesPage() {
  const { roles, loading, addRol, updateRol, deleteRol } = useRoles()
  const [modalCreate, setModalCreate] = useState(false)
  const [modalEdit, setModalEdit]     = useState(null)
  const [modalDetail, setModalDetail] = useState(null)
  const [confirmDel, setConfirmDel]   = useState(null)
  const [delError, setDelError]       = useState('')

  const handleDelete = async (rol) => {
    const { error } = await deleteRol(rol.id)
    if (error) { setDelError(error.message); setConfirmDel(null) }
  }

  if (loading) return <div className="page-container"><LoadingSpinner text="Cargando roles..." /></div>

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Roles</h1>
          <p className="text-dark-300 text-sm mt-1">{roles.length} roles registrados</p>
        </div>
        <button onClick={() => setModalCreate(true)} className="btn-gold text-sm flex items-center gap-2 self-start">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo rol
        </button>
      </div>

      {delError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center justify-between">
          {delError}
          <button onClick={() => setDelError('')} className="text-red-400 hover:text-red-300">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(rol => (
          <div key={rol.id} className="card-dark hover:border-gold-400/40">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gold-400/10 flex items-center justify-center text-gold-400 font-bold text-lg">
                {rol.nombre.charAt(0).toUpperCase()}
              </div>
              <span className={rol.activo ? 'badge-active' : 'badge-inactive'}>
                {rol.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <h3 className="font-semibold text-white capitalize mb-1">{rol.nombre}</h3>
            <p className="text-dark-400 text-xs mb-4 line-clamp-2">{rol.descripcion || 'Sin descripción'}</p>
            <p className="text-dark-500 text-xs mb-4">Creado: {rol.created_at}</p>
            <div className="flex gap-2">
              <button onClick={() => setModalDetail(rol)} className="flex-1 border border-dark-500 text-dark-300 text-xs py-1.5 rounded-lg hover:bg-dark-600 transition-all">Ver</button>
              <button onClick={() => setModalEdit(rol)} className="flex-1 border border-gold-400/30 text-gold-400 text-xs py-1.5 rounded-lg hover:bg-gold-400/10 transition-all">Editar</button>
              <button onClick={() => setConfirmDel(rol)} className="flex-1 border border-red-500/30 text-red-400 text-xs py-1.5 rounded-lg hover:bg-red-500/10 transition-all">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail */}
      <Modal isOpen={!!modalDetail} onClose={() => setModalDetail(null)} title="Detalle del rol" size="sm">
        {modalDetail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gold-400/10 flex items-center justify-center text-gold-400 font-bold text-2xl">
                {modalDetail.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg capitalize">{modalDetail.nombre}</h3>
                <span className={modalDetail.activo ? 'badge-active' : 'badge-inactive'}>{modalDetail.activo ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-dark-400">ID</span><span className="text-white">{modalDetail.id}</span></div>
              <div className="flex justify-between"><span className="text-dark-400">Nombre</span><span className="text-white capitalize">{modalDetail.nombre}</span></div>
              <div className="flex justify-between"><span className="text-dark-400">Descripción</span><span className="text-white text-right max-w-[60%]">{modalDetail.descripcion || '—'}</span></div>
              <div className="flex justify-between"><span className="text-dark-400">Creado</span><span className="text-white">{modalDetail.created_at}</span></div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={modalCreate} onClose={() => setModalCreate(false)} title="Nuevo rol">
        <RolForm onSubmit={async d => { const r = await addRol(d); if (!r?.error) setModalCreate(false); return r }} onCancel={() => setModalCreate(false)} />
      </Modal>

      <Modal isOpen={!!modalEdit} onClose={() => setModalEdit(null)} title="Editar rol">
        {modalEdit && <RolForm initial={modalEdit} onSubmit={async d => { const r = await updateRol(modalEdit.id, d); if (!r?.error) setModalEdit(null); return r }} onCancel={() => setModalEdit(null)} />}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDel} onClose={() => setConfirmDel(null)}
        onConfirm={() => handleDelete(confirmDel)}
        title="Eliminar rol"
        message={`¿Eliminar el rol "${confirmDel?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar" danger
      />
    </div>
  )
}


