import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProdutosTable } from '../components/ProdutosTable'
import { useProdutos } from '../hooks/useProdutos'

export function ProdutosListPage() {
  const [search, setSearch] = useState('')
  const { data: produtos, isLoading, isError } = useProdutos(search)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl text-branco-premium">Produtos</h1>
        <Link to="/admin/produtos/novo" className="btn-primary">
          + Novo produto
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por nome ou categoria..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="field-input max-w-md"
      />

      {isLoading && <p className="text-sm text-cinza-medio">Carregando produtos...</p>}
      {isError && <p className="field-error">Não foi possível carregar os produtos.</p>}
      {produtos && <ProdutosTable produtos={produtos} />}
    </div>
  )
}
