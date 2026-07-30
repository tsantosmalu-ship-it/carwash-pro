import { supabase } from '@/shared/lib/supabase'
import type { OrdemServicoFormValues } from '../schemas/ordemServico.schema'
import type { OrdemServicoDetalhada } from '../types'

const DETALHADO_SELECT =
  '*, agendamentos(cliente_id, data, hora, valor_total, clientes(nome, telefone), veiculos(marca, modelo, placa), agendamento_servicos(servicos(nome)))'

const BUCKET = 'ordens-servico-fotos'
const NOTAS_FISCAIS_BUCKET = 'notas-fiscais'

function normalizeOrdemServicoInput(input: OrdemServicoFormValues) {
  return {
    checklist: input.checklist,
    valor_final: input.valor_final ? Number(input.valor_final.replace(',', '.')) : null,
    forma_pagamento: input.forma_pagamento || null,
    observacoes: input.observacoes || null,
  }
}

export async function createOrdemServico(agendamentoId: string) {
  const { data, error } = await supabase
    .from('ordens_servico')
    .insert({ agendamento_id: agendamentoId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function listOrdensServico() {
  const { data, error } = await supabase
    .from('ordens_servico')
    .select(DETALHADO_SELECT)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as OrdemServicoDetalhada[]
}

export async function getOrdemServico(id: string) {
  const { data, error } = await supabase
    .from('ordens_servico')
    .select(DETALHADO_SELECT)
    .eq('id', id)
    .single()
  if (error) throw error
  return data as unknown as OrdemServicoDetalhada
}

export async function updateOrdemServico(id: string, input: OrdemServicoFormValues) {
  const { error } = await supabase
    .from('ordens_servico')
    .update({ ...normalizeOrdemServicoInput(input), updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function marcarInicio(id: string) {
  const { error } = await supabase
    .from('ordens_servico')
    .update({ hora_inicio: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function marcarFim(id: string) {
  const { error } = await supabase
    .from('ordens_servico')
    .update({ hora_fim: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function uploadFoto(ordemServicoId: string, tipo: 'antes' | 'depois', file: File) {
  const path = `${ordemServicoId}/${tipo}/${crypto.randomUUID()}-${file.name}`
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file)
  if (uploadError) throw uploadError

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path)

  const { data: atual, error: fetchError } = await supabase
    .from('ordens_servico')
    .select('fotos_antes, fotos_depois')
    .eq('id', ordemServicoId)
    .single()
  if (fetchError) throw fetchError

  const fotosExistentes = (tipo === 'antes' ? atual.fotos_antes : atual.fotos_depois) ?? []
  const novasFotos = [...fotosExistentes, publicUrlData.publicUrl]
  const { error: updateError } = await supabase
    .from('ordens_servico')
    .update(tipo === 'antes' ? { fotos_antes: novasFotos } : { fotos_depois: novasFotos })
    .eq('id', ordemServicoId)
  if (updateError) throw updateError

  return publicUrlData.publicUrl
}

export async function removerFoto(ordemServicoId: string, tipo: 'antes' | 'depois', url: string) {
  const { data: atual, error: fetchError } = await supabase
    .from('ordens_servico')
    .select('fotos_antes, fotos_depois')
    .eq('id', ordemServicoId)
    .single()
  if (fetchError) throw fetchError

  const fotosExistentes = (tipo === 'antes' ? atual.fotos_antes : atual.fotos_depois) ?? []
  const novasFotos = fotosExistentes.filter((foto) => foto !== url)
  const { error: updateError } = await supabase
    .from('ordens_servico')
    .update(tipo === 'antes' ? { fotos_antes: novasFotos } : { fotos_depois: novasFotos })
    .eq('id', ordemServicoId)
  if (updateError) throw updateError
}

export async function avaliarOrdemServico(id: string, avaliacao: number, comentario: string) {
  const { error } = await supabase.rpc('avaliar_ordem_servico', {
    p_ordem_servico_id: id,
    p_avaliacao: avaliacao,
    p_comentario: comentario || null,
  })
  if (error) throw error
}

export async function uploadNotaFiscal(ordemServicoId: string, file: File) {
  const path = `${ordemServicoId}/nota-fiscal.pdf`
  const { error: uploadError } = await supabase.storage
    .from(NOTAS_FISCAIS_BUCKET)
    .upload(path, file, { upsert: true })
  if (uploadError) throw uploadError

  const { error: updateError } = await supabase
    .from('ordens_servico')
    .update({ nota_fiscal_url: path })
    .eq('id', ordemServicoId)
  if (updateError) throw updateError

  return path
}

export async function getNotaFiscalSignedUrl(path: string) {
  const { data, error } = await supabase.storage
    .from(NOTAS_FISCAIS_BUCKET)
    .createSignedUrl(path, 300)
  if (error) throw error
  return data.signedUrl
}

export async function publicarAvaliacao(params: {
  ordemServicoId: string
  clienteNome: string
  servicoNome: string | null
  avaliacao: number
  comentario: string | null
}) {
  const { error: insertError } = await supabase.from('avaliacoes_publicas').insert({
    ordem_servico_id: params.ordemServicoId,
    cliente_nome: params.clienteNome,
    servico_nome: params.servicoNome,
    avaliacao: params.avaliacao,
    comentario: params.comentario,
  })
  if (insertError) throw insertError

  const { error: updateError } = await supabase
    .from('ordens_servico')
    .update({ avaliacao_aprovada: true })
    .eq('id', params.ordemServicoId)
  if (updateError) throw updateError
}

export async function despublicarAvaliacao(ordemServicoId: string) {
  const { error: deleteError } = await supabase
    .from('avaliacoes_publicas')
    .delete()
    .eq('ordem_servico_id', ordemServicoId)
  if (deleteError) throw deleteError

  const { error: updateError } = await supabase
    .from('ordens_servico')
    .update({ avaliacao_aprovada: false })
    .eq('id', ordemServicoId)
  if (updateError) throw updateError
}
