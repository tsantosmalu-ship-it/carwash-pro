import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { criarDestaque, listDestaques, removerDestaque } from '../api/galeriaDestaques.api'

export function useGaleriaDestaques() {
  return useQuery({
    queryKey: ['galeriaDestaques'],
    queryFn: listDestaques,
  })
}

export function useCriarDestaque() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ file, legenda }: { file: File; legenda: string }) => criarDestaque(file, legenda),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galeriaDestaques'] })
    },
  })
}

export function useRemoverDestaque() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => removerDestaque(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galeriaDestaques'] })
    },
  })
}
