import { useQuery } from '@tanstack/react-query'
import { listMeusAgendamentos } from '../api/agendamentos.api'

export function useMeusAgendamentos(clienteId: string | undefined) {
  return useQuery({
    queryKey: ['agendamentos', 'meus', clienteId],
    queryFn: () => listMeusAgendamentos(clienteId as string),
    enabled: !!clienteId,
  })
}
