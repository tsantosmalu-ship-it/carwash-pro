import { Link } from 'react-router-dom'
import { AgendamentosList } from '../../components/AgendamentosList'
import { useMeuCliente } from '@/features/clientes/hooks/useMeuCliente'
import { useMeusAgendamentos } from '../../hooks/useMeusAgendamentos'

export function MeusAgendamentosPage() {
  const { data: cliente } = useMeuCliente()
  const { data: agendamentos, isLoading, isError } = useMeusAgendamentos(cliente?.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl text-branco-premium">Meus Agendamentos</h1>
        <Link to="/agendar" className="btn-primary">
          + Novo agendamento
        </Link>
      </div>

      {isLoading && <p className="text-sm text-cinza-medio">Carregando agendamentos...</p>}
      {isError && <p className="field-error">Não foi possível carregar seus agendamentos.</p>}
      {agendamentos && (
        <AgendamentosList
          agendamentos={agendamentos}
          variant="cliente"
          emptyMessage="Você ainda não tem agendamentos."
        />
      )}
    </div>
  )
}
