export type UsuarioRole = 'admin' | 'cliente'

export interface AuthUser {
  id: string
  email: string | null
  role: UsuarioRole
}
