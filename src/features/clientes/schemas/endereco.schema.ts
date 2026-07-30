import { z } from 'zod'

export const enderecoSchema = z.object({
  nome: z.string().min(1, 'Dê um nome para o endereço (ex: Casa, Trabalho)'),
  cep: z.string().optional().or(z.literal('')),
  rua: z.string().optional().or(z.literal('')),
  numero: z.string().optional().or(z.literal('')),
  complemento: z.string().optional().or(z.literal('')),
  bairro: z.string().optional().or(z.literal('')),
  cidade: z.string().optional().or(z.literal('')),
  estado: z.string().optional().or(z.literal('')),
  referencia: z.string().optional().or(z.literal('')),
})

export type EnderecoFormValues = z.infer<typeof enderecoSchema>
