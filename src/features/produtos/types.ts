import type { ProdutoStatus } from '@/shared/types/database.types'

export type { ProdutoStatus }

export interface Produto {
  id: string
  nome: string
  categoria: string | null
  foto: string | null
  preco_custo: number | null
  preco_venda: number
  estoque_atual: number
  status: ProdutoStatus
  created_at: string
  updated_at: string
  deleted_at: string | null
}
