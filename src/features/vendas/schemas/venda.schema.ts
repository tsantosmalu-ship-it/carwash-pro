import { z } from 'zod'

export const vendaSchema = z.object({
  produto_id: z.string().min(1, 'Selecione o produto'),
  quantidade: z
    .string()
    .min(1, 'Informe a quantidade')
    .refine((value) => /^\d+$/.test(value) && Number(value) > 0, 'Quantidade inválida'),
})

export type VendaFormValues = z.infer<typeof vendaSchema>
