import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import logoOrleansAutoSpa from '@/assets/logo-orleans-auto-spa.png'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium ${
    isActive
      ? 'bg-dourado-principal text-preto-premium'
      : 'text-branco-premium/70 hover:bg-white/5 hover:text-branco-premium'
  }`

export function AdminLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-preto-premium">
      <header className="header-brilhante border-b border-dourado-escuro/20">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img src={logoOrleansAutoSpa} alt="Orleans Auto Spa" className="h-16 w-16 object-contain" />
              <span className="font-display text-sm text-dourado-principal">Admin</span>
            </div>
            <nav className="flex gap-1">
              <NavLink to="/admin" end className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/agenda" className={navLinkClass}>
                Agenda
              </NavLink>
              <NavLink to="/admin/ordens-servico" className={navLinkClass}>
                Ordens
              </NavLink>
              <NavLink to="/admin/clientes" className={navLinkClass}>
                Clientes
              </NavLink>
              <NavLink to="/admin/servicos" className={navLinkClass}>
                Serviços
              </NavLink>
              <NavLink to="/admin/produtos" className={navLinkClass}>
                Produtos
              </NavLink>
              <NavLink to="/admin/financeiro" className={navLinkClass}>
                Financeiro
              </NavLink>
              <NavLink to="/admin/site" className={navLinkClass}>
                Site
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-cinza-medio">{user?.email}</span>
            <Link to="/alterar-senha" className="link-accent text-sm">
              Alterar senha
            </Link>
            <button onClick={signOut} className="btn-secondary">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
