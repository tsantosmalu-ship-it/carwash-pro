import { useQuery } from '@tanstack/react-query'
import { listAvaliacoesPublicas } from '../api/avaliacoesPublicas.api'

export function useAvaliacoesPublicas() {
  return useQuery({
    queryKey: ['avaliacoesPublicas'],
    queryFn: listAvaliacoesPublicas,
  })
}
