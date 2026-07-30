-- ============================================================
-- MIGRAÇÃO 002 — policy de DELETE em enderecos
-- Rode no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================
-- O script original tinha select/insert/update para `enderecos`, mas
-- nenhuma policy de delete. Com RLS ativado, isso bloqueia qualquer
-- remoção de endereço (até para admin). Segue a mesma regra de posse
-- já usada nas outras policies desta tabela.

create policy "enderecos_delete" on public.enderecos
  for delete using (
    public.is_admin() or cliente_id in (select id from public.clientes where usuario_id = auth.uid())
  );
