import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@/shared/components/ui/TextField'
import { clienteSchema, type ClienteFormValues } from '../schemas/cliente.schema'
import type { Cliente } from '../types'

interface ClienteFormProps {
  defaultValues?: Partial<Cliente>
  onSubmit: (values: ClienteFormValues) => Promise<void>
  submitting: boolean
  errorMessage: string | null
  submitLabel?: string
}

export function ClienteForm({
  defaultValues,
  onSubmit,
  submitting,
  errorMessage,
  submitLabel = 'Salvar',
}: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: defaultValues?.nome ?? '',
      cpf: defaultValues?.cpf ?? '',
      telefone: defaultValues?.telefone ?? '',
      whatsapp: defaultValues?.whatsapp ?? '',
      email: defaultValues?.email ?? '',
      data_nascimento: defaultValues?.data_nascimento ?? '',
      observacoes: defaultValues?.observacoes ?? '',
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        label="Nome completo"
        id="nome"
        type="text"
        error={errors.nome?.message}
        {...register('nome')}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Telefone"
          id="telefone"
          type="tel"
          placeholder="(00) 00000-0000"
          error={errors.telefone?.message}
          {...register('telefone')}
        />
        <TextField
          label="WhatsApp"
          id="whatsapp"
          type="tel"
          placeholder="(00) 00000-0000"
          error={errors.whatsapp?.message}
          {...register('whatsapp')}
        />
      </div>

      <TextField
        label="E-mail"
        id="email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="CPF"
          id="cpf"
          type="text"
          error={errors.cpf?.message}
          {...register('cpf')}
        />
        <TextField
          label="Data de nascimento"
          id="data_nascimento"
          type="date"
          error={errors.data_nascimento?.message}
          {...register('data_nascimento')}
        />
      </div>

      <div>
        <label htmlFor="observacoes" className="field-label">
          Observações
        </label>
        <textarea id="observacoes" rows={3} className="field-input" {...register('observacoes')} />
      </div>

      {errorMessage && <p className="field-error">{errorMessage}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? 'Salvando...' : submitLabel}
      </button>
    </form>
  )
}
