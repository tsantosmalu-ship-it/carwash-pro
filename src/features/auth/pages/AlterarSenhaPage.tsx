import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { novaSenhaSchema, type NovaSenhaFormValues } from '../schemas/auth.schema'
import { updatePassword } from '../api/auth.api'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '@/shared/lib/errors'

export function AlterarSenhaPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NovaSenhaFormValues>({ resolver: zodResolver(novaSenhaSchema) })

  if (!loading && !user) {
    return <Navigate to="/login" replace />
  }

  async function onSubmit(values: NovaSenhaFormValues) {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      await updatePassword(values.password)
      navigate(user?.role === 'admin' ? '/admin' : '/', { replace: true })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-preto-premium px-4">
      <div className="card w-full max-w-sm">
        <h1 className="font-display text-xl text-branco-premium">Definir nova senha</h1>
        <p className="mt-1 text-sm text-cinza-medio">Orleans Auto Spa</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="password" className="field-label">
              Nova senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="field-input"
              {...register('password')}
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="field-label">
              Confirmar nova senha
            </label>
            <input
              id="confirmarSenha"
              type="password"
              autoComplete="new-password"
              className="field-input"
              {...register('confirmarSenha')}
            />
            {errors.confirmarSenha && <p className="field-error">{errors.confirmarSenha.message}</p>}
          </div>

          {errorMessage && <p className="field-error">{errorMessage}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </div>
    </div>
  )
}
