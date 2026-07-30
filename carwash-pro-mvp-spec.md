# CarWash Pro — Especificação Técnica do MVP
### Orleans Auto Spa | v1.0 Consolidada

---

## 1. Escopo do MVP (Fase 1)

Critério de corte: só entra no MVP o que resolve a operação real de hoje (agendar, atender, cobrar, controlar caixa) e o diferencial estratégico de venda de produto (marketplace light). Tudo que depende de dado histórico que você ainda não tem (fidelidade avançada, CRM com campanhas, estoque com fornecedor, relatórios exportáveis) fica para Fase 2/3.

**Módulos incluídos no MVP:**

1. Autenticação (Admin / Cliente)
2. Clientes + Endereços
3. Veículos
4. Serviços (catálogo simples, sem pacotes complexos ainda)
5. Agenda (calendário, status, sem conflito de horário)
6. Ordem de Serviço (fotos antes/depois, checklist, valor, pagamento)
7. Financeiro básico (entradas, saídas, saldo)
8. **Marketplace Light** (catálogo simples + estoque manual + venda vinculada ao agendamento)

**Explicitamente fora do MVP** (Fase 2 ou 3, conforme roadmap original do PRD):
Fidelidade com cashback, CRM com etiquetas/campanhas, Estoque com fornecedor/movimentações completas, Dashboard com múltiplos gráficos, Relatórios exportáveis, integrações externas (WhatsApp API, gateway de pagamento, mapas).

---

## 2. Stack Tecnológica Confirmada

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | React + TypeScript + Vite | Padrão de mercado, tipagem forte, build rápido |
| Estilo | Tailwind CSS | Consistência visual sem CSS solto |
| Formulários | React Hook Form + Zod | Validação robusta client-side |
| Dados/servidor | TanStack Query | Cache inteligente, evita over-fetching |
| Backend | Supabase (Postgres + Auth + Storage) | Elimina necessidade de backend próprio; RLS nativo para separar Admin/Cliente |
| Hospedagem | Vercel | Deploy simples, integração nativa com Vite/React |
| Formato do app | PWA | Instalável no celular sem loja de app; prioridade mobile-first (negócio é 100% móvel) |
| Ambiente de build | Claude Code (Desktop) | Executa terminal/git/migrations por você; você aprova, não digita comandos |

Nativo (iOS/Android) e multi-unidade ficam para Fase 4 / v2.0, conforme já previsto no seu PRD original — não refatora nada, só estende.

---

## 3. Modelagem de Dados — MVP

Toda tabela: `id (uuid)`, `created_at`, `updated_at`, `deleted_at` (soft delete quando aplicável).

**Entidades:**

- `usuarios` (admin | cliente, vínculo com Supabase Auth)
- `clientes` (nome, cpf opcional, telefone, whatsapp, email, data_nascimento)
- `enderecos` (cliente_id, nome, cep, rua, numero, bairro, cidade, estado, favorito)
- `veiculos` (cliente_id, marca, modelo, ano, cor, placa, km, foto)
- `servicos` (nome, categoria, descricao, tempo_estimado, preco, status)
- `agendamentos` (cliente_id, veiculo_id, endereco_id, data, hora, status, valor_total)
- `agendamento_servicos` (agendamento_id, servico_id) — tabela de ligação, permite múltiplos serviços por agendamento
- `ordens_servico` (agendamento_id, fotos_antes[], fotos_depois[], checklist, hora_inicio, hora_fim, valor_final, forma_pagamento, avaliacao)
- `produtos` (nome, categoria, foto, preco_custo, preco_venda, estoque_atual)
- `venda_produtos` (ordem_servico_id opcional, produto_id, quantidade, preco_unitario) — venda pode ou não estar vinculada a um atendimento
- `financeiro_lancamentos` (tipo: receita/despesa, categoria, valor, data, origem: servico/produto/manual)

**Relacionamentos-chave:**
Cliente 1:N Veículos | Cliente 1:N Endereços | Veículo 1:N Ordens de Serviço | Agendamento 1:N Serviços (via tabela de ligação) | Ordem de Serviço 1:N Vendas de Produto

Índices prioritários: `placa`, `telefone`, `email`, `data_agendamento`, `status`.

---

## 4. Regras de Negócio Críticas do MVP

- Toda Ordem de Serviço nasce de um Agendamento confirmado (não existe OS avulsa no MVP).
- Baixa de estoque de produto é automática na venda, mas o cadastro de entrada de estoque é manual (você digita quantas unidades comprou).
- Financeiro é alimentado automaticamente por Ordens de Serviço concluídas e vendas de produto, mais lançamentos manuais de despesa.
- Cliente só enxerga e edita os próprios dados (RLS do Supabase aplicado por `usuario_id`).
- Nenhum histórico é excluído (soft delete em todas as tabelas transacionais).

---

## 5. Plano de Execução

**Passo 1** — Você cria conta gratuita no Supabase (supabase.com) e instala o Claude Code Desktop.

**Passo 2** — Você abre o Claude Code apontando para este arquivo de especificação.

**Passo 3** — Construção incremental, módulo por módulo, na ordem: Auth → Clientes/Veículos → Serviços → Agenda → Ordem de Serviço → Financeiro → Marketplace Light. Cada módulo só avança para o próximo quando estiver funcional e testado.

**Passo 4** — Deploy de cada módulo na Vercel conforme fica pronto (não espera o projeto inteiro para publicar; permite você testar cedo com dados reais).

---

## 6. Roadmap Pós-MVP (referência, não implementar agora)

**Fase 2**: Passaporte do Veículo, Minha Garagem, Fidelidade (pontos simples), Relatórios básicos.
**Fase 3**: CRM com etiquetas/campanhas, Estoque avançado (fornecedor, movimentações, alertas), Cupons, Cashback.
**Fase 4 / v2.0**: Integrações externas (WhatsApp Business API, gateway de pagamento, mapas), múltiplos administradores, múltiplas unidades, app nativo.
