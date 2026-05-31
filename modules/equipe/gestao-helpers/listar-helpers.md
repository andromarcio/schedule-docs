<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Listar Helpers
> **Nível 3** — Feature Set: Gestão de Helpers — Domínio: Equipe

## Descrição
Exibe a lista de helpers avulsas cadastradas, com busca por nome e filtro por status. É o ponto de entrada para cadastrar novas helpers e verificar quais estão disponíveis para atribuição.

---

## Regras de negócio

1. Por padrão, a lista exibe somente helpers **ativas**.
2. A gerente pode alternar para exibir helpers inativas ou todas.
3. A busca é feita pelo nome (parcial, case-insensitive).
4. A lista é ordenada por nome em ordem alfabética.
5. Apenas GERENTE acessa a lista de helpers; MEMBRO não tem acesso a este módulo.

---

## Cenários

```gherkin
Feature: Listar helpers

  Background:
    Given que a gerente está autenticada no sistema

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Exibição padrão — apenas helpers ativas
    Given que existem helpers ativas e inativas cadastradas
    When a gerente acessa "/equipe/helpers"
    Then o sistema exibe somente as helpers com status ativo
    And a lista está ordenada alfabeticamente por nome

  Scenario: Busca por nome parcial
    When a gerente digita "maria" no campo de busca
    Then a lista exibe apenas helpers cujo nome contém "maria"

  Scenario: Filtro por helpers inativas
    When a gerente seleciona o filtro "Inativas"
    Then a lista exibe somente as helpers com status inativo

  Scenario: Filtro "Todas"
    When a gerente seleciona o filtro "Todas"
    Then a lista exibe helpers ativas e inativas

  # ── Estados especiais ──────────────────────────────────────────

  Scenario: Lista vazia — nenhuma helper cadastrada
    Given que não há helpers cadastradas
    When a gerente acessa "/equipe/helpers"
    Then o sistema exibe: "Nenhuma helper cadastrada. Clique em 'Nova Helper' para começar."

  Scenario: Busca sem resultado
    When a gerente busca por "xyz123"
    Then o sistema exibe: "Nenhuma helper encontrada para essa busca."

  Scenario: MEMBRO tenta acessar a lista de helpers
    Given que a usuária está autenticada como MEMBRO
    When tenta acessar "/equipe/helpers"
    Then o sistema redireciona para "/minha-agenda" com mensagem: "Acesso não permitido."
```

---

## Campos exibidos na lista

| Coluna | Campo | Observação |
|---|---|---|
| Nome | `name` | — |
| Telefone | `phone` | — |
| Status | `active` | Badge "Ativa" / "Inativa" |
| Ações | — | Botão Inativar (helpers não têm edição) |

---

## Comportamento de tela

### Onde fica
Página `/equipe/helpers` — acessível via aba/submenu a partir de `/equipe`.

### Elementos da tela

| Elemento | Comportamento |
|---|---|
| Campo de busca | Filtra por nome em tempo real (debounce 300ms) |
| Filtro de status | Segmented control: "Ativas" (padrão) · "Inativas" · "Todas" |
| Botão "Nova Helper" | Navega para `/equipe/helpers/novo` |
| Botão "Inativar" | Abre modal de confirmação de inativação |

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
→ ver DATA-MODEL.md: Helper

---

## Cenários técnicos adicionais

```gherkin
  # ── Comportamento técnico ──────────────────────────────────────

  Scenario: GET sem filtros retorna ativas ordenadas por nome
    When GET /api/v1/helpers
    Then resposta HTTP 200
    And body { "data": [...helpers ativas], "meta": { "total": N } }

  Scenario: GET com filtro de busca
    When GET /api/v1/helpers?search=maria
    Then resposta HTTP 200
    And apenas helpers cujo name contém "maria" (case-insensitive)

  Scenario: MEMBRO tenta GET na rota
    Given usuária autenticada com role MEMBRO
    When GET /api/v1/helpers
    Then resposta HTTP 403
    And body { "data": null, "error": { "code": "AUTH_FORBIDDEN" } }
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `AUTH_FORBIDDEN` | 403 | "Acesso não permitido." |
| `INTERNAL_ERROR` | 500 | "Não foi possível carregar a lista. Tente novamente." |

---

## API

### GET /api/v1/helpers
**Acesso**: autenticado — role `GERENTE` apenas

**Query params**:
```typescript
search?: string    // filtra por name (ILIKE %search%)
active?: boolean   // default: true
```

**Resposta de sucesso** — HTTP 200:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Maria Oliveira",
      "phone": "(305) 555-0099",
      "active": true
    }
  ],
  "meta": { "total": 1 }
}
```

**Respostas de erro**:
| HTTP | Code | Situação |
|---|---|---|
| 403 | `AUTH_FORBIDDEN` | Perfil MEMBRO tentando acessar |
| 500 | `INTERNAL_ERROR` | Falha inesperada |

---

## Arquivos a criar ou alterar

```
src/routes/helpers.ts               ← rota GET /api/v1/helpers
src/controllers/helpers.ts          ← handler de listagem
src/services/helpers.ts             ← lógica de filtro e ordenação
src/repositories/helpers.ts         ← query Prisma com where dinâmico
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
| Listar Helpers | CE | Baixa | 3 |

**Total: 3 PF**

---

## Implementação

| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| GET /api/v1/helpers | cleansched-api | src/routes/helpers.ts | — |
| Tela de lista | cleansched-web | src/pages/equipe/helpers/index.tsx | — |

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Helpers · Domínio: Equipe · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
