import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ServicoForm } from '../components/ServicoForm'
import { useServico } from '../hooks/useServico'
import { useCreateServico, useSetServicoStatus, useUpdateServico } from '../hooks/useServicoMutations'
import { getErrorMessage } from '@/shared/lib/errors'
import type { ServicoFormValues } from '../schemas/servico.schema'

export function ServicoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const isNovo = id === 'novo'
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: servico, isLoading, isError } = useServico(isNovo ? undefined : id)
  const createMutation = useCreateServico()
  const updateMutation = useUpdateServico(id ?? '')
  const statusMutation = useSetServicoStatus()

  async function handleCreate(values: ServicoFormValues) {
    setErrorMessage(null)
    try {
      const novoServico = await createMutation.mutateAsync(values)
      navigate(`/admin/servicos/${novoServico.id}`, { replace: true })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleUpdate(values: ServicoFormValues) {
    setErrorMessage(null)
    try {
      await updateMutation.mutateAsync(values)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleToggleStatus() {
    if (!servico) return
    const novoStatus = servico.status === 'ativo' ? 'inativo' : 'ativo'
    try {
      await statusMutation.mutateAsync({ id: servico.id, status: novoStatus })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  if (!id) return <Navigate to="/admin/servicos" replace />

  if (isNovo) {
    return (
      <div className="max-w-xl space-y-6">
        <Link to="/admin/servicos" className="link-accent text-sm">
          ← Voltar para serviços
        </Link>
        <div className="card">
          <h1 className="font-display text-xl text-branco-premium">Novo serviço</h1>
          <div className="mt-6">
            <ServicoForm
              submitting={createMutation.isPending}
              errorMessage={errorMessage}
              submitLabel="Criar serviço"
              onSubmit={handleCreate}
            />
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) return <p className="text-sm text-cinza-medio">Carregando serviço...</p>
  if (isError || !servico) {
    return <p className="field-error">Serviço não encontrado.</p>
  }

  return (
    <div className="max-w-xl space-y-6">
      <Link to="/admin/servicos" className="link-accent text-sm">
        ← Voltar para serviços
      </Link>

      <div className="card">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl text-branco-premium">{servico.nome}</h1>
          <button onClick={handleToggleStatus} className="btn-danger-text">
            {servico.status === 'ativo' ? 'Desativar serviço' : 'Reativar serviço'}
          </button>
        </div>

        <div className="mt-6">
          <ServicoForm
            defaultValues={servico}
            submitting={updateMutation.isPending}
            errorMessage={errorMessage}
            onSubmit={handleUpdate}
          />
        </div>
      </div>
    </div>
  )
}
