<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Listar Membros
> **Nível 3** — Feature Set: Gestão de Membros — Domínio: Equipe

## Descrição
Exibe a lista de membros fixas da equipe, com busca por nome e filtro por status. É o ponto de entrada para cadastrar, visualizar disponibilidade e inativar membros. MEMBRO acessa uma visão simplificada da lista.

---

## Regras de negócio

1. Por padrão, a lista exibe somente membros **ativas**.
2. A gerente pode alternar para exibir membros inativas ou todas.
3. A busca é feita pelo nome (parcial, case-insensitive).
4. A lista é ordenada por nome em ordem alfabética.
5. MEMBRO visualiza a lista básica (nome e status), sem acesso a cadastrar ou inativar.

---

## Cenários

```gherkin
Feature: Listar membros

  Background:
    Given que a gerente está autenticada no sistema

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Exibição padrão — apenas membros ativas
    Given que existem membros ativas e inativas cadastradas
    When a gerente acessa "/equipe"
    Then o sistema exibe somente as membros com status ativo
    And a lista está ordenada alfabeticamente por nome

  Scenario: Busca por nome parcial
    When a gerente digita "ana" no campo de busca
    Then a lista exibe apenas membros cujo nome contém "ana"

  Scenario: Filtro por membros inativas
    When a gerente seleciona o filtro "Inativas"
    Then a lista exibe somente as membros com status inativo

  # ── Visão do MEMBRO ───────────────────────────────────────────

  Scenario: Membro acessa a lista — visão básica
    Given que a usuária está autenticada como MEMBRO
    When acessa "/equipe"
    Then o sistema exibe a lista de membros ativas com nome apenas
    And não exibe botões de "Cadastrar", "Editar" ou "Inativar"

  # ── Estados especiais ──────────────────────────────────────────

  Scenario: Lista vazia — nenhuma membro cadastrada
    Given que não há membros cadastradas
    When a gerente acessa "/equipe"
    Then o sistema exibe: "Nenhuma membro cadastrada. Clique em 'Nova Membro' para começar."

  Scenario: Busca sem resultado
    When a gerente busca por "xyz123"
    Then o sistema exibe: "Nenhuma membro encontrada para essa busca."
```

---

## Campos exibidos na lista

| Coluna | Campo | Visível para GERENTE | Visível para MEMBRO |
|---|---|---|---|
| Nome | `name` | ✅ | ✅ |
| Telefone | `phone` | ✅ | ❌ |
| Status | `active` | ✅ Badge | ✅ Badge |
| Disponibilidade esta semana | resumo da semana atual | ✅ | ❌ |
| Ações | Editar · Inativar | ✅ | ❌ |

---

## Comportamento de tela

### Onde fica
Página `/equipe` — tela principal do domínio Equipe.

### Elementos da tela

| Elemento | Comportamento |
|---|---|
| Campo de busca | Filtra por nome em tempo real (debounce 300ms) |
| Filtro de status | Segmented control: "Ativas" (padrão) · "Inativas" · "Todas" |
| Botão "Nova Membro" | Navega para `/equipe/novo` — visível apenas para GERENTE |
| Linha da lista | Clique no nome navega para `/equipe/:id/editar` (GERENTE) |
| Botão "Inativar" | Abre modal de confirmação (feature Inativar Membro) |

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading inicial | Esqueleto de linhas (skeleton loader) |
| Lista preenchida | Exibe linhas com dados |
| Lista vazia | Mensagem de estado vazio com CTA para cadastrar |
| Sem resultado de busca | Mensagem de resultado vazio; busca pode ser limpa |
| Erro de servidor | Toast vermelho: "Não foi possível carregar a lista. Tente novamente." |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Membro

---

## Cenários técnicos adicionais

```gherkin
  # ── Comportamento técnico ──────────────────────────────────────

  Scenario: GET sem filtros retorna ativas ordenadas por nome
    When GET /api/v1/membros
    Then resposta HTTP 200
    And body { "data": [...membros ativas], "meta": { "total": N } }

  Scenario: GET com filtro de busca
    When GET /api/v1/membros?search=ana
    Then resposta HTTP 200
    And apenas membros cujo name contém "ana" (case-insensitive)

  Scenario: MEMBRO recebe visão reduzida
    Given usuária autenticada com role MEMBRO
    When GET /api/v1/membros
    Then resposta HTTP 200
    And campos retornados: apenas id, name, active
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `INTERNAL_ERROR` | 500 | "Não foi possível carregar a lista. Tente novamente." |

---

## API

### GET /api/v1/membros
**Acesso**: autenticado — `GERENTE` (visão completa); `MEMBRO` (visão básica)

**Query params**:
```typescript
search?: string    // filtra por name (ILIKE %search%)
active?: boolean   // default: true
```

**Resposta de sucesso (GERENTE)** — HTTP 200:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Ana Silva",
      "phone": "(305) 555-0001",
      "active": true,
      "weekAvailability": "disponível"
    }
  ],
  "meta": { "total": 1 }
}
```

**Respostas de erro**:
| HTTP | Code | Situação |
|---|---|---|
| 403 | `AUTH_FORBIDDEN` | Perfil sem permissão |
| 500 | `INTERNAL_ERROR` | Falha inesperada |

---

## Arquivos a criar ou alterar

```
src/routes/membros.ts               ← rota GET /api/v1/membros
src/controllers/membros.ts          ← handler de listagem
src/services/membros.ts             ← lógica de filtro; projeção por role
src/repositories/membros.ts         ← query Prisma com where dinâmico
```

---

## Dependências

- **Prisma** — persistência no banco PostgreSQL
- **Zod** — validação dos query params

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Listar Membros | CE | Baixa | 3 |

**Total: 3 PF**

---

## Implementação

| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| GET /api/v1/membros | cleansched-api | src/routes/membros.ts | — |
| Tela de lista | cleansched-web | src/pages/equipe/index.tsx | — |

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Membros · Domínio: Equipe · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
