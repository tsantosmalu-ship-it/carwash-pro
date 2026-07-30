import { useQuery } from '@tanstack/react-query'
import { getServico } from '../api/servicos.api'

export function useServico(id: string | undefined) {
  return useQuery({
    queryKey: ['servico', id],
    queryFn: () => getServico(id as string),
    enabled: !!id,
  })
}
