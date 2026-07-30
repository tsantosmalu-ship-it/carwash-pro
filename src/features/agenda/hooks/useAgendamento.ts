import { useQuery } from '@tanstack/react-query'
import { getAgendamento } from '../api/agendamentos.api'

export function useAgendamento(id: string | undefined) {
  return useQuery({
    queryKey: ['agendamento', id],
    queryFn: () => getAgendamento(id as string),
    enabled: !!id,
  })
}
