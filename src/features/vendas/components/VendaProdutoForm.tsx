import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { vendaSchema, type VendaFormValues } from '../schemas/venda.schema'
import type { Produto } from '@/features/produtos/types'

function formatPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface VendaProdutoFormProps {
  produtos: Produto[]
  onSubmit: (values: VendaFormValues) => Promise<void>
  submitting: boolean
  errorMessage: string | null
}

export function VendaProdutoForm({
  produtos,
  onSubmit,
  submitting,
  errorMessage,
}: VendaProdutoFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VendaFormValues>({
    resolver: zodResolver(vendaSchema),
    defaultValues: { produto_id: '', quantidade: '1' },
  })

  const produtoId = useWatch({ control, name: 'produto_id' })
  const produtoSelecionado = produtos.find((produto) => produto.id === produtoId)

  return (
    <form className="flex flex-wrap items-end gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="min-w-[220px] flex-1">
        <label htmlFor="produto_id" className="field-label">
          Produto
        </label>
        <select id="produto_id" className="field-input" {...register('produto_id')}>
          <option value="">Selecione um produto</option>
          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>
              {produto.nome} • {formatPreco(produto.preco_venda)} • estoque: {produto.estoque_atual}
            </option>
          ))}
        </select>
        {errors.produto_id && <p className="field-error">{errors.produto_id.message}</p>}
      </div>

      <div className="w-28">
        <label htmlFor="quantidade" className="field-label">
          Qtd.
        </label>
        <input id="quantidade" type="text" inputMode="numeric" className="field-input" {...register('quantidade')} />
        {errors.quantidade && <p className="field-error">{errors.quantidade.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting || !produtoSelecionado || produtoSelecionado.estoque_atual === 0}
        className="btn-primary"
      >
        {submitting ? 'Vendendo...' : 'Vender'}
      </button>

      {produtoSelecionado && produtoSelecionado.estoque_atual === 0 && (
        <p className="field-error w-full">Produto sem estoque.</p>
      )}
      {errorMessage && <p className="field-error w-full">{errorMessage}</p>}
    </form>
  )
}
