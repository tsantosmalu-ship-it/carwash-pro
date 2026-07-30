export type UsuarioRole = 'admin' | 'cliente'

export type AgendamentoStatus =
  | 'solicitado'
  | 'confirmado'
  | 'em_deslocamento'
  | 'iniciado'
  | 'concluido'
  | 'finalizado'
  | 'cancelado'

export type FormaPagamento = 'pix' | 'dinheiro' | 'cartao' | 'transferencia'

export type TipoLancamento = 'receita' | 'despesa'
export type OrigemLancamento = 'servico' | 'produto' | 'manual'

export type ProdutoStatus = 'ativo' | 'inativo'

export type TipoVeiculoServico = 'carro' | 'moto' | 'quadriciclo' | 'jet_ski'

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          role: UsuarioRole
          created_at: string
        }
        Insert: {
          id: string
          role?: UsuarioRole
          created_at?: string
        }
        Update: {
          id?: string
          role?: UsuarioRole
          created_at?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
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
        Insert: {
          id?: string
          usuario_id?: string | null
          nome: string
          cpf?: string | null
          telefone?: string | null
          whatsapp?: string | null
          email?: string | null
          data_nascimento?: string | null
          foto_perfil?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          usuario_id?: string | null
          nome?: string
          cpf?: string | null
          telefone?: string | null
          whatsapp?: string | null
          email?: string | null
          data_nascimento?: string | null
          foto_perfil?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'clientes_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: true
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      enderecos: {
        Row: {
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
        Insert: {
          id?: string
          cliente_id: string
          nome: string
          cep?: string | null
          rua?: string | null
          numero?: string | null
          complemento?: string | null
          bairro?: string | null
          cidade?: string | null
          estado?: string | null
          referencia?: string | null
          favorito?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string
          nome?: string
          cep?: string | null
          rua?: string | null
          numero?: string | null
          complemento?: string | null
          bairro?: string | null
          cidade?: string | null
          estado?: string | null
          referencia?: string | null
          favorito?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'enderecos_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
        ]
      }
      veiculos: {
        Row: {
          id: string
          cliente_id: string
          marca: string
          modelo: string
          versao: string | null
          ano: number | null
          cor: string | null
          placa: string | null
          km: number | null
          tipo_pintura: string | null
          foto_principal: string | null
          observacoes: string | null
          tipo_veiculo: TipoVeiculoServico | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          cliente_id: string
          marca: string
          modelo: string
          versao?: string | null
          ano?: number | null
          cor?: string | null
          placa?: string | null
          km?: number | null
          tipo_pintura?: string | null
          foto_principal?: string | null
          observacoes?: string | null
          tipo_veiculo?: TipoVeiculoServico | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          cliente_id?: string
          marca?: string
          modelo?: string
          versao?: string | null
          ano?: number | null
          cor?: string | null
          placa?: string | null
          km?: number | null
          tipo_pintura?: string | null
          foto_principal?: string | null
          observacoes?: string | null
          tipo_veiculo?: TipoVeiculoServico | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'veiculos_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
        ]
      }
      servicos: {
        Row: {
          id: string
          nome: string
          categoria: string | null
          descricao: string | null
          tempo_estimado_min: number | null
          preco: number
          status: 'ativo' | 'inativo'
          tipo_veiculo: TipoVeiculoServico | null
          itens_inclusos: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          categoria?: string | null
          descricao?: string | null
          tempo_estimado_min?: number | null
          preco: number
          status?: 'ativo' | 'inativo'
          tipo_veiculo?: TipoVeiculoServico | null
          itens_inclusos?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          categoria?: string | null
          descricao?: string | null
          tempo_estimado_min?: number | null
          preco?: number
          status?: 'ativo' | 'inativo'
          tipo_veiculo?: TipoVeiculoServico | null
          itens_inclusos?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      agendamentos: {
        Row: {
          id: string
          cliente_id: string
          veiculo_id: string
          endereco_id: string | null
          data: string
          hora: string
          status: AgendamentoStatus
          valor_total: number | null
          observacoes: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          cliente_id: string
          veiculo_id: string
          endereco_id?: string | null
          data: string
          hora: string
          status?: AgendamentoStatus
          valor_total?: number | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          cliente_id?: string
          veiculo_id?: string
          endereco_id?: string | null
          data?: string
          hora?: string
          status?: AgendamentoStatus
          valor_total?: number | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'agendamentos_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'agendamentos_veiculo_id_fkey'
            columns: ['veiculo_id']
            isOneToOne: false
            referencedRelation: 'veiculos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'agendamentos_endereco_id_fkey'
            columns: ['endereco_id']
            isOneToOne: false
            referencedRelation: 'enderecos'
            referencedColumns: ['id']
          },
        ]
      }
      agendamento_servicos: {
        Row: {
          id: string
          agendamento_id: string
          servico_id: string
          preco_aplicado: number
        }
        Insert: {
          id?: string
          agendamento_id: string
          servico_id: string
          preco_aplicado: number
        }
        Update: {
          id?: string
          agendamento_id?: string
          servico_id?: string
          preco_aplicado?: number
        }
        Relationships: [
          {
            foreignKeyName: 'agendamento_servicos_agendamento_id_fkey'
            columns: ['agendamento_id']
            isOneToOne: false
            referencedRelation: 'agendamentos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'agendamento_servicos_servico_id_fkey'
            columns: ['servico_id']
            isOneToOne: false
            referencedRelation: 'servicos'
            referencedColumns: ['id']
          },
        ]
      }
      ordens_servico: {
        Row: {
          id: string
          agendamento_id: string
          fotos_antes: string[] | null
          fotos_depois: string[] | null
          checklist: Record<string, boolean> | null
          hora_inicio: string | null
          hora_fim: string | null
          valor_final: number | null
          forma_pagamento: FormaPagamento | null
          avaliacao: number | null
          observacoes: string | null
          comentario_avaliacao: string | null
          avaliacao_aprovada: boolean
          nota_fiscal_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agendamento_id: string
          fotos_antes?: string[] | null
          fotos_depois?: string[] | null
          checklist?: Record<string, boolean> | null
          hora_inicio?: string | null
          hora_fim?: string | null
          valor_final?: number | null
          forma_pagamento?: FormaPagamento | null
          avaliacao?: number | null
          observacoes?: string | null
          comentario_avaliacao?: string | null
          avaliacao_aprovada?: boolean
          nota_fiscal_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agendamento_id?: string
          fotos_antes?: string[] | null
          fotos_depois?: string[] | null
          checklist?: Record<string, boolean> | null
          hora_inicio?: string | null
          hora_fim?: string | null
          valor_final?: number | null
          forma_pagamento?: FormaPagamento | null
          avaliacao?: number | null
          observacoes?: string | null
          comentario_avaliacao?: string | null
          avaliacao_aprovada?: boolean
          nota_fiscal_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ordens_servico_agendamento_id_fkey'
            columns: ['agendamento_id']
            isOneToOne: true
            referencedRelation: 'agendamentos'
            referencedColumns: ['id']
          },
        ]
      }
      financeiro_lancamentos: {
        Row: {
          id: string
          tipo: TipoLancamento
          categoria: string | null
          valor: number
          data: string
          origem: OrigemLancamento | null
          referencia_id: string | null
          observacoes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tipo: TipoLancamento
          categoria?: string | null
          valor: number
          data?: string
          origem?: OrigemLancamento | null
          referencia_id?: string | null
          observacoes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tipo?: TipoLancamento
          categoria?: string | null
          valor?: number
          data?: string
          origem?: OrigemLancamento | null
          referencia_id?: string | null
          observacoes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      produtos: {
        Row: {
          id: string
          nome: string
          categoria: string | null
          foto: string | null
          preco_custo: number | null
          preco_venda: number
          estoque_atual: number
          status: ProdutoStatus
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          nome: string
          categoria?: string | null
          foto?: string | null
          preco_custo?: number | null
          preco_venda: number
          estoque_atual?: number
          status?: ProdutoStatus
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          nome?: string
          categoria?: string | null
          foto?: string | null
          preco_custo?: number | null
          preco_venda?: number
          estoque_atual?: number
          status?: ProdutoStatus
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      venda_produtos: {
        Row: {
          id: string
          ordem_servico_id: string | null
          cliente_id: string
          produto_id: string
          quantidade: number
          preco_unitario: number
          created_at: string
        }
        Insert: {
          id?: string
          ordem_servico_id?: string | null
          cliente_id: string
          produto_id: string
          quantidade: number
          preco_unitario: number
          created_at?: string
        }
        Update: {
          id?: string
          ordem_servico_id?: string | null
          cliente_id?: string
          produto_id?: string
          quantidade?: number
          preco_unitario?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'venda_produtos_ordem_servico_id_fkey'
            columns: ['ordem_servico_id']
            isOneToOne: false
            referencedRelation: 'ordens_servico'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'venda_produtos_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'venda_produtos_produto_id_fkey'
            columns: ['produto_id']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
        ]
      }
      avaliacoes_publicas: {
        Row: {
          id: string
          ordem_servico_id: string
          cliente_nome: string
          servico_nome: string | null
          avaliacao: number
          comentario: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ordem_servico_id: string
          cliente_nome: string
          servico_nome?: string | null
          avaliacao: number
          comentario?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ordem_servico_id?: string
          cliente_nome?: string
          servico_nome?: string | null
          avaliacao?: number
          comentario?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'avaliacoes_publicas_ordem_servico_id_fkey'
            columns: ['ordem_servico_id']
            isOneToOne: false
            referencedRelation: 'ordens_servico'
            referencedColumns: ['id']
          },
        ]
      }
      conteudo_site: {
        Row: {
          chave: string
          valor: string
          atualizado_em: string
        }
        Insert: {
          chave: string
          valor: string
          atualizado_em?: string
        }
        Update: {
          chave?: string
          valor?: string
          atualizado_em?: string
        }
        Relationships: []
      }
      galeria_destaques: {
        Row: {
          id: string
          ordem_servico_id: string | null
          foto_url: string
          legenda: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ordem_servico_id?: string | null
          foto_url: string
          legenda?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ordem_servico_id?: string | null
          foto_url?: string
          legenda?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'galeria_destaques_ordem_servico_id_fkey'
            columns: ['ordem_servico_id']
            isOneToOne: false
            referencedRelation: 'ordens_servico'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      avaliar_ordem_servico: {
        Args: { p_ordem_servico_id: string; p_avaliacao: number; p_comentario?: string | null }
        Returns: void
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
