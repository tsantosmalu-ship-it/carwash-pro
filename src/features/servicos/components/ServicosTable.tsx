import { Link } from 'react-router-dom'
import { TIPO_VEICULO_LABELS } from '../types'
import type { Servico } from '../types'

function formatPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ServicosTable({ servicos }: { servicos: Servico[] }) {
  if (servicos.length === 0) {
    return <p className="text-sm text-cinza-medio">Nenhum serviço encontrado.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-dourado-escuro/20">
      <table className="min-w-full divide-y divide-dourado-escuro/10 text-sm">
        <thead className="bg-preto-card">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Nome</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Categoria</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Veículo</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Preço</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Tempo estimado</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dourado-escuro/10">
          {servicos.map((servico) => (
            <tr key={servico.id} className="hover:bg-white/5">
              <td className="px-4 py-3">
                <Link to={`/admin/servicos/${servico.id}`} className="link-accent">
                  {servico.nome}
                </Link>
              </td>
              <td className="px-4 py-3 text-cinza-medio">{servico.categoria ?? '—'}</td>
              <td className="px-4 py-3 text-cinza-medio">
                {servico.tipo_veiculo ? TIPO_VEICULO_LABELS[servico.tipo_veiculo] : '—'}
              </td>
              <td className="px-4 py-3 font-semibold text-dourado-principal">
                {formatPreco(servico.preco)}
              </td>
              <td className="px-4 py-3 text-cinza-medio">
                {servico.tempo_estimado_min ? `${servico.tempo_estimado_min} min` : '—'}
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    servico.status === 'ativo'
                      ? 'rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-400'
                      : 'rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-cinza-medio'
                  }
                >
                  {servico.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
