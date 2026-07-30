import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ProdutoForm } from '../components/ProdutoForm'
import { FotoProdutoUploader } from '../components/FotoProdutoUploader'
import { EntradaEstoqueForm } from '../components/EntradaEstoqueForm'
import { useProduto } from '../hooks/useProduto'
import { useCreateProduto, useSetProdutoStatus, useUpdateProduto } from '../hooks/useProdutoMutations'
import { getErrorMessage } from '@/shared/lib/errors'
import type { ProdutoFormValues } from '../schemas/produto.schema'

export function ProdutoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const isNovo = id === 'novo'
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: produto, isLoading, isError } = useProduto(isNovo ? undefined : id)
  const createMutation = useCreateProduto()
  const updateMutation = useUpdateProduto(id ?? '')
  const statusMutation = useSetProdutoStatus(id ?? '')

  async function handleCreate(values: ProdutoFormValues) {
    setErrorMessage(null)
    try {
      const novoProduto = await createMutation.mutateAsync(values)
      navigate(`/admin/produtos/${novoProduto.id}`, { replace: true })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleUpdate(values: ProdutoFormValues) {
    setErrorMessage(null)
    try {
      await updateMutation.mutateAsync(values)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleToggleStatus() {
    if (!produto) return
    try {
      await statusMutation.mutateAsync(produto.status === 'ativo' ? 'inativo' : 'ativo')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  if (!id) return <Navigate to="/admin/produtos" replace />

  if (isNovo) {
    return (
      <div className="max-w-xl space-y-6">
        <Link to="/admin/produtos" className="link-accent text-sm">
          ← Voltar para produtos
        </Link>
        <div className="card">
          <h1 className="font-display text-xl text-branco-premium">Novo produto</h1>
          <div className="mt-6">
            <ProdutoForm
              submitting={createMutation.isPending}
              errorMessage={errorMessage}
              submitLabel="Criar produto"
              onSubmit={handleCreate}
            />
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) return <p className="text-sm text-cinza-medio">Carregando produto...</p>
  if (isError || !produto) {
    return <p className="field-error">Produto não encontrado.</p>
  }

  return (
    <div className="max-w-xl space-y-6">
      <Link to="/admin/produtos" className="link-accent text-sm">
        ← Voltar para produtos
      </Link>

      <div className="card">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl text-branco-premium">{produto.nome}</h1>
          <button onClick={handleToggleStatus} className="btn-danger-text">
            {produto.status === 'ativo' ? 'Desativar produto' : 'Reativar produto'}
          </button>
        </div>

        <div className="mt-6">
          <FotoProdutoUploader produtoId={produto.id} foto={produto.foto} />
        </div>

        <div className="mt-6 rounded-lg bg-preto-card px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-branco-premium">Estoque atual</span>
            <span className="font-display text-lg text-dourado-principal">{produto.estoque_atual}</span>
          </div>
          <div className="mt-3">
            <EntradaEstoqueForm produtoId={produto.id} />
          </div>
        </div>

        <div className="mt-6">
          <ProdutoForm
            defaultValues={produto}
            submitting={updateMutation.isPending}
            errorMessage={errorMessage}
            onSubmit={handleUpdate}
          />
        </div>
      </div>
    </div>
  )
}
