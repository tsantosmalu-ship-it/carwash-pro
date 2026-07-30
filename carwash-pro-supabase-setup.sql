-- ============================================================
-- CARWASH PRO — SETUP INICIAL SUPABASE
-- Orleans Auto Spa | Execute na ordem, seção por seção
-- Cole no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================

-- ============================================================
-- ETAPA 1 — EXTENSÕES NECESSÁRIAS
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- ETAPA 2 — TABELA DE USUÁRIOS (vínculo com Supabase Auth)
-- ============================================================
-- Toda pessoa que faz login (admin ou cliente) tem uma linha aqui.
-- O id é o MESMO id do auth.users — não duplica cadastro.

create table public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'cliente' check (role in ('admin', 'cliente')),
  created_at timestamptz not null default now()
);

-- Trigger: toda vez que alguém se cadastra (auth.users), cria automaticamente
-- a linha correspondente em usuarios com role padrão 'cliente'.
-- Você promove os dois administradores manualmente depois (Etapa 6).

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.usuarios (id, role)
  values (new.id, 'cliente');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ETAPA 3 — TABELAS DE NEGÓCIO (MVP)
-- ============================================================

create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid unique references public.usuarios(id) on delete set null,
  nome text not null,
  cpf text,
  telefone text,
  whatsapp text,
  email text,
  data_nascimento date,
  foto_perfil text,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_clientes_telefone on public.clientes(telefone);
create index idx_clientes_email on public.clientes(email);

create table public.enderecos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  nome text not null,
  cep text,
  rua text,
  numero text,
  complemento text,
  bairro text,
  cidade text,
  estado text,
  referencia text,
  favorito boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.veiculos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  marca text not null,
  modelo text not null,
  versao text,
  ano int,
  cor text,
  placa text,
  km int,
  tipo_pintura text,
  foto_principal text,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_veiculos_placa on public.veiculos(placa);

create table public.servicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria text,
  descricao text,
  tempo_estimado_min int,
  preco numeric(10,2) not null,
  status text not null default 'ativo' check (status in ('ativo', 'inativo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  veiculo_id uuid not null references public.veiculos(id) on delete cascade,
  endereco_id uuid references public.enderecos(id),
  data date not null,
  hora time not null,
  status text not null default 'solicitado' check (
    status in ('solicitado','confirmado','em_deslocamento','iniciado','concluido','finalizado','cancelado')
  ),
  valor_total numeric(10,2),
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_agendamentos_data on public.agendamentos(data);
create index idx_agendamentos_status on public.agendamentos(status);

create table public.agendamento_servicos (
  id uuid primary key default gen_random_uuid(),
  agendamento_id uuid not null references public.agendamentos(id) on delete cascade,
  servico_id uuid not null references public.servicos(id),
  preco_aplicado numeric(10,2) not null
);

create table public.ordens_servico (
  id uuid primary key default gen_random_uuid(),
  agendamento_id uuid unique not null references public.agendamentos(id) on delete cascade,
  fotos_antes text[],
  fotos_depois text[],
  checklist jsonb,
  hora_inicio timestamptz,
  hora_fim timestamptz,
  valor_final numeric(10,2),
  forma_pagamento text check (forma_pagamento in ('pix','dinheiro','cartao','transferencia')),
  avaliacao smallint check (avaliacao between 1 and 5),
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria text,
  foto text,
  preco_custo numeric(10,2),
  preco_venda numeric(10,2) not null,
  estoque_atual int not null default 0,
  status text not null default 'ativo' check (status in ('ativo','inativo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.venda_produtos (
  id uuid primary key default gen_random_uuid(),
  ordem_servico_id uuid references public.ordens_servico(id) on delete set null,
  cliente_id uuid not null references public.clientes(id),
  produto_id uuid not null references public.produtos(id),
  quantidade int not null check (quantidade > 0),
  preco_unitario numeric(10,2) not null,
  created_at timestamptz not null default now()
);

create table public.financeiro_lancamentos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('receita','despesa')),
  categoria text,
  valor numeric(10,2) not null,
  data date not null default current_date,
  origem text check (origem in ('servico','produto','manual')),
  referencia_id uuid,
  observacoes text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ETAPA 4 — FUNÇÃO AUXILIAR PARA CHECAR PERFIL ADMIN
-- ============================================================
-- Toda política de segurança abaixo usa esta função.

create function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.usuarios
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ============================================================
-- ETAPA 5 — ROW LEVEL SECURITY (RLS)
-- Regra geral: admin vê e edita tudo. Cliente só vê e edita o que é dele.
-- ============================================================

alter table public.usuarios enable row level security;
alter table public.clientes enable row level security;
alter table public.enderecos enable row level security;
alter table public.veiculos enable row level security;
alter table public.servicos enable row level security;
alter table public.agendamentos enable row level security;
alter table public.agendamento_servicos enable row level security;
alter table public.ordens_servico enable row level security;
alter table public.produtos enable row level security;
alter table public.venda_produtos enable row level security;
alter table public.financeiro_lancamentos enable row level security;

-- usuarios: cada um vê a própria linha; admin vê todas.
create policy "usuarios_select" on public.usuarios
  for select using (id = auth.uid() or public.is_admin());

-- clientes: dono vê/edita o próprio cadastro; admin tudo.
create policy "clientes_select" on public.clientes
  for select using (usuario_id = auth.uid() or public.is_admin());
create policy "clientes_insert" on public.clientes
  for insert with check (usuario_id = auth.uid() or public.is_admin());
create policy "clientes_update" on public.clientes
  for update using (usuario_id = auth.uid() or public.is_admin());

-- enderecos: segue a posse do cliente.
create policy "enderecos_select" on public.enderecos
  for select using (
    public.is_admin() or cliente_id in (select id from public.clientes where usuario_id = auth.uid())
  );
create policy "enderecos_insert" on public.enderecos
  for insert with check (
    public.is_admin() or cliente_id in (select id from public.clientes where usuario_id = auth.uid())
  );
create policy "enderecos_update" on public.enderecos
  for update using (
    public.is_admin() or cliente_id in (select id from public.clientes where usuario_id = auth.uid())
  );

-- veiculos: mesma lógica de posse.
create policy "veiculos_select" on public.veiculos
  for select using (
    public.is_admin() or cliente_id in (select id from public.clientes where usuario_id = auth.uid())
  );
create policy "veiculos_insert" on public.veiculos
  for insert with check (
    public.is_admin() or cliente_id in (select id from public.clientes where usuario_id = auth.uid())
  );
create policy "veiculos_update" on public.veiculos
  for update using (
    public.is_admin() or cliente_id in (select id from public.clientes where usuario_id = auth.uid())
  );

-- servicos e produtos: leitura pública para usuários autenticados; escrita só admin.
create policy "servicos_select" on public.servicos
  for select using (auth.uid() is not null);
create policy "servicos_write" on public.servicos
  for all using (public.is_admin()) with check (public.is_admin());

create policy "produtos_select" on public.produtos
  for select using (auth.uid() is not null);
create policy "produtos_write" on public.produtos
  for all using (public.is_admin()) with check (public.is_admin());

-- agendamentos: cliente vê/cria os próprios; admin tudo.
create policy "agendamentos_select" on public.agendamentos
  for select using (
    public.is_admin() or cliente_id in (select id from public.clientes where usuario_id = auth.uid())
  );
create policy "agendamentos_insert" on public.agendamentos
  for insert with check (
    public.is_admin() or cliente_id in (select id from public.clientes where usuario_id = auth.uid())
  );
create policy "agendamentos_update" on public.agendamentos
  for update using (public.is_admin());

-- agendamento_servicos: segue a posse via agendamento.
create policy "agendamento_servicos_select" on public.agendamento_servicos
  for select using (
    public.is_admin() or agendamento_id in (
      select id from public.agendamentos where cliente_id in (
        select id from public.clientes where usuario_id = auth.uid()
      )
    )
  );
create policy "agendamento_servicos_write" on public.agendamento_servicos
  for all using (public.is_admin()) with check (public.is_admin());

-- ordens_servico: cliente só lê a própria; só admin escreve.
create policy "ordens_servico_select" on public.ordens_servico
  for select using (
    public.is_admin() or agendamento_id in (
      select id from public.agendamentos where cliente_id in (
        select id from public.clientes where usuario_id = auth.uid()
      )
    )
  );
create policy "ordens_servico_write" on public.ordens_servico
  for all using (public.is_admin()) with check (public.is_admin());

-- venda_produtos: cliente lê as próprias; admin tudo, admin registra venda.
create policy "venda_produtos_select" on public.venda_produtos
  for select using (
    public.is_admin() or cliente_id in (select id from public.clientes where usuario_id = auth.uid())
  );
create policy "venda_produtos_write" on public.venda_produtos
  for all using (public.is_admin()) with check (public.is_admin());

-- financeiro_lancamentos: só admin, nunca cliente.
create policy "financeiro_admin_only" on public.financeiro_lancamentos
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- ETAPA 6 — PROMOVER OS DOIS ADMINISTRADORES
-- ============================================================
-- Rode ISSO SÓ DEPOIS de você e seu sócio criarem conta no app
-- (ou seja, depois que a Etapa 2 já gerou a linha em usuarios).
-- Troque o e-mail abaixo pelo e-mail real de cada administrador.

-- update public.usuarios set role = 'admin'
-- where id = (select id from auth.users where email = 'seu-email@exemplo.com');
