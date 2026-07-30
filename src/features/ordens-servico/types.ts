import type { FormaPagamento } from '@/shared/types/database.types'

export type { FormaPagamento }

export interface OrdemServico {
  id: string
  agendamento_id: string
  fotos_antes: string[] | null
  fotos_depois: string[] | null
  checklist: Record<string, boolean> | null
  hora_inicio: string | null
  hora_fim: string | null
  valor_final: number | null
  forma_pagamento: FormaPagamento | null
  avaliacao: number | null
  observacoes: string | null
  comentario_avaliacao: string | null
  avaliacao_aprovada: boolean
  nota_fiscal_url: string | null
  created_at: string
  updated_at: string
}

export interface OrdemServicoDetalhada extends OrdemServico {
  agendamentos: {
    cliente_id: string
    data: string
    hora: string
    valor_total: number | null
    clientes: { nome: string; telefone: string | null } | null
    veiculos: { marca: string; modelo: string; placa: string | null } | null
    agendamento_servicos: { servicos: { nome: string } | null }[]
  } | null
}

export const CHECKLIST_ITEMS: { key: string; label: string }[] = [
  { key: 'lavagem_externa', label: 'Lavagem externa' },
  { key: 'lavagem_interna', label: 'Lavagem interna' },
  { key: 'secagem', label: 'Secagem' },
  { key: 'aspiracao', label: 'Aspiração' },
  { key: 'pneus_rodas', label: 'Pneus e rodas' },
  { key: 'vidros', label: 'Vidros' },
]

export const FORMA_PAGAMENTO_LABELS: Record<FormaPagamento, string> = {
  pix: 'Pix',
  dinheiro: 'Dinheiro',
  cartao: 'Cartão',
  transferencia: 'Transferência',
}

export const FORMA_PAGAMENTO_OPTIONS = Object.keys(FORMA_PAGAMENTO_LABELS) as FormaPagamento[]
