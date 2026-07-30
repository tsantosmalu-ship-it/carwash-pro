import { z } from 'zod'

export const veiculoSchema = z.object({
  tipo_veiculo: z.enum(['carro', 'moto', 'quadriciclo', 'jet_ski'], {
    message: 'Selecione o tipo de veículo',
  }),
  marca: z.string().min(1, 'Informe a marca'),
  modelo: z.string().min(1, 'Informe o modelo'),
  cor: z.string().optional().or(z.literal('')),
  placa: z.string().optional().or(z.literal('')),
  tipo_pintura: z.string().optional().or(z.literal('')),
  observacoes: z.string().optional().or(z.literal('')),
})

export type VeiculoFormValues = z.infer<typeof veiculoSchema>
