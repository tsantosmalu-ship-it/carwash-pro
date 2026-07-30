-- ============================================================
-- MIGRAÇÃO 009 — bloquear conflito de horário no agendamento
-- Rode no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================
-- Decisão do usuário em 2026-07-30: a Orleans Auto Spa atende um veículo
-- por vez (Premium Delivery, uma equipe só), então dois agendamentos não
-- podem existir no mesmo dia+horário exatos. Isso substitui o "sem
-- conflito de horário" do spec original do MVP (mudança de escopo pedida
-- explicitamente pelo usuário, não um bug).
--
-- Mesmo padrão de trigger das migrações 006/007: dispara ANTES do insert
-- em agendamentos, recusa se já existir outro agendamento (não cancelado)
-- no mesmo data+hora. O texto da exceção aparece direto pro usuário via
-- getErrorMessage() no front (que já cai no fallback error.message).
--
-- Só cobre INSERT porque hoje não existe tela de reagendar (mudar
-- data/hora de um agendamento existente) — se essa tela for construída no
-- futuro, este trigger precisa ser estendido para BEFORE UPDATE também.

create or replace function public.verificar_conflito_horario()
returns trigger as $$
begin
  if exists (
    select 1 from public.agendamentos
    where data = new.data
      and hora = new.hora
      and status <> 'cancelado'
      and deleted_at is null
  ) then
    raise exception 'Esse horário já está ocupado por outro agendamento. Escolha outro horário.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_agendamento_conflito_horario
  before insert on public.agendamentos
  for each row execute function public.verificar_conflito_horario();
