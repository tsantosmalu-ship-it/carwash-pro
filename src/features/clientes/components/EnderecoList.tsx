import { useState } from 'react'
import { EnderecoForm } from './EnderecoForm'
import { useEnderecos } from '../hooks/useEnderecos'
import {
  useCreateEndereco,
  useDeleteEndereco,
  useSetEnderecoFavorito,
  useUpdateEndereco,
} from '../hooks/useEnderecoMutations'
import { getErrorMessage } from '@/shared/lib/errors'
import type { EnderecoFormValues } from '../schemas/endereco.schema'
import type { Endereco } from '../types'

function formatEndereco(endereco: Endereco) {
  const partes = [
    [endereco.rua, endereco.numero].filter(Boolean).join(', '),
    endereco.bairro,
    [endereco.cidade, endereco.estado].filter(Boolean).join(' - '),
    endereco.cep,
  ].filter(Boolean)
  return partes.length > 0 ? partes.join(' • ') : 'Endereço sem detalhes preenchidos'
}

export function EnderecoList({ clienteId }: { clienteId: string }) {
  const { data: enderecos, isLoading } = useEnderecos(clienteId)
  const [mode, setMode] = useState<'idle' | 'novo' | string>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const createMutation = useCreateEndereco(clienteId)
  const updateMutation = useUpdateEndereco(clienteId)
  const deleteMutation = useDeleteEndereco(clienteId)
  const favoritoMutation = useSetEnderecoFavorito(clienteId)

  async function handleCreate(values: EnderecoFormValues) {
    setErrorMessage(null)
    try {
      await createMutation.mutateAsync(values)
      setMode('idle')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleUpdate(id: string, values: EnderecoFormValues) {
    setErrorMessage(null)
    try {
      await updateMutation.mutateAsync({ id, input: values })
      setMode('idle')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Remover este endereço?')) return
    try {
      await deleteMutation.mutateAsync(id)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleFavorito(id: string) {
    try {
      await favoritoMutation.mutateAsync(id)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  if (isLoading) {
    return <p className="text-sm text-cinza-medio">Carregando endereços...</p>
  }

  return (
    <div className="space-y-4">
      {errorMessage && <p className="field-error">{errorMessage}</p>}

      {enderecos && enderecos.length > 0 && (
        <ul className="space-y-3">
          {enderecos.map((endereco) =>
            mode === endereco.id ? (
              <li key={endereco.id}>
                <EnderecoForm
                  defaultValues={endereco}
                  submitting={updateMutation.isPending}
                  errorMessage={null}
                  onCancel={() => setMode('idle')}
                  onSubmit={(values) => handleUpdate(endereco.id, values)}
                />
              </li>
            ) : (
              <li
                key={endereco.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-dourado-escuro/20 p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-branco-premium">{endereco.nome}</p>
                    {endereco.favorito && (
                      <span className="rounded-full bg-dourado-principal/15 px-2 py-0.5 text-xs font-medium text-dourado-claro">
                        Favorito
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-cinza-medio">{formatEndereco(endereco)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 text-sm">
                  <button type="button" onClick={() => setMode(endereco.id)} className="link-accent">
                    Editar
                  </button>
                  {!endereco.favorito && (
                    <button
                      type="button"
                      onClick={() => handleFavorito(endereco.id)}
                      className="font-medium text-cinza-medio hover:underline"
                    >
                      Marcar favorito
                    </button>
                  )}
                  <button type="button" onClick={() => handleDelete(endereco.id)} className="btn-danger-text">
                    Remover
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}

      {enderecos && enderecos.length === 0 && mode !== 'novo' && (
        <p className="text-sm text-cinza-medio">Nenhum endereço cadastrado ainda.</p>
      )}

      {mode === 'novo' ? (
        <EnderecoForm
          submitting={createMutation.isPending}
          errorMessage={null}
          onCancel={() => setMode('idle')}
          onSubmit={handleCreate}
        />
      ) : (
        <button type="button" onClick={() => setMode('novo')} className="btn-secondary">
          + Adicionar endereço
        </button>
      )}
    </div>
  )
}
