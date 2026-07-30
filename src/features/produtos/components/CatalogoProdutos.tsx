import type { Produto } from '../types'

function formatPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function CatalogoProdutos({ produtos }: { produtos: Produto[] }) {
  const disponiveis = produtos.filter((produto) => produto.status === 'ativo')

  if (disponiveis.length === 0) {
    return <p className="text-sm text-cinza-medio">Nenhum produto disponível no momento.</p>
  }

  const grupos = new Map<string, Produto[]>()
  for (const produto of disponiveis) {
    const chave = produto.categoria ?? 'Outros'
    grupos.set(chave, [...(grupos.get(chave) ?? []), produto])
  }

  return (
    <div className="space-y-8">
      {[...grupos.entries()].map(([categoria, itens]) => (
        <div key={categoria}>
          <h2 className="font-display text-lg text-branco-premium">{categoria}</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {itens.map((produto) => (
              <div key={produto.id} className="card">
                {produto.foto ? (
                  <img
                    src={produto.foto}
                    alt={produto.nome}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-dourado-escuro/30 text-xs text-cinza-medio">
                    Sem foto
                  </div>
                )}
                <p className="mt-3 font-medium text-branco-premium">{produto.nome}</p>
                <p className="mt-1 font-display text-dourado-principal">
                  {formatPreco(produto.preco_venda)}
                </p>
                {produto.estoque_atual === 0 && (
                  <p className="mt-1 text-xs text-red-400">Sem estoque no momento</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-center text-xs text-cinza-medio">
        Para comprar, fale com a equipe durante o seu atendimento.
      </p>
    </div>
  )
}
