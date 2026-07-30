import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createEndereco,
  deleteEndereco,
  setEnderecoFavorito,
  updateEndereco,
} from '../api/enderecos.api'
import type { EnderecoFormValues } from '../schemas/endereco.schema'

export function useCreateEndereco(clienteId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: EnderecoFormValues) => createEndereco(clienteId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enderecos', clienteId] })
    },
  })
}

export function useUpdateEndereco(clienteId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: EnderecoFormValues }) =>
      updateEndereco(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enderecos', clienteId] })
    },
  })
}

export function useDeleteEndereco(clienteId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteEndereco(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enderecos', clienteId] })
    },
  })
}

export function useSetEnderecoFavorito(clienteId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => setEnderecoFavorito(id, clienteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enderecos', clienteId] })
    },
  })
}
