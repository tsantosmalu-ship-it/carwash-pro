import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import logoOrleansAutoSpa from '@/assets/logo-orleans-auto-spa.png'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium ${
    isActive
      ? 'bg-dourado-principal text-preto-premium'
      : 'text-branco-premium/70 hover:bg-white/5 hover:text-branco-premium'
  }`

const NAV_ITEMS: { to: string; label: string; end?: boolean }[] = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/agenda', label: 'Agenda' },
  { to: '/admin/ordens-servico', label: 'Ordens' },
  { to: '/admin/clientes', label: 'Clientes' },
  { to: '/admin/servicos', label: 'Serviços' },
  { to: '/admin/produtos', label: 'Produtos' },
  { to: '/admin/financeiro', label: 'Financeiro' },
  { to: '/admin/site', label: 'Site' },
]

export function AdminLayout() {
  const { user, signOut } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuAberto(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-preto-premium">
      <header className="header-brilhante border-b border-dourado-escuro/20">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img
              src={logoOrleansAutoSpa}
              alt="Orleans Auto Spa"
              className="h-12 w-12 object-contain md:h-16 md:w-16"
            />
            <span className="font-display text-sm text-dourado-principal">Admin</span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <span className="text-sm text-cinza-medio">{user?.email}</span>
            <Link to="/alterar-senha" className="link-accent text-sm">
              Alterar senha
            </Link>
            <button onClick={signOut} className="btn-secondary">
              Sair
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            className="rounded-lg p-2 text-branco-premium md:hidden"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuAberto ? <IconX size={26} /> : <IconMenu2 size={26} />}
          </button>
        </div>

        {menuAberto && (
          <div className="border-t border-dourado-escuro/20 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-dourado-escuro/20 pt-4">
              <span className="text-sm text-cinza-medio">{user?.email}</span>
              <Link to="/alterar-senha" className="link-accent text-sm">
                Alterar senha
              </Link>
              <button onClick={signOut} className="btn-secondary">
                Sair
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
