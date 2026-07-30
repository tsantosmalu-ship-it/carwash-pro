import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAgendamento, setAgendamentoStatus } from '../api/agendamentos.api'
import type { AgendamentoFormValues } from '../schemas/agendamento.schema'
import type { AgendamentoStatus } from '../types'

export function useCreateAgendamento(clienteId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      input,
      servicosSelecionados,
    }: {
      input: AgendamentoFormValues
      servicosSelecionados: { id: string; preco: number }[]
    }) => createAgendamento(clienteId, input, servicosSelecionados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'meus', clienteId] })
    },
  })
}

export function useSetAgendamentoStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AgendamentoStatus }) =>
      setAgendamentoStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] })
      queryClient.invalidateQueries({ queryKey: ['agendamento', variables.id] })
    },
  })
}
