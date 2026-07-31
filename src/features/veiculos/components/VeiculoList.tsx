import { useState } from 'react'
import { VeiculoForm } from './VeiculoForm'
import { useVeiculos } from '../hooks/useVeiculos'
import { useArquivarVeiculo, useCreateVeiculo, useUpdateVeiculo } from '../hooks/useVeiculoMutations'
import { getErrorMessage } from '@/shared/lib/errors'
import type { VeiculoFormValues } from '../schemas/veiculo.schema'
import { TIPO_VEICULO_LABELS, type Veiculo } from '../types'

function formatVeiculo(veiculo: Veiculo) {
  const partes = [
    [veiculo.marca, veiculo.modelo].filter(Boolean).join(' '),
    veiculo.cor,
    veiculo.tipo_veiculo ? TIPO_VEICULO_LABELS[veiculo.tipo_veiculo] : null,
  ].filter(Boolean)
  return partes.join(' • ')
}

export function VeiculoList({ clienteId }: { clienteId: string }) {
  const { data: veiculos, isLoading } = useVeiculos(clienteId)
  const [mode, setMode] = useState<'idle' | 'novo' | string>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const createMutation = useCreateVeiculo(clienteId)
  const updateMutation = useUpdateVeiculo(clienteId)
  const arquivarMutation = useArquivarVeiculo(clienteId)

  function abrirForm(novoMode: 'novo' | string) {
    setSuccessMessage(null)
    setErrorMessage(null)
    setMode(novoMode)
  }

  async function handleCreate(values: VeiculoFormValues) {
    setErrorMessage(null)
    try {
      await createMutation.mutateAsync(values)
      setMode('idle')
      setSuccessMessage('Veículo adicionado.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleUpdate(id: string, values: VeiculoFormValues) {
    setErrorMessage(null)
    try {
      await updateMutation.mutateAsync({ id, input: values })
      setMode('idle')
      setSuccessMessage('Veículo atualizado.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleArquivar(id: string) {
    if (!window.confirm('Arquivar este veículo? O histórico dele é mantido.')) return
    try {
      await arquivarMutation.mutateAsync(id)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  if (isLoading) {
    return <p className="text-sm text-cinza-medio">Carregando veículos...</p>
  }

  return (
    <div className="space-y-4">
      {errorMessage && <p className="field-error">{errorMessage}</p>}
      {successMessage && <p className="text-sm text-green-400">{successMessage}</p>}

      {veiculos && veiculos.length > 0 && (
        <ul className="space-y-3">
          {veiculos.map((veiculo) =>
            mode === veiculo.id ? (
              <li key={veiculo.id}>
                <VeiculoForm
                  defaultValues={veiculo}
                  submitting={updateMutation.isPending}
                  errorMessage={null}
                  onCancel={() => setMode('idle')}
                  onSubmit={(values) => handleUpdate(veiculo.id, values)}
                />
              </li>
            ) : (
              <li
                key={veiculo.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-dourado-escuro/20 p-4"
              >
                <div>
                  <p className="font-medium text-branco-premium">{formatVeiculo(veiculo)}</p>
                  <p className="mt-1 text-sm text-cinza-medio">{veiculo.placa || 'Sem placa cadastrada'}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 text-sm">
                  <button type="button" onClick={() => abrirForm(veiculo.id)} className="link-accent">
                    Editar
                  </button>
                  <button type="button" onClick={() => handleArquivar(veiculo.id)} className="btn-danger-text">
                    Arquivar
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}

      {veiculos && veiculos.length === 0 && mode !== 'novo' && (
        <p className="text-sm text-cinza-medio">Nenhum veículo cadastrado ainda.</p>
      )}

      {mode === 'novo' ? (
        <VeiculoForm
          submitting={createMutation.isPending}
          errorMessage={null}
          onCancel={() => setMode('idle')}
          onSubmit={handleCreate}
        />
      ) : (
        <button type="button" onClick={() => abrirForm('novo')} className="btn-secondary">
          + Adicionar veículo
        </button>
      )}
    </div>
  )
}
