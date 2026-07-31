import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@/shared/components/ui/TextField'
import { lancamentoSchema, type LancamentoFormValues } from '../schemas/lancamento.schema'

interface LancamentoFormProps {
  onSubmit: (values: LancamentoFormValues) => Promise<void>
  submitting: boolean
  errorMessage: string | null
}

function hoje() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function LancamentoForm({ onSubmit, submitting, errorMessage }: LancamentoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LancamentoFormValues>({
    resolver: zodResolver(lancamentoSchema),
    defaultValues: { tipo: 'despesa', categoria: '', valor: '', data: hoje(), observacoes: '' },
  })

  return (
    <form
      className="space-y-4 rounded-xl border border-dourado-escuro/20 bg-preto-card p-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="tipo" className="field-label">
            Tipo
          </label>
          <select id="tipo" className="field-input" {...register('tipo')}>
            <option value="despesa">Saída (despesa)</option>
            <option value="receita">Entrada (receita)</option>
          </select>
        </div>
        <TextField
          label="Valor (R$)"
          id="valor"
          type="text"
          inputMode="decimal"
          error={errors.valor?.message}
          {...register('valor')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Categoria"
          id="categoria"
          type="text"
          placeholder="Aluguel, produtos, salário..."
          error={errors.categoria?.message}
          {...register('categoria')}
        />
        <TextField
          label="Data"
          id="data"
          type="date"
          error={errors.data?.message}
          {...register('data')}
        />
      </div>

      <TextField
        label="Observações"
        id="observacoes"
        type="text"
        error={errors.observacoes?.message}
        {...register('observacoes')}
      />

      {errorMessage && <p className="field-error">{errorMessage}</p>}

      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? 'Salvando...' : 'Adicionar lançamento'}
      </button>
    </form>
  )
}
