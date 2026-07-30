-- ============================================================
-- MIGRAÇÃO 003 — permitir que o cliente vincule serviços ao próprio agendamento
-- Rode no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================
-- O script original só tinha "agendamento_servicos_write" restrita a admin
-- (for all using is_admin()). Como "agendamentos_insert" já permite o
-- cliente criar o próprio agendamento, mas a tabela de ligação com os
-- serviços escolhidos ficava bloqueada para ele — o mesmo tipo de lacuna
-- já corrigida em enderecos (migração 002). Esta policy adicional (as
-- policies do Postgres são combinadas com OR) libera apenas o INSERT,
-- e apenas para agendamentos que são do próprio cliente. Update/delete
-- continuam só para admin, via a policy "agendamento_servicos_write"
-- já existente.

create policy "agendamento_servicos_insert_cliente" on public.agendamento_servicos
  for insert with check (
    agendamento_id in (
      select id from public.agendamentos where cliente_id in (
        select id from public.clientes where usuario_id = auth.uid()
      )
    )
  );
