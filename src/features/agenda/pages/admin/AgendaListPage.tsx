import { useState } from 'react'
import { AgendamentosList } from '../../components/AgendamentosList'
import { useAgendamentosDoDia } from '../../hooks/useAgendamentosDoDia'

function toDateInputValue(date: Date) {
  const ano = date.getFullYear()
  const mes = String(date.getMonth() + 1).padStart(2, '0')
  const dia = String(date.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function addDays(dateValue: string, dias: number) {
  const [ano, mes, dia] = dateValue.split('-').map(Number)
  const date = new Date(ano, mes - 1, dia)
  date.setDate(date.getDate() + dias)
  return toDateInputValue(date)
}

function formatDataExibicao(dateValue: string) {
  const [ano, mes, dia] = dateValue.split('-')
  return `${dia}/${mes}/${ano}`
}

export function AgendaListPage() {
  const [data, setData] = useState(() => toDateInputValue(new Date()))
  const { data: agendamentos, isLoading, isError } = useAgendamentosDoDia(data)

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl text-branco-premium">Agenda</h1>

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setData((atual) => addDays(atual, -1))} className="btn-secondary">
          ← Dia anterior
        </button>
        <input
          type="date"
          value={data}
          onChange={(event) => setData(event.target.value)}
          className="field-input w-auto"
        />
        <button type="button" onClick={() => setData((atual) => addDays(atual, 1))} className="btn-secondary">
          Próximo dia →
        </button>
        <button
          type="button"
          onClick={() => setData(toDateInputValue(new Date()))}
          className="link-accent text-sm"
        >
          Hoje
        </button>
      </div>

      <p className="text-sm text-cinza-medio">{formatDataExibicao(data)}</p>

      {isLoading && <p className="text-sm text-cinza-medio">Carregando agenda...</p>}
      {isError && <p className="field-error">Não foi possível carregar a agenda.</p>}
      {agendamentos && (
        <AgendamentosList
          agendamentos={agendamentos}
          variant="admin"
          emptyMessage="Nenhum agendamento para este dia."
        />
      )}
    </div>
  )
}
