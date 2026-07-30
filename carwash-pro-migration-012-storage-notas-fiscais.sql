-- ============================================================
-- MIGRAÇÃO 012 — políticas de Storage do bucket notas-fiscais
-- Rode no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================
-- O bucket "notas-fiscais" já foi criado manualmente pelo usuário no
-- Dashboard (Storage > New bucket), então este script só cria as
-- políticas de acesso — diferente das migrações 004/008, não insere
-- o bucket via SQL.
--
-- Nota fiscal é documento mais sensível que fotos de OS, então a leitura
-- aqui é restrita ao dono (cliente do agendamento) ou admin — não
-- "qualquer autenticado" como nas fotos. Convenção de path esperada pelo
-- app: "<ordem_servico_id>/<qualquer-nome>.pdf".

create policy "notas_fiscais_select" on storage.objects
  for select using (
    bucket_id = 'notas-fiscais'
    and (
      public.is_admin()
      or (storage.foldername(name))[1]::uuid in (
        select os.id
        from public.ordens_servico os
        join public.agendamentos a on a.id = os.agendamento_id
        join public.clientes c on c.id = a.cliente_id
        where c.usuario_id = auth.uid()
      )
    )
  );

create policy "notas_fiscais_insert" on storage.objects
  for insert with check (bucket_id = 'notas-fiscais' and public.is_admin());

create policy "notas_fiscais_update" on storage.objects
  for update using (bucket_id = 'notas-fiscais' and public.is_admin());

create policy "notas_fiscais_delete" on storage.objects
  for delete using (bucket_id = 'notas-fiscais' and public.is_admin());
