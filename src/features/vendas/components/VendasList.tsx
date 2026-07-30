import type { VendaDetalhada } from '../types'

function formatPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function VendasList({ vendas }: { vendas: VendaDetalhada[] }) {
  if (vendas.length === 0) {
    return <p className="text-sm text-cinza-medio">Nenhum produto vendido neste atendimento.</p>
  }

  return (
    <ul className="space-y-1 text-sm">
      {vendas.map((venda) => (
        <li key={venda.id} className="flex justify-between text-branco-premium">
          <span>
            {venda.quantidade}x {venda.produtos?.nome ?? 'Produto removido'}
          </span>
          <span className="text-dourado-principal">{formatPreco(venda.preco_unitario * venda.quantidade)}</span>
        </li>
      ))}
    </ul>
  )
}
