import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../shared/lib/supabase'
import AmarantaLogo from '../../../shared/components/AmarantaLogo'

export default function RecuperarPasswordPage() {
  const [step, setStep]       = useState('email') // email | nueva
  const [email, setEmail]     = useState('')
  const [userId, setUserId]   = useState(null)
  const [password, setPassword]   = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  const handleEmail = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    const { data } = await supabase.from('usuarios').select('id, nombre, activo').eq('email', email.trim()).single()
    setLoading(false)
    if (!data) {
      setError('No encontramos ninguna cuenta asociada a ese correo electrónico.')
      return
    }
    if (!data.activo) {
      setError('Esta cuenta está desactivada. Contacta al administrador.')
      return
    }
    setUserId(data.id)
    setStep('nueva')
  }

  const handleReset = async (e) => {
    e.preventDefault(); setError('');
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    if (password !== password2) { setError('Las contraseñas no coinciden.'); return }
    setLoading(true)
    const { error } = await supabase.from('usuarios').update({ password }).eq('id', userId)
    setLoading(false)
    if (error) { setError('Error al actualizar la contraseña. Intenta de nuevo.'); return }
    setSuccess(true)
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="flex justify-center mb-8">
          <AmarantaLogo size="md" />
        </div>

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="font-serif text-xl font-bold text-white mb-2">¡Contraseña actualizada!</h2>
            <p className="text-dark-300 text-sm mb-6">Ya puedes iniciar sesión con tu nueva contraseña.</p>
            <Link to="/login" className="btn-gold w-full block text-center">Ir al inicio de sesión</Link>
          </div>
        ) : step === 'email' ? (
          <>
            <h2 className="font-serif text-2xl font-bold text-white mb-2">Recuperar contraseña</h2>
            <p className="text-dark-300 text-sm mb-8">Ingresa el correo asociado a tu cuenta y te ayudamos a restablecer tu contraseña.</p>
            <form onSubmit={handleEmail} className="space-y-4">
              <div>
                <label className="block text-dark-200 text-sm font-medium mb-2">Correo electrónico</label>
                <input type="email" className="input-dark" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" required />
              </div>
              {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Verificando...</> : 'Continuar'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="font-serif text-2xl font-bold text-white mb-2">Nueva contraseña</h2>
            <p className="text-dark-300 text-sm mb-8">Crea una contraseña segura para <span className="text-gold-400">{email}</span></p>
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-dark-200 text-sm font-medium mb-2">Nueva contraseña</label>
                <input type="password" className="input-dark" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required />
              </div>
              <div>
                <label className="block text-dark-200 text-sm font-medium mb-2">Confirmar contraseña</label>
                <input type="password" className="input-dark" value={password2} onChange={e => setPassword2(e.target.value)} placeholder="Repite la contraseña" required />
              </div>
              {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Guardando...</> : 'Actualizar contraseña'}
              </button>
            </form>
          </>
        )}

        {!success && (
          <p className="text-center mt-6">
            <Link to="/login" className="text-gold-400/70 hover:text-gold-400 text-sm transition-colors">← Volver al inicio de sesión</Link>
          </p>
        )}
      </div>
    </div>
  )
}
