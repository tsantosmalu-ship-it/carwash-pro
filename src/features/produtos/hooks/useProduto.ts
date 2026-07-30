import { useQuery } from '@tanstack/react-query'
import { getProduto } from '../api/produtos.api'

export function useProduto(id: string | undefined) {
  return useQuery({
    queryKey: ['produto', id],
    queryFn: () => getProduto(id as string),
    enabled: !!id,
  })
}
