import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@/shared/components/ui/TextField'
import { agendamentoSchema, type AgendamentoFormValues } from '../schemas/agendamento.schema'
import type { Veiculo } from '@/features/veiculos/types'
import type { Endereco } from '@/features/clientes/types'
import type { Servico } from '@/features/servicos/types'

interface AgendamentoFormProps {
  veiculos: Veiculo[]
  enderecos: Endereco[]
  servicos: Servico[]
  onSubmit: (values: AgendamentoFormValues) => Promise<void>
  submitting: boolean
  errorMessage: string | null
}

function formatPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function AgendamentoForm({
  veiculos,
  enderecos,
  servicos,
  onSubmit,
  submitting,
  errorMessage,
}: AgendamentoFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AgendamentoFormValues>({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: {
      veiculo_id: '',
      endereco_id: '',
      data: '',
      hora: '',
      servico_ids: [],
      observacoes: '',
    },
  })

  const servicoIdsSelecionados = useWatch({ control, name: 'servico_ids' }) ?? []
  const total = servicos
    .filter((servico) => servicoIdsSelecionados.includes(servico.id))
    .reduce((soma, servico) => soma + servico.preco, 0)

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="veiculo_id" className="field-label">
          Veículo
        </label>
        <select id="veiculo_id" className="field-input" {...register('veiculo_id')}>
          <option value="">Selecione um veículo</option>
          {veiculos.map((veiculo) => (
            <option key={veiculo.id} value={veiculo.id}>
              {veiculo.marca} {veiculo.modelo} {veiculo.placa ? `• ${veiculo.placa}` : ''}
            </option>
          ))}
        </select>
        {errors.veiculo_id && <p className="field-error">{errors.veiculo_id.message}</p>}
      </div>

      <div>
        <label htmlFor="endereco_id" className="field-label">
          Endereço
        </label>
        <select id="endereco_id" className="field-input" {...register('endereco_id')}>
          <option value="">A combinar</option>
          {enderecos.map((endereco) => (
            <option key={endereco.id} value={endereco.id}>
              {endereco.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Data"
          id="data"
          type="date"
          error={errors.data?.message}
          {...register('data')}
        />
        <TextField
          label="Horário"
          id="hora"
          type="time"
          error={errors.hora?.message}
          {...register('hora')}
        />
      </div>

      <div>
        <span className="field-label">Serviços</span>
        <div className="mt-2 space-y-2 rounded-lg border border-dourado-escuro/20 p-3">
          {servicos.length === 0 && (
            <p className="text-sm text-cinza-medio">Nenhum serviço disponível no momento.</p>
          )}
          {servicos.map((servico) => (
            <label key={servico.id} className="flex items-center justify-between gap-3 text-sm text-branco-premium">
              <span className="flex items-center gap-2">
                <input type="checkbox" value={servico.id} {...register('servico_ids')} />
                {servico.nome}
              </span>
              <span className="text-dourado-principal">{formatPreco(servico.preco)}</span>
            </label>
          ))}
        </div>
        {errors.servico_ids && <p className="field-error">{errors.servico_ids.message}</p>}
      </div>

      <div>
        <label htmlFor="observacoes" className="field-label">
          Observações
        </label>
        <textarea id="observacoes" rows={3} className="field-input" {...register('observacoes')} />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-preto-card px-4 py-3">
        <span className="text-sm font-medium text-branco-premium">Total estimado</span>
        <span className="font-display text-lg text-dourado-principal">{formatPreco(total)}</span>
      </div>

      {errorMessage && <p className="field-error">{errorMessage}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? 'Agendando...' : 'Confirmar agendamento'}
      </button>
    </form>
  )
}
