import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cadastroClienteSchema, type CadastroClienteFormValues } from '../schemas/auth.schema'
import { signUpCliente } from '../api/auth.api'
import { getErrorMessage } from '@/shared/lib/errors'

export function ClienteSignupPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroClienteFormValues>({ resolver: zodResolver(cadastroClienteSchema) })

  async function onSubmit(values: CadastroClienteFormValues) {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      const result = await signUpCliente(values)
      if (result.session) {
        navigate('/', { replace: true })
      } else {
        setAwaitingConfirmation(true)
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  if (awaitingConfirmation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-preto-premium px-4">
        <div className="card w-full max-w-sm text-center">
          <h1 className="font-display text-xl text-branco-premium">Confirme seu e-mail</h1>
          <p className="mt-3 text-sm text-cinza-medio">
            Enviamos um link de confirmação para o seu e-mail. Abra a mensagem e confirme para
            poder entrar na sua conta.
          </p>
          <Link to="/login" className="link-accent mt-6 inline-block">
            Ir para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-preto-premium px-4 py-10">
      <div className="card w-full max-w-sm">
        <h1 className="font-display text-xl text-branco-premium">Criar conta</h1>
        <p className="mt-1 text-sm text-cinza-medio">Orleans Auto Spa</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="nome" className="field-label">
              Nome completo
            </label>
            <input id="nome" type="text" className="field-input" {...register('nome')} />
            {errors.nome && <p className="field-error">{errors.nome.message}</p>}
          </div>

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

          <div>
            <label htmlFor="telefone" className="field-label">
              Telefone
            </label>
            <input
              id="telefone"
              type="tel"
              autoComplete="tel"
              placeholder="(00) 00000-0000"
              className="field-input"
              {...register('telefone')}
            />
            {errors.telefone && <p className="field-error">{errors.telefone.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="field-label">
              Senha
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
              Confirmar senha
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
            {submitting ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-cinza-medio">
          Já tem conta?{' '}
          <Link to="/login" className="link-accent">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
