import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ClienteForm } from '../../components/ClienteForm'
import { EnderecoList } from '../../components/EnderecoList'
import { VeiculoList } from '@/features/veiculos/components/VeiculoList'
import { useCliente } from '../../hooks/useCliente'
import { useArquivarCliente, useCreateCliente, useUpdateCliente } from '../../hooks/useClienteMutations'
import { getErrorMessage } from '@/shared/lib/errors'
import type { ClienteFormValues } from '../../schemas/cliente.schema'

export function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const isNovo = id === 'novo'
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: cliente, isLoading, isError } = useCliente(isNovo ? undefined : id)
  const createMutation = useCreateCliente()
  const updateMutation = useUpdateCliente(id ?? '')
  const arquivarMutation = useArquivarCliente()

  async function handleCreate(values: ClienteFormValues) {
    setErrorMessage(null)
    try {
      const novoCliente = await createMutation.mutateAsync(values)
      navigate(`/admin/clientes/${novoCliente.id}`, { replace: true })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleUpdate(values: ClienteFormValues) {
    setErrorMessage(null)
    try {
      await updateMutation.mutateAsync(values)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleArquivar() {
    if (!cliente) return
    if (!window.confirm(`Arquivar o cliente "${cliente.nome}"? O histórico dele é mantido.`))
      return
    try {
      await arquivarMutation.mutateAsync(cliente.id)
      navigate('/admin/clientes', { replace: true })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  if (!id) return <Navigate to="/admin/clientes" replace />

  if (isNovo) {
    return (
      <div className="max-w-xl space-y-6">
        <Link to="/admin/clientes" className="link-accent text-sm">
          ← Voltar para clientes
        </Link>
        <div className="card">
          <h1 className="font-display text-xl text-branco-premium">Novo cliente</h1>
          <p className="mt-1 text-sm text-cinza-medio">
            Cadastro avulso — sem necessidade de login do cliente.
          </p>
          <div className="mt-6">
            <ClienteForm
              submitting={createMutation.isPending}
              errorMessage={errorMessage}
              submitLabel="Criar cliente"
              onSubmit={handleCreate}
            />
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) return <p className="text-sm text-cinza-medio">Carregando cliente...</p>
  if (isError || !cliente) {
    return <p className="field-error">Cliente não encontrado.</p>
  }

  return (
    <div className="max-w-xl space-y-6">
      <Link to="/admin/clientes" className="link-accent text-sm">
        ← Voltar para clientes
      </Link>

      <div className="card">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl text-branco-premium">{cliente.nome}</h1>
          <button onClick={handleArquivar} className="btn-danger-text">
            Arquivar cliente
          </button>
        </div>

        <div className="mt-6">
          <ClienteForm
            defaultValues={cliente}
            submitting={updateMutation.isPending}
            errorMessage={errorMessage}
            onSubmit={handleUpdate}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="font-display text-lg text-branco-premium">Endereços</h2>
        <div className="mt-6">
          <EnderecoList clienteId={cliente.id} />
        </div>
      </div>

      <div className="card">
        <h2 className="font-display text-lg text-branco-premium">Veículos</h2>
        <div className="mt-6">
          <VeiculoList clienteId={cliente.id} />
        </div>
      </div>
    </div>
  )
}
