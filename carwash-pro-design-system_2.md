# Orleans Auto Spa — Design System Oficial
### Referência visual definitiva para implementação no Claude Code

---

## 1. Posicionamento (afeta todo copy da interface)

"Orleans Auto Spa não é um lava-jato. É uma empresa de Estética Automotiva Premium Delivery. Nosso foco não é apenas limpar veículos — é preservar, valorizar e proteger um patrimônio."

Regra de copywriting: nunca usar "lava-jato" em textos voltados ao cliente na interface. Usar "estética automotiva", "detalhamento", "cuidado premium". O termo pode continuar existindo internamente no banco de dados sem problema.

---

## 2. Cores oficiais

| Token | Hex | Uso |
|---|---|---|
| `--preto-premium` | `#0B0B0B` | Fundo principal (único modo — ver seção 5) |
| `--dourado-principal` | `#C8A24A` | Cor de destaque primária: preços, CTAs, ícones ativos |
| `--dourado-claro` | `#E9D28C` | Textos de destaque secundário, hover states sutis |
| `--dourado-escuro` | `#9B7330` | Bordas de ênfase, estados pressed, sombras douradas |
| `--branco-premium` | `#F5F5F5` | Texto principal sobre fundo escuro |

Regra de aplicação: dourado é cor de destaque, nunca cor de fundo em áreas grandes. Textos secundários usam cinza médio (`#8A8A8A`, não catalogado oficialmente mas necessário para hierarquia — usar com moderação).

---

## 3. Tipografia

| Uso | Fonte | Peso |
|---|---|---|
| Títulos e wordmark | Cinzel | 500–600 |
| Corpo de texto e UI | Montserrat | 400 |
| Destaques (preços, labels importantes) | Montserrat SemiBold | 600 |

Carregar via Google Fonts: `Cinzel:wght@500;600` e `Montserrat:wght@400;600`.

---

## 4. Navegação (Arquitetura de Informação — Área do Cliente)

Bottom tab bar fixo, 5 seções, validado via protótipo:

1. **Início** — saudação, veículo(s) resumido(s), próximo atendimento, atalhos rápidos (Agendar lavagem / Comprar produtos)
2. **Agendar** — fluxo de agendamento (seleciona veículo → serviço/pacote → data/horário → endereço → produtos opcionais → confirmação)
3. **Pacotes** — catálogo dos 4 planos oficiais de carro + linha duas rodas/náutico (ver seção 6). É a MESMA entidade que "serviços" no banco — não é camada promocional separada.
4. **Loja** — marketplace light (produtos avulsos para compra)
5. **Garagem** — "Minha Garagem": veículo(s) do cliente, indicador de dias desde última lavagem, lembretes de manutenção, linha do tempo de histórico

Login separado por perfil (Admin / Cliente) conforme já implementado no schema com RLS — **não** existe toggle de troca de perfil na interface final, isso era só recurso de demonstração do protótipo anterior.

---

## 5. Modo de exibição

**Decisão final: dark-only no MVP.** Light Mode não entra nesta fase. A identidade da marca é essencialmente noturna; dourado sobre preto é onde a marca "respira" com mais força. Não implementar toggle de tema nem lógica de preferência de sistema operacional no MVP — evita retrabalho caso Light Mode nunca vire prioridade real.

---

## 6. Catálogo oficial de serviços (fonte única de verdade)

Populado via `carwash-pro-schema-update-consolidado.sql` (script idempotente que substituiu os três scripts incrementais anteriores). Resumo:

| Serviço | Categoria | Tipo de veículo | Preço |
|---|---|---|---|
| Lavagem Essencial | Lavagem | Carro | R$ 79,00 |
| Lavagem Detalhada | Lavagem | Carro | R$ 99,00 |
| Lavagem Detalhada + Proteção de Pintura | Proteção | Carro | R$ 119,00 |
| Lavagem Detalhada + Proteção de Pintura + Tratamento para Couro | Proteção | Carro | R$ 189,00* |
| Moto | Duas Rodas | Moto | R$ 109,00 |
| Quadriciclo | Duas Rodas | Quadriciclo | R$ 99,00 |
| Jet Ski | Náutico | Jet Ski | R$ 109,00 |

*Decisão final: preço fixo em todos os serviços, sem exceção de linguagem "a partir de" na interface. O admin tem tela própria de edição (ver seção 9) para ajustar qualquer valor manualmente, caso a avaliação do veículo no local exija um preço diferente do padrão.

---

## 7. Elementos gráficos e ícones

Do Manual da Marca: silhueta de veículo (linha fina), gota d'água, linhas premium, brilho, detalhes metálicos.

Ícones funcionais (Tabler outline, já disponíveis no ambiente): `ti-car`, `ti-droplet`, `ti-calendar`, `ti-clock`, `ti-shopping-bag` (loja), `ti-package` (pacotes), `ti-home`.

---

## 9. Módulo Admin — Cadastro de Serviços/Pacotes (requisito confirmado)

O catálogo inicial é populado via SQL (`carwash-pro-schema-update-catalogo-servicos.sql`), mas isso é só a carga inicial — **não é suficiente como solução permanente**. O admin precisa de uma tela própria dentro do app para não depender do SQL Editor do Supabase toda vez que precisar ajustar o negócio. Este é um requisito de MVP, não de Fase 2, porque preço e catálogo mudam com frequência em qualquer negócio real.

Tela administrativa deve permitir, sem tocar em SQL:

- **Criar novo serviço/pacote**: nome, categoria, tipo de veículo aplicável, preço, itens inclusos (lista editável), status (ativo/inativo)
- **Editar serviço existente**: todos os campos acima, incluindo `preco` (cobre o caso de avaliação no local exigir valor diferente do padrão) e `tempo_estimado_min` (deixado em branco na carga inicial — o admin preenche aqui com o tempo real observado na operação, não um valor estimado por terceiros)
- **Desativar serviço** (soft — usar `status = 'inativo'`, nunca excluir de fato, para preservar histórico de Ordens de Serviço já geradas com aquele serviço)
- Essa tela não precisa de aprovação/workflow — é acesso direto de admin, dado que só existem dois administradores e ambos são donos do negócio

Isso vira parte do Módulo 3 (Serviços) já descrito no `carwash-pro-mvp-spec.md` — não é módulo novo, é a garantia de que "catálogo configurável" (como o PRD original pedia) realmente significa configurável pelo usuário final, não só pelo desenvolvedor.
