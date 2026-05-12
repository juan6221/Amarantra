import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../../shared/store/useStore'
import AmarantaLogo from '../../../shared/components/AmarantaLogo'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  if (isAuthenticated) {
    navigate('/app/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate(result.user.rol === 'admin' ? '/app/dashboard' : '/app/ventas', { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Panel izquierdo — decorativo */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center bg-dark-800">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(ellipse at 40% 50%, #d4af3718 0%, transparent 60%)' }}
        />
        <div className="relative z-10 text-center px-12">
          <AmarantaLogo size="xl" />
          <p className="text-dark-300 mt-6 text-lg font-light italic font-serif">
            "La elegancia es la única belleza que nunca se desvanece."
          </p>
          <div className="mt-12 grid grid-cols-2 gap-3 opacity-40">
            <img src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=300" alt="" className="rounded-xl object-cover h-40 w-full" />
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300" alt="" className="rounded-xl object-cover h-40 w-full mt-8" />
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="lg:hidden flex justify-center mb-8">
            <AmarantaLogo size="md" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-white mb-2">Bienvenido de vuelta</h2>
          <p className="text-dark-300 text-sm mb-8">Ingresa tus credenciales para continuar.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-dark-200 text-sm font-medium mb-2">Correo electrónico</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-dark"
                placeholder="admin@amaranta.com"
                required
              />
            </div>
            <div>
              <label className="block text-dark-200 text-sm font-medium mb-2">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-dark"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-start gap-3">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Link to="/recuperar-password" className="text-gold-400/70 hover:text-gold-400 text-xs transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando...
                </>
              ) : 'Ingresar'}
            </button>
          </form>

          {/* Credenciales demo */}
          <div className="mt-8 p-4 bg-dark-700 border border-dark-600 rounded-xl">
            <p className="text-dark-400 text-xs font-medium uppercase tracking-wider mb-3">Cuentas de demostración</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="badge-admin">Admin</span>
                <span className="text-dark-300">admin@amaranta.com / admin123</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge-tendero">Tendero</span>
                <span className="text-dark-300">maria@amaranta.com / tendero123</span>
              </div>
            </div>
          </div>

          <p className="text-center mt-6">
            <Link to="/" className="text-gold-400/70 hover:text-gold-400 text-sm transition-colors">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
