import { STATUS_LABELS, type AgendamentoStatus } from '../types'

const STATUS_STYLES: Record<AgendamentoStatus, string> = {
  solicitado: 'bg-amber-500/15 text-amber-400',
  confirmado: 'bg-dourado-principal/15 text-dourado-claro',
  em_deslocamento: 'bg-dourado-principal/15 text-dourado-claro',
  iniciado: 'bg-purple-500/15 text-purple-400',
  concluido: 'bg-green-500/15 text-green-400',
  finalizado: 'bg-green-500/15 text-green-400',
  cancelado: 'bg-red-500/15 text-red-400',
}

export function StatusBadge({ status }: { status: AgendamentoStatus }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
