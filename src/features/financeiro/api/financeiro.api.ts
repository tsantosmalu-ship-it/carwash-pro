import { supabase } from '@/shared/lib/supabase'
import type { LancamentoFormValues } from '../schemas/lancamento.schema'

export async function listLancamentos() {
  const { data, error } = await supabase
    .from('financeiro_lancamentos')
    .select('*')
    .order('data', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createLancamentoManual(input: LancamentoFormValues) {
  const { data, error } = await supabase
    .from('financeiro_lancamentos')
    .insert({
      tipo: input.tipo,
      categoria: input.categoria || null,
      valor: Number(input.valor.replace(',', '.')),
      data: input.data,
      origem: 'manual',
      observacoes: input.observacoes || null,
    })
    .select()
    .single()
  if (error) throw error
  return data
}
