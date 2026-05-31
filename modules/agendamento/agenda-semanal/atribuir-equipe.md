<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Atribuir Equipe
> **Nível 3** — Feature Set: Agenda Semanal — Domínio: Agendamento

## Descrição
Permite à gerente definir quais membros da equipe (fixas ou helpers) irão limpar cada imóvel em cada dia da agenda. Para cada imóvel agendado, a gerente seleciona ao menos um membro como **líder** e pode adicionar auxiliares. Somente membros disponíveis na data são exibidos.

---

## Regras de negócio

1. Membro indisponível na data de limpeza não aparece na lista de seleção. → ver RULES-DICTIONARY: Membro indisponível não pode ser atribuído
2. Cada item de agenda deve ter ao menos um membro com função **Líder** para que a agenda possa ser confirmada.
3. Helpers aparecem sempre disponíveis na lista de seleção (não registram disponibilidade).
4. Um membro pode ser atribuído a múltiplos imóveis no mesmo dia.
5. Agenda confirmada não pode ter atribuições alteradas. → ver RULES-DICTIONARY: Agenda confirmada é imutável
6. A atribuição pode ser feita em qualquer momento enquanto a agenda está em **Rascunho**.

---

## Cenários

```gherkin
Feature: Atribuir equipe aos itens da agenda

  Background:
    Given que a gerente está autenticada
    And existe a agenda da semana de 08/06/2026 com status "Rascunho"
    And o item "Casa da Maria — Oak St" está agendado para segunda-feira 08/06

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Atribuir líder a um item de agenda
    Given que "Ana Oliveira" está disponível em 08/06/2026
    When a gerente seleciona "Ana Oliveira" como "Líder" para "Casa da Maria — Oak St"
    And clica em "Salvar atribuição"
    Then a atribuição é salva
    And o card do imóvel exibe "Ana Oliveira (Líder)" em destaque

  Scenario: Atribuir líder e auxiliar
    Given que "Ana" e "Carol" estão disponíveis em 08/06
    When a gerente atribui "Ana" como Líder e "Carol" como Auxiliar
    Then ambas são salvas no item
    And o card exibe "Ana (Líder) · Carol (Auxiliar)"

  Scenario: Atribuir helper como líder (cobertura de ausência)
    Given que todas as membros fixas estão indisponíveis em 10/06
    And a helper "Jessica Lima" está cadastrada
    When a gerente seleciona "Jessica Lima" como Líder para quarta-feira
    Then a atribuição é salva normalmente

  Scenario: Remover atribuição existente
    Given que "Carol" está atribuída como auxiliar ao item
    When a gerente clica no "x" ao lado de "Carol" na atribuição
    Then "Carol" é removida do item

  # ── Conflitos ──────────────────────────────────────────────────

  Scenario: Tentativa de confirmar agenda com item sem líder
    Given que o item "Casa da Karen" não possui nenhum membro atribuído
    When a gerente tenta confirmar a agenda
    Then o sistema exibe: "Alguns imóveis ainda não têm equipe atribuída: Casa da Karen"
    And a confirmação é bloqueada

  # ── Restrições de acesso ───────────────────────────────────────

  Scenario: Tentativa de alterar atribuição em agenda confirmada
    Given que a agenda está confirmada
    When a gerente tenta editar a atribuição de qualquer item
    Then o sistema exibe: "A agenda desta semana já foi confirmada. Reabra-a para fazer alterações."
    And nenhuma alteração é salva
```

---

## Campos

| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Membro | lista de opções | sim (ao menos 1 Líder) | Apenas membros ativos e disponíveis na data; helpers sempre listadas |
| Função | lista de opções | sim | Líder ou Auxiliar |

---

## Comportamento de tela

### Onde fica
Tela de atribuição em `/agenda/:semana/atribuir`. Exibe a agenda por dia, com cards dos imóveis. Cada card tem seção expandível de "Equipe" com seletor de membros.

### Layout
Para cada card de imóvel:
- Título: apelido do imóvel + tamanho
- Subtítulo: cliente + endereço
- Seção "Equipe": lista de membros atribuídos com ícone de função; botão "+ Adicionar membro"
- Membros indisponíveis aparecem em cinza com label "Indisponível" — não selecionáveis

### Estados da tela

| Estado | Comportamento |
|---|---|
| Item sem atribuição | Card com borda laranja e badge "Sem equipe" |
| Item com líder | Card com borda verde |
| Item com líder + auxiliar | Card com borda verde + lista de nomes |
| Agenda confirmada | Cards somente leitura; botões desabilitados |
| Salvando | Spinner no card sendo editado |
| Erro | Toast vermelho: "Não foi possível salvar. Tente novamente." |
| Confirmar agenda | Botão "Confirmar Agenda" disponível apenas quando todos os itens têm líder |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Membro do Item de Agenda

---

## Cenários técnicos adicionais

```gherkin
  Scenario: PUT com membro indisponível retorna 422
    When PUT /api/v1/agendamento/items/:itemId/equipe com memberId de membro indisponível
    Then resposta HTTP 422
    And body { "error": { "code": "MEMBRO_INDISPONIVEL" } }

  Scenario: PUT em agenda confirmada retorna 422
    When PUT /api/v1/agendamento/items/:itemId/equipe (agenda confirmada)
    Then resposta HTTP 422
    And body { "error": { "code": "AGENDA_JA_CONFIRMADA" } }
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `AGENDA_JA_CONFIRMADA` | 422 | "A agenda desta semana já foi confirmada. Reabra-a para fazer alterações." |
| `MEMBRO_INDISPONIVEL` | 422 | "[Nome] está indisponível nesta data." |
| `AGENDA_ITEM_NOT_FOUND` | 404 | "Item de agenda não encontrado." |
| `MEMBRO_NOT_FOUND` | 404 | "Membro não encontrada." |
| `AUTH_FORBIDDEN` | 403 | "Você não tem permissão para esta ação." |
| `INTERNAL_ERROR` | 500 | "Não foi possível salvar. Tente novamente." |

---

## API

### PUT /api/v1/agendamento/items/:itemId/equipe
**Acesso**: autenticado — role `GERENTE`
Substitui toda a atribuição do item (idempotente).

**Body**:
```typescript
{
  assignments: Array<{
    memberId: string
    role: 'LIDER' | 'AUXILIAR'
  }>
}
```

**Resposta de sucesso** — HTTP 200: lista de atribuições salvas

---

### POST /api/v1/agendamento/agenda/:scheduleId/confirmar
**Acesso**: autenticado — role `GERENTE`
Confirma a agenda. Valida que todos os itens têm ao menos um LIDER.

**Resposta de sucesso** — HTTP 200: Agenda com status `CONFIRMADA`

---

### POST /api/v1/agendamento/agenda/:scheduleId/reabrir
**Acesso**: autenticado — role `GERENTE`
Reverte status para `RASCUNHO`. Requer confirmação via modal no frontend.

---

## Eventos

### Publicados
| Evento | Quando | Payload | Consumidores |
|---|---|---|---|
| `agenda.confirmada` | Ao confirmar agenda | `{ scheduleId, weekStart, items[{ propertyId, cleaningDate }] }` | Clientes e Imóveis (atualiza lastCleanedAt) |

---

## AuditLog

```typescript
logAction({
  userId: context.userId,
  action: 'agenda.confirmada',
  targetEntity: 'AgendaSemanal',
  targetId: agenda.id,
  metadata: { weekStart: agenda.weekStart, itemCount: agenda.items.length }
})
```

---

## Arquivos a criar ou alterar

```
src/routes/agendamento.ts               ← PUT /items/:id/equipe; POST confirmar/reabrir
src/services/atribuicao.ts              ← lógica de atribuição + validação disponibilidade
src/services/confirmacao.ts             ← validação de completude + publicação de evento
src/repositories/agendamento.ts         ← acesso Prisma
```

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Atribuir Equipe ao Item | EE | Média | 4 |
| Confirmar Agenda | EE | Média | 4 |
| Reabrir Agenda | EE | Baixa | 3 |

**Total: 11 PF**

---

## Implementação

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Agenda Semanal · Domínio: Agendamento · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
