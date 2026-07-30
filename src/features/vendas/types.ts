export interface Venda {
  id: string
  ordem_servico_id: string | null
  cliente_id: string
  produto_id: string
  quantidade: number
  preco_unitario: number
  created_at: string
}

export interface VendaDetalhada extends Venda {
  produtos: { nome: string } | null
}
