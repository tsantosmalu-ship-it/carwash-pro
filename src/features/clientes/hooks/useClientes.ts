import { useQuery } from '@tanstack/react-query'
import { listClientes } from '../api/clientes.api'

export function useClientes(search: string) {
  return useQuery({
    queryKey: ['clientes', search],
    queryFn: () => listClientes(search),
  })
}
