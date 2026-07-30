import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { entradaEstoqueSchema, type EntradaEstoqueFormValues } from '../schemas/produto.schema'
import { useRegistrarEntradaEstoque } from '../hooks/useProdutoMutations'
import { getErrorMessage } from '@/shared/lib/errors'

export function EntradaEstoqueForm({ produtoId }: { produtoId: string }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const entradaMutation = useRegistrarEntradaEstoque(produtoId)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EntradaEstoqueFormValues>({
    resolver: zodResolver(entradaEstoqueSchema),
    defaultValues: { quantidade: '' },
  })

  async function handleFormSubmit(values: EntradaEstoqueFormValues) {
    setErrorMessage(null)
    try {
      await entradaMutation.mutateAsync(values)
      reset({ quantidade: '' })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <form className="flex items-end gap-3" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div>
        <label htmlFor="quantidade" className="field-label">
          Registrar entrada de estoque
        </label>
        <input
          id="quantidade"
          type="text"
          inputMode="numeric"
          placeholder="Quantidade comprada"
          className="field-input w-48"
          {...register('quantidade')}
        />
        {errors.quantidade && <p className="field-error">{errors.quantidade.message}</p>}
      </div>
      <button type="submit" disabled={entradaMutation.isPending} className="btn-secondary">
        {entradaMutation.isPending ? 'Adicionando...' : '+ Adicionar'}
      </button>
      {errorMessage && <p className="field-error">{errorMessage}</p>}
    </form>
  )
}
