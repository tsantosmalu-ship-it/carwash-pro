import { z } from 'zod'

export const agendamentoSchema = z.object({
  veiculo_id: z.string().min(1, 'Selecione o veículo'),
  endereco_id: z.string().optional().or(z.literal('')),
  data: z.string().min(1, 'Selecione a data'),
  hora: z.string().min(1, 'Selecione o horário'),
  servico_ids: z.array(z.string()).min(1, 'Selecione ao menos um serviço'),
  observacoes: z.string().optional().or(z.literal('')),
})

export type AgendamentoFormValues = z.infer<typeof agendamentoSchema>
