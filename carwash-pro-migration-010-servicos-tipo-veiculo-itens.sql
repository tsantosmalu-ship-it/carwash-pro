-- ============================================================
-- MIGRAÇÃO 010 — tipo de veículo aplicável + itens inclusos em servicos
-- Rode no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================
-- Requisito confirmado em carwash-pro-design-system.md seção 9: a tela
-- admin de cadastro/edição de serviços precisa cobrir "tipo de veículo
-- aplicável" e "itens inclusos (lista editável)", que ainda não existiam
-- na tabela. Ambas as colunas ficam NULLABLE / com default vazio — os
-- serviços já cadastrados (carga inicial do catálogo oficial) não têm
-- esses dados preenchidos, e a própria tela admin nova é o jeito de
-- completar isso, sem precisar de outro script SQL.

alter table public.servicos
  add column if not exists tipo_veiculo text
    check (tipo_veiculo in ('carro', 'moto', 'quadriciclo', 'jet_ski')),
  add column if not exists itens_inclusos text[] not null default '{}';
