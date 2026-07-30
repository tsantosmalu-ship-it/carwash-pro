import { z } from 'zod'

const precoRegex = /^\d+([.,]\d{1,2})?$/

export const produtoSchema = z.object({
  nome: z.string().min(1, 'Informe o nome do produto'),
  categoria: z.string().optional().or(z.literal('')),
  preco_custo: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || precoRegex.test(value), 'Preço inválido'),
  preco_venda: z.string().min(1, 'Informe o preço de venda').refine((value) => precoRegex.test(value), 'Preço inválido'),
  estoque_inicial: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || /^\d+$/.test(value), 'Estoque inválido'),
})

export type ProdutoFormValues = z.infer<typeof produtoSchema>

export const entradaEstoqueSchema = z.object({
  quantidade: z.string().min(1, 'Informe a quantidade').refine((value) => /^\d+$/.test(value) && Number(value) > 0, 'Quantidade inválida'),
})

export type EntradaEstoqueFormValues = z.infer<typeof entradaEstoqueSchema>
