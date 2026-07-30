import { supabase } from '@/shared/lib/supabase'
import type { EntradaEstoqueFormValues, ProdutoFormValues } from '../schemas/produto.schema'
import type { ProdutoStatus } from '../types'

const BUCKET = 'produtos-fotos'

export async function listProdutos(search?: string) {
  let query = supabase
    .from('produtos')
    .select('*')
    .is('deleted_at', null)
    .order('nome', { ascending: true })

  if (search) {
    const term = search.replace(/[,()]/g, '')
    query = query.or(`nome.ilike.%${term}%,categoria.ilike.%${term}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getProduto(id: string) {
  const { data, error } = await supabase.from('produtos').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createProduto(input: ProdutoFormValues) {
  const { data, error } = await supabase
    .from('produtos')
    .insert({
      nome: input.nome,
      categoria: input.categoria || null,
      preco_custo: input.preco_custo ? Number(input.preco_custo.replace(',', '.')) : null,
      preco_venda: Number(input.preco_venda.replace(',', '.')),
      estoque_atual: input.estoque_inicial ? Number(input.estoque_inicial) : 0,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProduto(id: string, input: ProdutoFormValues) {
  const { data, error } = await supabase
    .from('produtos')
    .update({
      nome: input.nome,
      categoria: input.categoria || null,
      preco_custo: input.preco_custo ? Number(input.preco_custo.replace(',', '.')) : null,
      preco_venda: Number(input.preco_venda.replace(',', '.')),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function registrarEntradaEstoque(id: string, input: EntradaEstoqueFormValues) {
  const { data: atual, error: fetchError } = await supabase
    .from('produtos')
    .select('estoque_atual')
    .eq('id', id)
    .single()
  if (fetchError) throw fetchError

  const { error } = await supabase
    .from('produtos')
    .update({
      estoque_atual: atual.estoque_atual + Number(input.quantidade),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) throw error
}

export async function setProdutoStatus(id: string, status: ProdutoStatus) {
  const { error } = await supabase
    .from('produtos')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function uploadFotoProduto(id: string, file: File) {
  const path = `${id}/${crypto.randomUUID()}-${file.name}`
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file)
  if (uploadError) throw uploadError

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
  const { error: updateError } = await supabase
    .from('produtos')
    .update({ foto: publicUrlData.publicUrl })
    .eq('id', id)
  if (updateError) throw updateError

  return publicUrlData.publicUrl
}
