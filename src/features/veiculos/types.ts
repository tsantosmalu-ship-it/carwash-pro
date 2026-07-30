import type { TipoVeiculoServico } from '@/shared/types/database.types'

export type { TipoVeiculoServico }

export interface Veiculo {
  id: string
  cliente_id: string
  marca: string
  modelo: string
  versao: string | null
  ano: number | null
  cor: string | null
  placa: string | null
  km: number | null
  tipo_pintura: string | null
  foto_principal: string | null
  observacoes: string | null
  tipo_veiculo: TipoVeiculoServico | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export const TIPO_VEICULO_LABELS: Record<TipoVeiculoServico, string> = {
  carro: 'Carro',
  moto: 'Moto',
  quadriciclo: 'Quadriciclo',
  jet_ski: 'Jet Ski',
}

export const TIPO_VEICULO_OPTIONS = Object.keys(TIPO_VEICULO_LABELS) as TipoVeiculoServico[]
