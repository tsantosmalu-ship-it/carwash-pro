import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { StatusBadge } from '../../components/StatusBadge'
import { useAgendamento } from '../../hooks/useAgendamento'
import { useSetAgendamentoStatus } from '../../hooks/useAgendamentoMutations'
import { useCreateOrdemServico } from '@/features/ordens-servico/hooks/useOrdemServicoMutations'
import { getErrorMessage } from '@/shared/lib/errors'
import { STATUS_LABELS, STATUS_OPTIONS, type AgendamentoStatus } from '../../types'

const STATUS_SEM_OS: AgendamentoStatus[] = ['solicitado', 'cancelado']

function formatPreco(preco: number | null) {
  if (preco === null) return '—'
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatData(dateValue: string) {
  const [ano, mes, dia] = dateValue.split('-')
  return `${dia}/${mes}/${ano}`
}

export function AgendamentoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: agendamento, isLoading, isError } = useAgendamento(id)
  const statusMutation = useSetAgendamentoStatus()
  const createOsMutation = useCreateOrdemServico()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleStatusChange(status: AgendamentoStatus) {
    if (!agendamento) return
    setErrorMessage(null)
    try {
      await statusMutation.mutateAsync({ id: agendamento.id, status })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleCriarOrdemServico() {
    if (!agendamento) return
    setErrorMessage(null)
    try {
      const ordemServico = await createOsMutation.mutateAsync(agendamento.id)
      navigate(`/admin/ordens-servico/${ordemServico.id}`)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  if (isLoading) return <p className="text-sm text-cinza-medio">Carregando agendamento...</p>
  if (isError || !agendamento) {
    return <p className="field-error">Agendamento não encontrado.</p>
  }

  return (
    <div className="max-w-xl space-y-6">
      <Link to="/admin/agenda" className="link-accent text-sm">
        ← Voltar para agenda
      </Link>

      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-xl text-branco-premium">
              {formatData(agendamento.data)} às {agendamento.hora.slice(0, 5)}
            </h1>
            <p className="mt-1 text-sm text-cinza-medio">
              {agendamento.clientes?.nome ?? 'Cliente não encontrado'}
              {agendamento.clientes?.telefone ? ` • ${agendamento.clientes.telefone}` : ''}
            </p>
          </div>
          <StatusBadge status={agendamento.status} />
        </div>

        <div className="mt-6 space-y-4 text-sm">
          <div>
            <p className="font-medium text-branco-premium">Veículo</p>
            <p className="text-cinza-medio">
              {agendamento.veiculos
                ? `${agendamento.veiculos.marca} ${agendamento.veiculos.modelo}${
                    agendamento.veiculos.placa ? ` • ${agendamento.veiculos.placa}` : ''
                  }`
                : 'Não informado'}
            </p>
          </div>

          <div>
            <p className="font-medium text-branco-premium">Endereço</p>
            <p className="text-cinza-medio">
              {agendamento.enderecos
                ? [agendamento.enderecos.nome, agendamento.enderecos.rua, agendamento.enderecos.numero]
                    .filter(Boolean)
                    .join(', ')
                : 'A combinar'}
            </p>
          </div>

          <div>
            <p className="font-medium text-branco-premium">Serviços</p>
            <ul className="mt-1 space-y-1 text-cinza-medio">
              {agendamento.agendamento_servicos.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.servicos?.nome ?? 'Serviço removido'}</span>
                  <span>{formatPreco(item.preco_aplicado)}</span>
                </li>
              ))}
            </ul>
          </div>

          {agendamento.observacoes && (
            <div>
              <p className="font-medium text-branco-premium">Observações</p>
              <p className="text-cinza-medio">{agendamento.observacoes}</p>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg bg-preto-card px-4 py-3">
            <span className="font-medium text-branco-premium">Valor total</span>
            <span className="font-display text-lg text-dourado-principal">
              {formatPreco(agendamento.valor_total)}
            </span>
          </div>
        </div>

        <div className="mt-6">
          {agendamento.ordens_servico ? (
            <Link to={`/admin/ordens-servico/${agendamento.ordens_servico.id}`} className="btn-primary block w-full text-center">
              Ver Ordem de Serviço
            </Link>
          ) : STATUS_SEM_OS.includes(agendamento.status) ? (
            <p className="text-sm text-cinza-medio">
              Confirme o agendamento para poder abrir a Ordem de Serviço.
            </p>
          ) : (
            <button
              type="button"
              onClick={handleCriarOrdemServico}
              disabled={createOsMutation.isPending}
              className="btn-primary w-full"
            >
              {createOsMutation.isPending ? 'Criando...' : 'Criar Ordem de Serviço'}
            </button>
          )}
        </div>

        <div className="mt-6">
          <label htmlFor="status" className="field-label">
            Status
          </label>
          <select
            id="status"
            value={agendamento.status}
            onChange={(event) => handleStatusChange(event.target.value as AgendamentoStatus)}
            disabled={statusMutation.isPending}
            className="field-input"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          {errorMessage && <p className="field-error">{errorMessage}</p>}
        </div>
      </div>
    </div>
  )
}
