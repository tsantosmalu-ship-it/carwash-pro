import { useQuery } from '@tanstack/react-query'
import { listLancamentos } from '../api/financeiro.api'

export function useLancamentos() {
  return useQuery({
    queryKey: ['financeiro', 'lancamentos'],
    queryFn: listLancamentos,
  })
}
