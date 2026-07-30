import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrdensServico } from '../../hooks/useOrdensServico'

function formatPreco(preco: number | null) {
  if (preco === null) return '—'
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatData(dateValue: string | undefined) {
  if (!dateValue) return '—'
  const [ano, mes, dia] = dateValue.split('-')
  return `${dia}/${mes}/${ano}`
}

export function OrdensServicoListPage() {
  const { data: ordens, isLoading, isError } = useOrdensServico()
  const [search, setSearch] = useState('')

  const ordensFiltradas = useMemo(() => {
    if (!ordens) return []
    const termo = search.trim().toLowerCase()
    if (!termo) return ordens
    return ordens.filter((os) => {
      const cliente = os.agendamentos?.clientes?.nome?.toLowerCase() ?? ''
      const veiculo = os.agendamentos?.veiculos
        ? `${os.agendamentos.veiculos.marca} ${os.agendamentos.veiculos.modelo} ${os.agendamentos.veiculos.placa ?? ''}`.toLowerCase()
        : ''
      return cliente.includes(termo) || veiculo.includes(termo)
    })
  }, [ordens, search])

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl text-branco-premium">Ordens de Serviço</h1>

      <input
        type="text"
        placeholder="Buscar por cliente, veículo ou placa..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="field-input max-w-md"
      />

      {isLoading && <p className="text-sm text-cinza-medio">Carregando ordens de serviço...</p>}
      {isError && <p className="field-error">Não foi possível carregar as ordens de serviço.</p>}

      {ordensFiltradas.length === 0 && !isLoading ? (
        <p className="text-sm text-cinza-medio">Nenhuma ordem de serviço encontrada.</p>
      ) : (
        <ul className="space-y-3">
          {ordensFiltradas.map((os) => (
            <li key={os.id}>
              <Link
                to={`/admin/ordens-servico/${os.id}`}
                className="block rounded-xl border border-dourado-escuro/20 p-4 hover:bg-white/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-branco-premium">
                      {formatData(os.agendamentos?.data)} {os.agendamentos?.hora?.slice(0, 5)} •{' '}
                      {os.agendamentos?.clientes?.nome ?? 'Cliente não encontrado'}
                    </p>
                    <p className="mt-1 text-sm text-cinza-medio">
                      {os.agendamentos?.veiculos
                        ? `${os.agendamentos.veiculos.marca} ${os.agendamentos.veiculos.modelo}${
                            os.agendamentos.veiculos.placa ? ` • ${os.agendamentos.veiculos.placa}` : ''
                          }`
                        : 'Veículo não encontrado'}
                    </p>
                    <p className="mt-1 text-sm text-cinza-medio">
                      {os.agendamentos?.agendamento_servicos.map((item) => item.servicos?.nome).join(', ') ||
                        'Sem serviços vinculados'}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1 text-sm">
                    <span className="font-semibold text-dourado-principal">{formatPreco(os.valor_final)}</span>
                    {os.avaliacao && <span className="text-cinza-medio">Avaliação: {os.avaliacao} / 5</span>}
                    {os.nota_fiscal_url && <span className="text-cinza-medio">Nota fiscal enviada</span>}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
