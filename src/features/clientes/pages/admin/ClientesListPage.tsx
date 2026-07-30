import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClientesTable } from '../../components/ClientesTable'
import { useClientes } from '../../hooks/useClientes'

export function ClientesListPage() {
  const [search, setSearch] = useState('')
  const { data: clientes, isLoading, isError } = useClientes(search)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl text-branco-premium">Clientes</h1>
        <Link to="/admin/clientes/novo" className="btn-primary">
          + Novo cliente
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por nome, telefone ou e-mail..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="field-input max-w-md"
      />

      {isLoading && <p className="text-sm text-cinza-medio">Carregando clientes...</p>}
      {isError && <p className="field-error">Não foi possível carregar os clientes.</p>}
      {clientes && <ClientesTable clientes={clientes} />}
    </div>
  )
}
