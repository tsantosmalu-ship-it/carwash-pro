import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getClienteByUsuarioId } from '../api/clientes.api'

export function useMeuCliente() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['cliente', 'me', user?.id],
    queryFn: () => getClienteByUsuarioId(user!.id),
    enabled: !!user?.id,
  })
}
