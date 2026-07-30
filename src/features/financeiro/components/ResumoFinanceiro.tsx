import type { FinanceiroLancamento } from '../types'

function formatPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ResumoFinanceiro({ lancamentos }: { lancamentos: FinanceiroLancamento[] }) {
  const totalReceitas = lancamentos
    .filter((item) => item.tipo === 'receita')
    .reduce((soma, item) => soma + item.valor, 0)
  const totalDespesas = lancamentos
    .filter((item) => item.tipo === 'despesa')
    .reduce((soma, item) => soma + item.valor, 0)
  const saldo = totalReceitas - totalDespesas

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border border-dourado-escuro/20 bg-preto-card p-4">
        <p className="text-sm text-cinza-medio">Entradas</p>
        <p className="mt-1 font-display text-lg text-green-400">{formatPreco(totalReceitas)}</p>
      </div>
      <div className="rounded-xl border border-dourado-escuro/20 bg-preto-card p-4">
        <p className="text-sm text-cinza-medio">Saídas</p>
        <p className="mt-1 font-display text-lg text-red-400">{formatPreco(totalDespesas)}</p>
      </div>
      <div className="rounded-xl border border-dourado-escuro/20 bg-preto-card p-4">
        <p className="text-sm text-cinza-medio">Saldo</p>
        <p className={`mt-1 font-display text-lg ${saldo >= 0 ? 'text-dourado-principal' : 'text-red-400'}`}>
          {formatPreco(saldo)}
        </p>
      </div>
    </div>
  )
}
