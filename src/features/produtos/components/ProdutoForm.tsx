import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@/shared/components/ui/TextField'
import { produtoSchema, type ProdutoFormValues } from '../schemas/produto.schema'
import type { Produto } from '../types'

interface ProdutoFormProps {
  defaultValues?: Partial<Produto>
  onSubmit: (values: ProdutoFormValues) => Promise<void>
  submitting: boolean
  errorMessage: string | null
  submitLabel?: string
}

export function ProdutoForm({
  defaultValues,
  onSubmit,
  submitting,
  errorMessage,
  submitLabel = 'Salvar',
}: ProdutoFormProps) {
  const isNovo = !defaultValues

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProdutoFormValues>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: defaultValues?.nome ?? '',
      categoria: defaultValues?.categoria ?? '',
      preco_custo: defaultValues?.preco_custo !== undefined && defaultValues?.preco_custo !== null
        ? String(defaultValues.preco_custo)
        : '',
      preco_venda: defaultValues?.preco_venda !== undefined ? String(defaultValues.preco_venda) : '',
      estoque_inicial: '',
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        label="Nome do produto"
        id="nome"
        type="text"
        error={errors.nome?.message}
        {...register('nome')}
      />

      <TextField
        label="Categoria"
        id="categoria"
        type="text"
        placeholder="Acessórios, cuidados automotivos..."
        error={errors.categoria?.message}
        {...register('categoria')}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Preço de custo (R$)"
          id="preco_custo"
          type="text"
          inputMode="decimal"
          error={errors.preco_custo?.message}
          {...register('preco_custo')}
        />
        <TextField
          label="Preço de venda (R$)"
          id="preco_venda"
          type="text"
          inputMode="decimal"
          error={errors.preco_venda?.message}
          {...register('preco_venda')}
        />
      </div>

      {isNovo && (
        <TextField
          label="Estoque inicial"
          id="estoque_inicial"
          type="text"
          inputMode="numeric"
          placeholder="0"
          error={errors.estoque_inicial?.message}
          {...register('estoque_inicial')}
        />
      )}

      {errorMessage && <p className="field-error">{errorMessage}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? 'Salvando...' : submitLabel}
      </button>
    </form>
  )
}
