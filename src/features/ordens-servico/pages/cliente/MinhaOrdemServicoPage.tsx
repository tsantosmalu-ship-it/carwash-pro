import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AvaliacaoForm } from '../../components/AvaliacaoForm'
import { useOrdemServico } from '../../hooks/useOrdemServico'
import { getNotaFiscalSignedUrl } from '../../api/ordensServico.api'
import { CHECKLIST_ITEMS, FORMA_PAGAMENTO_LABELS } from '../../types'
import { VendasList } from '@/features/vendas/components/VendasList'
import { useVendasPorOrdemServico } from '@/features/vendas/hooks/useVendasPorOrdemServico'
import { getErrorMessage } from '@/shared/lib/errors'

function formatDataHora(dateValue: string, hora: string) {
  const [ano, mes, dia] = dateValue.split('-')
  return `${dia}/${mes}/${ano} às ${hora.slice(0, 5)}`
}

function formatPreco(preco: number | null) {
  if (preco === null) return '—'
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function MinhaOrdemServicoPage() {
  const { id } = useParams<{ id: string }>()
  const { data: ordemServico, isLoading, isError } = useOrdemServico(id)
  const { data: vendas } = useVendasPorOrdemServico(id)
  const [baixando, setBaixando] = useState(false)
  const [downloadErro, setDownloadErro] = useState<string | null>(null)

  async function handleBaixarNotaFiscal() {
    if (!ordemServico?.nota_fiscal_url) return
    setBaixando(true)
    setDownloadErro(null)
    try {
      const signedUrl = await getNotaFiscalSignedUrl(ordemServico.nota_fiscal_url)
      window.open(signedUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      setDownloadErro(getErrorMessage(error))
    } finally {
      setBaixando(false)
    }
  }

  if (isLoading) return <p className="text-sm text-cinza-medio">Carregando...</p>
  if (isError || !ordemServico) {
    return <p className="field-error">Ordem de serviço não encontrada.</p>
  }

  const agendamento = ordemServico.agendamentos
  const itensFeitos = CHECKLIST_ITEMS.filter((item) => ordemServico.checklist?.[item.key])
  const fotosAntes = ordemServico.fotos_antes ?? []
  const fotosDepois = ordemServico.fotos_depois ?? []

  return (
    <div className="space-y-6">
      <Link to="/agendamentos" className="link-accent text-sm">
        ← Voltar para meus agendamentos
      </Link>

      <div className="card">
        <h1 className="font-display text-xl text-branco-premium">Ordem de Serviço</h1>
        {agendamento && (
          <p className="mt-1 text-sm text-cinza-medio">
            {formatDataHora(agendamento.data, agendamento.hora)} •{' '}
            {agendamento.veiculos
              ? `${agendamento.veiculos.marca} ${agendamento.veiculos.modelo}`
              : 'Veículo não encontrado'}
          </p>
        )}

        {(fotosAntes.length > 0 || fotosDepois.length > 0) && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="field-label">Antes</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {fotosAntes.map((foto) => (
                  <img key={foto} src={foto} alt="Antes" className="aspect-square rounded-lg object-cover" />
                ))}
              </div>
            </div>
            <div>
              <p className="field-label">Depois</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {fotosDepois.map((foto) => (
                  <img key={foto} src={foto} alt="Depois" className="aspect-square rounded-lg object-cover" />
                ))}
              </div>
            </div>
          </div>
        )}

        {itensFeitos.length > 0 && (
          <div className="mt-6">
            <p className="field-label">O que foi feito</p>
            <ul className="mt-1 list-inside list-disc text-sm text-cinza-medio">
              {itensFeitos.map((item) => (
                <li key={item.key}>{item.label}</li>
              ))}
            </ul>
          </div>
        )}

        {vendas && vendas.length > 0 && (
          <div className="mt-6">
            <p className="field-label">Produtos</p>
            <div className="mt-1">
              <VendasList vendas={vendas} />
            </div>
          </div>
        )}

        <div className="mt-6 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-cinza-medio">Valor final</span>
            <span className="font-semibold text-dourado-principal">{formatPreco(ordemServico.valor_final)}</span>
          </div>
          {ordemServico.forma_pagamento && (
            <div className="flex justify-between">
              <span className="text-cinza-medio">Forma de pagamento</span>
              <span className="font-medium text-branco-premium">
                {FORMA_PAGAMENTO_LABELS[ordemServico.forma_pagamento]}
              </span>
            </div>
          )}
        </div>

        {ordemServico.nota_fiscal_url && (
          <div className="mt-6">
            <button type="button" onClick={handleBaixarNotaFiscal} disabled={baixando} className="btn-secondary">
              {baixando ? 'Abrindo...' : 'Baixar nota fiscal'}
            </button>
            {downloadErro && <p className="field-error mt-2">{downloadErro}</p>}
          </div>
        )}

        <div className="mt-6 border-t border-dourado-escuro/20 pt-6">
          {ordemServico.avaliacao ? (
            <div>
              <p className="text-sm text-cinza-medio">Sua avaliação: {ordemServico.avaliacao} / 5</p>
              {ordemServico.comentario_avaliacao && (
                <p className="mt-1 text-sm text-cinza-medio">"{ordemServico.comentario_avaliacao}"</p>
              )}
            </div>
          ) : (
            <AvaliacaoForm ordemServicoId={ordemServico.id} />
          )}
        </div>
      </div>
    </div>
  )
}
