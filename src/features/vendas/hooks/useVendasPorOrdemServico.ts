import { useQuery } from '@tanstack/react-query'
import { listVendasPorOrdemServico } from '../api/vendas.api'

export function useVendasPorOrdemServico(ordemServicoId: string | undefined) {
  return useQuery({
    queryKey: ['vendas', 'ordemServico', ordemServicoId],
    queryFn: () => listVendasPorOrdemServico(ordemServicoId as string),
    enabled: !!ordemServicoId,
  })
}
