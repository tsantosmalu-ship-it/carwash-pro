import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { OrdemServicoForm } from '../../components/OrdemServicoForm'
import { FotoUploader } from '../../components/FotoUploader'
import { NotaFiscalUploader } from '../../components/NotaFiscalUploader'
import { useOrdemServico } from '../../hooks/useOrdemServico'
import {
  useDespublicarAvaliacao,
  useMarcarFim,
  useMarcarInicio,
  usePublicarAvaliacao,
  useUpdateOrdemServico,
} from '../../hooks/useOrdemServicoMutations'
import { VendasList } from '@/features/vendas/components/VendasList'
import { VendaProdutoForm } from '@/features/vendas/components/VendaProdutoForm'
import { useVendasPorOrdemServico } from '@/features/vendas/hooks/useVendasPorOrdemServico'
import { useCreateVenda } from '@/features/vendas/hooks/useVendaMutations'
import { useProdutos } from '@/features/produtos/hooks/useProdutos'
import { getErrorMessage } from '@/shared/lib/errors'
import type { OrdemServicoFormValues } from '../../schemas/ordemServico.schema'
import type { VendaFormValues } from '@/features/vendas/schemas/venda.schema'

function formatDataHora(dateValue: string, hora: string) {
  const [ano, mes, dia] = dateValue.split('-')
  return `${dia}/${mes}/${ano} às ${hora.slice(0, 5)}`
}

function formatHorario(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function OrdemServicoPage() {
  const { id } = useParams<{ id: string }>()
  const { data: ordemServico, isLoading, isError } = useOrdemServico(id)
  const updateMutation = useUpdateOrdemServico(id ?? '')
  const inicioMutation = useMarcarInicio(id ?? '')
  const fimMutation = useMarcarFim(id ?? '')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: vendas } = useVendasPorOrdemServico(id)
  const { data: produtos } = useProdutos('')
  const produtosAtivos = (produtos ?? []).filter((produto) => produto.status === 'ativo')
  const createVendaMutation = useCreateVenda(id ?? '')
  const [vendaErrorMessage, setVendaErrorMessage] = useState<string | null>(null)

  const publicarMutation = usePublicarAvaliacao(id ?? '')
  const despublicarMutation = useDespublicarAvaliacao(id ?? '')
  const [avaliacaoErrorMessage, setAvaliacaoErrorMessage] = useState<string | null>(null)

  async function handlePublicarAvaliacao() {
    if (!ordemServico?.avaliacao || !ordemServico.agendamentos) return
    setAvaliacaoErrorMessage(null)
    try {
      await publicarMutation.mutateAsync({
        clienteNome: ordemServico.agendamentos.clientes?.nome ?? 'Cliente',
        servicoNome:
          ordemServico.agendamentos.agendamento_servicos.map((item) => item.servicos?.nome).join(', ') ||
          null,
        avaliacao: ordemServico.avaliacao,
        comentario: ordemServico.comentario_avaliacao,
      })
    } catch (error) {
      setAvaliacaoErrorMessage(getErrorMessage(error))
    }
  }

  async function handleDespublicarAvaliacao() {
    setAvaliacaoErrorMessage(null)
    try {
      await despublicarMutation.mutateAsync()
    } catch (error) {
      setAvaliacaoErrorMessage(getErrorMessage(error))
    }
  }

  async function handleSubmit(values: OrdemServicoFormValues) {
    setErrorMessage(null)
    try {
      await updateMutation.mutateAsync(values)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleVenderProduto(values: VendaFormValues) {
    if (!ordemServico?.agendamentos) return
    setVendaErrorMessage(null)
    try {
      await createVendaMutation.mutateAsync({
        clienteId: ordemServico.agendamentos.cliente_id,
        produtoId: values.produto_id,
        quantidade: Number(values.quantidade),
        precoUnitario:
          produtosAtivos.find((produto) => produto.id === values.produto_id)?.preco_venda ?? 0,
      })
    } catch (error) {
      setVendaErrorMessage(getErrorMessage(error))
    }
  }

  if (isLoading) return <p className="text-sm text-cinza-medio">Carregando ordem de serviço...</p>
  if (isError || !ordemServico) {
    return <p className="field-error">Ordem de serviço não encontrada.</p>
  }

  const agendamento = ordemServico.agendamentos

  return (
    <div className="max-w-xl space-y-6">
      <Link to="/admin/agenda" className="link-accent text-sm">
        ← Voltar para agenda
      </Link>

      <div className="card">
        <h1 className="font-display text-xl text-branco-premium">Ordem de Serviço</h1>
        {agendamento && (
          <div className="mt-1 text-sm text-cinza-medio">
            <p>{formatDataHora(agendamento.data, agendamento.hora)}</p>
            <p>
              {agendamento.clientes?.nome} •{' '}
              {agendamento.veiculos
                ? `${agendamento.veiculos.marca} ${agendamento.veiculos.modelo}`
                : 'Veículo não encontrado'}
            </p>
            <p>
              {agendamento.agendamento_servicos.map((item) => item.servicos?.nome).join(', ')}
            </p>
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => inicioMutation.mutate()}
            disabled={!!ordemServico.hora_inicio || inicioMutation.isPending}
            className="btn-secondary flex-1"
          >
            Início: {formatHorario(ordemServico.hora_inicio)}
          </button>
          <button
            type="button"
            onClick={() => fimMutation.mutate()}
            disabled={!ordemServico.hora_inicio || !!ordemServico.hora_fim || fimMutation.isPending}
            className="btn-secondary flex-1"
          >
            Fim: {formatHorario(ordemServico.hora_fim)}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <FotoUploader
            ordemServicoId={ordemServico.id}
            tipo="antes"
            titulo="Fotos antes"
            fotos={ordemServico.fotos_antes ?? []}
          />
          <FotoUploader
            ordemServicoId={ordemServico.id}
            tipo="depois"
            titulo="Fotos depois"
            fotos={ordemServico.fotos_depois ?? []}
          />
        </div>

        <div className="mt-6">
          <p className="field-label">Produtos vendidos</p>
          <div className="mt-2 space-y-3 rounded-lg border border-dourado-escuro/20 p-3">
            <VendasList vendas={vendas ?? []} />
            <VendaProdutoForm
              produtos={produtosAtivos}
              submitting={createVendaMutation.isPending}
              errorMessage={vendaErrorMessage}
              onSubmit={handleVenderProduto}
            />
          </div>
        </div>

        <div className="mt-6">
          <NotaFiscalUploader ordemServicoId={ordemServico.id} notaFiscalUrl={ordemServico.nota_fiscal_url} />
        </div>

        <div className="mt-6">
          <OrdemServicoForm
            ordemServico={ordemServico}
            submitting={updateMutation.isPending}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
          />
        </div>

        {ordemServico.avaliacao && (
          <div className="mt-6 rounded-lg border border-dourado-escuro/20 p-4">
            <p className="text-sm text-branco-premium">
              Avaliação do cliente: <span className="text-dourado-principal">{ordemServico.avaliacao} / 5</span>
            </p>
            {ordemServico.comentario_avaliacao && (
              <p className="mt-1 text-sm text-cinza-medio">"{ordemServico.comentario_avaliacao}"</p>
            )}

            <div className="mt-3">
              {ordemServico.avaliacao_aprovada ? (
                <button
                  type="button"
                  onClick={handleDespublicarAvaliacao}
                  disabled={despublicarMutation.isPending}
                  className="btn-danger-text"
                >
                  Remover da vitrine pública
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublicarAvaliacao}
                  disabled={publicarMutation.isPending}
                  className="btn-secondary"
                >
                  {publicarMutation.isPending ? 'Publicando...' : 'Aprovar e publicar na vitrine'}
                </button>
              )}
              {avaliacaoErrorMessage && <p className="field-error mt-2">{avaliacaoErrorMessage}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
