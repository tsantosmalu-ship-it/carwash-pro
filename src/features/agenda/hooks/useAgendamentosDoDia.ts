import { useQuery } from '@tanstack/react-query'
import { listAgendamentosDoDia } from '../api/agendamentos.api'

export function useAgendamentosDoDia(data: string) {
  return useQuery({
    queryKey: ['agendamentos', 'dia', data],
    queryFn: () => listAgendamentosDoDia(data),
  })
}
