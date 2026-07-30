import { z } from 'zod'

export const servicoSchema = z.object({
  nome: z.string().min(1, 'Informe o nome do serviço'),
  categoria: z.string().optional().or(z.literal('')),
  descricao: z.string().optional().or(z.literal('')),
  tempo_estimado_min: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || /^\d+$/.test(value), 'Tempo inválido'),
  preco: z
    .string()
    .min(1, 'Informe o preço')
    .refine((value) => /^\d+([.,]\d{1,2})?$/.test(value), 'Preço inválido'),
  tipo_veiculo: z.enum(['carro', 'moto', 'quadriciclo', 'jet_ski'], {
    message: 'Selecione o tipo de veículo',
  }),
  itens_inclusos: z.array(z.string().min(1, 'Item não pode ficar em branco')),
})

export type ServicoFormValues = z.infer<typeof servicoSchema>
