import { useQuery } from '@tanstack/react-query'
import { getOrdemServico } from '../api/ordensServico.api'

export function useOrdemServico(id: string | undefined) {
  return useQuery({
    queryKey: ['ordemServico', id],
    queryFn: () => getOrdemServico(id as string),
    enabled: !!id,
  })
}
