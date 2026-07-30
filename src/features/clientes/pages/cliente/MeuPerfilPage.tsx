import { useState } from 'react'
import { ClienteForm } from '../../components/ClienteForm'
import { EnderecoList } from '../../components/EnderecoList'
import { VeiculoList } from '@/features/veiculos/components/VeiculoList'
import { useMeuCliente } from '../../hooks/useMeuCliente'
import { useUpdateCliente } from '../../hooks/useClienteMutations'
import { getErrorMessage } from '@/shared/lib/errors'
import type { ClienteFormValues } from '../../schemas/cliente.schema'

export function MeuPerfilPage() {
  const { data: cliente, isLoading, isError } = useMeuCliente()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [savedMessage, setSavedMessage] = useState(false)

  const updateMutation = useUpdateCliente(cliente?.id ?? '')

  async function handleSubmit(values: ClienteFormValues) {
    if (!cliente) return
    setErrorMessage(null)
    setSavedMessage(false)
    try {
      await updateMutation.mutateAsync(values)
      setSavedMessage(true)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  if (isLoading) {
    return <p className="text-sm text-cinza-medio">Carregando seus dados...</p>
  }

  if (isError || !cliente) {
    return (
      <p className="field-error">
        Não foi possível carregar seu cadastro. Tente novamente mais tarde.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      <section className="card">
        <h1 className="font-display text-xl text-branco-premium">Meus Dados</h1>
        <p className="mt-1 text-sm text-cinza-medio">Mantenha seu cadastro atualizado.</p>

        <div className="mt-6">
          <ClienteForm
            defaultValues={cliente}
            submitting={updateMutation.isPending}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
          />
          {savedMessage && <p className="mt-3 text-sm text-green-400">Dados salvos.</p>}
        </div>
      </section>

      <section className="card">
        <h2 className="font-display text-lg text-branco-premium">Meus Endereços</h2>
        <p className="mt-1 text-sm text-cinza-medio">
          Usados para agendar atendimentos no seu endereço.
        </p>

        <div className="mt-6">
          <EnderecoList clienteId={cliente.id} />
        </div>
      </section>

      <section className="card">
        <h2 className="font-display text-lg text-branco-premium">Meus Veículos</h2>
        <p className="mt-1 text-sm text-cinza-medio">Cadastre os veículos que você leva para atendimento.</p>

        <div className="mt-6">
          <VeiculoList clienteId={cliente.id} />
        </div>
      </section>
    </div>
  )
}
