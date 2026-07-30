import { supabase } from '@/shared/lib/supabase'

const BUCKET = 'ordens-servico-fotos'

export async function listDestaques() {
  const { data, error } = await supabase
    .from('galeria_destaques')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function criarDestaque(file: File, legenda: string) {
  const path = `destaques/${crypto.randomUUID()}-${file.name}`
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file)
  if (uploadError) throw uploadError

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path)

  const { error } = await supabase
    .from('galeria_destaques')
    .insert({ foto_url: publicUrlData.publicUrl, legenda: legenda || null })
  if (error) throw error
}

export async function removerDestaque(id: string) {
  const { error } = await supabase.from('galeria_destaques').delete().eq('id', id)
  if (error) throw error
}
