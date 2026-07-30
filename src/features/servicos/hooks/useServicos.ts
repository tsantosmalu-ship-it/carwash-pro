import { useQuery } from '@tanstack/react-query'
import { listServicos } from '../api/servicos.api'

export function useServicos(search: string) {
  return useQuery({
    queryKey: ['servicos', search],
    queryFn: () => listServicos(search),
  })
}
