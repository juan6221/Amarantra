import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useStore'

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRole && user?.rol !== requiredRole) return <Navigate to="/app/ventas" replace />

  return children
}


