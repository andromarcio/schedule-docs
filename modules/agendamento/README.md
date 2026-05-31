<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Domínio: Agendamento
> **Nível 1** — Visão estratégica do domínio

## Responsabilidade
Este domínio é o coração operacional do CleanSched. Ele gera a agenda semanal de limpezas com base nos imóveis ativos e suas frequências, permite que a gerente atribua os membros da equipe a cada imóvel em cada dia, e oferece a visão consolidada da semana para toda a equipe. É aqui que a decisão de "quem vai a qual casa e quando" se concretiza.

### O que este domínio NÃO faz
| Responsabilidade | Pertence a |
|---|---|
| Manter dados dos imóveis e clientes | Domínio: Clientes e Imóveis |
| Manter dados e disponibilidade da equipe | Domínio: Equipe |
| Emitir faturas ou cobranças | Fora do escopo do sistema |

---

## Feature Sets

| Feature Set | Pasta | Responsabilidade | Features |
|---|---|---|---|
| [Agenda Semanal](./agenda-semanal/README.md) | `agendamento/agenda-semanal/` | Geração, atribuição de equipe e visualização da agenda da semana | 3 |

---

## Regras transversais do domínio

1. A semana de trabalho é sempre de segunda a sexta-feira.
2. Máximo de 5 imóveis por dia na agenda. → ver RULES-DICTIONARY: Limite de 5 imóveis por dia
3. Agenda confirmada é imutável sem ação explícita de reabertura pelo Gerente. → ver RULES-DICTIONARY: Agenda confirmada é imutável
4. Imóvel inativo nunca aparece na geração de agenda. → ver RULES-DICTIONARY: Imóvel inativo não gera agenda
5. Cada imóvel pode aparecer no máximo uma vez por semana na agenda (independente de haver capacidade sobrando no dia).
6. Todo item de agenda deve ter ao menos um membro com função **Líder** para que a agenda possa ser confirmada.
7. Ao confirmar a agenda, o sistema publica o evento `agenda.confirmada`, que atualiza a data de última limpeza de cada imóvel.

---

## Lógica de frequência na geração automática

| Frequência | Comportamento na geração |
|---|---|
| SEMANAL | Incluído toda semana sem exceção |
| QUINZENAL | Incluído em semanas alternadas: semanas 1 e 3 do mês (ou 2 e 4 quando a semana 1 não couber) |
| MENSAL | Incluído uma vez por mês; preferencialmente na primeira semana do mês |

---

## Integrações com outros domínios

### Leitura — domínios que consomem dados deste domínio
| Domínio | O que consome | Como |
|---|---|---|
| — | Nenhum domínio consome dados de Agendamento diretamente | — |

### Escrita — domínios que criam ou alteram dados deste domínio
| Domínio | O que altera | Situação |
|---|---|---|
| Clientes e Imóveis | Fornece imóveis para a agenda | Leitura (FK) |
| Equipe | Fornece membros e disponibilidades | Leitura (FK) |

### Eventos publicados por este domínio
| Evento | Quando | Consumido por |
|---|---|---|
| `agenda.confirmada` | Ao confirmar a agenda semanal | Clientes e Imóveis (atualiza `lastCleanedAt`) |

---

<div class="dev-only">

## Entidades do domínio

| Entidade | Descrição | Campos no DATA-MODEL.md |
|---|---|---|
| Agenda Semanal | Cabeçalho da agenda de uma semana | → ver DATA-MODEL.md: Agenda Semanal |
| Item de Agenda | Um imóvel agendado para um dia específico | → ver DATA-MODEL.md: Item de Agenda |
| Membro do Item de Agenda | Atribuição de um membro a um item | → ver DATA-MODEL.md: Membro do Item de Agenda |

---

## Dependências externas

| Serviço | Uso | Lib sugerida |
|---|---|---|
| — | Sem dependências externas nesta versão | — |

---

## Regras de acesso consolidadas

| Role | Pode fazer |
|---|---|
| GERENTE | Gerar, editar, atribuir equipe, confirmar e reabrir agendas; visualizar qualquer semana |
| MEMBRO | Visualizar a própria agenda da semana atual e próximas; visualizar endereço dos imóveis atribuídos |

---

</div>

---

*Última revisão: 2026-05-31*
*Links: [Agenda Semanal](./agenda-semanal/README.md) · [INDEX geral](../INDEX.md)*
