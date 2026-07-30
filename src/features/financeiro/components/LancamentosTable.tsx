import { ORIGEM_LABELS, type FinanceiroLancamento } from '../types'

function formatPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatData(dateValue: string) {
  const [ano, mes, dia] = dateValue.split('-')
  return `${dia}/${mes}/${ano}`
}

export function LancamentosTable({ lancamentos }: { lancamentos: FinanceiroLancamento[] }) {
  if (lancamentos.length === 0) {
    return <p className="text-sm text-cinza-medio">Nenhum lançamento ainda.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-dourado-escuro/20">
      <table className="min-w-full divide-y divide-dourado-escuro/10 text-sm">
        <thead className="bg-preto-card">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Data</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Categoria</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Origem</th>
            <th className="px-4 py-3 text-right font-medium text-cinza-medio">Valor</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dourado-escuro/10">
          {lancamentos.map((item) => (
            <tr key={item.id} className="hover:bg-white/5">
              <td className="px-4 py-3 text-cinza-medio">{formatData(item.data)}</td>
              <td className="px-4 py-3 text-cinza-medio">{item.categoria ?? '—'}</td>
              <td className="px-4 py-3 text-cinza-medio">
                {item.origem ? ORIGEM_LABELS[item.origem] : '—'}
              </td>
              <td
                className={`px-4 py-3 text-right font-medium ${
                  item.tipo === 'receita' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {item.tipo === 'receita' ? '+' : '-'} {formatPreco(item.valor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
