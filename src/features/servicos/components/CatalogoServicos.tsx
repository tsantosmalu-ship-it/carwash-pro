import { TIPO_VEICULO_LABELS, TIPO_VEICULO_OPTIONS } from '../types'
import type { Servico } from '../types'

function formatPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function CatalogoServicos({ servicos }: { servicos: Servico[] }) {
  const disponiveis = servicos.filter((servico) => servico.status === 'ativo' && servico.tipo_veiculo)

  if (disponiveis.length === 0) {
    return (
      <p className="text-sm text-cinza-medio">Nenhum pacote disponível no momento.</p>
    )
  }

  return (
    <div className="space-y-8">
      {TIPO_VEICULO_OPTIONS.map((tipo) => {
        const servicosDoTipo = disponiveis.filter((servico) => servico.tipo_veiculo === tipo)
        if (servicosDoTipo.length === 0) return null

        return (
          <div key={tipo}>
            <h2 className="font-display text-lg text-branco-premium">{TIPO_VEICULO_LABELS[tipo]}</h2>
            <div className="mt-3 space-y-3">
              {servicosDoTipo.map((servico) => (
                <div key={servico.id} className="card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-branco-premium">{servico.nome}</p>
                      {servico.categoria && (
                        <p className="mt-0.5 text-xs text-cinza-medio">{servico.categoria}</p>
                      )}
                    </div>
                    <span className="shrink-0 font-display text-lg text-dourado-principal">
                      {formatPreco(servico.preco)}
                    </span>
                  </div>

                  {servico.descricao && (
                    <p className="mt-2 text-sm text-cinza-medio">{servico.descricao}</p>
                  )}

                  {servico.itens_inclusos.length > 0 && (
                    <ul className="mt-3 list-inside list-disc space-y-0.5 text-sm text-cinza-medio">
                      {servico.itens_inclusos.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {servico.tempo_estimado_min && (
                    <p className="mt-3 text-xs text-cinza-medio">
                      Duração estimada: {servico.tempo_estimado_min} min
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
