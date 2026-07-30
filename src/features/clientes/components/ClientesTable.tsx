import { Link } from 'react-router-dom'
import type { Cliente } from '../types'

export function ClientesTable({ clientes }: { clientes: Cliente[] }) {
  if (clientes.length === 0) {
    return <p className="text-sm text-cinza-medio">Nenhum cliente encontrado.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-dourado-escuro/20">
      <table className="min-w-full divide-y divide-dourado-escuro/10 text-sm">
        <thead className="bg-preto-card">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Nome</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Telefone</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">E-mail</th>
            <th className="px-4 py-3 text-left font-medium text-cinza-medio">Conta</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dourado-escuro/10">
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="hover:bg-white/5">
              <td className="px-4 py-3">
                <Link to={`/admin/clientes/${cliente.id}`} className="link-accent">
                  {cliente.nome}
                </Link>
              </td>
              <td className="px-4 py-3 text-cinza-medio">{cliente.telefone ?? '—'}</td>
              <td className="px-4 py-3 text-cinza-medio">{cliente.email ?? '—'}</td>
              <td className="px-4 py-3 text-cinza-medio">
                {cliente.usuario_id ? 'Com login' : 'Avulso'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
