import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AgendamentoForm } from '../../components/AgendamentoForm'
import { useCreateAgendamento } from '../../hooks/useAgendamentoMutations'
import { useMeuCliente } from '@/features/clientes/hooks/useMeuCliente'
import { useVeiculos } from '@/features/veiculos/hooks/useVeiculos'
import { useEnderecos } from '@/features/clientes/hooks/useEnderecos'
import { useServicos } from '@/features/servicos/hooks/useServicos'
import { getErrorMessage } from '@/shared/lib/errors'
import type { AgendamentoFormValues } from '../../schemas/agendamento.schema'

export function NovoAgendamentoPage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: cliente } = useMeuCliente()
  const { data: veiculos, isLoading: veiculosLoading } = useVeiculos(cliente?.id)
  const { data: enderecos, isLoading: enderecosLoading } = useEnderecos(cliente?.id)
  const { data: servicos, isLoading: servicosLoading } = useServicos('')
  const createMutation = useCreateAgendamento(cliente?.id ?? '')

  const servicosAtivos = (servicos ?? []).filter((servico) => servico.status === 'ativo')

  async function handleSubmit(values: AgendamentoFormValues) {
    setErrorMessage(null)
    const servicosSelecionados = servicosAtivos
      .filter((servico) => values.servico_ids.includes(servico.id))
      .map((servico) => ({ id: servico.id, preco: servico.preco }))

    try {
      await createMutation.mutateAsync({ input: values, servicosSelecionados })
      navigate('/agendamentos', { replace: true })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const carregando = veiculosLoading || enderecosLoading || servicosLoading

  return (
    <div className="max-w-xl space-y-6">
      <Link to="/agendamentos" className="link-accent text-sm">
        ← Voltar para meus agendamentos
      </Link>

      <div className="card">
        <h1 className="font-display text-xl text-branco-premium">Novo agendamento</h1>

        {carregando && <p className="mt-4 text-sm text-cinza-medio">Carregando...</p>}

        {!carregando && veiculos && veiculos.length === 0 && (
          <p className="mt-4 text-sm text-cinza-medio">
            Cadastre um veículo antes de agendar um atendimento.
          </p>
        )}

        {!carregando && veiculos && veiculos.length > 0 && (
          <div className="mt-6">
            <AgendamentoForm
              veiculos={veiculos}
              enderecos={enderecos ?? []}
              servicos={servicosAtivos}
              submitting={createMutation.isPending}
              errorMessage={errorMessage}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </div>
  )
}
