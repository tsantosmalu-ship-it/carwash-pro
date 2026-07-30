import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { esqueciSenhaSchema, type EsqueciSenhaFormValues } from '../schemas/auth.schema'
import { requestPasswordReset } from '../api/auth.api'
import { getErrorMessage } from '@/shared/lib/errors'

export function EsqueciSenhaPage() {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EsqueciSenhaFormValues>({ resolver: zodResolver(esqueciSenhaSchema) })

  async function onSubmit(values: EsqueciSenhaFormValues) {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      await requestPasswordReset(values.email)
      setEnviado(true)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-preto-premium px-4">
      <div className="card w-full max-w-sm">
        <h1 className="font-display text-xl text-branco-premium">Esqueci minha senha</h1>
        <p className="mt-1 text-sm text-cinza-medio">Orleans Auto Spa</p>

        {enviado ? (
          <p className="mt-6 text-sm text-cinza-medio">
            Se houver uma conta com esse e-mail, enviamos um link de recuperação. Abra a mensagem
            e siga as instruções para definir uma nova senha.
          </p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label htmlFor="email" className="field-label">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="field-input"
                {...register('email')}
              />
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>

            {errorMessage && <p className="field-error">{errorMessage}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-cinza-medio">
          <Link to="/login" className="link-accent">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  )
}
