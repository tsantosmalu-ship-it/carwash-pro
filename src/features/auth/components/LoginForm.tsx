import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema'

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>
  submitting: boolean
  errorMessage: string | null
}

export function LoginForm({ onSubmit, submitting, errorMessage }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="email" className="field-label">
          E-mail
        </label>
        <input id="email" type="email" autoComplete="email" className="field-input" {...register('email')} />
        {errors.email && <p className="field-error">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="field-label">
          Senha
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="field-input"
          {...register('password')}
        />
        {errors.password && <p className="field-error">{errors.password.message}</p>}
      </div>

      {errorMessage && <p className="field-error">{errorMessage}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
