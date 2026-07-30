import { useQuery } from '@tanstack/react-query'
import { listOrdensServico } from '../api/ordensServico.api'

export function useOrdensServico() {
  return useQuery({
    queryKey: ['ordensServico'],
    queryFn: listOrdensServico,
  })
}
