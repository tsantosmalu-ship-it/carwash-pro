-- ============================================================
-- MIGRAÇÃO 004 — bucket de Storage para fotos da Ordem de Serviço
-- Rode no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================
-- Cria o bucket "ordens-servico-fotos" (fotos antes/depois do atendimento)
-- e as políticas de acesso: qualquer usuário autenticado pode ler (o app
-- não expõe URLs fora da área logada); só admin pode enviar/alterar/apagar
-- foto, seguindo a mesma regra de "ordens_servico_write" já existente na
-- tabela. Não há escopo por cliente aqui (mesma simplicidade já usada em
-- "servicos_select"/"produtos_select" — leitura ampla para autenticados);
-- se precisar de isolamento mais rígido por cliente no futuro, dá pra
-- trocar a policy de select por uma que valide o dono via o path do arquivo.

insert into storage.buckets (id, name, public)
values ('ordens-servico-fotos', 'ordens-servico-fotos', true)
on conflict (id) do nothing;

create policy "os_fotos_select" on storage.objects
  for select using (bucket_id = 'ordens-servico-fotos' and auth.uid() is not null);

create policy "os_fotos_insert" on storage.objects
  for insert with check (bucket_id = 'ordens-servico-fotos' and public.is_admin());

create policy "os_fotos_update" on storage.objects
  for update using (bucket_id = 'ordens-servico-fotos' and public.is_admin());

create policy "os_fotos_delete" on storage.objects
  for delete using (bucket_id = 'ordens-servico-fotos' and public.is_admin());
