import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServico, setServicoStatus, updateServico } from '../api/servicos.api'
import type { ServicoFormValues } from '../schemas/servico.schema'
import type { ServicoStatus } from '../types'

export function useCreateServico() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ServicoFormValues) => createServico(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] })
    },
  })
}

export function useUpdateServico(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ServicoFormValues) => updateServico(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] })
      queryClient.setQueryData(['servico', id], data)
    },
  })
}

export function useSetServicoStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ServicoStatus }) =>
      setServicoStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] })
      queryClient.invalidateQueries({ queryKey: ['servico', variables.id] })
    },
  })
}
