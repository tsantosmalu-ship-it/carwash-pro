import { useMeuCliente } from '@/features/clientes/hooks/useMeuCliente'
import { useVeiculos } from '@/features/veiculos/hooks/useVeiculos'
import { useMeusAgendamentos } from '@/features/agenda/hooks/useMeusAgendamentos'
import { AgendamentosList } from '@/features/agenda/components/AgendamentosList'
import type { AgendamentoDetalhado } from '@/features/agenda/types'

const STATUS_CONCLUIDOS = ['concluido', 'finalizado']

function diasDesde(dataStr: string) {
  const [ano, mes, dia] = dataStr.split('-').map(Number)
  const data = new Date(ano, mes - 1, dia)
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  data.setHours(0, 0, 0, 0)
  return Math.round((hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24))
}

function formatVeiculo(veiculo: { marca: string; modelo: string; ano: number | null; placa: string | null }) {
  const partes = [`${veiculo.marca} ${veiculo.modelo}`, veiculo.ano ? String(veiculo.ano) : null, veiculo.placa]
  return partes.filter(Boolean).join(' • ')
}

function formatUltimaLavagem(historico: AgendamentoDetalhado[]) {
  const concluidos = historico.filter((item) => STATUS_CONCLUIDOS.includes(item.status))
  if (concluidos.length === 0) return 'Nenhum atendimento concluído ainda'

  const dias = diasDesde(concluidos[0].data)
  if (dias === 0) return 'Última lavagem hoje'
  if (dias === 1) return 'Última lavagem ontem'
  return `Última lavagem há ${dias} dias`
}

export function GaragemPage() {
  const { data: cliente } = useMeuCliente()
  const { data: veiculos, isLoading: veiculosLoading } = useVeiculos(cliente?.id)
  const { data: agendamentos, isLoading: agendamentosLoading } = useMeusAgendamentos(cliente?.id)

  const carregando = veiculosLoading || agendamentosLoading

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl text-branco-premium">Minha Garagem</h1>

      {carregando && <p className="text-sm text-cinza-medio">Carregando garagem...</p>}

      {!carregando && veiculos && veiculos.length === 0 && (
        <p className="text-sm text-cinza-medio">
          Você ainda não cadastrou nenhum veículo. Adicione um em "Meus dados e veículos".
        </p>
      )}

      {!carregando &&
        veiculos?.map((veiculo) => {
          const historico = (agendamentos ?? []).filter((item) => item.veiculo_id === veiculo.id)

          return (
            <div key={veiculo.id} className="card">
              <p className="font-medium text-branco-premium">{formatVeiculo(veiculo)}</p>
              <p className="mt-1 text-sm text-dourado-claro">{formatUltimaLavagem(historico)}</p>

              <div className="mt-4">
                <p className="field-label mb-2">Histórico de atendimentos</p>
                <AgendamentosList
                  agendamentos={historico}
                  variant="cliente"
                  emptyMessage="Nenhum atendimento registrado ainda para este veículo."
                />
              </div>
            </div>
          )
        })}
    </div>
  )
}
