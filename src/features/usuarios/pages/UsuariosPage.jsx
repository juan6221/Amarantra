import { useState, useMemo } from 'react'
import { useUsuarios } from '../hooks/useUsuarios'
import { useRoles } from '../../roles/hooks/useRoles'
import Modal from '../../../components/Modal'
import ConfirmDialog from '../../../components/ConfirmDialog'
import LoadingSpinner from '../../../components/LoadingSpinner'

function UsuarioForm({ initial, roles, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { nombre: '', email: '', password: '', rol: roles[0]?.nombre || 'tendero', telefono: '', activo: true })
  const [err, setErr]   = useState('')
  const set = (k, v)    => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setErr('')
    const result = await onSubmit(form)
    if (result?.error) setErr(result.error.message || result.error)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-dark-200 text-sm font-medium mb-1">Nombre completo *</label>
          <input className="input-dark" value={form.nombre} onChange={e => set('nombre', e.target.value)} required placeholder="Nombre" />
        </div>
        <div>
          <label className="block text-dark-200 text-sm font-medium mb-1">Teléfono</label>
          <input className="input-dark" value={form.telefono || ''} onChange={e => set('telefono', e.target.value)} placeholder="+57 300 000 0000" />
        </div>
      </div>
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Correo electrónico *</label>
        <input className="input-dark" type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="correo@amaranta.com" />
      </div>
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">
          {initial ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
        </label>
        <input className="input-dark" type="password" value={form.password} onChange={e => set('password', e.target.value)} required={!initial} placeholder="••••••••" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-dark-200 text-sm font-medium mb-1">Rol</label>
          <select className="select-dark" value={form.rol} onChange={e => set('rol', e.target.value)}>
            {roles.filter(r => r.activo).map(r => (
              <option key={r.id} value={r.nombre}>{r.nombre.charAt(0).toUpperCase() + r.nombre.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-dark-200 text-sm font-medium mb-1">Estado</label>
          <select className="select-dark" value={form.activo ? 'activo' : 'inactivo'} onChange={e => set('activo', e.target.value === 'activo')}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>
      {err && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">{err}</p>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-outline-gold flex-1 text-sm py-2">Cancelar</button>
        <button type="submit" className="btn-gold flex-1 text-sm py-2">{initial ? 'Guardar cambios' : 'Crear usuario'}</button>
      </div>
    </form>
  )
}

export default function UsuariosPage() {
  const { usuarios, loading, addUsuario, updateUsuario, deleteUsuario } = useUsuarios()
  const { roles } = useRoles()
  const [search, setSearch]             = useState('')
  const [filterRol, setFilterRol]       = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [modalCreate, setModalCreate]   = useState(false)
  const [modalEdit, setModalEdit]       = useState(null)
  const [modalDetail, setModalDetail]   = useState(null)
  const [confirmDel, setConfirmDel]     = useState(null)
  const [confirmDesact, setConfirmDesact] = useState(null)
  const [actionError, setActionError]   = useState('')

  const filtered = useMemo(() => usuarios.filter(u => {
    const q = search.toLowerCase()
    const matchSearch  = u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    const matchRol     = !filterRol || u.rol === filterRol
    const matchEstado  = filterEstado === '' || (filterEstado === 'activo' ? u.activo : !u.activo)
    return matchSearch && matchRol && matchEstado
  }), [usuarios, search, filterRol, filterEstado])

  const handleAdd = async (data) => {
    const { error } = await addUsuario(data)
    if (error) return { error: { message: error.message?.includes('duplicate') || error.message?.includes('unique') ? 'Ya existe un usuario con ese correo electrónico.' : error.message } }
    setModalCreate(false)
    return {}
  }

  const handleUpdate = async (data) => {
    const updates = data.password ? data : { ...data, password: modalEdit.password }
    const { error } = await updateUsuario(modalEdit.id, updates)
    if (error) return { error: { message: error.message?.includes('duplicate') ? 'Ese correo ya está en uso.' : error.message } }
    setModalEdit(null)
    return {}
  }

  const handleDelete = async () => {
    const { error } = await deleteUsuario(confirmDel.id, true) // hard delete
    if (error) { setActionError(error.message); setConfirmDel(null) }
  }

  if (loading) return <div className="page-container"><LoadingSpinner text="Cargando usuarios..." /></div>

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Usuarios</h1>
          <p className="text-dark-300 text-sm mt-1">{usuarios.filter(u => u.activo).length} activos · {usuarios.length} total</p>
        </div>
        <button onClick={() => setModalCreate(true)} className="btn-gold text-sm flex items-center gap-2 self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo usuario
        </button>
      </div>

      {actionError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center justify-between">
          {actionError}<button onClick={() => setActionError('')} className="ml-2 text-lg leading-none">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input className="input-dark pl-9" placeholder="Buscar por nombre o email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select-dark" value={filterRol} onChange={e => setFilterRol(e.target.value)}>
          <option value="">Todos los roles</option>
          {roles.map(r => <option key={r.id} value={r.nombre}>{r.nombre.charAt(0).toUpperCase() + r.nombre.slice(1)}</option>)}
        </select>
        <select className="select-dark" value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
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
                <th className="table-header">Usuario</th>
                <th className="table-header">Teléfono</th>
                <th className="table-header">Rol</th>
                <th className="table-header">Estado</th>
                <th className="table-header text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-dark-700/30 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-dark-900 font-bold text-xs flex-shrink-0">
                        {u.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{u.nombre}</p>
                        <p className="text-dark-400 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell text-dark-300 text-sm">{u.telefono || '—'}</td>
                  <td className="table-cell">
                    <span className={u.rol === 'admin' ? 'badge-admin' : 'badge-tendero capitalize'}>{u.rol}</span>
                  </td>
                  <td className="table-cell">
                    <span className={u.activo ? 'badge-active' : 'badge-inactive'}>{u.activo ? 'Activo' : 'Inactivo'}</span>
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setModalDetail(u)} className="p-2 text-dark-300 hover:text-white hover:bg-dark-600 rounded-lg transition-all" title="Ver detalle">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button onClick={() => setModalEdit(u)} className="p-2 text-dark-300 hover:text-gold-400 hover:bg-gold-400/10 rounded-lg transition-all" title="Editar">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => setConfirmDesact(u)} className="p-2 text-dark-300 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all" title={u.activo ? 'Desactivar' : 'Activar'}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                      </button>
                      <button onClick={() => setConfirmDel(u)} className="p-2 text-dark-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Eliminar">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-dark-400">No se encontraron usuarios.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!modalDetail} onClose={() => setModalDetail(null)} title="Detalle del usuario" size="sm">
        {modalDetail && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-dark-900 font-bold text-2xl">
                {modalDetail.nombre.charAt(0)}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{modalDetail.nombre}</h3>
                <span className={modalDetail.rol === 'admin' ? 'badge-admin' : 'badge-tendero'}>{modalDetail.rol}</span>
              </div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 space-y-3 text-sm">
              {[
                ['Correo', modalDetail.email],
                ['Teléfono', modalDetail.telefono || '—'],
                ['Estado', modalDetail.activo ? 'Activo' : 'Inactivo'],
                ['Registrado', modalDetail.created_at || modalDetail.createdAt],
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

      <Modal isOpen={modalCreate} onClose={() => setModalCreate(false)} title="Crear nuevo usuario">
        <UsuarioForm roles={roles} onSubmit={handleAdd} onCancel={() => setModalCreate(false)} />
      </Modal>

      <Modal isOpen={!!modalEdit} onClose={() => setModalEdit(null)} title="Editar usuario">
        {modalEdit && <UsuarioForm initial={modalEdit} roles={roles} onSubmit={handleUpdate} onCancel={() => setModalEdit(null)} />}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDesact} onClose={() => setConfirmDesact(null)}
        onConfirm={() => updateUsuario(confirmDesact?.id, { activo: !confirmDesact?.activo })}
        title={confirmDesact?.activo ? 'Desactivar usuario' : 'Activar usuario'}
        message={`¿Deseas ${confirmDesact?.activo ? 'desactivar' : 'activar'} a "${confirmDesact?.nombre}"?`}
        confirmText={confirmDesact?.activo ? 'Desactivar' : 'Activar'}
        danger={confirmDesact?.activo}
      />

      <ConfirmDialog
        isOpen={!!confirmDel} onClose={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        title="Eliminar usuario"
        message={`¿Eliminar permanentemente a "${confirmDel?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar" danger
      />
    </div>
  )
}


