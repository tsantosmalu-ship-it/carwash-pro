import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ServicosTable } from '../components/ServicosTable'
import { useServicos } from '../hooks/useServicos'

export function ServicosListPage() {
  const [search, setSearch] = useState('')
  const { data: servicos, isLoading, isError } = useServicos(search)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl text-branco-premium">Serviços</h1>
        <Link to="/admin/servicos/novo" className="btn-primary">
          + Novo serviço
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por nome ou categoria..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="field-input max-w-md"
      />

      {isLoading && <p className="text-sm text-cinza-medio">Carregando serviços...</p>}
      {isError && <p className="field-error">Não foi possível carregar os serviços.</p>}
      {servicos && <ServicosTable servicos={servicos} />}
    </div>
  )
}
