import { useState } from 'react'
import { useAuthStore } from '../../../shared/store/useStore'
import { supabase } from '../../../shared/lib/supabase'

export default function PerfilPage() {
  const { user, login } = useAuthStore()
  const [form, setForm]         = useState({
    nombre:   user?.nombre   || '',
    email:    user?.email    || '',
    telefono: user?.telefono || '',
  })
  const [pwForm, setPwForm]     = useState({ actual: '', nueva: '', confirmar: '' })
  const [saving, setSaving]     = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [msg, setMsg]           = useState(null)   // { type: 'ok'|'error', text }
  const [msgPw, setMsgPw]       = useState(null)

  const set    = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setPw  = (k, v) => setPwForm(f => ({ ...f, [k]: v }))

  /* ── Guardar datos personales ── */
  const handleSavePerfil = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg(null)

    // Verificar email duplicado si cambió
    if (form.email.toLowerCase() !== user.email.toLowerCase()) {
      const { data: dup } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', form.email.toLowerCase())
        .neq('id', user.id)
        .single()
      if (dup) {
        setMsg({ type: 'error', text: 'Ese correo ya está en uso por otro usuario.' })
        setSaving(false)
        return
      }
    }

    const { error } = await supabase
      .from('usuarios')
      .update({ nombre: form.nombre.trim(), email: form.email.toLowerCase().trim(), telefono: form.telefono.trim() })
      .eq('id', user.id)

    if (error) {
      setMsg({ type: 'error', text: error.message })
    } else {
      // Refrescar sesión en el store con los nuevos datos
      useAuthStore.setState(s => ({
        user: { ...s.user, nombre: form.nombre.trim(), email: form.email.toLowerCase().trim(), telefono: form.telefono.trim() }
      }))
      setMsg({ type: 'ok', text: 'Datos actualizados correctamente.' })
    }
    setSaving(false)
  }

  /* ── Cambiar contraseña ── */
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setSavingPw(true)
    setMsgPw(null)

    if (pwForm.nueva !== pwForm.confirmar) {
      setMsgPw({ type: 'error', text: 'Las contraseñas nuevas no coinciden.' })
      setSavingPw(false)
      return
    }
    if (pwForm.nueva.length < 6) {
      setMsgPw({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' })
      setSavingPw(false)
      return
    }

    // Verificar contraseña actual
    const { data: check } = await supabase
      .from('usuarios')
      .select('id')
      .eq('id', user.id)
      .eq('password', pwForm.actual)
      .single()

    if (!check) {
      setMsgPw({ type: 'error', text: 'La contraseña actual es incorrecta.' })
      setSavingPw(false)
      return
    }

    const { error } = await supabase
      .from('usuarios')
      .update({ password: pwForm.nueva })
      .eq('id', user.id)

    if (error) {
      setMsgPw({ type: 'error', text: error.message })
    } else {
      setPwForm({ actual: '', nueva: '', confirmar: '' })
      setMsgPw({ type: 'ok', text: 'Contraseña actualizada correctamente.' })
    }
    setSavingPw(false)
  }

  return (
    <div className="page-container animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-dark-900 font-bold text-2xl flex-shrink-0">
          {user?.nombre?.charAt(0) || 'U'}
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">{user?.nombre}</h1>
          <p className="text-dark-300 text-sm capitalize">{user?.rol}</p>
        </div>
      </div>

      {/* Datos personales */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Datos personales
        </h2>

        <form onSubmit={handleSavePerfil} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-200 text-sm font-medium mb-1">Nombre completo *</label>
              <input
                className="input-dark"
                value={form.nombre}
                onChange={e => set('nombre', e.target.value)}
                required
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-dark-200 text-sm font-medium mb-1">Teléfono</label>
              <input
                className="input-dark"
                value={form.telefono}
                onChange={e => set('telefono', e.target.value)}
                placeholder="+57 300 000 0000"
              />
            </div>
          </div>
          <div>
            <label className="block text-dark-200 text-sm font-medium mb-1">Correo electrónico *</label>
            <input
              className="input-dark"
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              required
              placeholder="correo@amaranta.com"
            />
          </div>

          {msg && (
            <div className={`text-sm px-4 py-3 rounded-lg border ${msg.type === 'ok'
              ? 'text-green-400 bg-green-400/10 border-green-400/30'
              : 'text-red-400 bg-red-400/10 border-red-400/30'}`}>
              {msg.text}
            </div>
          )}

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-gold text-sm px-6 py-2.5 disabled:opacity-60">
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Cambiar contraseña
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-dark-200 text-sm font-medium mb-1">Contraseña actual *</label>
            <input
              className="input-dark"
              type="password"
              value={pwForm.actual}
              onChange={e => setPw('actual', e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-200 text-sm font-medium mb-1">Nueva contraseña *</label>
              <input
                className="input-dark"
                type="password"
                value={pwForm.nueva}
                onChange={e => setPw('nueva', e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-dark-200 text-sm font-medium mb-1">Confirmar nueva *</label>
              <input
                className="input-dark"
                type="password"
                value={pwForm.confirmar}
                onChange={e => setPw('confirmar', e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          {msgPw && (
            <div className={`text-sm px-4 py-3 rounded-lg border ${msgPw.type === 'ok'
              ? 'text-green-400 bg-green-400/10 border-green-400/30'
              : 'text-red-400 bg-red-400/10 border-red-400/30'}`}>
              {msgPw.text}
            </div>
          )}

          <div className="flex justify-end">
            <button type="submit" disabled={savingPw} className="btn-gold text-sm px-6 py-2.5 disabled:opacity-60">
              {savingPw ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
