import { Link } from 'react-router-dom'
import type { Produto } from '../types'

function formatPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ProdutosTable({ produtos }: { produtos: Produto[] }) {
  if (produtos.length === 0) {
    return <p className="text-sm text-cinza-medio">Nenhum produto encontrado.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-dourado-escuro/20">
      <table className="min-w-full divide-y divide-dourado-escuro/10 text-sm">
        <thead className="bg-preto-card">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Nome</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Categoria</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Preço</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Estoque</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dourado-escuro/10">
          {produtos.map((produto) => (
            <tr key={produto.id} className="hover:bg-white/5">
              <td className="px-4 py-3">
                <Link to={`/admin/produtos/${produto.id}`} className="link-accent">
                  {produto.nome}
                </Link>
              </td>
              <td className="px-4 py-3 text-cinza-medio">{produto.categoria ?? '—'}</td>
              <td className="px-4 py-3 font-semibold text-dourado-principal">
                {formatPreco(produto.preco_venda)}
              </td>
              <td className="px-4 py-3">
                <span className={produto.estoque_atual > 0 ? 'text-cinza-medio' : 'font-medium text-red-400'}>
                  {produto.estoque_atual}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    produto.status === 'ativo'
                      ? 'rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-400'
                      : 'rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-cinza-medio'
                  }
                >
                  {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
