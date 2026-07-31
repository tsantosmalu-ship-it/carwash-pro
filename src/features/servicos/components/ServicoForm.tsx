import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@/shared/components/ui/TextField'
import { servicoSchema, type ServicoFormValues } from '../schemas/servico.schema'
import { TIPO_VEICULO_LABELS, TIPO_VEICULO_OPTIONS } from '../types'
import type { Servico } from '../types'

interface ServicoFormProps {
  defaultValues?: Partial<Servico>
  onSubmit: (values: ServicoFormValues) => Promise<void>
  submitting: boolean
  errorMessage: string | null
  successMessage?: string | null
  submitLabel?: string
}

export function ServicoForm({
  defaultValues,
  onSubmit,
  submitting,
  errorMessage,
  successMessage,
  submitLabel = 'Salvar',
}: ServicoFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServicoFormValues>({
    resolver: zodResolver(servicoSchema),
    defaultValues: {
      nome: defaultValues?.nome ?? '',
      categoria: defaultValues?.categoria ?? '',
      descricao: defaultValues?.descricao ?? '',
      tempo_estimado_min: defaultValues?.tempo_estimado_min
        ? String(defaultValues.tempo_estimado_min)
        : '',
      preco: defaultValues?.preco !== undefined ? String(defaultValues.preco) : '',
      tipo_veiculo: defaultValues?.tipo_veiculo ?? undefined,
      itens_inclusos: defaultValues?.itens_inclusos ?? [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itens_inclusos' as never,
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        label="Nome do serviço"
        id="nome"
        type="text"
        error={errors.nome?.message}
        {...register('nome')}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Categoria"
          id="categoria"
          type="text"
          placeholder="Lavagem, Estética, Detalhamento..."
          error={errors.categoria?.message}
          {...register('categoria')}
        />
        <TextField
          label="Preço (R$)"
          id="preco"
          type="text"
          inputMode="decimal"
          placeholder="50.00"
          error={errors.preco?.message}
          {...register('preco')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="tipo_veiculo" className="field-label">
            Tipo de veículo
          </label>
          <select id="tipo_veiculo" className="field-input" {...register('tipo_veiculo')}>
            <option value="">Selecione</option>
            {TIPO_VEICULO_OPTIONS.map((tipo) => (
              <option key={tipo} value={tipo}>
                {TIPO_VEICULO_LABELS[tipo]}
              </option>
            ))}
          </select>
          {errors.tipo_veiculo && <p className="field-error">{errors.tipo_veiculo.message}</p>}
        </div>
        <TextField
          label="Tempo estimado (min)"
          id="tempo_estimado_min"
          type="text"
          inputMode="numeric"
          placeholder="60"
          error={errors.tempo_estimado_min?.message}
          {...register('tempo_estimado_min')}
        />
      </div>

      <div>
        <label htmlFor="descricao" className="field-label">
          Descrição
        </label>
        <textarea id="descricao" rows={3} className="field-input" {...register('descricao')} />
      </div>

      <div>
        <span className="field-label">Itens inclusos</span>
        <div className="mt-2 space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                type="text"
                className="field-input"
                placeholder="Ex: Lavagem externa"
                {...register(`itens_inclusos.${index}` as const)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="btn-secondary shrink-0"
                aria-label="Remover item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        {errors.itens_inclusos && (
          <p className="field-error">Preencha ou remova os itens em branco.</p>
        )}
        <button type="button" onClick={() => append('')} className="link-accent mt-2 text-sm">
          + Adicionar item
        </button>
      </div>

      {errorMessage && <p className="field-error">{errorMessage}</p>}
      {successMessage && <p className="mt-1 text-sm text-green-400">{successMessage}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? 'Salvando...' : submitLabel}
      </button>
    </form>
  )
}
