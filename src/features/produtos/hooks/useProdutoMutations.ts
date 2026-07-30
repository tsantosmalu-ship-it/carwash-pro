import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createProduto,
  registrarEntradaEstoque,
  setProdutoStatus,
  updateProduto,
  uploadFotoProduto,
} from '../api/produtos.api'
import type { EntradaEstoqueFormValues, ProdutoFormValues } from '../schemas/produto.schema'
import type { ProdutoStatus } from '../types'

export function useCreateProduto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProdutoFormValues) => createProduto(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
    },
  })
}

function useInvalidarProduto(id: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['produtos'] })
    queryClient.invalidateQueries({ queryKey: ['produto', id] })
  }
}

export function useUpdateProduto(id: string) {
  const invalidar = useInvalidarProduto(id)
  return useMutation({
    mutationFn: (input: ProdutoFormValues) => updateProduto(id, input),
    onSuccess: invalidar,
  })
}

export function useRegistrarEntradaEstoque(id: string) {
  const invalidar = useInvalidarProduto(id)
  return useMutation({
    mutationFn: (input: EntradaEstoqueFormValues) => registrarEntradaEstoque(id, input),
    onSuccess: invalidar,
  })
}

export function useSetProdutoStatus(id: string) {
  const invalidar = useInvalidarProduto(id)
  return useMutation({
    mutationFn: (status: ProdutoStatus) => setProdutoStatus(id, status),
    onSuccess: invalidar,
  })
}

export function useUploadFotoProduto(id: string) {
  const invalidar = useInvalidarProduto(id)
  return useMutation({
    mutationFn: (file: File) => uploadFotoProduto(id, file),
    onSuccess: invalidar,
  })
}
