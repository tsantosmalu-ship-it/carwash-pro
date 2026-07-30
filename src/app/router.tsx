import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ClienteLoginPage } from '@/features/auth/pages/ClienteLoginPage'
import { ClienteSignupPage } from '@/features/auth/pages/ClienteSignupPage'
import { AdminLoginPage } from '@/features/auth/pages/AdminLoginPage'
import { AlterarSenhaPage } from '@/features/auth/pages/AlterarSenhaPage'
import { EsqueciSenhaPage } from '@/features/auth/pages/EsqueciSenhaPage'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { AdminLayout } from '@/shared/components/AdminLayout'
import { ClienteAreaLayout } from '@/shared/components/ClienteAreaLayout'
import { ClientesListPage } from '@/features/clientes/pages/admin/ClientesListPage'
import { ClienteDetailPage } from '@/features/clientes/pages/admin/ClienteDetailPage'
import { MeuPerfilPage } from '@/features/clientes/pages/cliente/MeuPerfilPage'
import { InicioPage } from '@/features/cliente-home/pages/InicioPage'
import { PacotesPage } from '@/features/cliente-home/pages/PacotesPage'
import { LojaPage } from '@/features/cliente-home/pages/LojaPage'
import { GaragemPage } from '@/features/cliente-home/pages/GaragemPage'
import { ServicosListPage } from '@/features/servicos/pages/ServicosListPage'
import { ServicoDetailPage } from '@/features/servicos/pages/ServicoDetailPage'
import { MeusAgendamentosPage } from '@/features/agenda/pages/cliente/MeusAgendamentosPage'
import { NovoAgendamentoPage } from '@/features/agenda/pages/cliente/NovoAgendamentoPage'
import { AgendaListPage } from '@/features/agenda/pages/admin/AgendaListPage'
import { AgendamentoDetailPage } from '@/features/agenda/pages/admin/AgendamentoDetailPage'
import { OrdemServicoPage } from '@/features/ordens-servico/pages/admin/OrdemServicoPage'
import { OrdensServicoListPage } from '@/features/ordens-servico/pages/admin/OrdensServicoListPage'
import { MinhaOrdemServicoPage } from '@/features/ordens-servico/pages/cliente/MinhaOrdemServicoPage'
import { FinanceiroPage } from '@/features/financeiro/pages/FinanceiroPage'
import { ProdutosListPage } from '@/features/produtos/pages/ProdutosListPage'
import { ProdutoDetailPage } from '@/features/produtos/pages/ProdutoDetailPage'
import { SiteAdminPage } from '@/features/site/pages/SiteAdminPage'
import { AdminHome } from './AdminHome'

const router = createBrowserRouter([
  { path: '/login', element: <ClienteLoginPage /> },
  { path: '/cadastro', element: <ClienteSignupPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
  { path: '/alterar-senha', element: <AlterarSenhaPage /> },
  { path: '/esqueci-senha', element: <EsqueciSenhaPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute allowedRole="cliente">
        <ClienteAreaLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <InicioPage /> },
      { path: 'agendar', element: <NovoAgendamentoPage /> },
      { path: 'pacotes', element: <PacotesPage /> },
      { path: 'loja', element: <LojaPage /> },
      { path: 'garagem', element: <GaragemPage /> },
      { path: 'meus-dados', element: <MeuPerfilPage /> },
      { path: 'agendamentos', element: <MeusAgendamentosPage /> },
      { path: 'ordens-servico/:id', element: <MinhaOrdemServicoPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminHome /> },
      { path: 'clientes', element: <ClientesListPage /> },
      { path: 'clientes/:id', element: <ClienteDetailPage /> },
      { path: 'servicos', element: <ServicosListPage /> },
      { path: 'servicos/:id', element: <ServicoDetailPage /> },
      { path: 'agenda', element: <AgendaListPage /> },
      { path: 'agenda/:id', element: <AgendamentoDetailPage /> },
      { path: 'ordens-servico', element: <OrdensServicoListPage /> },
      { path: 'ordens-servico/:id', element: <OrdemServicoPage /> },
      { path: 'financeiro', element: <FinanceiroPage /> },
      { path: 'produtos', element: <ProdutosListPage /> },
      { path: 'produtos/:id', element: <ProdutoDetailPage /> },
      { path: 'site', element: <SiteAdminPage /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
