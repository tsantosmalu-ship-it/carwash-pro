import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { signInWithPassword, signOut, fetchUsuarioRole } from '../api/auth.api'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '@/shared/lib/errors'
import type { LoginFormValues } from '../schemas/auth.schema'

export function AdminLoginPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // `submitting` também cobre a checagem de role pós-login: enquanto ela roda,
  // o AuthProvider pode reagir ao SIGNED_IN antes do signOut() (conta não-admin)
  // terminar, disparando esse redirect no meio do caminho e mandando o usuário
  // para /login em vez de mostrar o erro "sem acesso de administrador".
  if (!loading && !submitting && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />
  }

  async function handleLogin(values: LoginFormValues) {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      const { user: authUser } = await signInWithPassword(values.email, values.password)
      if (!authUser) throw new Error('Falha no login.')

      const role = await fetchUsuarioRole(authUser.id)
      if (role !== 'admin') {
        await signOut()
        setErrorMessage('Esta conta não tem acesso de administrador.')
        return
      }

      navigate('/admin', { replace: true })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-preto-premium px-4">
      <div className="card w-full max-w-sm">
        <h1 className="font-display text-xl text-branco-premium">Painel Administrativo</h1>
        <p className="mt-1 text-sm text-cinza-medio">Orleans Auto Spa</p>

        <div className="mt-6">
          <LoginForm onSubmit={handleLogin} submitting={submitting} errorMessage={errorMessage} />
        </div>

        <p className="mt-4 text-center text-sm">
          <Link to="/esqueci-senha" className="link-accent">
            Esqueci minha senha
          </Link>
        </p>
      </div>
    </div>
  )
}
