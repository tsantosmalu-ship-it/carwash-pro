import { z } from 'zod'

export const ordemServicoSchema = z.object({
  checklist: z.record(z.string(), z.boolean()),
  valor_final: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || /^\d+([.,]\d{1,2})?$/.test(value), 'Valor inválido'),
  forma_pagamento: z.enum(['pix', 'dinheiro', 'cartao', 'transferencia']).optional().or(z.literal('')),
  observacoes: z.string().optional().or(z.literal('')),
})

export type OrdemServicoFormValues = z.infer<typeof ordemServicoSchema>

export const avaliacaoSchema = z.object({
  avaliacao: z.number().min(1).max(5),
})

export type AvaliacaoFormValues = z.infer<typeof avaliacaoSchema>
