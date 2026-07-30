import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getConteudo, updateConteudo } from '../api/conteudoSite.api'

export function useConteudoSite(chave: string) {
  return useQuery({
    queryKey: ['conteudoSite', chave],
    queryFn: () => getConteudo(chave),
  })
}

export function useUpdateConteudoSite(chave: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (valor: string) => updateConteudo(chave, valor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conteudoSite', chave] })
    },
  })
}
