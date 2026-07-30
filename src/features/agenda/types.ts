import type { AgendamentoStatus } from '@/shared/types/database.types'

export type { AgendamentoStatus }

export interface Agendamento {
  id: string
  cliente_id: string
  veiculo_id: string
  endereco_id: string | null
  data: string
  hora: string
  status: AgendamentoStatus
  valor_total: number | null
  observacoes: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AgendamentoServico {
  id: string
  agendamento_id: string
  servico_id: string
  preco_aplicado: number
  servicos: {
    nome: string
  } | null
}

export interface AgendamentoDetalhado extends Agendamento {
  clientes: { nome: string; telefone: string | null } | null
  veiculos: { marca: string; modelo: string; placa: string | null } | null
  enderecos: { nome: string; rua: string | null; numero: string | null; bairro: string | null } | null
  agendamento_servicos: AgendamentoServico[]
  ordens_servico: { id: string; avaliacao: number | null } | null
}

export const STATUS_LABELS: Record<AgendamentoStatus, string> = {
  solicitado: 'Solicitado',
  confirmado: 'Confirmado',
  em_deslocamento: 'Em deslocamento',
  iniciado: 'Iniciado',
  concluido: 'Concluído',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado',
}

export const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as AgendamentoStatus[]
