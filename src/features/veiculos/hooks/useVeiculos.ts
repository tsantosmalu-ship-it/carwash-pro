import { useQuery } from '@tanstack/react-query'
import { listVeiculos } from '../api/veiculos.api'

export function useVeiculos(clienteId: string | undefined) {
  return useQuery({
    queryKey: ['veiculos', clienteId],
    queryFn: () => listVeiculos(clienteId as string),
    enabled: !!clienteId,
  })
}
