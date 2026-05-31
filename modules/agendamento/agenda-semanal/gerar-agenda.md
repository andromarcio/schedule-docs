<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Gerar Agenda
> **Nível 3** — Feature Set: Agenda Semanal — Domínio: Agendamento

## Descrição
Permite à gerente criar a agenda de limpezas para uma semana específica. O sistema sugere automaticamente quais imóveis devem ser limpos naquela semana com base na frequência contratada e na data da última limpeza de cada imóvel. A gerente pode revisar e ajustar antes de salvar.

---

## Regras de negócio

1. Só pode existir uma agenda por semana (identificada pelo início da semana — segunda-feira).
2. Imóveis inativos não entram na geração automática. → ver RULES-DICTIONARY: Imóvel inativo não gera agenda
3. Máximo de 5 imóveis por dia. → ver RULES-DICTIONARY: Limite de 5 imóveis por dia
4. **Imóveis semanais** (SEMANAL): incluídos em toda semana.
5. **Imóveis quinzenais** (QUINZENAL): incluídos em semanas alternadas. O sistema verifica a data da última limpeza — se foi há 14 ou mais dias (ou nunca foi limpo), inclui na semana atual.
6. **Imóveis mensais** (MENSAL): incluídos quando a data da última limpeza foi há 28 ou mais dias (ou nunca foi limpo).
7. A geração automática distribui os imóveis uniformemente pelos dias úteis da semana, respeitando o limite de 5 por dia. Imóveis com tamanho G são preferencialmente alocados no início da semana.
8. A gerente pode mover imóveis entre dias, adicionar imóveis que não foram sugeridos, ou remover sugestões.
9. A agenda é salva com status **Rascunho** — ainda pode ser editada.
10. Não é possível gerar agenda para semana já existente — use edição de agenda.

---

## Cenários

```gherkin
Feature: Gerar agenda semanal

  Background:
    Given que a gerente está autenticada
    And existem imóveis ativos cadastrados com diferentes frequências

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Geração automática para semana sem agenda
    Given que não existe agenda para a semana de 08/06/2026 (segunda)
    When a gerente clica em "Gerar Agenda" para a semana de 08/06/2026
    Then o sistema calcula quais imóveis devem ser atendidos na semana
    And distribui os imóveis pelos dias (segunda a sexta), máximo 5 por dia
    And exibe a agenda como rascunho para revisão
    And o status da agenda é "Rascunho"

  Scenario: Imóvel SEMANAL sempre incluído
    Given que "Casa da Maria — Oak St" tem frequência "Semanal"
    When o sistema gera a agenda para qualquer semana
    Then "Casa da Maria — Oak St" é sempre incluída

  Scenario: Imóvel QUINZENAL incluído após 14 dias
    Given que "Casa da Karen" tem frequência "Quinzenal"
    And a última limpeza foi em "26/05/2026"
    When o sistema gera a agenda para a semana de "08/06/2026"
    Then "Casa da Karen" é incluída (13 dias depois — dentro do período quinzenal)

  Scenario: Imóvel QUINZENAL não incluído antes de 14 dias
    Given que "Casa da Karen" foi limpa em "02/06/2026"
    When o sistema gera agenda para "08/06/2026"
    Then "Casa da Karen" NÃO é incluída automaticamente
    And a gerente pode adicioná-la manualmente se necessário

  Scenario: Imóvel MENSAL incluído após 28 dias ou nunca limpo
    Given que "Casa do Robert" tem frequência "Mensal"
    And nunca foi limpo (lastCleanedAt vazio)
    When o sistema gera a agenda para qualquer semana
    Then "Casa do Robert" é incluída

  Scenario: Gerente remove imóvel sugerido
    Given que a agenda gerada inclui "Casa da Emily"
    When a gerente clica em remover "Casa da Emily" da agenda
    Then "Casa da Emily" é removida da semana

  Scenario: Gerente adiciona imóvel não sugerido
    Given que a agenda foi gerada sem "Casa da Linda" (por frequência)
    When a gerente clica em "Adicionar imóvel" e seleciona "Casa da Linda" para quarta-feira
    Then "Casa da Linda" é adicionada à agenda de quarta

  # ── Conflitos com dados existentes ─────────────────────────────

  Scenario: Tentativa de gerar agenda para semana já existente
    Given que já existe agenda para a semana de 08/06/2026
    When a gerente tenta gerar novamente para a mesma semana
    Then o sistema exibe: "Já existe uma agenda para esta semana. Acesse-a para fazer alterações."

  # ── Estados especiais ──────────────────────────────────────────

  Scenario: Nenhum imóvel a agendar na semana
    Given que todos os imóveis ativos são mensais e foram limpos recentemente
    When a gerente gera a agenda
    Then o sistema cria a agenda vazia com mensagem: "Nenhum imóvel foi sugerido para esta semana. Adicione manualmente se necessário."
```

---

## Campos

*Esta feature não possui formulário de campos simples — é uma tela de revisão de agenda.*

### Campos preenchidos automaticamente pelo sistema

| Label PO | Valor | Quando |
|---|---|---|
| Início da semana | Segunda-feira da semana selecionada | Na geração |
| Fim da semana | Sexta-feira da semana selecionada | Na geração |
| Status | Rascunho | Na geração |
| Ordem no dia | 1 a N (por tamanho: G primeiro) | Na geração automática |

---

## Comportamento de tela

### Onde fica
Tela principal em `/agenda`. Exibe calendário semanal. Botão "Gerar Agenda" aparece quando a semana selecionada não tem agenda ainda.

### Layout da tela de revisão
Visão de 5 colunas (seg–sex). Cada coluna mostra os imóveis agendados para aquele dia com cards contendo: apelido do imóvel, tamanho (P/M/G), nome do cliente. Cards são arrastáveis entre dias (drag-and-drop).

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading (geração) | Spinner central com texto "Calculando agenda..." |
| Agenda vazia (nenhuma sugestão) | Toast informativo + tela vazia com botão "Adicionar imóvel" |
| Rascunho gerado | Agenda preenchida, editável; banner amarelo "Rascunho — atribuição de equipe pendente" |
| Limite do dia atingido | Ao tentar adicionar 6º imóvel em um dia, exibe: "Este dia já atingiu o limite de 5 casas." |
| Erro de servidor | Toast vermelho: "Não foi possível gerar a agenda. Tente novamente." |
| Conflito de semana existente | Modal informativo com link para a agenda da semana |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Agenda Semanal · → ver DATA-MODEL.md: Item de Agenda

---

## Cenários técnicos adicionais

```gherkin
  Scenario: POST retorna 201 com lista de itens gerados
    When POST /api/v1/agendamento/agenda com { weekStart: "2026-06-08" }
    Then resposta HTTP 201
    And body { "data": { "id": "uuid", "weekStart": "2026-06-08", "status": "RASCUNHO", "items": [...] } }

  Scenario: POST para semana existente retorna 409
    When POST /api/v1/agendamento/agenda com weekStart de semana já existente
    Then resposta HTTP 409
    And body { "error": { "code": "AGENDA_JA_EXISTE" } }

  Scenario: Adicionar imóvel excedendo limite do dia retorna 422
    When POST /api/v1/agendamento/agenda/:id/items com cleaningDate em dia lotado
    Then resposta HTTP 422
    And body { "error": { "code": "AGENDA_LIMITE_DIA_EXCEDIDO" } }
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `AGENDA_JA_EXISTE` | 409 | "Já existe uma agenda para esta semana." |
| `AGENDA_LIMITE_DIA_EXCEDIDO` | 422 | "Este dia já atingiu o limite de 5 casas." |
| `AGENDA_IMOVEL_JA_AGENDADO` | 409 | "Este imóvel já está na agenda desta semana." |
| `AGENDA_DATA_INVALIDA` | 422 | "A data deve ser um dia útil dentro da semana selecionada." |
| `IMOVEL_NOT_FOUND` | 404 | "Imóvel não encontrado." |
| `AUTH_FORBIDDEN` | 403 | "Você não tem permissão para esta ação." |
| `INTERNAL_ERROR` | 500 | "Não foi possível gerar a agenda. Tente novamente." |

---

## API

### POST /api/v1/agendamento/agenda
**Acesso**: autenticado — role `GERENTE`

**Body**:
```typescript
{
  weekStart: string   // ISO 8601 date — deve ser uma segunda-feira
}
```

**Resposta de sucesso** — HTTP 201: Agenda Semanal com itens gerados

---

### POST /api/v1/agendamento/agenda/:scheduleId/items
**Acesso**: autenticado — role `GERENTE`
Adiciona imóvel manualmente a uma agenda em Rascunho.

**Body**:
```typescript
{
  propertyId: string
  cleaningDate: string   // data dentro da semana, dia útil
}
```

---

### DELETE /api/v1/agendamento/agenda/:scheduleId/items/:itemId
**Acesso**: autenticado — role `GERENTE`
Remove item de agenda em Rascunho.

---

### PATCH /api/v1/agendamento/agenda/:scheduleId/items/:itemId
**Acesso**: autenticado — role `GERENTE`
Move item para outro dia ou ajusta ordem.

**Body**:
```typescript
{
  cleaningDate?: string
  dayOrder?: number
}
```

---

## Lógica de geração (algoritmo)

```
1. Busca todos os imóveis ativos
2. Para cada imóvel, verifica se deve entrar na semana:
   - SEMANAL → sempre
   - QUINZENAL → se (hoje - lastCleanedAt) >= 13 dias OU lastCleanedAt é null
   - MENSAL → se (hoje - lastCleanedAt) >= 27 dias OU lastCleanedAt é null
3. Ordena imóveis: G primeiro, depois M, depois P
4. Distribui pelos dias da semana (seg a sex), round-robin com limite de 5/dia
5. Cria agenda com status RASCUNHO e todos os itens
```

---

## Eventos

### Publicados
| Evento | Quando | Payload | Consumidores |
|---|---|---|---|
| `agenda.criada` | Ao gerar a agenda | `{ scheduleId, weekStart, itemCount }` | — |

---

## Arquivos a criar ou alterar

```
src/routes/agendamento.ts              ← rotas POST/PATCH/DELETE de agenda e itens
src/services/agendamento.ts            ← algoritmo de geração automática
src/repositories/agendamento.ts        ← acesso Prisma
src/validations/agendamento.ts         ← schemas Zod
```

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Gerar Agenda (automático) | EE | Alta | 6 |
| Adicionar Item Manual | EE | Baixa | 3 |
| Remover Item | EE | Baixa | 3 |
| Mover Item de Dia | EE | Baixa | 3 |

**Total: 15 PF** *(apenas as EEs desta feature)*

---

## Implementação

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Agenda Semanal · Domínio: Agendamento · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
