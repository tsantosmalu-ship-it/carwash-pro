import type { OrigemLancamento, TipoLancamento } from '@/shared/types/database.types'

export type { TipoLancamento, OrigemLancamento }

export interface FinanceiroLancamento {
  id: string
  tipo: TipoLancamento
  categoria: string | null
  valor: number
  data: string
  origem: OrigemLancamento | null
  referencia_id: string | null
  observacoes: string | null
  created_at: string
}

export const ORIGEM_LABELS: Record<OrigemLancamento, string> = {
  servico: 'Serviço',
  produto: 'Produto',
  manual: 'Manual',
}
