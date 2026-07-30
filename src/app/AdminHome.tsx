import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLancamentos } from '@/features/financeiro/hooks/useLancamentos'
import { useAgendamentosDoDia } from '@/features/agenda/hooks/useAgendamentosDoDia'
import { useProdutos } from '@/features/produtos/hooks/useProdutos'
import { GraficoFaturamento7Dias } from '@/features/dashboard/components/GraficoFaturamento7Dias'
import { Link } from 'react-router-dom'

const LIMITE_ESTOQUE_BAIXO = 5

function hoje() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function ultimosNDias(n: number) {
  const dias: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dias.push(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    )
  }
  return dias
}

function formatPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function AdminHome() {
  const { user } = useAuth()
  const dataHoje = hoje()
  const mesAtual = dataHoje.slice(0, 7)

  const { data: lancamentos } = useLancamentos()
  const { data: agendamentosHoje } = useAgendamentosDoDia(dataHoje)
  const { data: produtos } = useProdutos('')

  const receitas = (lancamentos ?? []).filter((item) => item.tipo === 'receita')
  const faturamentoDia = receitas.filter((item) => item.data === dataHoje).reduce((soma, item) => soma + item.valor, 0)
  const faturamentoMes = receitas
    .filter((item) => item.data.startsWith(mesAtual))
    .reduce((soma, item) => soma + item.valor, 0)

  const agendamentosAtivosHoje = (agendamentosHoje ?? []).filter((item) => item.status !== 'cancelado')

  const produtosEstoqueBaixo = (produtos ?? []).filter(
    (produto) => produto.status === 'ativo' && produto.estoque_atual <= LIMITE_ESTOQUE_BAIXO,
  )

  const pontosGrafico = ultimosNDias(7).map((data) => ({
    data,
    valor: receitas.filter((item) => item.data === data).reduce((soma, item) => soma + item.valor, 0),
  }))

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="font-display text-xl text-branco-premium">Painel Administrativo</h1>
        <p className="mt-2 text-cinza-medio">Logado como {user?.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card">
          <p className="text-sm text-cinza-medio">Faturamento hoje</p>
          <p className="mt-1 font-display text-lg text-dourado-principal">{formatPreco(faturamentoDia)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-cinza-medio">Faturamento do mês</p>
          <p className="mt-1 font-display text-lg text-dourado-principal">{formatPreco(faturamentoMes)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-cinza-medio">Agendamentos hoje</p>
          <p className="mt-1 font-display text-lg text-branco-premium">{agendamentosAtivosHoje.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-cinza-medio">Estoque baixo</p>
          <p
            className={`mt-1 font-display text-lg ${
              produtosEstoqueBaixo.length > 0 ? 'text-red-400' : 'text-branco-premium'
            }`}
          >
            {produtosEstoqueBaixo.length}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="font-display text-lg text-branco-premium">Faturamento — últimos 7 dias</h2>
        <div className="mt-4">
          <GraficoFaturamento7Dias pontos={pontosGrafico} />
        </div>
      </div>

      {produtosEstoqueBaixo.length > 0 && (
        <div className="card">
          <h2 className="font-display text-lg text-branco-premium">Produtos com estoque baixo</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {produtosEstoqueBaixo.map((produto) => (
              <li key={produto.id} className="flex justify-between">
                <Link to={`/admin/produtos/${produto.id}`} className="link-accent">
                  {produto.nome}
                </Link>
                <span className="text-red-400">{produto.estoque_atual} un.</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <Link to="/admin/clientes" className="btn-primary inline-block">
          Ver clientes
        </Link>
      </div>
    </div>
  )
}
