import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { UsuarioRole } from '@/features/auth/types'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRole: UsuarioRole
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-preto-premium text-cinza-medio">
        Carregando...
      </div>
    )
  }

  if (!user) {
    const loginPath = allowedRole === 'admin' ? '/admin/login' : '/login'
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />
  }

  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />
  }

  return <>{children}</>
}
