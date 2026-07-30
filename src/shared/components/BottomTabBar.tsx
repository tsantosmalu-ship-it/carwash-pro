import { NavLink } from 'react-router-dom'
import { IconCalendarPlus, IconCar, IconHome, IconPackage, IconShoppingBag } from '@tabler/icons-react'

const TABS = [
  { to: '/', label: 'Início', Icon: IconHome, end: true },
  { to: '/agendar', label: 'Agendar', Icon: IconCalendarPlus, end: false },
  { to: '/pacotes', label: 'Pacotes', Icon: IconPackage, end: false },
  { to: '/loja', label: 'Loja', Icon: IconShoppingBag, end: false },
  { to: '/garagem', label: 'Garagem', Icon: IconCar, end: false },
]

export function BottomTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-dourado-escuro/20 bg-preto-card">
      <div className="mx-auto flex max-w-2xl items-stretch justify-between">
        {TABS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                isActive ? 'text-dourado-principal' : 'text-cinza-medio hover:text-branco-premium'
              }`
            }
          >
            <Icon size={22} stroke={1.75} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
