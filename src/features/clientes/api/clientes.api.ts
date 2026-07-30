import { supabase } from '@/shared/lib/supabase'
import type { ClienteFormValues } from '../schemas/cliente.schema'

function normalizeClienteInput(input: ClienteFormValues) {
  return {
    nome: input.nome,
    cpf: input.cpf || null,
    telefone: input.telefone || null,
    whatsapp: input.whatsapp || null,
    email: input.email || null,
    data_nascimento: input.data_nascimento || null,
    observacoes: input.observacoes || null,
  }
}

export async function listClientes(search?: string) {
  let query = supabase
    .from('clientes')
    .select('*')
    .is('deleted_at', null)
    .order('nome', { ascending: true })

  if (search) {
    const term = search.replace(/[,()]/g, '')
    query = query.or(`nome.ilike.%${term}%,telefone.ilike.%${term}%,email.ilike.%${term}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getCliente(id: string) {
  const { data, error } = await supabase.from('clientes').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function getClienteByUsuarioId(usuarioId: string) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('usuario_id', usuarioId)
    .single()
  if (error) throw error
  return data
}

export async function createCliente(input: ClienteFormValues) {
  const { data, error } = await supabase
    .from('clientes')
    .insert(normalizeClienteInput(input))
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCliente(id: string, input: ClienteFormValues) {
  const { data, error } = await supabase
    .from('clientes')
    .update({ ...normalizeClienteInput(input), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function arquivarCliente(id: string) {
  const { error } = await supabase
    .from('clientes')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
