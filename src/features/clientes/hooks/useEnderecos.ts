import { useQuery } from '@tanstack/react-query'
import { listEnderecos } from '../api/enderecos.api'

export function useEnderecos(clienteId: string | undefined) {
  return useQuery({
    queryKey: ['enderecos', clienteId],
    queryFn: () => listEnderecos(clienteId as string),
    enabled: !!clienteId,
  })
}
