import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().min(3, 'Informe o nome completo'),
  cpf: z.string().optional().or(z.literal('')),
  telefone: z.string().optional().or(z.literal('')),
  whatsapp: z.string().optional().or(z.literal('')),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  data_nascimento: z.string().optional().or(z.literal('')),
  observacoes: z.string().optional().or(z.literal('')),
})

export type ClienteFormValues = z.infer<typeof clienteSchema>
