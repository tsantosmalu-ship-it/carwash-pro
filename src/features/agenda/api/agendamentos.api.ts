import { supabase } from '@/shared/lib/supabase'
import type { AgendamentoFormValues } from '../schemas/agendamento.schema'
import type { AgendamentoDetalhado, AgendamentoStatus } from '../types'

const DETALHADO_SELECT =
  '*, clientes(nome, telefone), veiculos(marca, modelo, placa), enderecos(nome, rua, numero, bairro), agendamento_servicos(*, servicos(nome)), ordens_servico(id, avaliacao)'

export async function listAgendamentosDoDia(data: string) {
  const { data: agendamentos, error } = await supabase
    .from('agendamentos')
    .select(DETALHADO_SELECT)
    .eq('data', data)
    .is('deleted_at', null)
    .order('hora', { ascending: true })
  if (error) throw error
  return agendamentos as unknown as AgendamentoDetalhado[]
}

export async function listMeusAgendamentos(clienteId: string) {
  const { data: agendamentos, error } = await supabase
    .from('agendamentos')
    .select(DETALHADO_SELECT)
    .eq('cliente_id', clienteId)
    .is('deleted_at', null)
    .order('data', { ascending: false })
    .order('hora', { ascending: false })
  if (error) throw error
  return agendamentos as unknown as AgendamentoDetalhado[]
}

export async function getAgendamento(id: string) {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(DETALHADO_SELECT)
    .eq('id', id)
    .single()
  if (error) throw error
  return data as unknown as AgendamentoDetalhado
}

export async function createAgendamento(
  clienteId: string,
  input: AgendamentoFormValues,
  servicosSelecionados: { id: string; preco: number }[],
) {
  const valorTotal = servicosSelecionados.reduce((soma, servico) => soma + servico.preco, 0)

  const { data: agendamento, error } = await supabase
    .from('agendamentos')
    .insert({
      cliente_id: clienteId,
      veiculo_id: input.veiculo_id,
      endereco_id: input.endereco_id || null,
      data: input.data,
      hora: input.hora,
      valor_total: valorTotal,
      observacoes: input.observacoes || null,
    })
    .select()
    .single()
  if (error) throw error

  const { error: servicosError } = await supabase.from('agendamento_servicos').insert(
    servicosSelecionados.map((servico) => ({
      agendamento_id: agendamento.id,
      servico_id: servico.id,
      preco_aplicado: servico.preco,
    })),
  )
  // Não há policy de delete para agendamentos (soft delete é o padrão do
  // sistema), então não é possível desfazer o insert acima em caso de falha
  // aqui — o agendamento fica sem serviços vinculados e precisa de ajuste manual.
  if (servicosError) throw servicosError

  return agendamento
}

export async function setAgendamentoStatus(id: string, status: AgendamentoStatus) {
  const { error } = await supabase
    .from('agendamentos')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
