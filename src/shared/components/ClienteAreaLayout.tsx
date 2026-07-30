import { Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { BottomTabBar } from './BottomTabBar'
import { WhatsAppButton } from './WhatsAppButton'
import logoOrleansAutoSpa from '@/assets/logo-orleans-auto-spa.png'

export function ClienteAreaLayout() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-preto-premium">
      <header className="header-brilhante border-b border-dourado-escuro/20">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <img src={logoOrleansAutoSpa} alt="Orleans Auto Spa" className="h-16 w-16 object-contain" />
          <button onClick={signOut} className="btn-secondary">
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 pb-24">
        <Outlet />
      </main>

      <WhatsAppButton />
      <BottomTabBar />
    </div>
  )
}
