import { useGaleriaDestaques } from '../hooks/useGaleriaDestaques'

export function GaleriaDestaques() {
  const { data: destaques, isLoading } = useGaleriaDestaques()

  if (isLoading || !destaques || destaques.length === 0) return null

  return (
    <div className="card">
      <h2 className="font-display text-lg text-branco-premium">Nossos Trabalhos</h2>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {destaques.map((destaque) => (
          <div key={destaque.id} className="w-40 shrink-0">
            <img
              src={destaque.foto_url}
              alt={destaque.legenda ?? 'Trabalho em destaque'}
              className="aspect-square w-40 rounded-lg object-cover"
            />
            {destaque.legenda && <p className="mt-1 text-xs text-cinza-medio">{destaque.legenda}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
