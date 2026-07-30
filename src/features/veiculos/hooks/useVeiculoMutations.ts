import { useMutation, useQueryClient } from '@tanstack/react-query'
import { arquivarVeiculo, createVeiculo, updateVeiculo } from '../api/veiculos.api'
import type { VeiculoFormValues } from '../schemas/veiculo.schema'

export function useCreateVeiculo(clienteId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: VeiculoFormValues) => createVeiculo(clienteId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veiculos', clienteId] })
    },
  })
}

export function useUpdateVeiculo(clienteId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: VeiculoFormValues }) =>
      updateVeiculo(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veiculos', clienteId] })
    },
  })
}

export function useArquivarVeiculo(clienteId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => arquivarVeiculo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veiculos', clienteId] })
    },
  })
}
