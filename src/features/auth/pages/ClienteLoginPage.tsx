import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { signInWithPassword } from '../api/auth.api'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '@/shared/lib/errors'
import { WhatsAppButton } from '@/shared/components/WhatsAppButton'
import type { LoginFormValues } from '../schemas/auth.schema'

export function ClienteLoginPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!loading && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />
  }

  async function handleLogin(values: LoginFormValues) {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      await signInWithPassword(values.email, values.password)
      const from = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(from, { replace: true })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-preto-premium px-4">
      <div className="card w-full max-w-sm">
        <h1 className="font-display text-xl text-branco-premium">Entrar na sua conta</h1>
        <p className="mt-1 text-sm text-cinza-medio">Orleans Auto Spa</p>

        <div className="mt-6">
          <LoginForm onSubmit={handleLogin} submitting={submitting} errorMessage={errorMessage} />
        </div>

        <p className="mt-4 text-center text-sm">
          <Link to="/esqueci-senha" className="link-accent">
            Esqueci minha senha
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-cinza-medio">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="link-accent">
            Cadastre-se
          </Link>
        </p>
      </div>
      <WhatsAppButton />
    </div>
  )
}
