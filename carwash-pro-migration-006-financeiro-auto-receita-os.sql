-- ============================================================
-- MIGRAÇÃO 006 — lançamento automático de receita ao concluir a OS
-- Rode no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================
-- "Financeiro é alimentado automaticamente por Ordens de Serviço
-- concluídas" (regra de negócio do spec). Implementado como trigger
-- (mesmo padrão de handle_new_user) em vez de lógica no app: assim o
-- lançamento acontece de forma confiável não importa por onde o status
-- do agendamento seja alterado, sem depender do front-end lembrar de
-- fazer essa chamada extra. Dispara quando o status muda PARA
-- 'concluido'; usa o valor_final da OS (ou o valor_total do agendamento
-- como fallback se a OS não tiver valor_final definido); é idempotente
-- (não duplica lançamento se o status oscilar).

create or replace function public.registrar_receita_ordem_servico()
returns trigger as $$
declare
  v_ordem_servico_id uuid;
  v_valor numeric(10,2);
begin
  if new.status = 'concluido' and (old.status is distinct from new.status) then
    select id, coalesce(valor_final, new.valor_total)
      into v_ordem_servico_id, v_valor
      from public.ordens_servico
      where agendamento_id = new.id;

    if v_ordem_servico_id is not null and v_valor is not null then
      if not exists (
        select 1 from public.financeiro_lancamentos
        where origem = 'servico' and referencia_id = v_ordem_servico_id
      ) then
        insert into public.financeiro_lancamentos (tipo, categoria, valor, data, origem, referencia_id)
        values ('receita', 'Serviço', v_valor, current_date, 'servico', v_ordem_servico_id);
      end if;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_agendamento_concluido
  after update on public.agendamentos
  for each row execute function public.registrar_receita_ordem_servico();
