-- ============================================================
-- MIGRAÇÃO 011 — tipo de veículo em veiculos
-- Rode no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================
-- Necessário pro formulário simplificado de cadastro de veículo pedido
-- pelo usuário em 2026-07-30 — não fazia parte do carwash-pro-ajustes-v2.sql.
-- Reaproveita os mesmos 4 valores já usados em servicos.tipo_veiculo, pra
-- manter consistência entre as duas tabelas (e permitir no futuro filtrar
-- quais pacotes/serviços aparecem pra cada veículo do cliente).

alter table public.veiculos
  add column if not exists tipo_veiculo text
    check (tipo_veiculo in ('carro', 'moto', 'quadriciclo', 'jet_ski'));
