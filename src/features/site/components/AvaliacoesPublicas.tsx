import { useAvaliacoesPublicas } from '../hooks/useAvaliacoesPublicas'

export function AvaliacoesPublicas() {
  const { data: avaliacoes, isLoading } = useAvaliacoesPublicas()

  if (isLoading || !avaliacoes || avaliacoes.length === 0) return null

  return (
    <div className="card">
      <h2 className="font-display text-lg text-branco-premium">O que dizem nossos clientes</h2>
      <div className="mt-3 space-y-3">
        {avaliacoes.map((avaliacao) => (
          <div key={avaliacao.id} className="rounded-lg border border-dourado-escuro/20 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-branco-premium">{avaliacao.cliente_nome}</p>
              <span className="text-sm text-dourado-principal">{'★'.repeat(avaliacao.avaliacao)}</span>
            </div>
            {avaliacao.servico_nome && (
              <p className="mt-0.5 text-xs text-cinza-medio">{avaliacao.servico_nome}</p>
            )}
            {avaliacao.comentario && (
              <p className="mt-2 text-sm text-cinza-medio">"{avaliacao.comentario}"</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
