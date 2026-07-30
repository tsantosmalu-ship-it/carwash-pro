-- ============================================================
-- MIGRAÇÃO 013 — comentário opcional na avaliação do cliente
-- Rode no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================
-- Estende avaliar_ordem_servico (migração 005) pra também gravar
-- comentario_avaliacao (nova coluna da migração ajustes-v2). Terceiro
-- parâmetro com default null mantém compatível com chamadas antigas
-- de 2 argumentos, então não quebra nada já em produção.

create or replace function public.avaliar_ordem_servico(
  p_ordem_servico_id uuid,
  p_avaliacao smallint,
  p_comentario text default null
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
  set avaliacao = p_avaliacao,
      comentario_avaliacao = p_comentario,
      updated_at = now()
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

grant execute on function public.avaliar_ordem_servico(uuid, smallint, text) to authenticated;
