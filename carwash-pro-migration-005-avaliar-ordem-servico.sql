-- ============================================================
-- MIGRAÇÃO 005 — cliente avaliar a própria Ordem de Serviço
-- Rode no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================
-- "ordens_servico_write" é restrita a admin (for all), então o cliente não
-- consegue dar nota ao atendimento (coluna "avaliacao"). Em vez de abrir uma
-- policy de UPDATE geral pro cliente — o que deixaria ele livre pra alterar
-- valor_final, forma_pagamento etc via chamada direta à API — a liberação é
-- via função security definer que só toca a coluna "avaliacao" da própria OS
-- (checada pela cadeia agendamento -> cliente -> usuario_id = auth.uid()).

create or replace function public.avaliar_ordem_servico(
  p_ordem_servico_id uuid,
  p_avaliacao smallint
)
returns void
language plpgsql
security definer
as $$
begin
  if p_avaliacao is null or p_avaliacao < 1 or p_avaliacao > 5 then
    raise exception 'Avaliação deve ser um número entre 1 e 5';
  end if;

  update public.ordens_servico
  set avaliacao = p_avaliacao, updated_at = now()
  where id = p_ordem_servico_id
    and agendamento_id in (
      select id from public.agendamentos where cliente_id in (
        select id from public.clientes where usuario_id = auth.uid()
      )
    );

  if not found then
    raise exception 'Ordem de serviço não encontrada ou sem permissão para avaliar';
  end if;
end;
$$;

grant execute on function public.avaliar_ordem_servico(uuid, smallint) to authenticated;
