import { supabase } from '@/shared/lib/supabase'
import type { EnderecoFormValues } from '../schemas/endereco.schema'

function normalizeEnderecoInput(input: EnderecoFormValues) {
  return {
    nome: input.nome,
    cep: input.cep || null,
    rua: input.rua || null,
    numero: input.numero || null,
    complemento: input.complemento || null,
    bairro: input.bairro || null,
    cidade: input.cidade || null,
    estado: input.estado || null,
    referencia: input.referencia || null,
  }
}

export async function listEnderecos(clienteId: string) {
  const { data, error } = await supabase
    .from('enderecos')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('favorito', { ascending: false })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function createEndereco(clienteId: string, input: EnderecoFormValues) {
  const { data, error } = await supabase
    .from('enderecos')
    .insert({ ...normalizeEnderecoInput(input), cliente_id: clienteId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateEndereco(id: string, input: EnderecoFormValues) {
  const { data, error } = await supabase
    .from('enderecos')
    .update({ ...normalizeEnderecoInput(input), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteEndereco(id: string) {
  // RLS sem policy de delete não gera erro, só filtra as linhas afetadas
  // para zero — por isso conferimos o retorno em vez de confiar só em `error`.
  const { data, error } = await supabase.from('enderecos').delete().eq('id', id).select()
  if (error) throw error
  if (!data || data.length === 0) {
    throw new Error('Não foi possível remover o endereço (sem permissão).')
  }
}

export async function setEnderecoFavorito(id: string, clienteId: string) {
  const { error: clearError } = await supabase
    .from('enderecos')
    .update({ favorito: false })
    .eq('cliente_id', clienteId)
  if (clearError) throw clearError

  const { error } = await supabase.from('enderecos').update({ favorito: true }).eq('id', id)
  if (error) throw error
}
