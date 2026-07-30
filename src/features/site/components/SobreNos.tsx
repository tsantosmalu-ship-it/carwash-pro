import { useConteudoSite } from '../hooks/useConteudoSite'

export function SobreNos() {
  const { data: texto, isLoading } = useConteudoSite('sobre_nos')

  if (isLoading || !texto) return null

  return (
    <div className="card">
      <h2 className="font-display text-lg text-branco-premium">Sobre Nós</h2>
      <p className="mt-2 whitespace-pre-line text-sm text-cinza-medio">{texto}</p>
    </div>
  )
}
