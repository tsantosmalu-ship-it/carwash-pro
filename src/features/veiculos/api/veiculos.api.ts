import { supabase } from '@/shared/lib/supabase'
import type { VeiculoFormValues } from '../schemas/veiculo.schema'

function normalizeVeiculoInput(input: VeiculoFormValues) {
  return {
    tipo_veiculo: input.tipo_veiculo,
    marca: input.marca,
    modelo: input.modelo,
    cor: input.cor || null,
    placa: input.placa ? input.placa.toUpperCase() : null,
    tipo_pintura: input.tipo_pintura || null,
    observacoes: input.observacoes || null,
  }
}

export async function listVeiculos(clienteId: string) {
  const { data, error } = await supabase
    .from('veiculos')
    .select('*')
    .eq('cliente_id', clienteId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function getVeiculo(id: string) {
  const { data, error } = await supabase.from('veiculos').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createVeiculo(clienteId: string, input: VeiculoFormValues) {
  const { data, error } = await supabase
    .from('veiculos')
    .insert({ ...normalizeVeiculoInput(input), cliente_id: clienteId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateVeiculo(id: string, input: VeiculoFormValues) {
  const { data, error } = await supabase
    .from('veiculos')
    .update({ ...normalizeVeiculoInput(input), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function arquivarVeiculo(id: string) {
  const { error } = await supabase
    .from('veiculos')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
