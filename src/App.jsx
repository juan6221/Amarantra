import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './shared/store/useStore'

import LandingPage     from './features/landing/pages/LandingPage'
import LoginPage       from './features/auth/pages/LoginPage'
import AppLayout       from './shared/components/AppLayout'
import ProtectedRoute  from './shared/components/ProtectedRoute'
import DashboardPage   from './features/dashboard/pages/DashboardPage'
import UsuariosPage    from './features/usuarios/pages/UsuariosPage'
import CategoriasPage  from './features/productos/pages/CategoriasPage'
import ProductosPage   from './features/productos/pages/ProductosPage'
import VentasPage      from './features/ventas/pages/VentasPage'

function AppRedirect() {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={user?.rol === 'admin' ? '/app/dashboard' : '/app/ventas'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Público */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* App privada */}
        <Route path="/app" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AppRedirect />} />

          {/* Admin + Tendero */}
          <Route path="ventas" element={<VentasPage />} />
          <Route path="productos" element={<ProductosPage />} />

          {/* Solo Admin */}
          <Route path="dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="usuarios" element={
            <ProtectedRoute requiredRole="admin">
              <UsuariosPage />
            </ProtectedRoute>
          } />
          <Route path="categorias" element={
            <ProtectedRoute requiredRole="admin">
              <CategoriasPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
