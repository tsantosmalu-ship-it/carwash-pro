import { supabase } from '@/shared/lib/supabase'
import type { ServicoFormValues } from '../schemas/servico.schema'
import type { ServicoStatus } from '../types'

function normalizeServicoInput(input: ServicoFormValues) {
  return {
    nome: input.nome,
    categoria: input.categoria || null,
    descricao: input.descricao || null,
    tempo_estimado_min: input.tempo_estimado_min ? Number(input.tempo_estimado_min) : null,
    preco: Number(input.preco.replace(',', '.')),
    tipo_veiculo: input.tipo_veiculo,
    itens_inclusos: input.itens_inclusos.filter((item) => item.trim() !== ''),
  }
}

export async function listServicos(search?: string) {
  let query = supabase.from('servicos').select('*').order('nome', { ascending: true })

  if (search) {
    const term = search.replace(/[,()]/g, '')
    query = query.or(`nome.ilike.%${term}%,categoria.ilike.%${term}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getServico(id: string) {
  const { data, error } = await supabase.from('servicos').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createServico(input: ServicoFormValues) {
  const { data, error } = await supabase
    .from('servicos')
    .insert(normalizeServicoInput(input))
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateServico(id: string, input: ServicoFormValues) {
  const { data, error } = await supabase
    .from('servicos')
    .update({ ...normalizeServicoInput(input), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function setServicoStatus(id: string, status: ServicoStatus) {
  const { error } = await supabase
    .from('servicos')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
