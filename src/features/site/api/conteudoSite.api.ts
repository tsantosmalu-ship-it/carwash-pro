import { supabase } from '@/shared/lib/supabase'

export async function getConteudo(chave: string) {
  const { data, error } = await supabase
    .from('conteudo_site')
    .select('valor')
    .eq('chave', chave)
    .maybeSingle()
  if (error) throw error
  return data?.valor ?? null
}

export async function updateConteudo(chave: string, valor: string) {
  const { error } = await supabase
    .from('conteudo_site')
    .upsert({ chave, valor, atualizado_em: new Date().toISOString() })
  if (error) throw error
}
