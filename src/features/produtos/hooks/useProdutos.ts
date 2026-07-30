import { useQuery } from '@tanstack/react-query'
import { listProdutos } from '../api/produtos.api'

export function useProdutos(search: string) {
  return useQuery({
    queryKey: ['produtos', search],
    queryFn: () => listProdutos(search),
  })
}
