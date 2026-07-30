import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  avaliarOrdemServico,
  createOrdemServico,
  despublicarAvaliacao,
  marcarFim,
  marcarInicio,
  publicarAvaliacao,
  removerFoto,
  updateOrdemServico,
  uploadFoto,
  uploadNotaFiscal,
} from '../api/ordensServico.api'
import type { OrdemServicoFormValues } from '../schemas/ordemServico.schema'

export function useCreateOrdemServico() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (agendamentoId: string) => createOrdemServico(agendamentoId),
    onSuccess: (_data, agendamentoId) => {
      queryClient.invalidateQueries({ queryKey: ['agendamento', agendamentoId] })
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] })
    },
  })
}

function useInvalidarOrdemServico(id: string) {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['ordemServico', id] })
}

export function useUpdateOrdemServico(id: string) {
  const invalidar = useInvalidarOrdemServico(id)
  return useMutation({
    mutationFn: (input: OrdemServicoFormValues) => updateOrdemServico(id, input),
    onSuccess: invalidar,
  })
}

export function useMarcarInicio(id: string) {
  const invalidar = useInvalidarOrdemServico(id)
  return useMutation({
    mutationFn: () => marcarInicio(id),
    onSuccess: invalidar,
  })
}

export function useMarcarFim(id: string) {
  const invalidar = useInvalidarOrdemServico(id)
  return useMutation({
    mutationFn: () => marcarFim(id),
    onSuccess: invalidar,
  })
}

export function useUploadFoto(id: string) {
  const invalidar = useInvalidarOrdemServico(id)
  return useMutation({
    mutationFn: ({ tipo, file }: { tipo: 'antes' | 'depois'; file: File }) =>
      uploadFoto(id, tipo, file),
    onSuccess: invalidar,
  })
}

export function useRemoverFoto(id: string) {
  const invalidar = useInvalidarOrdemServico(id)
  return useMutation({
    mutationFn: ({ tipo, url }: { tipo: 'antes' | 'depois'; url: string }) =>
      removerFoto(id, tipo, url),
    onSuccess: invalidar,
  })
}

export function useAvaliarOrdemServico(id: string) {
  const invalidar = useInvalidarOrdemServico(id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ avaliacao, comentario }: { avaliacao: number; comentario: string }) =>
      avaliarOrdemServico(id, avaliacao, comentario),
    onSuccess: () => {
      invalidar()
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] })
    },
  })
}

export function useUploadNotaFiscal(id: string) {
  const invalidar = useInvalidarOrdemServico(id)
  return useMutation({
    mutationFn: (file: File) => uploadNotaFiscal(id, file),
    onSuccess: invalidar,
  })
}

export function usePublicarAvaliacao(id: string) {
  const invalidar = useInvalidarOrdemServico(id)
  return useMutation({
    mutationFn: (params: {
      clienteNome: string
      servicoNome: string | null
      avaliacao: number
      comentario: string | null
    }) => publicarAvaliacao({ ordemServicoId: id, ...params }),
    onSuccess: invalidar,
  })
}

export function useDespublicarAvaliacao(id: string) {
  const invalidar = useInvalidarOrdemServico(id)
  return useMutation({
    mutationFn: () => despublicarAvaliacao(id),
    onSuccess: invalidar,
  })
}
