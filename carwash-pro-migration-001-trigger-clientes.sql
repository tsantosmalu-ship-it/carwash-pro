-- ============================================================
-- MIGRAÇÃO 001 — trigger de cadastro também cria a linha em `clientes`
-- Rode no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================
-- Por quê: signUp() não retorna sessão ativa quando "Confirm email" está
-- ligado (padrão do Supabase). Sem sessão, um insert feito pelo app em
-- `clientes` é bloqueado pela RLS (usuario_id = auth.uid(), que fica nulo).
-- Solução: o trigger roda como security definer (ignora RLS) e cria a
-- linha em `clientes` junto com a linha em `usuarios`, lendo nome/telefone
-- dos metadados enviados no signUp.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.usuarios (id, role)
  values (new.id, 'cliente');

  insert into public.clientes (usuario_id, nome, email, telefone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    new.email,
    new.raw_user_meta_data->>'telefone'
  );

  return new;
end;
$$ language plpgsql security definer;
