import { useState, useMemo } from 'react'
import { useUsuarios } from '../hooks/useUsuarios'
import Modal from '../../../shared/components/Modal'
import ConfirmDialog from '../../../shared/components/ConfirmDialog'
import LoadingSpinner from '../../../shared/components/LoadingSpinner'

function UsuarioForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { nombre: '', email: '', password: '', rol: 'tendero', activo: true })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Nombre completo</label>
        <input className="input-dark" value={form.nombre} onChange={e => set('nombre', e.target.value)} required placeholder="Nombre del usuario" />
      </div>
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">Correo electrónico</label>
        <input className="input-dark" type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="correo@amaranta.com" />
      </div>
      <div>
        <label className="block text-dark-200 text-sm font-medium mb-1">
          {initial ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
        </label>
        <input className="input-dark" type="password" value={form.password} onChange={e => set('password', e.target.value)} required={!initial} placeholder="••••••••" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-dark-200 text-sm font-medium mb-1">Rol</label>
          <select className="select-dark" value={form.rol} onChange={e => set('rol', e.target.value)}>
            <option value="admin">Administrador</option>
            <option value="tendero">Tendero</option>
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
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-outline-gold flex-1 text-sm py-2">Cancelar</button>
        <button type="submit" className="btn-gold flex-1 text-sm py-2">{initial ? 'Guardar cambios' : 'Crear usuario'}</button>
      </div>
    </form>
  )
}

export default function UsuariosPage() {
  const { usuarios, loading, addUsuario, updateUsuario, deleteUsuario } = useUsuarios()
  const [search, setSearch]         = useState('')
  const [filterRol, setFilterRol]   = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [modalCreate, setModalCreate]   = useState(false)
  const [modalEdit, setModalEdit]       = useState(null)
  const [confirmDel, setConfirmDel]     = useState(null)

  const filtered = useMemo(() => usuarios.filter(u => {
    const matchSearch  = u.nombre.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRol     = !filterRol || u.rol === filterRol
    const matchEstado  = filterEstado === '' || (filterEstado === 'activo' ? u.activo : !u.activo)
    return matchSearch && matchRol && matchEstado
  }), [usuarios, search, filterRol, filterEstado])

  if (loading) return <div className="page-container"><LoadingSpinner text="Cargando usuarios..." /></div>

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Usuarios</h1>
          <p className="text-dark-300 text-sm mt-1">{usuarios.filter(u => u.activo).length} usuarios activos</p>
        </div>
        <button onClick={() => setModalCreate(true)} className="btn-gold text-sm flex items-center gap-2 self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo usuario
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input className="input-dark pl-9" placeholder="Buscar por nombre o email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select-dark" value={filterRol} onChange={e => setFilterRol(e.target.value)}>
          <option value="">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="tendero">Tendero</option>
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
                <th className="table-header">Rol</th>
                <th className="table-header">Estado</th>
                <th className="table-header">Creado</th>
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
                  <td className="table-cell">
                    <span className={u.rol === 'admin' ? 'badge-admin' : 'badge-tendero'}>
                      {u.rol === 'admin' ? 'Admin' : 'Tendero'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={u.activo ? 'badge-active' : 'badge-inactive'}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="table-cell text-dark-400 text-xs">{u.created_at || u.createdAt}</td>
                  <td className="table-cell text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setModalEdit(u)} className="p-2 text-dark-300 hover:text-gold-400 hover:bg-gold-400/10 rounded-lg transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => setConfirmDel(u)} className="p-2 text-dark-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
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

      <Modal isOpen={modalCreate} onClose={() => setModalCreate(false)} title="Crear nuevo usuario">
        <UsuarioForm onSubmit={async data => { await addUsuario(data); setModalCreate(false) }} onCancel={() => setModalCreate(false)} />
      </Modal>
      <Modal isOpen={!!modalEdit} onClose={() => setModalEdit(null)} title="Editar usuario">
        {modalEdit && (
          <UsuarioForm initial={modalEdit}
            onSubmit={async data => {
              const updates = data.password ? data : { ...data, password: modalEdit.password }
              await updateUsuario(modalEdit.id, updates)
              setModalEdit(null)
            }}
            onCancel={() => setModalEdit(null)} />
        )}
      </Modal>
      <ConfirmDialog
        isOpen={!!confirmDel} onClose={() => setConfirmDel(null)}
        onConfirm={() => deleteUsuario(confirmDel?.id)}
        title="Desactivar usuario"
        message={`¿Deseas desactivar a "${confirmDel?.nombre}"?`}
        confirmText="Desactivar" danger
      />
    </div>
  )
}
