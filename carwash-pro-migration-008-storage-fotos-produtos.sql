-- ============================================================
-- MIGRAÇÃO 008 — bucket de Storage para fotos de produtos
-- Rode no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================
-- Mesmo padrão da migração 004 (fotos da Ordem de Serviço): bucket
-- público, leitura para qualquer autenticado, escrita só admin.

insert into storage.buckets (id, name, public)
values ('produtos-fotos', 'produtos-fotos', true)
on conflict (id) do nothing;

create policy "produtos_fotos_select" on storage.objects
  for select using (bucket_id = 'produtos-fotos' and auth.uid() is not null);

create policy "produtos_fotos_insert" on storage.objects
  for insert with check (bucket_id = 'produtos-fotos' and public.is_admin());

create policy "produtos_fotos_update" on storage.objects
  for update using (bucket_id = 'produtos-fotos' and public.is_admin());

create policy "produtos_fotos_delete" on storage.objects
  for delete using (bucket_id = 'produtos-fotos' and public.is_admin());
