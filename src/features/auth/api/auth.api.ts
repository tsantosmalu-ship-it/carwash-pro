import { supabase } from '@/shared/lib/supabase'
import type { UsuarioRole } from '../types'

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUpCliente(params: {
  nome: string
  email: string
  telefone: string
  password: string
}) {
  // A linha em `clientes` é criada pelo trigger handle_new_user() no banco
  // (via raw_user_meta_data), não aqui — sem isso, o insert falharia por RLS
  // sempre que "Confirm email" estiver ativo, já que signUp() não retorna
  // sessão ativa nesse caso e a policy exige usuario_id = auth.uid().
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        nome: params.nome,
        telefone: params.telefone,
      },
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/alterar-senha`,
  })
  if (error) throw error
}

export async function fetchUsuarioRole(userId: string): Promise<UsuarioRole> {
  const { data, error } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data.role
}
