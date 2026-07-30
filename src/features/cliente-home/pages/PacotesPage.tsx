import { CatalogoServicos } from '@/features/servicos/components/CatalogoServicos'
import { useServicos } from '@/features/servicos/hooks/useServicos'

export function PacotesPage() {
  const { data: servicos, isLoading, isError } = useServicos('')

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl text-branco-premium">Pacotes</h1>

      {isLoading && <p className="text-sm text-cinza-medio">Carregando pacotes...</p>}
      {isError && <p className="field-error">Não foi possível carregar os pacotes.</p>}
      {servicos && <CatalogoServicos servicos={servicos} />}
    </div>
  )
}
