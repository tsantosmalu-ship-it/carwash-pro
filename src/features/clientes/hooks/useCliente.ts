import { useQuery } from '@tanstack/react-query'
import { getCliente } from '../api/clientes.api'

export function useCliente(id: string | undefined) {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: () => getCliente(id as string),
    enabled: !!id,
  })
}
