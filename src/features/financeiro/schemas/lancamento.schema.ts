import { z } from 'zod'

export const lancamentoSchema = z.object({
  tipo: z.enum(['receita', 'despesa']),
  categoria: z.string().optional().or(z.literal('')),
  valor: z
    .string()
    .min(1, 'Informe o valor')
    .refine((value) => /^\d+([.,]\d{1,2})?$/.test(value), 'Valor inválido'),
  data: z.string().min(1, 'Selecione a data'),
  observacoes: z.string().optional().or(z.literal('')),
})

export type LancamentoFormValues = z.infer<typeof lancamentoSchema>
