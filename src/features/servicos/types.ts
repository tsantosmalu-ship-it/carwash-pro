import type { TipoVeiculoServico } from '@/shared/types/database.types'

export type ServicoStatus = 'ativo' | 'inativo'
export type { TipoVeiculoServico }

export interface Servico {
  id: string
  nome: string
  categoria: string | null
  descricao: string | null
  tempo_estimado_min: number | null
  preco: number
  status: ServicoStatus
  tipo_veiculo: TipoVeiculoServico | null
  itens_inclusos: string[]
  created_at: string
  updated_at: string
}

export const TIPO_VEICULO_LABELS: Record<TipoVeiculoServico, string> = {
  carro: 'Carro',
  moto: 'Moto',
  quadriciclo: 'Quadriciclo',
  jet_ski: 'Jet Ski',
}

export const TIPO_VEICULO_OPTIONS = Object.keys(TIPO_VEICULO_LABELS) as TipoVeiculoServico[]
