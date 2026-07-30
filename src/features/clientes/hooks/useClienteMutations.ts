import { useMutation, useQueryClient } from '@tanstack/react-query'
import { arquivarCliente, createCliente, updateCliente } from '../api/clientes.api'
import type { ClienteFormValues } from '../schemas/cliente.schema'

export function useCreateCliente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ClienteFormValues) => createCliente(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    },
  })
}

export function useUpdateCliente(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ClienteFormValues) => updateCliente(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      queryClient.setQueryData(['cliente', id], data)
      queryClient.invalidateQueries({ queryKey: ['cliente', 'me'] })
    },
  })
}

export function useArquivarCliente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => arquivarCliente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    },
  })
}
