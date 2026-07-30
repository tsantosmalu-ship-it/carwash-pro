import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createVenda } from '../api/vendas.api'

export function useCreateVenda(ordemServicoId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: {
      clienteId: string
      produtoId: string
      quantidade: number
      precoUnitario: number
    }) => createVenda({ ...input, ordemServicoId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendas', 'ordemServico', ordemServicoId] })
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
      queryClient.invalidateQueries({ queryKey: ['financeiro'] })
    },
  })
}
