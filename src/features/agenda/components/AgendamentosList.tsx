import { Link } from 'react-router-dom'
import { StatusBadge } from './StatusBadge'
import type { AgendamentoDetalhado } from '../types'

function formatPreco(preco: number | null) {
  if (preco === null) return '—'
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatHora(hora: string) {
  return hora.slice(0, 5)
}

interface AgendamentosListProps {
  agendamentos: AgendamentoDetalhado[]
  variant: 'admin' | 'cliente'
  emptyMessage: string
}

export function AgendamentosList({ agendamentos, variant, emptyMessage }: AgendamentosListProps) {
  if (agendamentos.length === 0) {
    return <p className="text-sm text-cinza-medio">{emptyMessage}</p>
  }

  return (
    <ul className="space-y-3">
      {agendamentos.map((agendamento) => {
        const conteudo = (
          <div className="rounded-xl border border-dourado-escuro/20 p-4 hover:bg-white/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-branco-premium">
                  {variant === 'admin' && agendamento.data.split('-').reverse().join('/') + ' • '}
                  {formatHora(agendamento.hora)}
                  {variant === 'admin' && agendamento.clientes && ` • ${agendamento.clientes.nome}`}
                </p>
                <p className="mt-1 text-sm text-cinza-medio">
                  {agendamento.veiculos
                    ? `${agendamento.veiculos.marca} ${agendamento.veiculos.modelo}${
                        agendamento.veiculos.placa ? ` • ${agendamento.veiculos.placa}` : ''
                      }`
                    : 'Veículo não encontrado'}
                </p>
                <p className="mt-1 text-sm text-cinza-medio">
                  {agendamento.agendamento_servicos.map((item) => item.servicos?.nome).join(', ') ||
                    'Sem serviços vinculados'}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <StatusBadge status={agendamento.status} />
                <span className="text-sm font-semibold text-dourado-principal">
                  {formatPreco(agendamento.valor_total)}
                </span>
              </div>
            </div>

            {variant === 'cliente' && agendamento.ordens_servico && (
              <Link to={`/ordens-servico/${agendamento.ordens_servico.id}`} className="link-accent mt-3 inline-block text-sm">
                {agendamento.ordens_servico.avaliacao ? 'Ver Ordem de Serviço' : 'Avaliar atendimento'}
              </Link>
            )}
          </div>
        )

        return (
          <li key={agendamento.id}>
            {variant === 'admin' ? (
              <Link to={`/admin/agenda/${agendamento.id}`}>{conteudo}</Link>
            ) : (
              conteudo
            )}
          </li>
        )
      })}
    </ul>
  )
}
