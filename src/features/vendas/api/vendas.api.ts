import { supabase } from '@/shared/lib/supabase'
import type { VendaDetalhada } from '../types'

export async function listVendasPorOrdemServico(ordemServicoId: string) {
  const { data, error } = await supabase
    .from('venda_produtos')
    .select('*, produtos(nome)')
    .eq('ordem_servico_id', ordemServicoId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as unknown as VendaDetalhada[]
}

export async function createVenda(input: {
  clienteId: string
  ordemServicoId: string
  produtoId: string
  quantidade: number
  precoUnitario: number
}) {
  const { data, error } = await supabase
    .from('venda_produtos')
    .insert({
      cliente_id: input.clienteId,
      ordem_servico_id: input.ordemServicoId,
      produto_id: input.produtoId,
      quantidade: input.quantidade,
      preco_unitario: input.precoUnitario,
    })
    .select()
    .single()
  if (error) throw error
  return data
}
