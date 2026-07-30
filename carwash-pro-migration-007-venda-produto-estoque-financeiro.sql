-- ============================================================
-- MIGRAÇÃO 007 — baixa de estoque e receita automática na venda de produto
-- Rode no SQL Editor do Supabase (Dashboard > SQL Editor > New Query)
-- ============================================================
-- "Baixa de estoque de produto é automática na venda" + "Financeiro é
-- alimentado automaticamente por... vendas de produto" (regras de negócio
-- do spec). Mesmo padrão de trigger já usado em handle_new_user e em
-- registrar_receita_ordem_servico (migração 006): dispara ANTES do insert
-- em venda_produtos, trava a linha do produto (for update, evita corrida
-- em vendas simultâneas), recusa a venda se não houver estoque suficiente,
-- debita o estoque e cria o lançamento financeiro — tudo na mesma
-- transação do insert original.

create or replace function public.processar_venda_produto()
returns trigger as $$
declare
  v_estoque_atual int;
begin
  select estoque_atual into v_estoque_atual
    from public.produtos
    where id = new.produto_id
    for update;

  if v_estoque_atual is null then
    raise exception 'Produto não encontrado';
  end if;

  if v_estoque_atual < new.quantidade then
    raise exception 'Estoque insuficiente (disponível: %, solicitado: %)', v_estoque_atual, new.quantidade;
  end if;

  update public.produtos
    set estoque_atual = estoque_atual - new.quantidade, updated_at = now()
    where id = new.produto_id;

  insert into public.financeiro_lancamentos (tipo, categoria, valor, data, origem, referencia_id)
  values ('receita', 'Produto', new.preco_unitario * new.quantidade, current_date, 'produto', new.id);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_venda_produto_insert
  before insert on public.venda_produtos
  for each row execute function public.processar_venda_produto();
