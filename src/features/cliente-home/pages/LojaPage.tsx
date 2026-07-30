import { CatalogoProdutos } from '@/features/produtos/components/CatalogoProdutos'
import { useProdutos } from '@/features/produtos/hooks/useProdutos'

export function LojaPage() {
  const { data: produtos, isLoading, isError } = useProdutos('')

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl text-branco-premium">Loja</h1>

      {isLoading && <p className="text-sm text-cinza-medio">Carregando produtos...</p>}
      {isError && <p className="field-error">Não foi possível carregar os produtos.</p>}
      {produtos && <CatalogoProdutos produtos={produtos} />}
    </div>
  )
}
