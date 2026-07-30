import { Link } from 'react-router-dom'
import { useMeuCliente } from '@/features/clientes/hooks/useMeuCliente'
import { SobreNos } from '@/features/site/components/SobreNos'
import { GaleriaDestaques } from '@/features/site/components/GaleriaDestaques'
import { AvaliacoesPublicas } from '@/features/site/components/AvaliacoesPublicas'

export function InicioPage() {
  const { data: cliente } = useMeuCliente()

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="font-display text-xl text-branco-premium">
          Olá, {cliente?.nome?.split(' ')[0] ?? 'bem-vindo(a)'}
        </h1>
        <p className="mt-1 text-sm text-cinza-medio">
          Bem-vindo(a) à sua área na Orleans Auto Spa.
        </p>
      </div>

      <div className="card">
        <h2 className="font-display text-lg text-branco-premium">Atalhos</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Link to="/meus-dados" className="link-accent">
            Meus dados e veículos
          </Link>
          <Link to="/agendamentos" className="link-accent">
            Meus agendamentos
          </Link>
          <Link to="/alterar-senha" className="link-accent">
            Alterar senha
          </Link>
        </div>
      </div>

      <SobreNos />
      <GaleriaDestaques />
      <AvaliacoesPublicas />
    </div>
  )
}
