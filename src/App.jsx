import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useStore'

import LandingPage          from './features/landing/pages/LandingPage'
import LoginPage            from './features/auth/pages/LoginPage'
import RecuperarPasswordPage from './features/auth/pages/RecuperarPasswordPage'
import AppLayout            from './components/AppLayout'
import ProtectedRoute       from './components/ProtectedRoute'
import DashboardPage        from './features/dashboard/pages/DashboardPage'
import UsuariosPage         from './features/usuarios/pages/UsuariosPage'
import RolesPage            from './features/roles/pages/RolesPage'
import ClientesPage         from './features/clientes/pages/ClientesPage'
import CategoriasPage       from './features/productos/pages/CategoriasPage'
import ProductosPage        from './features/productos/pages/ProductosPage'
import VentasPage           from './features/ventas/pages/VentasPage'
import PerfilPage           from './features/perfil/pages/PerfilPage'

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
        <Route path="/"                    element={<LandingPage />} />
        <Route path="/login"               element={<LoginPage />} />
        <Route path="/recuperar-password"  element={<RecuperarPasswordPage />} />

        {/* App privada */}
        <Route path="/app" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AppRedirect />} />

          {/* Disponible para todos los roles */}
          <Route path="ventas"   element={<VentasPage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="perfil"   element={<PerfilPage />} />

          {/* Solo Admin */}
          <Route path="dashboard" element={
            <ProtectedRoute requiredRole="admin"><DashboardPage /></ProtectedRoute>
          } />
          <Route path="usuarios" element={
            <ProtectedRoute requiredRole="admin"><UsuariosPage /></ProtectedRoute>
          } />
          <Route path="roles" element={
            <ProtectedRoute requiredRole="admin"><RolesPage /></ProtectedRoute>
          } />
          <Route path="clientes" element={
            <ProtectedRoute requiredRole="admin"><ClientesPage /></ProtectedRoute>
          } />
          <Route path="categorias" element={
            <ProtectedRoute requiredRole="admin"><CategoriasPage /></ProtectedRoute>
          } />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}


