import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLancamentoManual } from '../api/financeiro.api'
import type { LancamentoFormValues } from '../schemas/lancamento.schema'

export function useCreateLancamentoManual() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: LancamentoFormValues) => createLancamentoManual(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeiro', 'lancamentos'] })
    },
  })
}
