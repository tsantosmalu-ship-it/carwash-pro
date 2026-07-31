import { useState } from 'react'
import { ResumoFinanceiro } from '../components/ResumoFinanceiro'
import { LancamentoForm } from '../components/LancamentoForm'
import { LancamentosTable } from '../components/LancamentosTable'
import { useLancamentos } from '../hooks/useLancamentos'
import { useCreateLancamentoManual } from '../hooks/useLancamentoMutations'
import { getErrorMessage } from '@/shared/lib/errors'
import type { LancamentoFormValues } from '../schemas/lancamento.schema'

export function FinanceiroPage() {
  const { data: lancamentos, isLoading, isError } = useLancamentos()
  const createMutation = useCreateLancamentoManual()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)

  async function handleCreate(values: LancamentoFormValues) {
    setErrorMessage(null)
    try {
      await createMutation.mutateAsync(values)
      setMostrarForm(false)
      setSuccessMessage('Lançamento adicionado.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl text-branco-premium">Financeiro</h1>
        <button
          type="button"
          onClick={() => {
            setSuccessMessage(null)
            setErrorMessage(null)
            setMostrarForm((atual) => !atual)
          }}
          className="btn-primary"
        >
          {mostrarForm ? 'Fechar' : '+ Novo lançamento'}
        </button>
      </div>

      {successMessage && <p className="text-sm text-green-400">{successMessage}</p>}

      {isLoading && <p className="text-sm text-cinza-medio">Carregando financeiro...</p>}
      {isError && <p className="field-error">Não foi possível carregar o financeiro.</p>}

      {lancamentos && (
        <>
          <ResumoFinanceiro lancamentos={lancamentos} />

          {mostrarForm && (
            <LancamentoForm
              submitting={createMutation.isPending}
              errorMessage={errorMessage}
              onSubmit={handleCreate}
            />
          )}

          <LancamentosTable lancamentos={lancamentos} />
        </>
      )}
    </div>
  )
}
