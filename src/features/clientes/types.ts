export interface Cliente {
  id: string
  usuario_id: string | null
  nome: string
  cpf: string | null
  telefone: string | null
  whatsapp: string | null
  email: string | null
  data_nascimento: string | null
  foto_perfil: string | null
  observacoes: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Endereco {
  id: string
  cliente_id: string
  nome: string
  cep: string | null
  rua: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  referencia: string | null
  favorito: boolean
  created_at: string
  updated_at: string
}
