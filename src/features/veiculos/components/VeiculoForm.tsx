import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@/shared/components/ui/TextField'
import { veiculoSchema, type VeiculoFormValues } from '../schemas/veiculo.schema'
import { TIPO_VEICULO_LABELS, TIPO_VEICULO_OPTIONS } from '../types'
import type { Veiculo } from '../types'

interface VeiculoFormProps {
  defaultValues?: Partial<Veiculo>
  onSubmit: (values: VeiculoFormValues) => Promise<void>
  onCancel: () => void
  submitting: boolean
  errorMessage: string | null
}

export function VeiculoForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
  errorMessage,
}: VeiculoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VeiculoFormValues>({
    resolver: zodResolver(veiculoSchema),
    defaultValues: {
      tipo_veiculo: defaultValues?.tipo_veiculo ?? undefined,
      marca: defaultValues?.marca ?? '',
      modelo: defaultValues?.modelo ?? '',
      cor: defaultValues?.cor ?? '',
      placa: defaultValues?.placa ?? '',
      tipo_pintura: defaultValues?.tipo_pintura ?? '',
      observacoes: defaultValues?.observacoes ?? '',
    },
  })

  return (
    <form
      className="space-y-4 rounded-xl border border-dourado-escuro/20 bg-preto-card p-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
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

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Marca"
          id="marca"
          type="text"
          error={errors.marca?.message}
          {...register('marca')}
        />
        <TextField
          label="Modelo"
          id="modelo"
          type="text"
          error={errors.modelo?.message}
          {...register('modelo')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Cor"
          id="cor"
          type="text"
          error={errors.cor?.message}
          {...register('cor')}
        />
        <TextField
          label="Placa"
          id="placa"
          type="text"
          placeholder="ABC1D23"
          error={errors.placa?.message}
          {...register('placa')}
        />
      </div>

      <TextField
        label="Tipo de pintura"
        id="tipo_pintura"
        type="text"
        error={errors.tipo_pintura?.message}
        {...register('tipo_pintura')}
      />

      <div>
        <label htmlFor="veiculo_observacoes" className="field-label">
          Observações
        </label>
        <textarea id="veiculo_observacoes" rows={3} className="field-input" {...register('observacoes')} />
      </div>

      {errorMessage && <p className="field-error">{errorMessage}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Salvando...' : 'Salvar veículo'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  )
}
