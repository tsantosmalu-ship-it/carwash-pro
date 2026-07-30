import { supabase } from '@/shared/lib/supabase'

export async function listAvaliacoesPublicas() {
  const { data, error } = await supabase
    .from('avaliacoes_publicas')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
